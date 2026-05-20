from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Course, Module, Lesson, Enrollment, UserProgress, Quiz, Question, Choice, QuizAttempt

class ELearningAPITests(APITestCase):
    def setUp(self):
        # Create standard user
        self.instructor = User.objects.create_user(
            username='instructor',
            password='password123',
            email='instructor@test.com',
            first_name='Angela',
            last_name='Yu'
        )
        
        self.student = User.objects.create_user(
            username='student',
            password='password123',
            email='student@test.com'
        )

        # Create Course
        self.course = Course.objects.create(
            title='Test Course',
            description='Test description',
            category='Development',
            difficulty='Beginner',
            instructor=self.instructor,
            duration='10 hours',
            rating=4.5
        )

        # Create Module & Lesson
        self.module = Module.objects.create(course=self.course, title='Test Module', order=1)
        self.lesson = Lesson.objects.create(
            module=self.module,
            title='Test Lesson',
            content='Test content',
            video_url='http://test.com/video.mp4',
            order=1
        )

        # Create Quiz
        self.quiz = Quiz.objects.create(course=self.course, title='Test Quiz')
        self.question = Question.objects.create(quiz=self.quiz, question_text='1 + 1 = ?')
        self.choice_correct = Choice.objects.create(question=self.question, choice_text='2', is_correct=True)
        self.choice_wrong = Choice.objects.create(question=self.question, choice_text='3', is_correct=False)

    def test_user_registration(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'password': 'newpassword123',
            'email': 'new@test.com',
            'full_name': 'New Student'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser')

    def test_user_login(self):
        url = reverse('login')
        data = {
            'username': 'student',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        
    def test_course_list(self):
        url = reverse('course-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Course')

    def test_course_detail(self):
        url = reverse('course-detail', args=[self.course.id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Course')
        self.assertEqual(len(response.data['modules']), 1)
        self.assertEqual(response.data['modules'][0]['title'], 'Test Module')

    def test_enrollment_required_auth(self):
        url = reverse('enroll', args=[self.course.id])
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_enrollment_success(self):
        self.client.force_authenticate(user=self.student)
        url = reverse('enroll', args=[self.course.id])
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Enrollment.objects.filter(user=self.student, course=self.course).exists())

    def test_quiz_grading(self):
        # First enroll
        Enrollment.objects.create(user=self.student, course=self.course)
        self.client.force_authenticate(user=self.student)
        
        url = reverse('submit_quiz', args=[self.course.id, self.quiz.id])
        
        # Submit correct answer
        data = {
            'answers': {
                str(self.question.id): self.choice_correct.id
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['score'], 100)
        self.assertEqual(response.data['correct'], 1)
        self.assertEqual(response.data['total'], 1)
        
        # Submit wrong answer
        data = {
            'answers': {
                str(self.question.id): self.choice_wrong.id
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['score'], 0)
