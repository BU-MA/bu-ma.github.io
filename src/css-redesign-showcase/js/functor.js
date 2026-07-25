document.addEventListener("DOMContentLoaded", () => {
    const titleCard = document.getElementById("titleCard");
    const spacer = document.getElementById("title-spacer");
    const titleExtraInner = document.querySelector(".title-extra-inner");
    const titleExtra = document.querySelector('.title-extra')

    const scrollThreshold = 50;
    let expandedPixelHeight = 0;
    let collapsedPixelHeight = 0;
    let topOffset = 0;

    const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

    /* const measureBaseLayout = () => {
        const wasScrolled = titleCard.classList.contains("scrolled");

        // Disable transitions to prevent visual flickering during measurement
        const originalTransition = titleCard.style.transition;
        titleCard.style.transition = "none";

        if (wasScrolled) {
            titleCard.classList.remove("scrolled");
        }

        if (titleExtra && titleExtraInner) {
            titleExtra.style.setProperty('--true-height', `${titleExtraInner.offsetHeight}px`);
        }

        // Measure true expanded layout dynamically
        expandedPixelHeight = titleCard.offsetHeight;
        const expandedPixelWidth = titleCard.offsetWidth;
        topOffset = parseFloat(window.getComputedStyle(titleCard).top) || 0;

        // Measure true collapsed layout dynamically
        titleCard.classList.add("scrolled");
        collapsedPixelHeight = titleCard.offsetHeight;
        const collapsedPixelWidth = titleCard.offsetWidth;

        // Restore active state
        if (!wasScrolled) {
            titleCard.classList.remove("scrolled");
        }

        // test
        titleCard.style.setProperty('--collapsed-center-y', `${collapsedPixelHeight / 2}px`);
        titleCard.style.setProperty('--expanded-center-x', `${expandedPixelWidth / 2}px`);
        titleCard.style.setProperty('--collapsed-width', `${collapsedPixelWidth}px`);

        // Force a browser reflow before restoring transitions
        void titleCard.offsetHeight;
        titleCard.style.transition = originalTransition;

        console.log(`[MEASURE] expandedPixelHeight measured at: ${expandedPixelHeight}px | topOffset: ${topOffset}px`);
    };

     */
    const measureBaseLayout = () => {
        // Calculate static parameters strictly from your CSS architecture
        // This avoids toggling classes and disabling transitions
        collapsedPixelHeight = 4.5 * getRemInPixels();
        topOffset = 3 * getRemInPixels();

        // Only update the expanded height if the card is physically unscrolled.
        // This ensures the current CSS transition is never interrupted.
        if (!titleCard.classList.contains("scrolled")) {
            expandedPixelHeight = titleCard.offsetHeight;
        }
    };

    const updateSpacerHeight = () => {
        const gap = 2 * getRemInPixels();
        const scrolled = titleCard.classList.contains("scrolled");
        const cardTop = scrolled ? 0 : topOffset;
        const cardHeight = scrolled ? collapsedPixelHeight : expandedPixelHeight;
        spacer.style.height = `${window.scrollY + cardTop + cardHeight + gap}px`;
    };

    // Initial measurement
    measureBaseLayout();
    updateSpacerHeight();

    // Handle layout shifts from MathJax rendering
    if (titleExtraInner) {
        let lastInnerHeight = titleExtraInner.offsetHeight;
        const resizeObserver = new ResizeObserver(() => {
            if (titleExtraInner.offsetHeight !== lastInnerHeight && titleExtraInner.offsetHeight > 0) {
                console.log(`[OBSERVER] Inner height shift detected: ${lastInnerHeight}px -> ${titleExtraInner.offsetHeight}px`);
                lastInnerHeight = titleExtraInner.offsetHeight;
                measureBaseLayout();
                updateSpacerHeight();
            }
        });
        resizeObserver.observe(titleExtraInner);
    }

    // Handle viewport resizing
    window.addEventListener("resize", () => {
        console.log("[EVENT] Window resize triggered.");
        measureBaseLayout();
        updateSpacerHeight();
    });

    // Handle scroll state
    const handleScroll = () => {
        const isScrolled = window.scrollY > scrollThreshold;
        const hasClass = titleCard.classList.contains("scrolled");

        if (isScrolled && !hasClass) {
            console.log("[EVENT] Scroll threshold crossed (DOWN).");
            titleCard.classList.add("scrolled");
            updateSpacerHeight();
        } else if (!isScrolled && hasClass) {
            console.log("[EVENT] Scroll threshold crossed (UP).");
            titleCard.classList.remove("scrolled");
            updateSpacerHeight();

            // Measure the exact DOM geometry slightly after the 0.5s CSS animation concludes
            setTimeout(() => {
                const actualCardHeight = titleCard.getBoundingClientRect().height;
                const actualSpacerHeight = spacer.getBoundingClientRect().height;
                const expectedGap = 2 * getRemInPixels();

                console.log(`[DIAGNOSTIC] --- 550ms Post-Animation Report ---`);
                console.log(`[DIAGNOSTIC] Cached expandedPixelHeight: ${expandedPixelHeight}px`);
                console.log(`[DIAGNOSTIC] Actual Rendered Card Height: ${actualCardHeight}px`);
                console.log(`[DIAGNOSTIC] Current Spacer Height: ${actualSpacerHeight}px`);
                console.log(`[DIAGNOSTIC] Required Spacer Height (Offset + Actual Card + Gap): ${topOffset + actualCardHeight + expectedGap}px`);
                console.log(`[DIAGNOSTIC] Overlap Discrepancy (Negative = Overlapping): ${actualSpacerHeight - (topOffset + actualCardHeight + expectedGap)}px`);
            }, 550);
        }
    };

    window.addEventListener("scroll", handleScroll);
});