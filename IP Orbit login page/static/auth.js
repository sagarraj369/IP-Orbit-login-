// ==========================================
// IP ORBIT - SUPABASE AUTHENTICATION
// ==========================================

const SUPABASE_URL = "https://ucygsrjjtivnnxrzudji.supabase.co";

const SUPABASE_KEY = "sb_publishable_VtXMtMSqcNTrA8B42cF_bQ_SaKJM-hN";

const MAIN_WEBSITE = "https://ip-orbit.vercel.app/";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);


// ==========================================
// MESSAGE FUNCTION
// ==========================================

function showMessage(message, type = "success") {

    const box = document.getElementById("message");

    if (box) {
        box.textContent = message;
        box.className = "message " + type;
    } else {
        alert(message);
    }
}


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "🙈";
        button.setAttribute("aria-label", "Hide password");

    } else {

        input.type = "password";
        button.textContent = "👁";
        button.setAttribute("aria-label", "Show password");

    }
}


// ==========================================
// REGISTER
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();

        const email = document.getElementById("registerEmail").value.trim();

        const phone = document.getElementById("phoneNumber").value.trim();

        const password = document.getElementById("registerPassword").value;

        const confirmPassword = document.getElementById("confirmPassword").value;


        // VALIDATION

        if (!name || !email || !phone || !password || !confirmPassword) {

            showMessage("Please fill in all fields.", "error");
            return;

        }

        if (!/^[0-9]{10}$/.test(phone)) {

            showMessage("Enter a valid 10-digit phone number.", "error");
            return;

        }

        if (password.length < 6) {

            showMessage("Password must contain at least 6 characters.", "error");
            return;

        }

        if (password !== confirmPassword) {

            showMessage("Passwords do not match.", "error");
            return;

        }


        const submitButton = registerForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Creating Account...";
        }

        showMessage("Creating your account. Please wait...", "info");


        try {

            const { data, error } = await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    emailRedirectTo: window.location.origin + "/login?verified=1",

                    data: {
                        full_name: name,
                        phone_number: phone
                    }

                }

            });


            if (error) {

                console.error("Signup error:", error);

                showMessage("Registration failed: " + error.message, "error");

                return;

            }


            console.log("Signup response:", data);


            if (data.session) {

                showMessage(
                    "Account created successfully! Redirecting...",
                    "success"
                );

                setTimeout(() => {
                    window.location.href = MAIN_WEBSITE;
                }, 1500);

            } else {

                showMessage(
                    "Registration successful! Check your inbox and spam folder. Click the Supabase confirmation link to verify your email.",
                    "success"
                );

            }

        } catch (error) {

            console.error("Unexpected signup error:", error);

            showMessage("Something went wrong: " + error.message, "error");

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Create Account";
            }

        }

    });

}


// ==========================================
// EMAIL CONFIRMATION
// ==========================================

async function checkEmailConfirmation() {

    const params = new URLSearchParams(window.location.search);

    const authError = params.get("error_description");

    if (authError) {

        showMessage(
            "Email verification failed: " + authError,
            "error"
        );

        return;

    }


    if (params.get("verified") === "1") {

        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {

            showMessage(error.message, "error");
            return;

        }

        if (data.session) {

            await supabaseClient.auth.signOut();

        }

        showMessage(
            "✓ EMAIL VERIFIED SUCCESSFULLY! YOU CAN NOW LOG IN.",
            "success"
        );

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

    }

}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();

        const password = document.getElementById("loginPassword").value;


        showMessage("Logging in...", "info");


        const submitButton = loginForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
        }


        try {

            const { data, error } = await supabaseClient.auth.signInWithPassword({

                email: email,
                password: password

            });


            if (error) {

                showMessage(error.message, "error");
                return;

            }


            if (data.session) {

                showMessage("Login successful! Redirecting...", "success");

                setTimeout(() => {

                    window.location.href = MAIN_WEBSITE;

                }, 1000);

            }

        } catch (error) {

            console.error("Login error:", error);

            showMessage(error.message, "error");

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
            }

        }

    });

}


// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {

    forgotForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("forgotEmail").value.trim();

        showMessage("Sending recovery email...", "info");


        try {

            const { error } = await supabaseClient.auth.resetPasswordForEmail(

                email,

                {
                    redirectTo: window.location.origin + "/forgot-password"
                }

            );


            if (error) {

                showMessage(error.message, "error");
                return;

            }


            showMessage(
                "Password recovery email sent! Check your inbox and spam folder.",
                "success"
            );

        } catch (error) {

            console.error("Recovery email error:", error);

            showMessage(error.message, "error");

        }

    });

}


// ==========================================
// RESET PASSWORD
// ==========================================

const recoveryForm = document.getElementById("recoveryForm");

if (recoveryForm) {

    recoveryForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const password = document.getElementById("newPassword").value;

        const confirmPassword = document.getElementById("confirmNewPassword").value;


        if (password.length < 6) {

            showMessage("Password must contain at least 6 characters.", "error");
            return;

        }

        if (password !== confirmPassword) {

            showMessage("Passwords do not match.", "error");
            return;

        }


        showMessage("Updating password...", "info");


        try {

            const { data: sessionData, error: sessionError } =
                await supabaseClient.auth.getSession();


            if (sessionError || !sessionData.session) {

                showMessage(
                    "Open the password recovery link from your email first.",
                    "error"
                );

                return;

            }


            const { error } = await supabaseClient.auth.updateUser({

                password: password

            });


            if (error) {

                showMessage(error.message, "error");
                return;

            }


            await supabaseClient.auth.signOut();


            showMessage(
                "Password updated successfully! Please log in.",
                "success"
            );


            setTimeout(() => {

                window.location.href = "/login";

            }, 2000);


        } catch (error) {

            console.error("Password update error:", error);

            showMessage(error.message, "error");

        }

    });

}


// ==========================================
// INITIAL PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", async function() {

    await checkEmailConfirmation();

});
window.addEventListener("load", function () {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.classList.add("hide");

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }
});
