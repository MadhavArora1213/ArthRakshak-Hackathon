import json
import random
from datetime import datetime

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

# Simple daily tips without AI
def simple_daily_tips():
    print("💰 Welcome to Daily Financial Tips! 💰")
    print("Get a financial tip every day in your preferred language.")
    
    lang = select_language()
    
    print(f"\n📅 Today's Financial Tip ({datetime.now().strftime('%B %d, %Y')}):")
    print("=" * 60)
    
    tip = get_daily_tip(lang)
    print(f"💡 {tip}")
    
    print("=" * 60)
    print("Come back tomorrow for a new tip! 🌟")
    
    # Option to see tips in other languages
    while True:
        choice = input("\nWould you like to see today's tip in another language? (y/n): ").lower().strip()
        if choice == 'y':
            new_lang = select_language()
            if new_lang != lang:
                print(f"\n📝 Today's tip in {new_lang.upper()}:")
                print(f"💡 {get_daily_tip(new_lang)}")
        else:
            break

# Run the application
if __name__ == "__main__":
    simple_daily_tips()
