from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL
# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def post_header(self):
        return self.body[:20]

    def __str__(self):
        return f"<{self.user.username}: {self.post_header()}...>"


class Comment(models.Model):
    body = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def comment_header(self):
        return self.body[:20]

    def __str__(self):
        return f"{self.user.username} commented on <{self.post}>"

