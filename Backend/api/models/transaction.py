from django.db import models

class Transaction(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Transaction {self.id} by {self.user.first_name}, {self.user.last_name}"
