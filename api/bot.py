import os
from fastapi import FastAPI, Request
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.storage.memory import MemoryStorage

# ቶከኑን ከኢንቫይሮመንት ቫሪያብል ማግኘት
BOT_TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

# FastAPI መተግበሪያ መፍጠር (Vercel ይህንን 'app' ይፈልገዋል)
app = FastAPI()

@dp.message(CommandStart())
async def start_command(message: types.Message):
    web_app_url = "https://google.com" # ለጊዜው መፈተኛ
    
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

# ቴሌግራም መልእክት ሲልክ የሚቀበለው endpoint
@app.post("/api/bot")
async def telegram_webhook(request: Request):
    try:
        json_data = await request.json()
        update = types.Update.model_validate(json_data, context={"bot": bot})
        await dp.feed_update(bot, update)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ለብሮውዘር መፈተኛ ቀላል ገጽ
@app.get("/")
def read_root():
    return {"message": "School Connect Bot API is running!"}
