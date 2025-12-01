#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

# Patch for Python 3.12+ compatibility with django-filter
import pkgutil
import importlib.util

def find_loader(name):
    """Replacement for deprecated pkgutil.find_loader"""
    try:
        spec = importlib.util.find_spec(name)
        return spec.loader if spec else None
    except (ImportError, AttributeError, ValueError):
        return None

# Apply the patch
if not hasattr(pkgutil, 'find_loader'):
    pkgutil.find_loader = find_loader

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
