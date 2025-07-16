import { Audio } from 'expo-av';

/**
 * Load and play audio file
 * @param {string} audioSource - Audio file resource
 * @param {object} options - Playback options
 * @returns {Promise<object>} - The sound object
 */
export const playVoice = async (audioSource, options = {}) => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      audioSource,
      { shouldPlay: true, ...options }
    );
    
    return sound;
  } catch (error) {
    console.error('Error playing audio:', error);
    return null;
  }
};

/**
 * Stop and unload audio
 * @param {object} sound - Sound object to stop
 */
export const stopVoice = async (sound) => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  } catch (error) {
    console.error('Error stopping audio:', error);
  }
};

/**
 * Initialize audio for the app
 */
export const initializeAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
};

/**
 * Convert text to speech (placeholder for future implementation)
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code
 */
export const textToSpeech = async (text, language = 'en-US') => {
  // This would integrate with a TTS service
  // For now, just log the text that would be spoken
  console.log(`Would speak: ${text} in ${language}`);
  
  // In a real implementation, you would return the audio to play
  return null;
};