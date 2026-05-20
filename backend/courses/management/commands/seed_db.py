from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from courses.models import Course, Module, Lesson, Enrollment, UserProgress, Quiz, Question, Choice, QuizAttempt

class Command(BaseCommand):
    help = 'Seeds the database with initial e-learning courses, lessons, and quizzes'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        QuizAttempt.objects.all().delete()
        UserProgress.objects.all().delete()
        Enrollment.objects.all().delete()
        Choice.objects.all().delete()
        Question.objects.all().delete()
        Quiz.objects.all().delete()
        Lesson.objects.all().delete()
        Module.objects.all().delete()
        Course.objects.all().delete()

        # Keep users but make sure we have the demo instructor and superuser
        self.stdout.write('Creating users...')
        instructor, created = User.objects.get_or_create(
            username='instructor',
            defaults={
                'first_name': 'Angela',
                'last_name': 'Yu',
                'email': 'angela@edustream.com',
                'is_staff': True
            }
        )
        if created or not instructor.check_password('password123'):
            instructor.set_password('password123')
            instructor.save()

        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@edustream.com',
                'is_superuser': True,
                'is_staff': True
            }
        )
        if created or not admin_user.check_password('adminpassword'):
            admin_user.set_password('adminpassword')
            admin_user.save()

        self.stdout.write('Seeding course data...')

        # Course 1: Python Masterclass
        c1 = Course.objects.create(
            title='Python Masterclass: From Zero to Hero',
            description='Learn Python programming language from the absolute basics up to advanced algorithms, OOP, and script automation.',
            category='Development',
            difficulty='Beginner',
            instructor=instructor,
            thumbnail_url='https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60',
            duration='24 hours',
            rating=4.8
        )

        c1_m1 = Module.objects.create(course=c1, title='Module 1: Getting Started with Python', order=1)
        Lesson.objects.create(
            module=c1_m1,
            title='1.1 Installation & Setup',
            description='In this lesson, you will install Python 3.12 and configure Visual Studio Code.',
            video_url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            content='Step 1: Go to python.org and download the latest Python release for your system.\nStep 2: Install VS Code from code.visualstudio.com.\nStep 3: Install the official Python Extension in VS Code.',
            duration='8 mins',
            order=1
        )
        Lesson.objects.create(
            module=c1_m1,
            title='1.2 Hello World & Variables',
            description='Understand standard output and how variables store data in memory.',
            video_url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            content='Python variables do not need explicit types. Example:\nname = "EduStream"\nprint("Hello " + name)',
            duration='12 mins',
            order=2
        )

        c1_m2 = Module.objects.create(course=c1, title='Module 2: Control Flow & Data Structures', order=2)
        Lesson.objects.create(
            module=c1_m2,
            title='2.1 Conditional statements (if-else)',
            description='Learn branching logic and boolean variables.',
            video_url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            content='Branching relies on indentation. Example:\nif score >= 90:\n    print("A")\nelse:\n    print("B")',
            duration='15 mins',
            order=1
        )
        Lesson.objects.create(
            module=c1_m2,
            title='2.2 For & While Loops',
            description='Master iterations and list comprehensions in Python.',
            video_url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            content='Loops iterate over collections. Example:\nfor item in [1, 2, 3]:\n    print(item)',
            duration='18 mins',
            order=2
        )

        # Quiz for Course 1
        c1_quiz = Quiz.objects.create(course=c1, title='Python Programming Essentials Quiz')
        
        q1 = Question.objects.create(quiz=c1_quiz, question_text='Which data type is mutable in Python?')
        Choice.objects.create(question=q1, choice_text='Tuple', is_correct=False)
        Choice.objects.create(question=q1, choice_text='List', is_correct=True)
        Choice.objects.create(question=q1, choice_text='String', is_correct=False)
        Choice.objects.create(question=q1, choice_text='Integer', is_correct=False)

        q2 = Question.objects.create(quiz=c1_quiz, question_text='How do you insert an element at the end of a list in Python?')
        Choice.objects.create(question=q2, choice_text='list.add(item)', is_correct=False)
        Choice.objects.create(question=q2, choice_text='list.append(item)', is_correct=True)
        Choice.objects.create(question=q2, choice_text='list.insert(item)', is_correct=False)
        Choice.objects.create(question=q2, choice_text='list.push(item)', is_correct=False)

        # Course 2: React.js
        c2 = Course.objects.create(
            title='Modern Front-End: React.js & Advanced CSS',
            description='Master React, hooks, contexts, routing, and beautiful styling with CSS custom properties and flexbox/grid layouts.',
            category='Design & Frontend',
            difficulty='Intermediate',
            instructor=instructor,
            thumbnail_url='https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
            duration='18 hours',
            rating=4.9
        )

        c2_m1 = Module.objects.create(course=c2, title='Module 1: Introduction to React & JSX', order=1)
        Lesson.objects.create(
            module=c2_m1,
            title='1.1 Declarative vs Imperative UI',
            description='Learn why React makes frontend development easier and declarative.',
            video_url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            content='In React, you describe how the UI should look based on the current state, rather than writing instructions on how to transition it.',
            duration='10 mins',
            order=1
        )
        Lesson.objects.create(
            module=c2_m1,
            title='1.2 Creating Custom Components',
            description='Understand props, JSX, and building modular interfaces.',
            video_url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            content='Components are standard functions that return JSX. Example:\nfunction Welcome(props) { return <h1>Hello, {props.name}</h1>; }',
            duration='14 mins',
            order=2
        )

        c2_quiz = Quiz.objects.create(course=c2, title='React Core concepts Quiz')
        q3 = Question.objects.create(quiz=c2_quiz, question_text='Which hook would you use to fetch data when a component mounts?')
        Choice.objects.create(question=q3, choice_text='useState', is_correct=False)
        Choice.objects.create(question=q3, choice_text='useContext', is_correct=False)
        Choice.objects.create(question=q3, choice_text='useEffect', is_correct=True)
        Choice.objects.create(question=q3, choice_text='useReducer', is_correct=False)

        # Course 3: Django & Postgres
        c3 = Course.objects.create(
            title='Scalable APIs with Django & PostgreSQL',
            description='Learn Django REST Framework, database optimization, JWT authentication, and deploying servers to cloud virtual machines.',
            category='Back-End',
            difficulty='Advanced',
            instructor=instructor,
            thumbnail_url='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
            duration='32 hours',
            rating=4.7
        )

        c3_m1 = Module.objects.create(course=c3, title='Module 1: Django REST Framework Foundations', order=1)
        Lesson.objects.create(
            module=c3_m1,
            title='1.1 Serializers & Class-Based Views',
            description='Learn to convert database models into JSON response objects.',
            video_url='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            content='DRF serializers abstract data serialization and validation, acting like Django Forms but outputting JSON data.',
            duration='15 mins',
            order=1
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))
