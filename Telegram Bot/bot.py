import telebot
import os
import dotenv

bot = telebot.TeleBot(os.environ['TOKEN'], parse_mode=None)

