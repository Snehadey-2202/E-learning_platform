from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Course, Module, Lesson, Enrollment, UserProgress, Quiz, Question, Choice, QuizAttempt
from .serializers import (
    UserSerializer, 
    CourseListSerializer, 
    CourseDetailSerializer, 
    QuizAttemptSerializer
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'full_name': f"{user.first_name} {user.last_name}".strip() or user.username
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'detail': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'full_name': f"{user.first_name} {user.last_name}".strip() or user.username
                }
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer

class EnrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
        if created:
            return Response({'detail': f'Successfully enrolled in {course.title}.'}, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Already enrolled in this course.'}, status=status.HTTP_200_OK)

class CompleteLessonView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id, lesson_id):
        lesson = get_object_or_404(Lesson, id=lesson_id, module__course_id=course_id)
        
        # Verify enrollment
        if not Enrollment.objects.filter(user=request.user, course_id=course_id).exists():
            return Response({'detail': 'You must be enrolled in this course to mark lessons as complete.'}, status=status.HTTP_403_FORBIDDEN)
            
        progress, created = UserProgress.objects.get_or_create(user=request.user, lesson=lesson)
        if created:
            return Response({'detail': f'Lesson {lesson.title} completed.'}, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Lesson already completed.'}, status=status.HTTP_200_OK)

class SubmitQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id, quiz_id):
        quiz = get_object_or_404(Quiz, id=quiz_id, course_id=course_id)
        
        # Verify enrollment
        if not Enrollment.objects.filter(user=request.user, course_id=course_id).exists():
            return Response({'detail': 'You must be enrolled in this course to submit quizzes.'}, status=status.HTTP_403_FORBIDDEN)
            
        submitted_answers = request.data.get('answers', {}) # format: { "question_id": choice_id }
        
        correct_count = 0
        total_questions = quiz.questions.count()
        
        if total_questions == 0:
            return Response({'detail': 'This quiz has no questions.'}, status=status.HTTP_400_BAD_REQUEST)
            
        for question in quiz.questions.all():
            submitted_choice_id = submitted_answers.get(str(question.id))
            if submitted_choice_id:
                try:
                    choice = Choice.objects.get(id=submitted_choice_id, question=question)
                    if choice.is_correct:
                        correct_count += 1
                except Choice.DoesNotExist:
                    pass
                    
        score_percentage = int((correct_count / total_questions) * 100)
        
        # Save attempt record
        attempt = QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=score_percentage,
            correct_answers=correct_count,
            total_questions=total_questions
        )
        
        return Response({
            'quiz_id': quiz.id,
            'score': score_percentage,
            'correct': correct_count,
            'total': total_questions,
            'submitted_at': attempt.submitted_at
        }, status=status.HTTP_201_CREATED)
