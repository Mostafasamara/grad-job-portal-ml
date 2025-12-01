from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.views.generic import TemplateView


urlpatterns = [
    # path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/', include('accounts.urls',namespace='accounts')),
    path('admin/', admin.site.urls),
    path('jobs/', include('job.urls' , namespace='jobs')),
    path('contact-us/', include('contact.urls' , namespace='contact')),
    path('api-auth/', include('rest_framework.urls')),
    path('blog-api/',include('blog.urls'),name='blog-api'),
    path('notifications/',include('notifications.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]


