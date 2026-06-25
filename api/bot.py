import os
import logging
from fastapi import FastAPI, Request, Response, status
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.storage.memory import MemoryStorage
from supabase import create_client, Client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment Variables
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

app = FastAPI()

# የሱፓቤዝ እና የቦት ቁልፎችን ደህንነት መፈተሽ (ክራሽ እንዳይሆን መከላከያ)
bot = None
dp = None
supabase = None

if BOT_TOKEN:
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher(storage=MemoryStorage())

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        logger.error(f"Supabase connection error: {e}")

# ----------------------------------------
# 🖥️ API Endpoints
# ----------------------------------------

@app.get("/api/student/{telegram_id}")
def get_student_data(telegram_id: int):
    if not supabase:
        return {"status": "error", "message": "Supabase credentials are missing or invalid!"}
    try:
        response = supabase.table("students").select("*").eq("parent_telegram_id", telegram_id).execute()
        if response.data:
            return {"status": "success", "data": response.data[0]}
        return {"status": "error", "message": "የተማሪ መረጃ አልተገኘም የወላጅ ID አልተመዘገበም።"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/memos")
def get_memos():
    if not supabase:
        return {"status": "error", "message": "Supabase credentials are missing!"}
    try:
        response = supabase.table("memos").select("*").order("created_at", desc=True).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ----------------------------------------
# 🤖 Telegram Bot Handlers
# ----------------------------------------

if dp:
    @dp.message(CommandStart())
    async def start_command(message: types.Message):
        web_app_url = "https://ethio-school-parent.vercel.app/"
        keyboard = InlineKeyboardMarkup(
            inline_keyboard=[[InlineKeyboardButton(text="📱 የትምህርት ቤት ፖርታልን ክፈት", web_app=WebAppInfo(url=web_app_url))]]
        )
        welcome_text = (
            "👋 እንኳን ወደ ትምህርት ቤት ኮኔክት በደህና መጡ!\n\n"
            "ይህ ቦት ከተማሪዎች ወላጆች ጋር በቀጥታ ለመገናኘት የተዘጋጀ ነው።\n\n"
            "📌 **የሚገኙ አገልግሎቶች:**\n"
            "• የክፍያ ስክሪንሾት መላኪያ\n"
            "• የተማሪዎች የባህርይ እና የውጤት መከታተያ\n"
            "• የትምህርት ቤት ዲጂታል ሜሞዎች"
        )
        await message.answer(welcome_text, reply_markup=keyboard, parse_mode="Markdown")

@app.post("/api/bot")
async def telegram_webhook(request: Request):
    if not dp or not bot:
        return Response(content="Bot not initialized", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    try:
        json_data = await request.json()
        update = types.Update.model_validate(json_data, context={"bot": bot})
        await dp.feed_update(bot, update)
        return Response(status_code=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return Response(content=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@app.get("/api/bot/setup")
async def setup_webhook():
    if not WEBHOOK_URL or not bot:
        return {"status": "error", "message": "WEBHOOK_URL or BOT_TOKEN variable is missing!"}
    webhook_endpoint = f"{WEBHOOK_URL}/api/bot"
    try:
        await bot.set_webhook(url=webhook_endpoint)
        return {"status": "success", "message": f"Webhook successfully set to {webhook_endpoint}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def index():
    return {"status": "running", "bot_initialized": bot is not None, "supabase_initialized": supabase is not None}
