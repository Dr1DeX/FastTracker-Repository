from django.db import models


class ExecutorToTask(models.Model):
    name = models.CharField('Name', max_length=254)
    email = models.EmailField()
    pr_task = models.CharField('PR', max_length=254)
    registration_date = models.DateField('Registration Date', auto_now_add=True)
    avatar = models.CharField('URL', max_length=512)

    def __str__(self):
        return self.name
