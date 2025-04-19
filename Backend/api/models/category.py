from django.db import models

class Category(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=255, default="USD")
    color = models.CharField(max_length=7) # Store with HEX Value?
    
    def __str__(self):
        return f"Category: {self.title}  by {self.user.first_name}, {self.user.last_name}"