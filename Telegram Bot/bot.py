from typing import List, Tuple
import telebot
from telebot import types
import os
from dotenv import load_dotenv
import requests
import pyproj
import haversine as hs

load_dotenv()

bot = telebot.TeleBot(os.environ['TOKEN'], parse_mode=None)

def distance_between(point1: Tuple[float, float], point2: Tuple[float, float]):
    geod = pyproj.Geod(ellps='WGS84')
    lons = [point1[0], point2[0]]
    lats = [point1[1], point2[1]]
    return hs.haversine(point1, point2, unit=hs.Unit.METERS)

def main_menu():
    markup = types.ReplyKeyboardMarkup(row_width=1, one_time_keyboard=True)
    request_location_btn = types.KeyboardButton("📍 Отправить текущее местоположение", request_location=True)
    request_address_btn = types.KeyboardButton("✏️ Ввести адрес вручную")
    markup.add(request_location_btn, request_address_btn)
    return markup

def offices_list(loc: Tuple[float, float], office_list: List):
    # Сортируем отделения по удаленности и оставляем 5 ближайших
    office_list.sort(key=lambda x: distance_between((float(x["latitude"]), float(x["longitude"])), (loc[0], loc[1])))
    office_list = office_list[:5]

    # Составляем клавиатуру отделений
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=False, row_width=1)
    for office in office_list:
        distance = int(distance_between( (float(office["latitude"]), float(office["longitude"])), (loc[0], loc[1]) ))
        markup.add(types.KeyboardButton(f"✉️ {office['postalCode']} - {office['addressSource']} - {distance} м."))
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

    # Получаем списки офисов через АПИ
    resp = requests.get('http://localhost:8000/get_offices', params={'latitude': lat, "longitude": lon, "radius": 5}).json()

    bot.send_message(message.chat.id, f"Найдено {resp['totalCount']} открытых отделений в радиусе 5 километров. Показаны 5 ближайших. Выберите отделение для получения подробной информации.", reply_markup=offices_list((lat, lon), resp['postOffices']))

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