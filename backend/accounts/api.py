from django.contrib import auth
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from accounts.models import MyUser , EmployerProfile ,EmployeeProfile
from .serializers import EmployerProfileSerializer, MyUserSerializer,EmployeeProfileSerializer
from django.utils.decorators import method_decorator
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .authentication import CsrfExemptSessionAuthentication
from django.middleware.csrf import get_token
import joblib
import os
import logging
from job.models import Category
import PyPDF2
# باقي الكود كما هو، لكن استخدم CsrfExemptSessionAuthentication من الـ import الجديد
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

class MyUserAPi(generics.CreateAPIView):
    model = MyUser
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer

class EmployerProfileAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmployerProfile.objects.all()
    serializer_class = EmployerProfileSerializer
    lookup_field = "id"

class EmployeeProfileAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    lookup_field = "id"

class CkeckAuthenticatedView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request,format=None):
        user = self.request.user
        try:
            isAuthenticated = user.is_authenticated

            # إضافة معلومات debug
            response_data = {
                'isAuthenticated': 'success' if isAuthenticated else 'error',
                'user_type': str(type(user)),
                'user_id': user.id if isAuthenticated else None,
                'session_key': request.session.session_key,
                'has_session': bool(request.session.session_key)
            }

            if isAuthenticated:
                response_data.update({
                    'email': user.email,
                    'is_employer': user.is_employer
                })

            return Response(response_data)
        except Exception as e:
            return Response({'error': f'Something went wrong: {str(e)}'})

# إزالة csrf_protect decorator
class UserSignupView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def post(self, request,format=None):
        data = self.request.data
        try:
            first_name = data['first_name']
            last_name = data['last_name']
            email = data['email']
            password = data['password']
            re_password = data['re_password']
            is_employer = data['is_employer']

            if password == re_password:
                if MyUser.objects.filter(email=email).exists():
                    return Response({'error': 'User already exists'})
                else:
                    if len(password) < 6:
                        return Response({'error': 'Password must be at least 6 characters'})
                    else:
                        user = MyUser.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name, is_employer=is_employer)
                        user.save()
                        return Response({'success': 'User created successfully'})
            else:
                return Response({'error': 'Passwords do not match'})
        except:
            return Response({'error': 'Something went wrong when registering account'})

# إزالة csrf_protect decorator
class LoginView(APIView):
    permission_classes = {permissions.AllowAny,}
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def post(self,request,format=None):
        data = self.request.data

        try:
            user = auth.authenticate(username=data['email'], password=data['password'])

            if user is not None:
                # إجبار إنشاء session
                if not request.session.session_key:
                    request.session.create()

                auth.login(request, user)

                # حفظ session بشكل صريح
                request.session.save()

                return Response({
                    'success': 'User authenticated',
                    'email': data['email'],
                    'is_employer': user.is_employer,
                    'user_id': user.id,
                    'session_key': request.session.session_key
                })
            else:
                return Response({'error':'Error Authenticating'})
        except Exception as e:
            return Response({'error': f'Something went wrong when login: {str(e)}'})

class LogoutView(APIView):
    def post(self,request,format=None):
        try:
            auth.logout(request)
            return Response({'success': 'Loggout Out'})
        except:
            return Response({'error': 'Something went wrong when logging out'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = {permissions.AllowAny,}

    def get(self, request, format=None):
        # إجبار إنشاء session إذا لم يكن موجود
        if not request.session.session_key:
            request.session.create()

        # الحصول على CSRF token
        csrf_token = get_token(request)

        return Response({
            'success': 'CSRF cookie set',
            'csrfToken': csrf_token,
            'session_key': request.session.session_key
        })

class DeleteUserView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    def delete(self, request, format=None):
        try:
            user = self.request.user
            MyUser.objects.filter(id=user.id).delete()
            return Response({'success': "user deleted successfully"})
        except:
            return Response({'error': 'something went wrong while deleteing' })


class GetProfile(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request, format=None):
        user = self.request.user

        # إذا لم يكن المستخدم مسجل دخول، أرجع رسالة واضحة
        if not user.is_authenticated:
            return Response({'error': 'User not authenticated', 'isAuthenticated': False}, status=200)

        try:
            if user.is_employer:
                try:
                    profile = EmployerProfile.objects.get(user=user)
                    profile = EmployerProfileSerializer(profile)
                except EmployerProfile.DoesNotExist:
                    # إنشاء profile إذا لم يكن موجود
                    profile = EmployerProfile.objects.create(user=user, phone_number='', image='default-profile-image.jpg')
                    profile = EmployerProfileSerializer(profile)
            else:
                try:
                    profile = EmployeeProfile.objects.get(user=user)
                    profile = EmployeeProfileSerializer(profile)
                except EmployeeProfile.DoesNotExist:
                    # إنشاء profile إذا لم يكن موجود
                    profile = EmployeeProfile.objects.create(user=user, phone_number='', image='default-profile-image.jpg', cv='')
                    profile = EmployeeProfileSerializer(profile)

            user_data = MyUserSerializer(user)

            return Response({"user": user_data.data, "profile": profile.data, "isAuthenticated": True})
        except Exception as e:
            return Response({'error': f"Something went wrong: {str(e)}"}, status=500)


class VisitProfile(APIView):
    def get(self, request, user_id):
        user = MyUser.objects.get(id=user_id)

        try:
            if user.is_employer:
                profile = EmployerProfile.objects.get(user=user)
                profile = EmployerProfileSerializer(profile)
            else:
                profile = EmployeeProfile.objects.get(user=user)
                profile = EmployeeProfileSerializer(profile)

            user = MyUserSerializer(user)

            return Response({"user": user.data, "profile": profile.data})
        except:
            return Response({'error': "something went wrong while retrieveing profile data"})

def run_model_on_cv(file_path):
    try:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        MODEL_PATH = os.path.join(BASE_DIR, 'ml_models', 'model.joblib')
        VECTORIZER_PATH = os.path.join(BASE_DIR, 'ml_models', 'vectorizer.joblib')
        LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'ml_models', 'label_encoder.joblib')

        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)

        # ✅ Read PDF in binary mode and extract text
        resume_text = ""
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                resume_text += page.extract_text() or ""

        if not resume_text.strip():
            raise ValueError("No extractable text in PDF")

        resume_vector = vectorizer.transform([resume_text])
        pred_encoded = model.predict(resume_vector)[0]

        if os.path.exists(LABEL_ENCODER_PATH):
            le = joblib.load(LABEL_ENCODER_PATH)
            return le.inverse_transform([pred_encoded])[0]
        else:
            return str(pred_encoded)

    except Exception as e:
        logger.exception("🔥 ML prediction failed for CV:")
        return None


class UpdateProfileView(APIView):
    parser_classes = (JSONParser, FormParser, MultiPartParser)

    def put(self, request, format=None):
        user = self.request.user

        if user.is_employer:
            profile = EmployerProfile.objects.get(user=user)
            profile_serializer = EmployerProfileSerializer(profile, data=request.data, partial=True)
        else:
            profile = EmployeeProfile.objects.get(user=user)
            profile_serializer = EmployeeProfileSerializer(profile, data=request.data, partial=True)

        user_serializer = MyUserSerializer(user, data=request.data, partial=True)

        is_user_valid = user_serializer.is_valid()
        is_profile_valid = profile_serializer.is_valid()

        if is_user_valid and is_profile_valid:
            user_serializer.save()
            profile_serializer.save()

        if 'cv' in request.FILES and not user.is_employer:
            try:
                predicted_name = run_model_on_cv(profile.cv.path)
                if predicted_name:  # Only save if prediction is valid
                    category_obj, _ = Category.objects.get_or_create(name=predicted_name)
                    profile.predicted_category = category_obj
                    profile.save(update_fields=['predicted_category'])
                    profile_serializer = EmployeeProfileSerializer(profile)
            except Exception as e:
                logger.exception(f"Prediction failed: {e}")

            return Response({"user": user_serializer.data, "profile": profile_serializer.data}, status=200)

        # ✅ Only call .errors now that .is_valid() was run
        return Response({
            "user_errors": user_serializer.errors,
            "profile_errors": profile_serializer.errors
        }, status=400)
