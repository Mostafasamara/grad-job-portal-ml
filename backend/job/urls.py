from django.urls import include, path
from . import views
from . import api

app_name = 'job'

urlpatterns = [
    # path('', views.job_list , name = 'job_list'),
    # path('add', views.add_job , name = 'add_job'),
    # path('<str:slug>', views.job_detail , name = 'job_detail'),
    # path('<int:id>/save', views.save_job , name = 'save_job'),

    # ##API
    # path('api/jobs', api.job_list_api , name = 'job_list_api'),
    # path('api/jobs/<int:id>', api.job_detail_api , name = 'job_detail_api'),

    ##Job API
    path('api/jobs/', api.JobListAPI.as_view() , name = 'JobsList'),
    path('api/jobs/add/', api.AddJob.as_view() , name = 'AddJob'),
    path('api/jobs/<int:id>/', api.JobDetail.as_view() , name = 'JobDetail'),
    path('api/jobs/filter/', api.JobListFilter.as_view() , name = 'JobsListFilter'),
    path('api/jobs/search/', api.JobSearch.as_view() , name = 'JobsSearch'),

    ##Category API
    path('api/category/', api.CategoryListApi.as_view() , name = 'CategoriesList'),

    ##Job Application API
    #apply for a job
    path('api/jobs/<int:job_id>/apply/', api.UserApplyJob.as_view() , name = 'UserApplyJob'),
    #save a job
    path('api/jobs/<int:job_id>/save/', api.SaveJob.as_view() , name = 'SaveJob'),
    #remove a job
    path('api/jobs/<int:job_id>/remove/', api.RemoveSavedJob.as_view() , name = 'RemoveJob'),
    #apply for a job (not a user)
    path('api/jobs/<int:job_id>/apply/anonymous/', api.AnonApplyJob.as_view() , name = 'AnonApplyJob'),
    #get recruiter jobs
    path('api/jobs/employer_jobs/', api.EmployerJobs.as_view() , name = 'EmployerJobs'),
    # get user applications
    path('api/employee_applications/', api.EmployeeApplications.as_view() , name = 'EmployeeApplications'),
    # get recruiter applications
    path('api/employer_applications/', api.EmployerApplications.as_view() , name = 'EmployerApplications'),
    # get application details
    path('api/application/<int:id>/', api.ApplicationDetails.as_view() , name = 'ApplicationDetails'),
    # update application status
    path('api/application/<int:id>/update/', api.UpdateApplicationStatus.as_view() , name = 'UpdateApplicationStatus'),
    #job applications
    path('api/jobs/<int:job_id>/applications/', api.GetJobApplications.as_view() , name = 'JobApplications'),

    #Interview APIs
    #create interview
    path('api/application/<int:application_id>/setup_interview/', api.CreateInterview.as_view() , name = 'CreateInterview'),
    #list all interviews
    # path('api/interviews/', api.GetInterviews.as_view() , name = 'InterviewList'),



]
