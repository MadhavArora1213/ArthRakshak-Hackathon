import requests
import json
import random
import os 
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("SARVAM_API_KEY")
# Correct Sarvam AI chat completions endpoint
SARVAM_CHAT_URL = "https://api.sarvam.ai/v1/chat/completions"

# Load tips from file
def load_tips():
    with open("financial_tips.json", "r", encoding="utf-8") as f:
        return json.load(f)

# Get daily tip based on date and language
def get_daily_tip(lang='en'):
    tips = load_tips()
    
    # Use current date as seed for consistent daily tip
    today = datetime.now().strftime("%Y-%m-%d")
    random.seed(today)
    
    # Select tip for the day
    tip = random.choice(tips)
    
    # Reset random seed for other operations
    random.seed()
    
    return tip.get(lang, tip["en"])

# Get random tip (for testing or multiple tips)
def get_random_tip(lang='en'):
    tips = load_tips()
    tip = random.choice(tips)
    return tip.get(lang, tip["en"])

# System prompt
system_prompt = """
You are a friendly and knowledgeable Financial Advisor bot named "FinBot". Your role is to educate users with short, impactful financial tips daily.

✅ Behavior:
- Always respond politely and in a motivational tone.
- Include one financial tip per day unless asked for more.
- Translate tips into the user’s preferred language (English, Hindi, or Punjabi).
- Avoid giving the same tip repeatedly on the same day.
- If the user greets you or asks a general question like "what’s new?", include a tip subtly.

📌 Tip Guidelines:
- Use bullet points or quotes for tips.
- Keep them under 25 words.
- Prefer tips on savings, budgeting, investment, loans, and daily finance habits.
- Example format:
   💡 *"Track your expenses daily using a simple app—it’s the first step to financial freedom!"*

📌 Multilingual Handling:
- Use this language mapping based on user's request or profile:
  - English → `en`
  - Hindi → `hi`
  - Punjabi → `pa`

🎯 Goal:
Educate, engage, and remind users to take small but consistent actions to improve their financial health.

"""

# Chat request for daily tip using Sarvam AI
def ask_bot(lang='en', tip_type='daily'):
    if tip_type == 'daily':
        tip = get_daily_tip(lang)
    else:
        tip = get_random_tip(lang)
    
    if not api_key:
        return f"💡 Today's Financial Tip: {tip}\n\n⚠️ Set SARVAM_API_KEY in .env file for AI-enhanced tips"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Prepare the message for Sarvam AI in correct chat format
    user_message = f"""Enhance this financial tip and make it more engaging with emojis for {lang.upper()} language:

{tip}

Make it motivational and formatted nicely."""
    
    payload = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "model": "sarvam-m",
        "max_tokens": 150,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(SARVAM_CHAT_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        
        # Extract the generated text from Sarvam AI response (standard OpenAI-like format)
        if 'choices' in result and len(result['choices']) > 0:
            enhanced_tip = result['choices'][0]['message']['content']
            return enhanced_tip
        else:
            # Fallback if response format is different
            return f"💡 Today's Financial Tip: {tip}"
    
    except requests.exceptions.RequestException as e:
        # Fallback to simple tip if API fails
        return f"💡 Today's Financial Tip: {tip}\n\n⚠️ Sarvam AI unavailable: {str(e)}"
    except (KeyError, IndexError) as e:
        return f"💡 Today's Financial Tip: {tip}\n\n⚠️ Error parsing Sarvam AI response: {str(e)}"

# Language selection function
def select_language():
    print("\n🌍 Select your preferred language:")
    print("1. English (en)")
    print("2. Hindi (hi)")  
    print("3. Punjabi (pa)")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    language_map = {
        '1': 'en',
        '2': 'hi', 
        '3': 'pa'
    }
    
    return language_map.get(choice, 'en')

# Main function for daily tips
def daily_financial_tips():
    print("💰 Welcome to Daily Financial Tips with Sarvam AI! 💰")
    print("Get personalized financial advice every day using Sarvam AI.")
    
    lang = select_language()
    
    print(f"\n📅 Today's Financial Tip ({datetime.now().strftime('%B %d, %Y')}):")
    print("=" * 60)
    
    daily_advice = ask_bot(lang=lang, tip_type='daily')
    print(daily_advice)
    
    print("\n" + "=" * 60)
    print("Come back tomorrow for a new tip! 🌟")

# Run the application
if __name__ == "__main__":
    daily_financial_tips()
