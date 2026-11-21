from flask import Flask, render_template, redirect

app = Flask(__name__)

@app.route("/")
def home():
    return redirect("/login")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/register")
def register():
    return render_template("register.html")


@app.route("/verify-email")
def verify_email():
    return render_template("verify_email.html")


@app.route("/forgot-password")
def forgot_password():
    return render_template("forgot_password.html")


if __name__ == "__main__":
    app.run(debug=True)