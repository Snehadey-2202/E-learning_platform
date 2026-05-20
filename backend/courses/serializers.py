from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Module, Lesson, Enrollment, UserProgress, Quiz, Question, Choice, QuizAttempt

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user

class LessonSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'title', 'description', 'video_url', 'content', 'duration', 'order', 'completed')

    def get_completed(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return UserProgress.objects.filter(user=user, lesson=obj).exists()
        return False

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ('id', 'title', 'order', 'lessons')

class CourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'category', 'difficulty', 'instructor_name', 'thumbnail_url', 'duration', 'rating', 'enrolled')

    def get_enrolled(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return Enrollment.objects.filter(user=user, course=obj).exists()
        return False

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('id', 'choice_text') # SECURE: excludes is_correct

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'question_text', 'choices')

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ('id', 'title', 'questions')

class CourseDetailSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)
    enrolled = serializers.SerializerMethodField()
    quiz = QuizSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'category', 'difficulty', 'instructor_name', 'thumbnail_url', 'duration', 'rating', 'enrolled', 'modules', 'quiz')

    def get_enrolled(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return Enrollment.objects.filter(user=user, course=obj).exists()
        return False

class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ('id', 'quiz', 'quiz_title', 'score', 'correct_answers', 'total_questions', 'submitted_at')
