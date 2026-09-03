# Journal Blog - Complete Project Setup Guide

## Frontend Status: ✅ COMPLETE

All HTML pages, CSS, and JS files have been generated:

### Pages Created:
- ✅ index.html - Homepage
- ✅ blog_post.html - Single post view
- ✅ archive.html - Post archive + series grid
- ✅ about.html - About page
- ✅ contact.html - Contact form
- ✅ newsletter.html - Newsletter signup
- ✅ newsletter_unsubscribe.html - Unsubscribe page
- ✅ search.html - Search results
- ✅ tag.html - Tag filtering + cloud
- ✅ categories.html - Category filtering
- ✅ collection_single.html - Single series view
- ✅ series_management.html - Admin series management
- ✅ legal.html - Privacy + Terms tabbed interface
- ✅ comments_management.html - Comment moderation
- ✅ traffic.html - Traffic analytics
- ✅ subscribers.html - Subscriber stats
- ✅ 404.html - 404 error page
- ✅ 500.html - 500 error page
- ✅ login.html - Authentication page
- ✅ dashboard.html - Main dashboard
- ✅ dashboard_home.html - Dashboard overview
- ✅ my_posts.html - Author's posts
- ✅ post_create.html - Create/edit posts
- ✅ post_list.html - All posts (admin)
- ✅ media_library.html - Media management
- ✅ settings.html - Author settings
- ✅ author_page.html - Public author profile
- ✅ password_reset.html - Password recovery

### CSS Files:
- ✅ style.css - Global styles
- ✅ contact.css - Contact page
- ✅ newsletter.css - Newsletter & unsubscribe
- ✅ search.css - Search results
- ✅ series_management.css - Series admin
- Plus 10+ existing theme-specific stylesheets

### JS Files:
- ✅ script.js - Global functionality
- ✅ contact.js - Contact form
- ✅ newsletter.js - Newsletter/unsubscribe
- ✅ search.js - Search functionality
- ✅ password_reset.js - Password reset
- ✅ series_management.js - Series CRUD
- Plus 10+ existing page-specific scripts

---

## Backend Implementation: Django + PostgreSQL

### Prerequisites:
```bash
# Install Python 3.9+
python --version

# Install pip
pip --version
```

### Step 1: Project Setup
```bash
# Create project directory
mkdir journal-backend
cd journal-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install django==4.2 psycopg2-binary python-dotenv
pip install djangorestframework django-cors-headers
pip install pillow  # For image processing
pip install celery redis  # For async tasks
pip install python-decouple  # For environment variables
```

### Step 2: Create Django Project
```bash
django-admin startproject journal .
python manage.py startapp blog
python manage.py startapp accounts
python manage.py startapp newsletter
```

### Step 3: Project Structure
```
journal-backend/
├── journal/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── blog/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
├── accounts/
│   ├── models.py
│   ├── views.py
│   └── admin.py
├── newsletter/
│   ├── models.py
│   └── views.py
├── media/
├── static/
├── .env
├── manage.py
└── requirements.txt
```

### Step 4: Database Models

**blog/models.py:**
```python
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    social_links = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    
    def __str__(self):
        return self.name

class Series(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "series"
    
    def __str__(self):
        return self.name

class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    subtitle = models.CharField(max_length=500, blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='posts')
    body = models.TextField()
    hero_image = models.ImageField(upload_to='posts/heroes/')
    category = models.CharField(max_length=100, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    series = models.ForeignKey(Series, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    views = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-published_at']
    
    def __str__(self):
        return self.title

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.email
```

### Step 5: Admin Configuration

**blog/admin.py:**
```python
from django.contrib import admin
from .models import Author, Post, Tag, Series, NewsletterSubscriber

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'email')
    search_fields = ('user__first_name', 'user__email')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'published_at')
    list_filter = ('status', 'created_at', 'category')
    search_fields = ('title', 'body')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ('name', 'author')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'subscribed_at', 'is_active')
    list_filter = ('is_active',)
```

### Step 6: Settings Configuration

**journal/settings.py:**
```python
# Add to INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',
    'corsheaders',
    
    'blog',
    'accounts',
    'newsletter',
]

# Add CORS configuration
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    # ... rest of middleware
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'journal_db',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Email configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or SendGrid, AWS SES
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PASSWORD')
```

### Step 7: Run Django

```bash
# Create migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Admin panel: http://localhost:8000/admin
```

---

## Deployment Options

### Option 1: Render.com (Recommended for beginners)
- Free tier available
- Automatic deployments from GitHub
- Managed PostgreSQL database
- Native Django support

### Option 2: Railway.app
- Simple CLI deployment
- Generous free tier
- Excellent for Django

### Option 3: Heroku (Legacy but still works)
```bash
pip install gunicorn
echo "web: gunicorn journal.wsgi" > Procfile
git push heroku main
```

---

## Frontend-Backend Integration

Connect your frontend to Django API:

**js/app.js (updated):**
```javascript
const API_URL = 'http://localhost:8000/api';

async function renderPublicPosts() {
    const response = await fetch(`${API_URL}/posts/`);
    const posts = await response.json();
    // Render posts...
}
```

---

## Next Steps (Priority Order):

1. ✅ Frontend: COMPLETE
2. ⬜ Set up Django project (2-3 hours)
3. ⬜ Create database models (1-2 hours)
4. ⬜ Build REST API endpoints (3-4 hours)
5. ⬜ Connect frontend to backend (2-3 hours)
6. ⬜ Implement file uploads (2 hours)
7. ⬜ Set up email system (2 hours)
8. ⬜ Deploy to production (2-3 hours)

**Total: ~2 weeks for full stack**

---

## Key Resources:

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- PostgreSQL: https://www.postgresql.org/
- Render Deployment: https://render.com/docs

