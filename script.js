(function () {
    const storageKey = "portfolio-theme";
    const toggle = document.querySelector(".theme-toggle");
    const savedTheme = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    const statusMessage = document.querySelector(".form-status");
    const contactForm = document.getElementById("contact-form");

    function setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(storageKey, theme);

        if (toggle) {
            const isDark = theme === "dark";
            toggle.textContent = isDark ? "Light mode" : "Dark mode";
            toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            toggle.setAttribute("aria-pressed", String(isDark));
        }
    }

    function showStatus(message, isSuccess) {
        if (!statusMessage) return;

        statusMessage.textContent = message;
        statusMessage.style.color = isSuccess ? "#2e7d32" : "#b91c1c";
        statusMessage.style.display = "block";
    }

    function parseLeadingJson(text) {
        const body = text.trimStart();
        if (body[0] !== "{" && body[0] !== "[") {
            throw new Error("No JSON response found");
        }

        let depth = 0;
        let inString = false;
        let escaped = false;

        for (let index = 0; index < body.length; index += 1) {
            const character = body[index];

            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (character === "\\") {
                    escaped = true;
                } else if (character === '"') {
                    inString = false;
                }
            } else if (character === '"') {
                inString = true;
            } else if (character === "{" || character === "[") {
                depth += 1;
            } else if (character === "}" || character === "]") {
                depth -= 1;
                if (depth === 0) {
                    return JSON.parse(body.slice(0, index + 1));
                }
            }
        }

        throw new Error("Incomplete JSON response");
    }

    function handleFormSubmit(event) {
        if (!contactForm) return;

        event.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        fetch("https://formsubmit.co/ajax/srinithi.webdev@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async (response) => {
                let result;
                try {
                    result = parseLeadingJson(await response.text());
                } catch {
                    throw new Error("The email service returned an unreadable response. Your submission could not be confirmed.");
                }

                if (!response.ok || !(result.success === true || result.success === "true")) {
                    throw new Error(result.message || "The form service could not confirm the submission.");
                }
                window.location.href = "thanks.html";
            })
            .catch((error) => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Send Message";
                }

                showStatus(error.message || "The form could not be submitted. Please try again.", false);
            });
    }

    setTheme(initialTheme);

    if (toggle) {
        toggle.addEventListener("click", function () {
            const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            setTheme(nextTheme);
        });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", handleFormSubmit);
    }
})();