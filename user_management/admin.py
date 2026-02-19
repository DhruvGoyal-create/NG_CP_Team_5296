from django.contrib import admin
from .models import UserProfile, UserSession, UserActivity, Transaction, SecureUserData, WorkingHours

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'created_at', 'updated_at']
    search_fields = ['user__username', 'user__email', 'phone']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'login_time', 'logout_time', 'duration_display', 'ip_address', 'is_active']
    list_filter = ['is_active', 'login_time']
    search_fields = ['user__username', 'ip_address']
    readonly_fields = ['login_time', 'duration_display']
    
    def duration_display(self, obj):
        duration = obj.duration()
        if duration:
            return str(duration).split('.')[0]
        return "Active"
    duration_display.short_description = 'Duration'

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'timestamp', 'ip_address']
    list_filter = ['activity_type', 'timestamp']
    search_fields = ['user__username', 'activity_type']
    readonly_fields = ['timestamp']

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'user', 'transaction_type', 'amount', 'status', 'created_at']
    list_filter = ['transaction_type', 'status', 'created_at']
    search_fields = ['transaction_id', 'user__username']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at']
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ['amount', 'transaction_type']
        return self.readonly_fields

@admin.register(SecureUserData)
class SecureUserDataAdmin(admin.ModelAdmin):
    list_display = ['user', 'data_type', 'created_at', 'is_active']
    list_filter = ['data_type', 'is_active', 'created_at']
    search_fields = ['user__username', 'data_type']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ['encrypted_data']
        return self.readonly_fields

@admin.register(WorkingHours)
class WorkingHoursAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'check_in', 'check_out', 'total_hours_display', 'break_hours']
    list_filter = ['date', 'user']
    search_fields = ['user__username']
    readonly_fields = ['total_hours_display']
    
    def total_hours_display(self, obj):
        if obj.total_hours:
            return str(obj.total_hours).split('.')[0]
        return "Not calculated"
    total_hours_display.short_description = 'Total Hours'
    
    actions = ['calculate_total_hours_action']
    
    def calculate_total_hours_action(self, request, queryset):
        for obj in queryset:
            obj.calculate_total_hours()
        self.message_user(request, f"Calculated hours for {queryset.count()} records.")
    calculate_total_hours_action.short_description = 'Calculate total hours for selected records'
