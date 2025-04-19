from django.db import models

class Transaction(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.ForeignKey('Category', on_delete=models.DO_NOTHING)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=255, default="USD")
    location = models.CharField(max_length=255, default="USA")
    transaction_date = models.DateTimeField(auto_now_add=False)
    
    def __str__(self):
        return f"Transaction {self.id} by {self.user.first_name}, {self.user.last_name}"
