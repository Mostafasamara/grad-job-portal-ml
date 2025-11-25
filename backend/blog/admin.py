from django.contrib import admin

from blog.models import Comment, Post

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    pass
  

# admin.site.register(Post)
admin.site.register(Comment)
# admin.site.register(Like)
