from django.shortcuts import redirect, render
from .models import Job
from django.core.paginator import Paginator
from .form import ApplicationForm , JobForm
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .filters import JobFilter
from django.http import HttpResponseRedirect

from accounts.models import EmployeeProfile
# Create your views here.


def job_list(request):
    job_list = Job.objects.all()
    clear_filter = request.GET.get('clear_filter') == '1'

    predicted_category = None  # 👈 we’ll send this to the template

    if request.user.is_authenticated and not getattr(request.user, "is_employer", False):
        try:
            profile = EmployeeProfile.objects.get(user=request.user)
            if profile.predicted_category:
                predicted_category = profile.predicted_category
                # only filter when user did NOT click "Show all jobs"
                if not clear_filter:
                    job_list = job_list.filter(category=predicted_category)
        except EmployeeProfile.DoesNotExist:
            pass

    myfilter = JobFilter(request.GET, queryset=job_list)
    job_list = myfilter.qs

    paginator = Paginator(job_list, 4)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'jobs': page_obj,
        'myfilter': myfilter,
        'skip_filter': clear_filter,
        'predicted_category': predicted_category,  # 👈 new
    }
    return render(request, 'job/job_list.html', context)



def job_detail(request , slug):
    job_detail = Job.objects.get(slug = slug)


    if request.method=='POST':
        form = ApplicationForm(request.POST , request.FILES )
        if form.is_valid():
            myform = form.save(commit=False)
            myform.job = job_detail
            myform.save()

    else:
        form = ApplicationForm()

    context = {'job' : job_detail , 'form':form}
    return render(request,'job/job_detail.html',context)

@login_required
def add_job(request):

    if request.method=='POST':
        form = JobForm(request.POST , request.FILES )
        if form.is_valid():
            myform = form.save(commit=False)
            myform.owner = request.user
            myform.save()
            return redirect(reverse('jobs:job_list'))

    else:
        form =JobForm()


    return render(request,'job/add_job.html', {'form1':form})


@login_required
def save_job(request, id):
    profile = request.user.profile
    job = Job.objects.get(id=id)
    if job in profile.saved_jobs.all():
        profile.saved_jobs.remove(job)
    else:
        profile.saved_jobs.add(job)
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
