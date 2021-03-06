from django.conf.urls import patterns, url


urlpatterns = patterns('',
        url(r'^$', 'front_users.views.index', name='index'),
        url(r'^recoverPassword/$', 'front_users.views.recoverPassword', name='recoverPassword'),
        url(r'^changePassword/$', 'front_users.views.changePassword', name='changePassword'),
        url(r'^users/detail/(?P<id>\d+)$', 'front_users.views.detail', name='detail'),
        url(r'^profile/$', 'front_users.views.profile', name='profile'),
        url(r'^settings/$', 'front_users.views.settings', name='settings'),
        url(r'^authentication/$', 'front_users.views.authentication_requiered', name='authenticationRequiered'),
        url(r'^listUsers/$', 'front_users.views.listUsers', name='listUsers'),

        url(r'^p$', 'front_users.views.permissions', name='permissions'),

        url(r'^password/reset/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)$', 'front_users.views.password_confirm')

)
