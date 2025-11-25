from django.test import SimpleTestCase
from django.urls import resolve, reverse
from job.views import job_list


class TestUrls(SimpleTestCase):

    def test_job_list_url(self):
        url = reverse('job:job_list')
        self.assertEquals(resolve(url).func, job_list)
        