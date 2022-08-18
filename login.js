window.addEventListener("load", () => {
    document.getElementById("closelogin").onclick = () => {
        document.getElementById("login").style.display = "none";
        [...document.getElementsByClassName("signuponly")].forEach(
            (element) => (element.style.display = "none")
        );
        [...document.getElementsByClassName("invalid")].forEach((element) =>
            element.classList.remove("invalid")
        );
        document.getElementById("loginError").innerText = "";
        document.getElementById("loginError").style.display = "none";
    };

    document.getElementById("openlogin").onclick = () => {
        document.getElementById("login").style.display = "flex";
        document.getElementById("logintitle").innerText =
            "Log in to Silly Geese Poker";
    };

    document.getElementById("opensignup").onclick = () => {
        document.getElementById("login").style.display = "flex";
        document.getElementById("logintitle").innerText =
            "Sign Up for Silly Geese Poker";
        [...document.getElementsByClassName("signuponly")].forEach(
            (element) => (element.style.display = "inline")
        );
    };

    document.getElementById("loginBtn").onclick = () => {
        [...document.getElementsByClassName("invalid")].forEach((element) =>
            element.classList.remove("invalid")
        );

        if (
            document.getElementById("logintitle").innerText ===
                "Sign Up for Silly Geese Poker" &&
            document.getElementById("username").value.length === 0
        ) {
            document.getElementById("username").classList.add("invalid");
            document.getElementById("loginError").style.display = "inline";
            document.getElementById("loginError").innerText =
                "You must enter a name!";
            return;
        }

        if (
            !document
                .getElementById("email")
                .value.match(
                    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
                )
        ) {
            document.getElementById("email").classList.add("invalid");
            document.getElementById("loginError").style.display = "inline";
            document.getElementById("loginError").innerText =
                "You must enter a valid email!";
            return;
        }

        if (document.getElementById("password").value.length === 0) {
            document.getElementById("password").classList.add("invalid");
            document.getElementById("loginError").style.display = "inline";
            document.getElementById("loginError").innerText =
                "You must enter a password!";
            return;
        }

        if (
            document.getElementById("logintitle").innerText ===
            "Sign Up for Silly Geese Poker"
        ) {
            if (document.getElementById("username").value.length === 0) {
                document.getElementById("username").classList.add("invalid");
                document.getElementById("loginError").style.display = "inline";
                document.getElementById("loginError").innerText =
                    "You must enter a name!";
                return;
            }

            if (
                document.getElementById("confirmpassword").value !==
                document.getElementById("password").value
            ) {
                document.getElementById("loginError").style.display = "inline";
                document.getElementById("loginError").innerText =
                    "Passwords do not match!";
                return;
            }
        }

        window.location.href =
            "https://blacksluts.me/pictures/7/972_black-muscle.jpg";
    };
});
