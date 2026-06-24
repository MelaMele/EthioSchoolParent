import os
import logging
from fastapi import FastAPI, Request, Response, status
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.storage.memory import MemoryStorage

# የሎግ ማስተካከያ (ስህተቶችን በVercel Logs ላይ በቀላሉ ለማየት)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment Variables
BOT_TOKEN = os.getenv("BOT_TOKEN")
# ማሳሰቢያ፦ የ Vercel ፕሮጀክት ሊንክዎን (ለምሳሌ https://your-app.vercel.app) በ Vercel Environment Variables ላይ WEBHOOK_URL በሚል ቁልፍ ቢያስገቡት ይመረጣል።
WEBHOOK_URL = os.getenv("WEBHOOK_URL") 

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())
app = FastAPI()

# 1. ቦቱ ሲጀምር የሚላክ መልእክት (/start)
@dp.message(CommandStart())
async def start_command(message: types.Message):
    # ወላጆች የ Mini App ፖርታሉን የሚከፍቱበት ጊዜያዊ ሊንክ (በኋላ እውነተኛውን የVercel Frontend ሊንክ እናደርገዋለን)
    web_app_url = "https://google.com" 
    
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
        "ይህ ቦት ከተማሪዎች ወላጆች ጋር በቀጥታ ለመገናኘት የተዘጋጀ ነው።\n\n"
        "📌 **የሚገኙ አገልግሎቶች:**\n"
        "• የክፍያ ስክሪንሾት መላኪያ\n"
        "• የተማሪዎች የባህርይ እና የውጤት መከታተያ\n"
        "• የትምህርት ቤት ዲጂታል ሜሞዎች\n\n"
        "ከታች ያለውን ቁልፍ ተጭነው መገልገያ ፖርታሉን መክፈት ይችላሉ።"
    )
    await message.answer(welcome_text, reply_markup=keyboard, parse_mode="Markdown")

# 2. የእገዛ መልእክት (/help)
@dp.message(Command("help"))
async def help_command(message: types.Message):
    help_text = (
        "❓ **እገዛ ይፈልጋሉ?**\n\n"
        "• የትምህርት ቤት ፖርታሉን ለመክፈት ከታች ያለውን የሜኑ በተን ወይም `/start` ን ይጫኑ።\n"
        "• ማንኛውም ቴክኒካዊ ችግር ካጋጠመዎት እባክዎ ለትምህርት ቤቱ አስተዳደር ያሳውቁ።"
    )
    await message.answer(help_text, parse_mode="Markdown")

# 3. የቴሌግራም ዌብሁክ መቀበያ መስመር (POST Endpoint)
@app.post("/api/bot")
async def telegram_webhook(request: Request):
    try:
        json_data = await request.json()
        logger.info(f"Received update: {json_data}")
        
        update = types.Update.model_validate(json_data, context={"bot": bot})
        await dp.feed_update(bot, update)
        return Response(status_code=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error processing update: {e}")
        return Response(content=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 4. የቦቱን የዌብሁክ ስራ ለመፈተሽ እና አውቶማቲክ ሰት ለማድረግ (GET Endpoint)
@app.get("/api/bot/setup")
async def setup_webhook():
    if not WEBHOOK_URL:
        return {"status": "error", "message": "WEBHOOK_URL environment variable is missing!"}
    
    webhook_endpoint = f"{WEBHOOK_URL}/api/bot"
    try:
        await bot.set_webhook(url=webhook_endpoint)
        return {"status": "success", "message": f"Webhook successfully set to {webhook_endpoint}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def index():
    return {"status": "running", "project": "School Connect Telegram Bot"}
