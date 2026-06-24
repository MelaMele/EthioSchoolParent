import os
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.storage.memory import MemoryStorage

# ⚠️ ማሳሰቢያ፦ የቦት ቶከኑን በኋላ በ Vercel Environment Variable ውስጥ እናስገባዋለን።
# ለጊዜው ኮዱ ከሲስተሙ ፈልጎ እንዲያነብ በዚህ መልክ እናዘጋጀዋለን።
BOT_TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

@dp.message(CommandStart())
async def start_command(message: types.Message):
    # በኋላ በ Vercel የሚሰጠንን እውነተኛ ሊንክ እዚህ እንተካዋለን። 
    # ለጊዜው ለመፈተሽ ጎግልን እናድርገው።
    web_app_url = "https://google.com" 
    
    # ወላጆች ሲጫኑት Mini App የሚከፍት inline button ማዘጋጀት
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📱 የትምህርት ቤት ፖርታልን ክፈት",
                    web_app=WebAppInfo(url=web_app_url)
                )
            ]
        ]
    )
    
    welcome_text = (
        "👋 እንኳን ወደ ትምህርት ቤት ኮኔክት በደህና መጡ!\n\n"
        "ይህ ቦት ከተማሪዎች ወላጆች ጋር በቀጥታ ለመገናኘት የተዘጋጀ ነው።\n"
        "ከታች ያለውን **'በትምህርት ቤት ፖርታልን ክፈት'** የሚለውን ቁልፍ ተጭነው "
        "የክፍያ ስክሪንሾት መላክ፣ የተማሪዎችን የባህርይ ሁኔታ መከታተል እና መልእክቶችን ማየት ይችላሉ።"
    )
    
    await message.answer(welcome_text, reply_markup=keyboard, parse_mode="Markdown")

# Vercel Serverless Function ለዌብሁክ (Webhook) ጥሪዎች የሚጠቀመው ዋና ክፍል
async def handle_webhook(request_body: dict):
    update = types.Update.model_validate(request_body, context={"bot": bot})
    await dp.feed_update(bot, update)

# ለVercel WSGI/ASGI ተኳሃኝነት (ይህ የቦቱ መግቢያ መተላለፊያ ነው)
def handler(request, *args, **kwargs):
    import json
    if request.method == "POST":
        body = json.loads(request.body.decode("utf-8"))
        asyncio.run(handle_webhook(body))
        return {"statusCode": 200, "body": "OK"}
    return {"statusCode": 200, "body": "Method not allowed"}
