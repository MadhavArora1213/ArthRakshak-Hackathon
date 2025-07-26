# Daily Financial Tips System 💰

A multilingual financial tips application that provides daily financial advice in English, Hindi, and Punjabi, enhanced with Sarvam AI.

## Features

- **Daily Tips**: Get a consistent financial tip every day based on the current date
- **Multilingual Support**: Tips available in English, Hindi, and Punjabi
- **Sarvam AI Integration**: Enhanced tips using Sarvam AI for better engagement
- **Simple Interface**: Easy-to-use command-line interface
- **Fallback Support**: Works even without API key (simple tips mode)

## Files Overview

- `main.py` - Full application with Sarvam AI integration
- `sarvam_tips.py` - Dedicated Sarvam AI implementation
- `simple_tips.py` - Standalone version without AI (recommended for basic usage)
- `financial_tips.json` - Database of multilingual financial tips
- `test_tips.py` - Test script to verify functionality

## Quick Start

### Option 1: Simple Version (No API Key Required)
```bash
python simple_tips.py
```

### Option 2: Sarvam AI Enhanced Version
1. Create a `.env` file with your Sarvam AI API key:
   ```
   SARVAM_API_KEY=your_sarvam_api_key_here
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the main application:
   ```bash
   python main.py
   ```
   Or use the dedicated Sarvam version:
   ```bash
   python sarvam_tips.py
   ```

## How It Works

1. **Daily Consistency**: The system uses the current date as a seed to ensure all users get the same tip on the same day
2. **Language Selection**: Choose from English (en), Hindi (hi), or Punjabi (pa)
3. **Tip Rotation**: Tips rotate daily, ensuring you get different advice each day
4. **AI Enhancement**: Sarvam AI makes tips more engaging and motivational

## Sarvam AI Integration

The application uses Sarvam AI's chat API to enhance the basic financial tips with:
- Better formatting and emojis
- More engaging and motivational language
- Context-aware responses
- Multilingual support improvements

## Usage Examples

### Language Options:
- **English**: "Track your daily expenses using a simple app—it's the first step to financial freedom!"
- **Hindi**: "एक सिंपल ऐप का इस्तेमाल करके अपने दैनिक खर्चों को ट्रैक करें—यह आर्थिक आजादी का पहला कदम है!"
- **Punjabi**: "ਇੱਕ ਸਿੰਪਲ ਐਪ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਆਪਣੇ ਰੋਜ਼ਾਨਾ ਖਰਚਿਆਂ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ—ਇਹ ਆਰਥਿਕ ਅਜ਼ਾਦੀ ਦਾ ਪਹਿਲਾ ਕਦਮ ਹੈ!"

## Testing

Run the test script to verify functionality:
```bash
python test_tips.py
```

## Adding New Tips

Edit `financial_tips.json` to add new tips. Each tip should have translations for all supported languages:

```json
{
  "en": "Your tip in English",
  "hi": "आपका हिंदी में टिप",
  "pa": "ਤੁਹਾਡਾ ਪੰਜਾਬੀ ਵਿੱਚ ਟਿੱਪ"
}
```

## Requirements

- Python 3.6+
- `requests` package (for Sarvam AI integration)
- `python-dotenv` package (for environment variables)
- Sarvam AI API key (optional, for enhanced experience)

## Installation

For AI-enhanced version:
```bash
pip install -r requirements.txt
```

For simple version: No additional packages required!

## Getting Sarvam AI API Key

1. Visit [Sarvam AI](https://www.sarvam.ai/)
2. Sign up for an account
3. Navigate to API section and generate your API key
4. Add it to your `.env` file as `SARVAM_API_KEY`

## Daily Usage

Run the application once per day to get your daily financial tip. The tip will be the same throughout the day but will change the next day.

---

Powered by Sarvam AI 🚀 Happy saving! 🌟
