from django.contrib import admin
from .models.user import User
from .models.transaction import Transaction
from .models.category import Category
# Register your models here.
admin.site.register(User)
admin.site.register(Transaction)
admin.site.register(Category)