document.addEventListener("DOMContentLoaded", () => {
    const titleCard = document.getElementById("titleCard");
    const spacer = document.getElementById("title-spacer");
    const titleExtraInner = document.querySelector(".title-extra-inner");
    const body = document.body

    const scrollThreshold = 50;
    let expandedPixelHeight = 0;
    let collapsedPixelHeight = 0;
    let topOffset = 0;

    const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

    const measureBaseLayout = () => {
        const wasScrolled = titleCard.classList.contains("scrolled");

        // Disable transitions to prevent visual flickering during measurement
        const originalTransition = titleCard.style.transition;
        titleCard.style.transition = "none";

        if (wasScrolled) {
            titleCard.classList.remove("scrolled");
            body.classList.remove("scrolled");
        }

        // Measure true expanded layout dynamically
        expandedPixelHeight = titleCard.offsetHeight;
        topOffset = parseFloat(window.getComputedStyle(titleCard).top) || 0;

        // Measure true collapsed layout dynamically
        titleCard.classList.add("scrolled");
        body.classList.add("scrolled");
        collapsedPixelHeight = titleCard.offsetHeight;

        // Restore active state
        if (!wasScrolled) {
            titleCard.classList.remove("scrolled");
            body.classList.remove("scrolled");
        }

        // Force a browser reflow before restoring transitions
        void titleCard.offsetHeight;
        titleCard.style.transition = originalTransition;
    };


    const updateSpacerHeight = () => {
        const gap = 2 * getRemInPixels();

        if (!titleCard.classList.contains("scrolled")) {
            // Adding scrollThreshold pre-compensates for the 50px the content
            // will slide underneath the fixed header before the JS triggers.
            spacer.style.height = `${topOffset + expandedPixelHeight + gap + scrollThreshold}px`;
        } else {
            spacer.style.height = `${collapsedPixelHeight + gap + scrollThreshold}px`;
        }
    };

    // Initial measurement
    measureBaseLayout();
    updateSpacerHeight();

    // Handle layout shifts from MathJax rendering
    if (titleExtraInner) {
        let lastInnerHeight = titleExtraInner.offsetHeight;
        const resizeObserver = new ResizeObserver(() => {
            if (titleExtraInner.offsetHeight !== lastInnerHeight && titleExtraInner.offsetHeight > 0) {
                lastInnerHeight = titleExtraInner.offsetHeight;
                measureBaseLayout();
                updateSpacerHeight();
            }
        });
        resizeObserver.observe(titleExtraInner);
    }

    // Handle viewport resizing
    window.addEventListener("resize", () => {
        measureBaseLayout();
        updateSpacerHeight();
    });

    // Handle scroll state
    const handleScroll = () => {
        const isScrolled = window.scrollY > scrollThreshold;
        const hasClass = titleCard.classList.contains("scrolled");

        if (isScrolled && !hasClass) {
            titleCard.classList.add("scrolled");
            body.classList.add("scrolled");
            updateSpacerHeight();
        } else if (!isScrolled && hasClass) {
            titleCard.classList.remove("scrolled");
            body.classList.remove("scrolled");
            updateSpacerHeight();
        }
    };

    window.addEventListener("scroll", handleScroll);
});