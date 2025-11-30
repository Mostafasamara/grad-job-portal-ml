# backend/accounts/apps.py

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        import accounts.signals  # 👈 this line ensures signals are registered
