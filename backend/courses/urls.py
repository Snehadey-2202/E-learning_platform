from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    LoginView,
    CourseViewSet,
    EnrollView,
    CompleteLessonView,
    SubmitQuizView
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    
    # Courses Catalog ViewSet (handles lists and individual details)
    path('', include(router.urls)),
    
    # Enrollment
    path('courses/<int:course_id>/enroll/', EnrollView.as_view(), name='enroll'),
    
    # Lesson completion
    path('courses/<int:course_id>/lessons/<int:lesson_id>/complete/', CompleteLessonView.as_view(), name='complete_lesson'),
    
    # Quiz Submission
    path('courses/<int:course_id>/quiz/<int:quiz_id>/submit/', SubmitQuizView.as_view(), name='submit_quiz'),
]
