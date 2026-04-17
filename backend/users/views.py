from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User Created Successfully. Now perform Login to get your token",
        })

class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ResetPasswordAPI(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        new_password = request.data.get('new_password')
        if username and new_password:
            try:
                user = User.objects.get(username=username)
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successfully."})
            except User.DoesNotExist:
                return Response({"error": "User does not exist."}, status=400)
        return Response({"error": "Username and new_password are required."}, status=400)
