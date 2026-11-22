from flask import Flask, render_template

app = Flask(__name__)


# PUBLIC HOMEPAGE
@app.route("/")
def home():
    return render_template("index.html")


# LOGIN
@app.route("/login")
def login():
    return render_template("login.html")


# REGISTER
@app.route("/register")
def register():
    return render_template("register.html")


# EMAIL VERIFICATION
@app.route("/verify-email")
def verify_email():
    return render_template("verify_email.html")


# FORGOT PASSWORD
@app.route("/forgot-password")
def forgot_password():
    return render_template("forgot_password.html")

#RESET PASSWORD
@app.route("/reset-password")
def reset_password():
    return render_template("reset_password.html")


if __name__ == "__main__":
    app.run(debug=True)
