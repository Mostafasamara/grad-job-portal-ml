from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication that doesn't enforce CSRF checks.
    Useful for API endpoints that need to work with external clients.
    """
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening