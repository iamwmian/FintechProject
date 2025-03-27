from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import random
from datetime import datetime, timedelta

class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)


####################### TESTING ###########################

def generate_random_datetime(start_date, end_date):
    delta = end_date - start_date
    random_seconds = random.randint(0, int(delta.total_seconds()))
    random_datetime = start_date + timedelta(seconds=random_seconds)
    return random_datetime


def generate_random_price(min_price, max_price):
    random_price = random.uniform(min_price, max_price)
    
    random_price = round(random_price, 2)
    
    return random_price
def generate_random_currency():
    currencies = [
        "USD",
        "EUR",
        # "GBP",
        # "JPY",
        # "AUD",
        # "CAD",
        # "CHF",
        # "CNY",
        # "INR",
        # "MXN",
        # "BRL",
        # "ZAR",
        # "KRW",
        # "HKD",
        # "SGD",
    ]
    random_currency = random.choice(currencies)
    return random_currency

def generate_random_category_and_item():
    map = {}

    map["Groceries"] = ["Walmart", "Target", "Costco", "Aldi", "HEB"]
    map["Entertainment"] = ["Netflix", "Hulu", "Crunchyroll", "HBO", "Spotify", "Apple Music", "Disney+"]
    map["Misc"] = ["Lost a Bet"]
    map["Utilities"] = ["Electricity", "Water", "Gas", "Internet", "Rent"]
    map["Transportation"] = ["Gas", "Public Transit", "Uber", "Car Payment", "Car Insurance"]
    map["Dining"] = ["McDonald", "Starbucks", "Chipotle", "Pizza Hut", "Subway"]
    map["Health"] = ["Gym Membership", "Medical Bills", "Prescription Medications"]
    map["Travel"] = ["Flight", "Hotel", "Car Rental", "Airbnb"]
    map["Shopping"] = ["Amazon", "eBay", "Best Buy", "Home Depot"]
    map["Education"] = ["Tuition", "Books", "Online Courses", "Workshops"]
    

    random_key = random.choice(list(map.keys()))
    random_value = random.choice(map[random_key])

    return random_key, random_value

def generate_random_transaction():
    start_date = datetime(2024, 1, 1)  
    end_date = datetime(2024, 12, 31) 

    random_key, random_value = generate_random_category_and_item()
    random_datetime = generate_random_datetime(start_date, end_date)
    random_price = generate_random_price(20, 1000)
    random_currency = generate_random_currency()

    transaction = {
        'title': random_value,
        'cost' : random_price,
        'currency' : random_currency,
        'category' : random_key,
        'date' : random_datetime
    }
    
    return transaction

class RandomTransaction(APIView):
    def get(self, request):
        transaction = generate_random_transaction()
        return Response(transaction)

    
class RandomTransactions(APIView):
    def get(self, request):
       number_of_transactions = 10
       transactions = [generate_random_transaction() for _ in range(number_of_transactions)]
       return Response(transactions)