from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='auth-register'),
    path('login/', views.LoginView.as_view(), name='auth-login'),
    path('me/', views.UserProfileView.as_view(), name='auth-profile'),
    path('users/', views.AdminUserListView.as_view(), name='auth-users-list'),
    path('users/<int:pk>/', views.AdminUserDetailView.as_view(), name='auth-user-detail'),
    path('users/new/', views.NewEmployeeListView.as_view(), name='auth-new-employees-list'),
    path('users/new/<int:pk>/', views.NewEmployeeDetailView.as_view(), name='auth-new-employee-detail'),
    path('departments/', views.DepartmentListView.as_view(), name='auth-departments-list'),
]
