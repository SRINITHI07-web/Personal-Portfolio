(function () {
    const storageKey = "portfolio-theme";
    const toggle = document.querySelector(".theme-toggle");
    const savedTheme = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

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

    setTheme(initialTheme);

    if (toggle) {
        toggle.addEventListener("click", function () {
            const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            setTheme(nextTheme);
        });
    }
})();