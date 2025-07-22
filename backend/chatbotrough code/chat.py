import requests
import os
import asyncio
import base64
from sarvamai import AsyncSarvamAI, AudioOutput
from langdetect import detect
import pygame
from io import BytesIO
import pyaudio
import wave
import tempfile
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
import whisper
import re
import numpy as np
import time

from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("SARVAM_API_KEY")

# Initialize pygame mixer once
pygame.mixer.init()

# Audio recording settings
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
SILENCE_THRESHOLD = 500  # Adjust this value based on your microphone sensitivity
SILENCE_DURATION = 4.0   # Stop recording after 4 seconds of silence

# Language detection and mapping
LANGUAGE_MAP = {
    'hi': {'code': 'hi-IN', 'name': 'Hindi'},
    'en': {'code': 'en-IN', 'name': 'English'},
    'bn': {'code': 'bn-IN', 'name': 'Bengali'},
    'kn': {'code': 'kn-IN', 'name': 'Kannada'},
    'ml': {'code': 'ml-IN', 'name': 'Malayalam'},
    'mr': {'code': 'mr-IN', 'name': 'Marathi'},
    'od': {'code': 'od-IN', 'name': 'Odia'},
    'pa': {'code': 'pa-IN', 'name': 'Punjabi'},
    'ta': {'code': 'ta-IN', 'name': 'Tamil'},
    'te': {'code': 'te-IN', 'name': 'Telugu'},
    'gu': {'code': 'gu-IN', 'name': 'Gujarati'}
}

def get_user_language_preference():
    """Let user choose their preferred language"""
    print("\n🌐 Choose your preferred language:")
    print("1. Auto-detect from text")
    print("2. English")
    print("3. Hindi (हिंदी)")
    print("4. Bengali (বাংলা)")
    print("5. Tamil (தமிழ்)")
    print("6. Telugu (తెలుగు)")
    print("7. Kannada (ಕನ್ನಡ)")
    print("8. Malayalam (മലയാളം)")
    print("9. Gujarati (ગુજરાતી)")
    print("10. Marathi (मराठी)")
    print("11. Punjabi (ਪੰਜਾਬੀ)")
    print("12. Odia (ଓଡ଼ିଆ)")
    
    choice = input("Enter choice (1-12): ").strip()
    
    language_choices = {
        '1': 'auto',
        '2': 'en',
        '3': 'hi',
        '4': 'bn',
        '5': 'ta',
        '6': 'te',
        '7': 'kn',
        '8': 'ml',
        '9': 'gu',
        '10': 'mr',
        '11': 'pa',
        '12': 'od'
    }
    
    selected_lang = language_choices.get(choice, 'auto')
    
    if selected_lang == 'auto':
        print("✅ Language will be auto-detected from your input")
        return None
    else:
        lang_info = LANGUAGE_MAP.get(selected_lang, LANGUAGE_MAP['en'])
        print(f"✅ Selected language: {lang_info['name']}")
        return selected_lang

def detect_lang_with_langdetect(text):
    """Enhanced language detection with English word pattern recognition"""
    try:
        # First check if the text contains English words written in Devanagari
        # Common English words that might be transliterated
        english_patterns = [
            'ऐप', 'एप्प', 'app', 'अप्प',  # app
            'नॉट', 'नोट', 'not', 'नाट',   # not
            'वर्किंग', 'working', 'वर्क',  # working
            'व्हाट', 'what', 'व्हेट',     # what
            'शुड', 'should', 'शुल्ड',    # should
            'डू', 'do', 'डू',            # do
            'माई', 'my', 'मै',          # my
            'इज़', 'is', 'इस'           # is
        ]
        
        # Check if text contains English patterns (transliterated or mixed)
        english_word_count = 0
        total_words = len(text.split())
        
        for pattern in english_patterns:
            if pattern.lower() in text.lower():
                english_word_count += 1
        
        # If significant English patterns found, consider it English
        if english_word_count > 0 and total_words <= 10:  # Short phrases with English words
            print(f"🔍 Detected transliterated English words: {english_word_count}/{total_words}")
            return "en"
        
        # Use langdetect for other cases
        lang = detect(text)
        print(f"🔍 LangDetect detected: {lang}")
        
        # Additional check: if detected as Marathi but contains obvious English patterns
        if lang == 'mr' and english_word_count > 0:
            print(f"🔍 Override: Marathi detection but English patterns found, switching to English")
            return "en"
            
        return lang
        
    except Exception as e:
        print(f"🔍 LangDetect failed: {e}, defaulting to English")
        return "en"

def is_silent(audio_chunk):
    """Check if audio chunk is silent based on RMS (Root Mean Square)"""
    # Convert bytes to numpy array
    audio_data = np.frombuffer(audio_chunk, dtype=np.int16)
    # Calculate RMS (Root Mean Square)
    rms = np.sqrt(np.mean(audio_data**2))
    return rms < SILENCE_THRESHOLD

async def record_audio_with_vad():
    """Record audio from microphone with Voice Activity Detection"""
    print("🎤 Recording... Speak now! (Will stop automatically after 4 seconds of silence)")
    
    audio = pyaudio.PyAudio()
    
    stream = audio.open(format=FORMAT,
                       channels=CHANNELS,
                       rate=RATE,
                       input=True,
                       frames_per_buffer=CHUNK)
    
    frames = []
    silent_chunks = 0
    silent_threshold = int(SILENCE_DURATION * RATE / CHUNK)  # Number of chunks for silence duration
    recording_started = False
    
    try:
        while True:
            data = stream.read(CHUNK)
            frames.append(data)
            
            if is_silent(data):
                silent_chunks += 1
                if recording_started:  # Only count silence after we started recording voice
                    # Only print every 10 chunks to reduce spam
                    if silent_chunks % 10 == 0 or silent_chunks >= silent_threshold:
                        print(f"🔇 Silence detected... {silent_chunks}/{silent_threshold}")
            else:
                if not recording_started:
                    print("🗣️ Voice detected! Recording...")
                    recording_started = True
                else:
                    # Reset silence counter and give feedback when voice returns
                    if silent_chunks > 5:  # Only if there was significant silence
                        print("🗣️ Voice detected again, continuing...")
                silent_chunks = 0  # Reset silence counter when voice is detected
            
            # Stop recording if we've been silent for too long after starting to record
            if recording_started and silent_chunks >= silent_threshold:
                print("🔴 Recording stopped due to silence")
                break
            
            # Safety limit: stop after 30 seconds regardless
            if len(frames) > int(30 * RATE / CHUNK):
                print("🔴 Recording stopped - 30 second limit reached")
                break
                
    except KeyboardInterrupt:
        print("🔴 Recording stopped by user")
    
    stream.stop_stream()
    stream.close()
    audio.terminate()
    
    if not frames:
        print("❌ No audio recorded")
        return None
    
    # Save to temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
    
    wf = wave.open(temp_file.name, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(audio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
    
    duration = len(frames) * CHUNK / RATE
    print(f"📊 Recorded {duration:.1f} seconds of audio")
    
    return temp_file.name

async def speech_to_text_sarvam(audio_file_path, language="hi-IN"):
    """Convert speech to text using Sarvam AI"""
    try:
        with open(audio_file_path, 'rb') as f:
            audio_content = f.read()
        
        files = {
            'file': ('audio.wav', audio_content, 'audio/wav')
        }
        
        data = {
            'language_code': language,
            'model': 'saarika:v1'
        }
        
        response = requests.post(
            "https://api.sarvam.ai/speech-to-text",
            headers={
                "api-subscription-key": api_key
            },
            files=files,
            data=data
        )
        
        if response.status_code == 200:
            result = response.json()
            transcript = result.get("transcript", "")
            print(f"🗣️ You said (Sarvam): {transcript}")
            return transcript
        else:
            print(f"❌ Sarvam Speech-to-text failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Sarvam Speech recognition error: {e}")
        return None

async def speech_to_text_whisper(audio_file_path):
    """Convert speech to text using OpenAI Whisper (offline)"""
    try:
        if not os.path.exists(audio_file_path):
            print(f"❌ Audio file not found: {audio_file_path}")
            return None
            
        model = whisper.load_model("base")
        result = model.transcribe(audio_file_path)
        transcript = result["text"].strip()
        
        print(f"🗣️ You said (Whisper): {transcript}")
        return transcript
        
    except Exception as e:
        print(f"❌ Whisper Speech recognition error: {e}")
        return None

async def play_tts(text, language="hi-IN", speaker="anushka"):
    """Convert text to speech using Sarvam AI (Streaming)"""
    client = AsyncSarvamAI(api_subscription_key=api_key)
    
    try:
        print("🔊 Generating speech...")
        
        async with client.text_to_speech_streaming.connect(model="bulbul:v2") as ws:
            await ws.configure(target_language_code=language, speaker=speaker)
            await ws.convert(text)
            await ws.flush()
            
            audio_data = BytesIO()
            async for message in ws:
                if isinstance(message, AudioOutput):
                    audio_chunk = base64.b64decode(message.data.audio)
                    audio_data.write(audio_chunk)
            
            audio_data.seek(0)
            pygame.mixer.music.load(audio_data)
            pygame.mixer.music.play()
            
            print("🔊 Playing audio...")
            
            while pygame.mixer.music.get_busy():
                await asyncio.sleep(0.1)
                
            print("✅ Audio playback completed")
                
    except Exception as e:
        print(f"❌ TTS Error: {e}")

async def get_user_input(preferred_lang=None):
    """Get user input via text or speech"""
    print("\n📝 Choose input method:")
    print("1. Type your message")
    print("2. Speak your message")
    print("3. Change language preference")
    print("4. Quit")
    
    choice = input("Enter choice (1-4): ").strip()
    
    if choice == "1":
        query = input("💬 Type your message: ")
        return query, preferred_lang
    
    elif choice == "2":
        audio_file = await record_audio_with_vad()
        if not audio_file:
            return None, preferred_lang
            
        transcript = None
        
        try:
            # Use preferred language for speech recognition if available
            if preferred_lang and preferred_lang in LANGUAGE_MAP:
                lang_code = LANGUAGE_MAP[preferred_lang]['code']
                print(f"🔄 Trying Sarvam AI ({LANGUAGE_MAP[preferred_lang]['name']})...")
                transcript = await speech_to_text_sarvam(audio_file, lang_code)
            
            # If no preferred language or failed, try English first
            if not transcript:
                print("🔄 Trying Sarvam AI (English)...")
                transcript = await speech_to_text_sarvam(audio_file, "en-IN")
            
            # If no transcript, try Hindi
            if not transcript:
                print("🔄 Trying Sarvam AI (Hindi)...")
                transcript = await speech_to_text_sarvam(audio_file, "hi-IN")
            
            # If Sarvam fails, try Whisper
            if not transcript:
                print("🔄 Trying Whisper as fallback...")
                transcript = await speech_to_text_whisper(audio_file)
        
        finally:
            try:
                if os.path.exists(audio_file):
                    os.remove(audio_file)
            except:
                pass
        
        return transcript, preferred_lang
    
    elif choice == "3":
        new_preferred_lang = get_user_language_preference()
        return await get_user_input(new_preferred_lang)
    
    elif choice == "4":
        return "quit", preferred_lang
    
    else:
        print("❌ Invalid choice. Please try again.")
        return await get_user_input(preferred_lang)

async def main():
    print("🤖 Welcome to ArthRakshak - Multilingual AI Assistant!")
    print("=" * 55)
    
    # Get initial language preference
    preferred_lang = get_user_language_preference()
    
    while True:
        query, preferred_lang = await get_user_input(preferred_lang)
        
        if not query or query.lower() in ['quit', 'exit', 'q']:
            print("👋 Goodbye!")
            break
        
        if not query.strip():
            print("❌ No input received. Please try again.")
            continue
        
        # Determine language to use
        if preferred_lang:
            # Use user's preferred language
            detected_lang = preferred_lang
            print(f"🔧 Using preferred language: {LANGUAGE_MAP[detected_lang]['name']}")
        else:
            # Auto-detect language
            detected_lang = detect_lang_with_langdetect(query)
            print(f"🔍 Auto-detected language: {detected_lang}")
        
        lang_info = LANGUAGE_MAP.get(detected_lang, LANGUAGE_MAP['en'])
        
        print(f"🔍 Processing: {query}")
        print(f"🌐 Language: {lang_info['name']} ({lang_info['code']})")

        # Simplified approach - skip vector search if Qdrant is not running
        try:
            model_name = "BAAI/bge-base-en-v1.5"
            model_kwargs = {'device': 'cpu'}
            encode_kwargs = {'normalize_embeddings': True}
            embeddings = HuggingFaceEmbeddings(
                model_name=model_name,
                model_kwargs=model_kwargs,
                encode_kwargs=encode_kwargs
            )

            vectorstore = QdrantVectorStore.from_existing_collection(
                embedding=embeddings,
                url="http://localhost:6333",
                collection_name="troubleshooting",
            )

            search_results = vectorstore.similarity_search(query, k=5)

            context_parts = []
            for result in search_results:
                context_parts.append(result.page_content)

            context = "\n\n".join(context_parts)
            
        except Exception as e:
            print(f"⚠️ Vector search unavailable: {e}")
            print("📝 Using general knowledge without context...")
            context = "General troubleshooting knowledge base is not available. Provide helpful general advice."

        system_prompt = f"""
        You are a helpful multilingual AI assistant for computer troubleshooting.
        Respond to the user's question **in {lang_info['name']} language only**.
        Keep your response concise (maximum 3-4 sentences) but helpful.
        
        Context (knowledge base):
        {context}

        User Question:
        {query}

        Important: Respond in {lang_info['name']} language only. Provide helpful computer troubleshooting advice in 3-4 sentences maximum.
        """

        try:
            response = requests.post(
                "https://api.sarvam.ai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": "sarvam-m",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": query}
                    ]
                }
            )
            
            if response.status_code == 200:
                response_data = response.json()
                ai_response = response_data['choices'][0]['message']['content']
                print(f"\n🤖 Response: {ai_response}")
                
                # Use streaming TTS
                await play_tts(ai_response, language=lang_info['code'])
                
            else:
                print("❌ Sorry, I couldn't process your request right now.")
                print(f"Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Sorry, there was an error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
