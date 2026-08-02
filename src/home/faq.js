document.addEventListener("DOMContentLoaded", () => {

    const faqToggles = document.querySelectorAll(".faq-toggle");

    faqToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const question = toggle.closest(".faq-question");
            const isExpanded = toggle.getAttribute("aria-expanded") === "true";

            // Update accessibility state
            toggle.setAttribute("aria-expanded", !isExpanded);

            // Trigger the CSS grid expansion
            question.classList.toggle("open");
        });
    });
});