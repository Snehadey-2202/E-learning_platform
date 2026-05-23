from django.contrib import admin

from .models import (
    Choice,
    Course,
    Enrollment,
    Lesson,
    Module,
    Question,
    Quiz,
    QuizAttempt,
    UserProgress,
)


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ("title", "duration", "order", "video_url")


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 0
    fields = ("title", "order")


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 0
    fields = ("choice_text", "is_correct")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "difficulty", "instructor", "rating", "created_at")
    list_filter = ("category", "difficulty", "created_at")
    search_fields = ("title", "description", "category", "instructor__username", "instructor__email")
    autocomplete_fields = ("instructor",)
    inlines = (ModuleInline,)
    ordering = ("title",)


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order")
    list_filter = ("course",)
    search_fields = ("title", "course__title")
    autocomplete_fields = ("course",)
    inlines = (LessonInline,)
    ordering = ("course", "order")


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "module", "duration", "order")
    list_filter = ("module__course", "module")
    search_fields = ("title", "description", "content", "module__title", "module__course__title")
    autocomplete_fields = ("module",)
    ordering = ("module", "order")


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "enrolled_at")
    list_filter = ("course", "enrolled_at")
    search_fields = ("user__username", "user__email", "course__title")
    autocomplete_fields = ("user", "course")


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "completed_at")
    list_filter = ("completed_at", "lesson__module__course")
    search_fields = ("user__username", "user__email", "lesson__title")
    autocomplete_fields = ("user", "lesson")


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "course")
    search_fields = ("title", "course__title")
    autocomplete_fields = ("course",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("question_text", "quiz")
    search_fields = ("question_text", "quiz__title", "quiz__course__title")
    autocomplete_fields = ("quiz",)
    inlines = (ChoiceInline,)


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ("choice_text", "question", "is_correct")
    list_filter = ("is_correct", "question__quiz")
    search_fields = ("choice_text", "question__question_text", "question__quiz__title")
    autocomplete_fields = ("question",)


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("user", "quiz", "score", "correct_answers", "total_questions", "submitted_at")
    list_filter = ("quiz", "submitted_at")
    search_fields = ("user__username", "user__email", "quiz__title")
    autocomplete_fields = ("user", "quiz")
    readonly_fields = ("submitted_at",)
