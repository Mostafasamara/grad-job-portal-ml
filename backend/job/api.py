from django.db import models
from rest_framework.views import APIView
from accounts.models import EmployeeProfile, EmployerProfile, MyUser
from notifications.models import EmployeeNotification
from .models import Application, Category, Interview, Job
from django.db.models import Q
from .serializers import ApplicationSerializer, CategorySerializer, JobSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions

from notifications.models import Notification

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from accounts.authentication import CsrfExemptSessionAuthentication
from rest_framework import generics, permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from accounts.models import EmployeeProfile
from .models import Job
from .serializers import JobSerializer


''' Funcation Viwes '''
@api_view(['GET'])
def job_list_api(request):
    all_jobs = Job.objects.all()
    data = JobSerializer(all_jobs , many = True).data
    return Response({'data':data})

@api_view(['GET'])
def job_detail_api(request , id):
    job_detail = Job.objects.get(id = id)
    data = JobSerializer(job_detail).data
    return Response({'data':data})


''' Generic Views '''

class JobListAPI(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_queryset(self):
        qs = Job.objects.all()

        # normal filters from query params (job_type, experience, category, …)
        job_type = self.request.query_params.get('job_type')
        if job_type:
            qs = qs.filter(job_type=job_type)

        category_id = self.request.query_params.get('category')
        if category_id:
            qs = qs.filter(category_id=category_id)

        # 👇 NEW: auto-filter by predicted_category (unless user asks to see all)
        user = self.request.user
        include_all = self.request.query_params.get('include_all')

        if (
            user.is_authenticated
            and not user.is_employer
            and include_all is None  # only auto-filter when include_all is NOT given
        ):
            try:
                profile = EmployeeProfile.objects.get(user=user)
                if profile.predicted_category:
                    qs = qs.filter(category=profile.predicted_category)
            except EmployeeProfile.DoesNotExist:
                pass

        return qs


class AddJob(APIView):
    def post(self, request):
        user = self.request.user
        data = self.request.data
        try:
            Job.objects.create(
                owner = user,
                title = data["title"],
                job_type = data["job_type"],
                description = data["description"],
                vacancy = data["vacancy"],
                salary = data["salary"],
                experience = data["experience"],
                category = Category.objects.get(id=data["category"]),
                )
            return Response({'success': "Job added successfully"})
        except Exception as e:
            return Response({'error': e.args})


class GetJobs(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request,format=None):
        try:
            jobs = Job.objects.all()
            jobs = JobSerializer(jobs,many = True)
            return Response({"jobs":jobs.data})
        except Exception as e:
            return Response({'error':"error while get jobs"})


class JobDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    lookup_field = 'id'



''' Job Application APIs '''

class UserApplyJob(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, job_id):
        user = self.request.user
        job = Job.objects.get(id=job_id)
        try:
            if user.is_authenticated:
                if Application.objects.filter(Q(applicant=user) & Q(job=job)).exists():
                    return Response({'error': "You have already applied for this job"})
                else:
                    Application.objects.create(
                        job=job,
                        applicant=user,
                        full_name=f"{user.first_name} {user.last_name}"

                        )

                    employer=EmployerProfile.objects.get(user=job.owner)
                    employee=EmployeeProfile.objects.get(user=user)

                    application=Application.objects.last()

                    Notification.objects.create(
                        to_user=employer,
                        created_by=employee,
                        application=application,
                    )


                    return Response({'success': "application sent successfully"})
            else:
                return Response({'error': "You have to be looged in for an auto apply"})
        except Exception as e:
            return Response({'error': e.args})


class AnonApplyJob(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, job_id):
        data = self.request.data
        user=self.request.user
        job = Job.objects.get(id=job_id)
        try:
            if Application.objects.filter(Q(email=data["email"]) & Q(job=job)).exists():
                return Response({'error': "An aplication for this job with this email already exists"})
            else:
                if user.is_authenticated:
                    Application.objects.create(
                        job=job,
                        full_name=data["full_name"],
                        email=data["email"],
                        website=data["website"],
                        cv=data["cv"],
                        cover_letter=data["cover_letter"],
                        applicant=user,
                        )
                    employer=MyUser.objects.get(id=job.owner.id)
                    application=Application.objects.last()
                    Notification.objects.create(
                        to_user=employer,
                        created_by=user,
                        application=application,
                    )

                    return Response({'success': "application sent successfully"})
                else:
                    Application.objects.create(
                        job=job,
                        full_name=data["full_name"],
                        email=data["email"],
                        website=data["website"],
                        cv=data["cv"],
                        cover_letter=data["cover_letter"])
                    employer=MyUser.objects.get(id=job.owner.id)
                    application=Application.objects.last()
                    Notification.objects.create(
                        to_user=employer,
                        application=application,
                    )
                    return Response({'success': "application sent successfully"})
        except Exception as e:
            return Response({'error': e.args})



class EmployerApplications(generics.ListAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    model = Application
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Application.objects.filter(job__owner_id=user.id).order_by("-created_at")
        return queryset


class EmployerJobs(generics.ListAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    model = Job
    serializer_class = JobSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Job.objects.filter(owner=user)
        return queryset



class ApplicationDetails(generics.RetrieveAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    lookup_field = 'id'


class JobListFilter(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['job_type', 'experience', 'category']



class JobSearch(APIView):
    def get(self,request,format=None):
        queryset = Job.objects.all()
        title = request.GET.get('title', '')
        queryset = Job.objects.filter(title__icontains=title)
        data = JobSerializer(queryset, many = True).data
        return Response({'job':data})


class CategoryListApi(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset  = Category.objects.all()
    serializer_class = CategorySerializer




class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return

class EmployeeApplications(generics.ListAPIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = [permissions.IsAuthenticated]

    model = Application
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        # البحث عن جميع التطبيقات التي قام بها المستخدم الحالي
        queryset = Application.objects.filter(applicant=user).order_by("-created_at")
        return queryset


class SaveJob(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request, job_id):
        profile = EmployeeProfile.objects.get(user=self.request.user)
        job = Job.objects.get(id=job_id)
        try:
            profile.saved_jobs.add(job)
            profile.save()
            return Response({"success": "job saved successfully"})
        except Exception as e:
            return Response({"error": e.args})


class RemoveSavedJob(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request, job_id):
        profile = EmployeeProfile.objects.get(user=self.request.user)
        job = Job.objects.get(id=job_id)
        try:
            profile.saved_jobs.remove(job)
            profile.save()
            return Response({"success": "job removed successfully"})
        except Exception as e:
            return Response({"error": e.args})


class UpdateApplicationStatus(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def patch(self, request, id):
        data = self.request.data

        application = Application.objects.get(id=id)
        serializer = ApplicationSerializer(application, data=data, partial=True)


        if serializer.is_valid():
            serializer.save()
            if data.status == "Rejected":
                if application.applicant:
                    employer = EmployerProfile.objects.get(user=self.request.user)
                    employee = EmployeeProfile.objects.get(user=application.applicant)
                    EmployeeNotification.objects.create(
                        sender=employer,
                        receiver=employee)
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)


class CreateInterview(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, application_id):
        data = self.request.data
        application = Application.objects.get(id=application_id)

        try:
            if Interview.objects.filter(application=application).exists():
                return Response({'error': "An interview for this application has already been set up"})
            else:
                Interview.objects.create(application=application, address=data["address"], time=data["time"])
                employer = EmployerProfile.objects.get(user=application.job.owner)
                employee = EmployeeProfile.objects.get(user=application.applicant)
                interview = Interview.objects.last()

                EmployeeNotification.objects.create(
                    sender=employer,
                    receiver=employee,
                    interview=interview)

                return Response({'success': "Interview is set up successfully"})
        except Exception as e:
            return Response({'error': e.args})


# class GetInterviews(generics.ListAPIView):
#     model = Interview
#     serializer_class = InterviewSerializer
#     queryset = Interview.objects.all()


# class InterviewDetails(generics.RetrieveAPIView):
#     queryset = Interview.objects.all()
#     serializer_class = InterviewSerializer
#     lookup_field = "id"


class GetJobApplications(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, job_id):
        try:
            pending = Application.objects.filter(Q(job__id=job_id) & Q(status="Pending")).count()
            accepted = Application.objects.filter(Q(job__id=job_id) & Q(status="Accepted")).count()
            rejected = Application.objects.filter(Q(job__id=job_id) & Q(status="Rejected")).count()
            return Response({"pending": pending, "accepted": accepted, "rejected": rejected})
        except Exception as e:
            return Response({"error": e.args})
