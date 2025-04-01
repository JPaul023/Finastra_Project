from django.contrib import admin
from .models import Client, ClientContact, ClientEmail


class ClientContactInline(admin.TabularInline):
    model = ClientContact
    extra = 1

class ClientEmailInline(admin.TabularInline):
    model = ClientEmail
    extra = 1

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('client_id', 'name', 'company', 'status')
    inlines = [ClientContactInline, ClientEmailInline]

admin.site.register(ClientContact)
admin.site.register(ClientEmail)

