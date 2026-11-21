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


// SHOW MESSAGE
function showMessage(message, type = "success") {
    const box = document.getElementById("message");

    if (box) {
        box.textContent = message;
        box.className = "message " + type;
    }
}


// PASSWORD SHOW / HIDE
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);

    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🙈";
    } else {
        input.type = "password";
        button.textContent = "👁";
    }
}


// CHECK EMAIL CONFIRMATION
async function checkEmailConfirmation() {

    const params = new URLSearchParams(window.location.search);

    if (params.get("verified") === "1") {

        // Wait for Supabase to process the confirmation link
        const { data } = await supabaseClient.auth.getSession();

        if (data.session) {
            await supabaseClient.auth.signOut();
        }

        showMessage(
            "Email verified successfully! You can now log in.",
            "success"
        );

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        return true;
    }

    return false;
}


// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const phone = document.getElementById("phoneNumber").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            showMessage("Enter a valid 10-digit phone number.", "error");
            return;
        }

        showMessage("Creating your account...", "info");

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
            showMessage(error.message, "error");
            return;
        }

        showMessage(
            "Registration successful! Check your email and click Confirm email address.",
            "success"
        );

        registerForm.reset();

    });

}


// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        showMessage("Logging in...", "info");

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,
                password: password

            });

        if (error) {
            showMessage(error.message, "error");
            return;
        }

        if (data.session) {
            window.location.href = MAIN_WEBSITE;
        }

    });

}


// FORGOT PASSWORD
const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {

    forgotForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("forgotEmail").value.trim();

        showMessage("Sending password recovery email...", "info");

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(email, {

                redirectTo: window.location.origin + "/forgot-password"

            });

        if (error) {
            showMessage(error.message, "error");
            return;
        }

        showMessage(
            "Password recovery email sent. Open the link in your email.",
            "success"
        );

    });

}


// UPDATE PASSWORD AFTER RECOVERY LINK
const recoveryForm = document.getElementById("recoveryForm");

if (recoveryForm) {

    recoveryForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const password = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmNewPassword").value;

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        const { data } = await supabaseClient.auth.getSession();

        if (!data.session) {
            showMessage("Please open the password recovery link from your email.", "error");
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

        showMessage("Password updated successfully. Please log in.", "success");

        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);

    });

}


// INITIAL PAGE CHECK
document.addEventListener("DOMContentLoaded", async function() {

    const confirmationHandled = await checkEmailConfirmation();

    if (confirmationHandled) return;

});