import datetime
import time
import yfinance as yf
import requests
import matplotlib.pyplot as plt
import json
import pandas as pd
import json
import websocket
import threading
import pandas as pd
import numpy as np
from typing import Any
from snapi_py_client.snapi_bridge import StocknoteAPIPythonBridge
from fyers_apiv3 import fyersModel

from selenium import webdriver
import time
import json
import re
import os

import pandas_ta as ta

import urllib.parse

import pickle
import subprocess


#from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import ProcessPoolExecutor


# In[ ]:





# ### Stocks greter than 5000 Cr. mCap

# masterFile = pd.read_csv('https://developers.stocknote.com/doc/ScripMaster.csv')
# masterFile = masterFile[masterFile['exchangeSegment'] == 'nse_cm']
# masterFile = masterFile[masterFile['tradingSymbol'].apply(lambda x : x[-3:]=='-EQ')]

# stocks = list(masterFile['name'])

# def getInfo(stock):
#     for ii in range(10):
#         try:
#             ticker = yf.Ticker(stock+".NS")
#             info = ticker.info
#             market_cap = info.get("marketCap")
# #             floatShares = info.get('floatShares')
# #             sharesOutstanding = info.get('sharesOutstanding')
# #             freeFloat = round(floatShares/sharesOutstanding, 2)
# 
# #             heldPercentInsiders = round(info.get('heldPercentInsiders'),2)
# #             heldPercentInstitutions = round(info.get('heldPercentInstitutions'),2)
# #             if market_cap + freeFloat + heldPercentInsiders + heldPercentInstitutions:
# #                 return market_cap, freeFloat, heldPercentInsiders, heldPercentInstitutions
#         
#             if market_cap:
#                 return round(market_cap/1e7)
#         except:
#             time.sleep(0.2)
#     print('No info :', stock)
#     return 0

# mCap = pd.DataFrame([], columns=['Script', 'mCap'])
# 
# count = 0
# for stock in stocks:
#     count += 1
#     if count % 50 == 0:
#         print(count)
#     mcap = getInfo(stock)
#     mCap.loc[len(mCap)] = {'Script':stock, 'mCap':mcap}

# mCap.to_csv('mCap.csv', index=False)

# In[ ]:





# ## Login

# In[2]:


################################################# Fyers Login ###############################################
redirect_uri= "https://fyersapiapp.com"  ## redircet_uri you entered while creating APP.
client_id = "ZSPH9S9VD4-100"                       ## Client_id here refers to APP_ID of the created app
secret_key = "PVZEFWT7X6"                          ## app_secret key which you got after creating the app
grant_type = "authorization_code"                  ## The grant_type always has to be "authorization_code"
response_type = "code"                             ## The response_type always has to be "code"
state = "sample"                                   ##  The state field here acts as a session manager. you will be sent with the state field after successfull generation of auth_code


#### give a new refresh token every 15 days // lst update : 10 Feb

command = """curl --location --request POST 'https://api-t1.fyers.in/api/v3/validate-refresh-token' --header 'Content-Type: application/json' --data-raw '{
  "grant_type": "refresh_token",
  "appIdHash": "87c0bcf2b4bf3ecf6a0f46fac9e846889e5c50dd12f3b520fb422596492d0ff2",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZDoxIiwiZDoyIiwieDowIiwieDoxIiwieDoyIl0sImF0X2hhc2giOiJnQUFBQUFCb1VsWXRVM1U0Vm1yaWVhalRuQlhEcXJtYXMzUU9SWGQ1VFlsb3NrZUNIclJ5XzdNRUFkZ3RKUGxIUTVQY1NBZmZCcWl1d1JDWXY3d25qZlpTYUpXWGNnMllCRWxzUFRITWk0d0xEa1FXSjkydXlBRT0iLCJkaXNwbGF5X25hbWUiOiIiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJkMGUzNjM1NGFiYmUzZjg5ZWEzNTJiOGI4N2ZjOTQ3ZWQ1ZTQxNjc5OWJkMDQ4ZDZkYTY4NzRjNiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImZ5X2lkIjoiWVAyNDIzMyIsImFwcFR5cGUiOjEwMCwiZXhwIjoxNzUxNTAyNjAwLCJpYXQiOjE3NTAyMjY0NzcsImlzcyI6ImFwaS5meWVycy5pbiIsIm5iZiI6MTc1MDIyNjQ3Nywic3ViIjoicmVmcmVzaF90b2tlbiJ9.ZNLdBd51yLWgow4KTgGG7_8U84hJk327lPdMCodOuhk",
  "pin": "9647"
}'"""


try:
    result = subprocess.run(command, shell=True, check=True,  stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    response_json = json.loads(result.stdout)  # Convert the JSON response to a Python dictionary
    access_token = response_json['access_token']
    if response_json['code'] == 200:
        print("Fyers login Successful.")
    else:
        print("Fyers login Problem")
        exit()
except subprocess.CalledProcessError as e:
    print(f"Fyers login Problem: {e}")


#print(access_token)


# In[3]:


path = '/home/sirshendu/Desktop/FnoDataRunDaily/ProcessData/MakeHtml/5_TaqTbq'


# In[4]:


mcap = pd.read_csv(path+'/mCap.csv')
mcap['Script'] = mcap['Script'].apply(lambda x : 'NSE:'+x+'-EQ')
symbols = list(mcap[mcap['mCap'] >= 5000]['Script'].unique())


# # Websocket

# In[5]:


import time
import threading
import pandas as pd
from fyers_apiv3.FyersWebsocket import data_ws


# In[6]:


last_print_time = time.time()
r'''
def onmessage(message):
    """
    Callback function to handle incoming messages from the FyersDataSocket WebSocket.

    Parameters:
        message (dict): The received message from the WebSocket.

    """
    print(message)
    
    return
    
    global last_print_time
    processed_data = []
    #print("Response:", type(message))
    # Check if message is valid and contains expected keys
    if isinstance(message, dict):
        if "symbol" in message and "chp" in message:  # Example keys
            symbol = message["symbol"]
            CngPrice = message["chp"]
            
            # Acquire lock to safely append to the shared list
            #with lock:
            #    processed_data.append({"symbol": symbol, "CngPrice": CngPrice, "timestamp": time.time()})


            # Process the data (e.g., log, analyze, or trigger alerts)
            #print(f"Symbol: {symbol}, Cng Price: {CngPrice}")

            # Example: Save data to a list or database
            processed_data.append({"symbol": symbol, "CngPrice": CngPrice})
            
            if time.time() - last_print_time > 10:
                
                #print(message)
                last_print_time = time.time()
            

            # Example: Trigger an alert if price crosses a threshold
            #if price > 5000:  # Set your condition
            #    print(f"ALERT: {symbol} price exceeded 5000!")
        else:
            print("Unexpected message format:", message)
    else:
        print("Invalid message type received.")
'''

# Store received messages
processed_data = []
last_save_time = time.time()

def onmessage(message):
    global last_save_time
    
    if isinstance(message, dict) and "symbol" in message:
        message['received_time'] = datetime.datetime.now().isoformat()
        processed_data.append(message)

        # Convert to DataFrame every 10 seconds and save
        if time.time() - last_save_time > 60:
            save_dataframe()
            last_save_time = time.time()

def save_dataframe():
    if processed_data:
        try:
            df = pd.DataFrame(processed_data)
            #timeNow = datetime.datetime.now().isoformat()
            #df["received_time"] = [timeNow for ii in range(len(df))]

    #         allColumns = ['ltp', 'vol_traded_today', 'last_traded_time', 'exch_feed_time',
    #            'bid_size', 'ask_size', 'bid_price', 'ask_price', 'last_traded_qty',
    #            'tot_buy_qty', 'tot_sell_qty', 'avg_trade_price', 'low_price',
    #            'high_price', 'lower_ckt', 'upper_ckt', 'open_price',
    #            'prev_close_price', 'type', 'symbol', 'ch', 'chp']
            df = df.loc[:, [ 'received_time', 'symbol', 'ltp', 'chp', 'tot_buy_qty', 'tot_sell_qty']]
            df["received_time"] = pd.to_datetime(df["received_time"], errors='coerce')
            df = df.sort_values(by=['symbol', 'received_time'])
            df = df.groupby('symbol').apply(lambda g : g.set_index('received_time').resample("1min").agg({'symbol':'last', 'ltp':'last', 'chp':'last', 'tot_buy_qty':'last', 'tot_sell_qty':'last'}).reset_index() ).reset_index(drop=True)
            #df = df.iloc[::3]

            # Save to CSV (append mode)
            df.to_csv(path+"/market_data.csv", mode='a', header=not pd.io.common.file_exists(path+"/market_data.csv"), index=False)

            # Keep only the last occurrence of each symbol & save the dataframe
            df = pd.read_csv(path+"/market_data.csv")
            df = df.drop_duplicates(subset= ["received_time","symbol"], keep="last")
            df["received_time"] = pd.to_datetime(df["received_time"], errors='coerce')
            df = df.sort_values(by=['symbol', 'received_time'])
            #df = df.groupby('symbol').apply(lambda g : g.set_index('received_time').resample("1min").agg({'symbol':'last', 'ltp':'last', 'chp':'last', 'tot_buy_qty':'last', 'tot_sell_qty':'last'}).reset_index() ).reset_index(drop=True)
            #df = df.iloc[::3]
            df.to_csv(path+"/market_data.csv", index=False)

            # also save in json file
            # Convert to nested dictionary
            df = df.sort_values(by=['symbol', 'received_time'])
            df = df.groupby('symbol').apply(lambda g : g.iloc[::-1].iloc[::3].iloc[::-1] ).reset_index(drop=True)

            nested_json = {}

            for _, row in df.iterrows():
                #print(row['received_time'])
                if pd.isna(row['received_time']):
                    print('Nat time found')
                    continue

                symbol = row['symbol']
                time = str(row['received_time'])
                data = {
                    'ltp': row['ltp'],
                    'chp': row['chp'],
                    'tot_buy_qty': row['tot_buy_qty'],
                    'tot_sell_qty': row['tot_sell_qty']
                }
                nested_json.setdefault(symbol, {})[time] = data

            # Save to file
            with open(path+"/market_data.json", "w") as f:
                json.dump(nested_json, f, indent=4)

            # Clear stored data after saving
            processed_data.clear()
            del df
        except:
            print('Coming at except')
def onerror(message):
    """
    Callback function to handle WebSocket errors.

    Parameters:
        message (dict): The error message received from the WebSocket.
    """
    print("Error:", message)

def onclose(message):
    """
    Callback function to handle WebSocket connection close events.
    """
    print("Connection closed:", message)

    
# df = pd.read_csv("ind_nifty500list.csv")
# symbols = list(df['Symbol'].apply(lambda x : "NSE:"+x+"-EQ"))

def onopen(symbols = symbols):
    """
    Callback function to subscribe to data type and symbols upon WebSocket connection.

    """
    # Specify the data type and symbols you want to subscribe to
    data_type = "SymbolUpdate"

    # Subscribe to the specified symbols and data type
    symbols = symbols#['NSE:SBIN-EQ', 'NSE:ADANIENT-EQ']
    fyers.subscribe(symbols=symbols, data_type=data_type)

    # Keep the socket running to receive real-time data
    fyers.keep_running()

  
r'''
def process_data():
    """Processes collected data every 10 seconds."""
    while True:
        time.sleep(10)  # Wait for 10 seconds
        
        with lock:
            if processed_data:
                print("Processing latest data batch...")
                latest_data = processed_data.copy()
                processed_data.clear()  # Clear after processing

        # Example processing: Convert to DataFrame
        if latest_data:
            df = pd.DataFrame(latest_data)
            print(df)  # Print latest processed data
            # You can save to a database, CSV, or perform analysis here.
'''


# In[7]:


# Replace the sample access token with your actual access token obtained from Fyers
#access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3NDI0NDQzNDMsImV4cCI6MTc0MjUxNzAwMywibmJmIjoxNzQyNDQ0MzQzLCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbjI1YzN0UUlxNlJ3RWc4M2hWWXBqYlpBTEpFTlh4Q1lpSGlXdzVWSXA4QkJPREJQNFFDMFVPVmhWelF5Ympyek9PeHBHWVNNVU9XT0Q3MWtzOU5UZ0QzVFl3NFVaeXdpTzNtcDYweTBISVJkU3dpRT0iLCJkaXNwbGF5X25hbWUiOiJQUklZQU5LQSBEQVMiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJkMGUzNjM1NGFiYmUzZjg5ZWEzNTJiOGI4N2ZjOTQ3ZWQ1ZTQxNjc5OWJkMDQ4ZDZkYTY4NzRjNiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImZ5X2lkIjoiWVAyNDIzMyIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.10vap4z3LdvYd2_QOBe3ex5xMQThkqBKvhLOZSlrhCE"


# Create a FyersDataSocket instance with the provided parameters
fyers = data_ws.FyersDataSocket(
    access_token=access_token,       # Access token in the format "appid:accesstoken"
    log_path="",                     # Path to save logs. Leave empty to auto-create logs in the current directory.
    litemode=False,                  # Lite mode disabled. Set to True if you want a lite response.
    write_to_file=False,              # Save response in a log file instead of printing it.
    reconnect=True,                  # Enable auto-reconnection to WebSocket on disconnection.
    on_connect=onopen,               # Callback function to subscribe to data upon connection.
    on_close=onclose,                # Callback function to handle WebSocket connection close events.
    on_error=onerror,                # Callback function to handle WebSocket errors.
    on_message=onmessage             # Callback function to handle incoming messages from the WebSocket.
)

# Establish a connection to the Fyers WebSocket
fyers.connect()



