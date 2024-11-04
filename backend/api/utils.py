from rest_framework_simplejwt.tokens import RefreshToken

def userToken(user):
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token

    # access_token['email'] = user.email
    # access_token['full_name'] = user.full_name
    # access_token['phone_number'] = user.phone_number
    # access_token['address'] = user.address
    access_token['role'] = user.role
    
    return {
        'refresh': str(refresh),
        'access': str(access_token),
    }
