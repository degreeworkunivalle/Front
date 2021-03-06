"""
Django settings for front project.

Generated by 'django-admin startproject' using Django 1.8.1.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETTINGS_PATH = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '4rwvcw%@pdto9$4@$+_%kno9mvrn)o0(@luoz86yl+@d&ne9#^'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sessions.backends.signed_cookies',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'front_users',
    'front_modules',
    'front_foro',
    'front_material',
    'front_wiki',
    'front_comments',
    'front_activities',
    'front_evaluations',
    'front_notifications',
    'front_gamification',
    'front_chat',

)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',
#    'django.contrib.auth.middleware.RemoteUserMiddleware',

    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'front.urls'
PROJECT_DIR = os.path.dirname(__file__)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
	'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
	    os.path.join(BASE_DIR, 'front_users/templates'),
            os.path.join(BASE_DIR, 'front_activities/templates'),
            os.path.join(BASE_DIR, 'front_chat/templates'),
            os.path.join(BASE_DIR, 'front_evaluations/templates'),
            os.path.join(BASE_DIR, 'front_foro/templates'),
            os.path.join(BASE_DIR, 'front_gamification/templates'),
            os.path.join(BASE_DIR, 'front_material/templates'),
            os.path.join(BASE_DIR, 'front_modules/templates'),
            os.path.join(BASE_DIR, 'front_wiki/templates'),
	    
	    os.path.join(BASE_DIR, 'front_evaluations', 'templates/quiz'),
            os.path.join(BASE_DIR, 'front_evaluations', 'templates/questions'),
            os.path.join(BASE_DIR, 'front_evaluations', 'templates/categories'),

	],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'front.processor.debug',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'front.wsgi.application'


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT = '/var/www/html/trabajodegrado/'
"""STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
    #os.path.join(BASE_DIR, 'statics'),
)"""

STATICFILES_DIRS = ( os.path.join('statics'), )

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',)

"""
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.RemoteUserBackend',
)
"""

##Testing
if DEBUG:
    # Database
    # https://docs.djangoproject.com/en/1.8/ref/settings/#databases
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
            'NAME': '',                      # Or path to database file if using sqlite3.
            # The following settings are not used with sqlite3:
            'USER': '',
            'PASSWORD': '',
            'HOST': '',                      # Empty for localhost through domain sockets or           '127.0.0.1' for localhost through TCP.
            'PORT': '',                      # Set to empty string for default.
        }
    }
#persisntent sessions 
#SESSION_EXPIRE_AT_BROWSER_CLOSE = False

#here host server is specified

if DEBUG:
    API_SERVER = 'http://127.0.0.1:8080'
else:
    #API_SERVER = 'http+unix://%2Fwebapps%2FServices%2Frun%2Fgunicorn.sock'
    API_SERVER = 'http://127.0.0.1:8002'
