from django.conf.urls import patterns, url


urlpatterns = patterns('',
       	url(r'^gamification/$', 'front_gamification.views.home_gamification', name='home_gamification'),
        url(r'^gamification/badges$', 'front_gamification.views.badge', name='badge'),
        url(r'^gamification/badges/detail/(?P<id>\d+)$', 'front_gamification.views.badgeDetail', name='detail_badge'),
    	url(r'^gamification/award$', 'front_gamification.views.award', name='award'),
    	url(r'^gamification/scores/quiz$', 'front_gamification.views.scores_quiz', name='scores_quiz'),
    	url(r'^gamification/scores/activitie$', 'front_gamification.views.scores_activitie', name='scores_activitie'),
)