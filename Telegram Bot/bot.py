import telebot
from telebot import types
import os
from dotenv import load_dotenv

load_dotenv()

bot = telebot.TeleBot(os.environ['TOKEN'], parse_mode=None)

def main_menu():
    markup = types.ReplyKeyboardMarkup(row_width=1, one_time_keyboard=True)
    request_location_btn = types.KeyboardButton("📍 Отправить текущее местоположение", request_location=True)
    request_address_btn = types.KeyboardButton("✏️ Ввести адрес вручную")
    markup.add(request_location_btn, request_address_btn)
    return markup

def offices_list():
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=True, row_width=1)
    markup.add(types.KeyboardButton("Назад"))
    return markup

def is_address_reply(message):
    if message.reply_to_message:
        return message.reply_to_message.text == 'Введите адрес в ответ на данное сообщение'

@bot.message_handler(commands=['start', 'help'])
def welcome_message(message):
    bot.send_message(message.chat.id, "Привет, этот бот поможет вам найти ближайшие отделения почты. Для продолжения, выберите действие.", 
                    reply_markup=main_menu())

@bot.message_handler(content_types=['location'])
def location_handler(message):
    lat = message.location.latitude
    lon = message.location.longitude
    bot.send_message(message.chat.id, f"Полученные координаты: {lat},{lon}", reply_markup=offices_list())

@bot.message_handler(regexp="✏️ Ввести адрес вручную")
def address_handler(message):
    force_reply = types.ForceReply()
    bot.send_message(message.chat.id, "Введите адрес в ответ на данное сообщение", reply_markup=force_reply)

@bot.message_handler(regexp="Назад")
def back_to_main_menu(message):
    bot.send_message(message.chat.id, 'Выберите действие', reply_markup=main_menu())

@bot.message_handler(func=is_address_reply)
def address_reply_handler(message):
    address = message.text
    bot.send_message(message.chat.id, f"Полученный адрес: {address}", reply_markup=offices_list())

@bot.message_handler(func=lambda x: True)
def message_black_hole(message):
    bot.send_message(message.chat.id, "Извините, команда не была распознана. Выберите действие:", reply_markup=main_menu())

bot.infinity_polling()