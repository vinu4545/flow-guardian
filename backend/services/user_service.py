import bcrypt
from Database.user_model import create_user, get_user_by_email

def register_user(data):
    existing_user = get_user_by_email(data.email)

    if existing_user:
        return {"error": "User already exists"}

    hashed_password = bcrypt.hashpw(
        data.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = create_user(
        data.fullName,
        data.email,
        data.phone,
        hashed_password
    )

    return {"message": "User created", "user": user}