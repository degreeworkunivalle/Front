from django.conf.urls import patterns, url


urlpatterns = patterns('',
        url(r'^wiki/$', 'front_wiki.views.wiki', name='wiki'),
        url(r'^wiki/create/$', 'front_wiki.views.create', name='create'),
        url(r'^wiki/edit/$', 'front_wiki.views.edit', name='edit'),
)