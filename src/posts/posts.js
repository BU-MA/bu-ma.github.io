document.addEventListener('DOMContentLoaded', async () => {
    /* ---------- Config ---------- */
    const CATEGORY_META = {
        talks:        { label: 'Talk Notes',        icon: 'icon-talk' },
        putnam:       { label: 'Putnam POTW',       icon: 'icon-putnam' },
        theorem:      { label: 'Theorem of the Week', icon: 'icon-theorem' },
        newsletter:   { label: 'Newsletter',        icon: 'icon-newsletter' },
        competitions: { label: 'Competitions',      icon: 'icon-competition' },
    };

    /* ---------- Template cache ---------- */
    const templateCache = new Map();

    const esc = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));


    /*
 * `new Date("2025-10-10")` parses as UTC midnight. Formatting it back out
 * with toLocaleDateString in a US Eastern browser then displays Oct 9,
 * since Eastern is behind UTC,. Parsing the y/m/d components directly
 * into a local Date sidesteps the UTC round-trip entirely.
 */
    const parseLocalDate = (str) => {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d);
    };


    const svgTextWrap = (text, maxChars) => {
        const words = text.split(/\s+/).filter(Boolean);
        const lines = [];
        let current = '';
        for (const w of words) {
            const test = current ? `${current} ${w}` : w;
            if (test.length > maxChars && current) {
                lines.push(current);
                current = w;
            } else {
                current = test;
            }
        }
        if (current) lines.push(current);
        return lines.length ? lines : [text];
    };

    const fillTemplate = (template, data) => {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
            data[key] !== undefined ? data[key] : match
        );
    };

    /* ---------- Cover builder ---------- */
    const buildCover = async (post) => {
        // if a custom image is specified, use it
        let templatePath = ""
        let templateUsed = false
        if (post.cover) {
            const extension = post.cover.split('.').pop()
            if (!extension) {
                return `<img src="${esc(post.cover)}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;">`;
            } else if (extension.includes('jpg')) {
                return `<img src="${esc(post.cover)}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;">`;
            } else if (extension.includes('png')) {
                return `<img src="${esc(post.cover)}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;">`;
            } else if (extension.includes('jpeg')) {
                return `<img src="${esc(post.cover)}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;">`;
            } else if (extension.includes('svg')) {
                return `<img src="${esc(post.cover)}" alt="" style="display:block;width:100%;height:100%;object-fit:cover;">`;
            } else if (extension.includes('html')) {
                templatePath = post.cover
            }
        } else {
            templatePath = `/src/assets/covers/${post.category}-default-cover.html`;
            templateUsed = true;
        }


        // Fetch template (cached per category)
        let template = ""
        if (templateUsed) {
            template = templateCache.get(templatePath);
            if (!template) {
                try {
                    const res = await fetch(templatePath);
                    if (!res.ok) throw new Error('missing');
                    template = await res.text();
                } catch (e) {
                    // fallback to posts template if category file doesn't exist yet
                    const fallbackRes = await fetch('/src/assets/covers/talks-default-cover.html');
                    console.log("Falling back to posts template")
                    template = await fallbackRes.text();
                }
                templateCache.set(templatePath, template);
            }
        } else {
            try {
                const res = await fetch(templatePath);
                if (!res.ok) throw new Error('missing');
                template = await res.text();
            } catch (e) {
                // fallback to posts template
                const fallbackRes = await fetch('/src/assets/covers/talks-default-cover.html');
                console.log("Falling back to posts template")
                template = await fallbackRes.text();
            }
        }

        // compute text layout
        const lines = svgTextWrap(post.title, 16);
        const tspans = lines.map((l, i) =>
            `<tspan x="30" dy="${i === 0 ? 0 : 28}">${esc(l)}</tspan>`
        ).join('');
        const centeredTspans = lines.map((l, i) =>
            `<tspan x="150" dy="${i === 0 ? 0 : 28}">${esc(l)}</tspan>`
        ).join('');
        const authorY = 308 + lines.length * 28 + 18;

        // inject data
        return fillTemplate(template, {
            title_tspans: tspans,
            title_tspans_centered: centeredTspans,
            author_y: authorY,
            author: esc(post.author)
        });
    };

    /* ---------- Fetch data ---------- */
    const res = await fetch('/src/posts/posts.json');
    const { posts: rawPosts } = await res.json();

    /* ---------- Drop anything dated in the future, sort newest first ---------- */
    const today = new Date();
    const posts = rawPosts
        .filter(p => parseLocalDate(p.date) <= today)
        .sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date));


    /* ---------- Pick featured ---------- */
    const featuredIdx = posts.findIndex(p => p.featured);
    const featured = featuredIdx >= 0 ? posts.splice(featuredIdx, 1)[0] : posts.shift();

    /* ---------- Helpers ---------- */
    const fmtDate = (str) => {
        const d = parseLocalDate(str);
        return {
            month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
            day:   String(d.getDate()).padStart(2, '0'),
            year:  String(d.getFullYear()),
        };
    };

    const fmtDateFeatured = (str) => {
        const d = parseLocalDate(str);
        return {
            month: d.toLocaleString('en-US', { month: 'short' }),
            day:   String(d.getDate()).padStart(2, '0'),
            year:  String(d.getFullYear()),
        };
    };

    const renderTitle = (title, accent) => {
        if (!accent) return esc(title);
        const idx = title.indexOf(accent);
        if (idx === -1) return esc(title);
        return esc(title.slice(0, idx)) + `<span>${esc(accent)}</span>` + esc(title.slice(idx + accent.length));
    };

    const buttonText = (cat) => {
        if (cat === "talks") {
            return `Read the notes <span class=\"arrow\">&rarr;</span>`
        } else if (cat === "putnam") {
            return `Read the notes <span class=\"arrow\">&rarr;</span>`
        } else if (cat === "theorem") {
            return `Read the notes <span class=\"arrow\">&rarr;</span>`
        } else if (cat === "newsletter") {
            return `Check out the news <span class=\"arrow\">&rarr;</span>`
        } else if (cat === "competitions") {
            return `Read the notes <span class=\"arrow\">&rarr;</span>`
        } else {
            return `Read the notes <span class=\"arrow\">&rarr;</span>`
        }
    }

    /* ---------- Render featured ---------- */
    const renderFeatured = async (p) => {
        const d = fmtDateFeatured(p.date);
        const meta = CATEGORY_META[p.category];
        const coverSvg = await buildCover(p);

        return `
        <article class="post-featured reveal" data-category="${p.category}">
            <div class="post-featured-cover" aria-hidden="true">
                ${coverSvg}
            </div>
            <div class="post-featured-badge" aria-hidden="true">
                <span class="icon ${meta.icon}"></span>
            </div>
            <div class="post-featured-main">
                <div class="post-featured-eyebrow">${esc(meta.label)}</div>
                <h2>${renderTitle(p.title, p.accent)}</h2>
                <p class="post-featured-byline">${esc(p.author)} &middot; ${esc(d.month)} ${d.day}, ${d.year}</p>
                <p class="post-featured-excerpt">${esc(p.excerpt)}</p>
                <a class="post-featured-cta" href="${esc(p.url)}">
                    ${buttonText(p.category)}
                </a>
            </div>
        </article>`;
    };

    /* ---------- Render list row ---------- */
    const renderRow = (p) => {
        const d = fmtDate(p.date);
        const meta = CATEGORY_META[p.category];
        return `
        <a class="post-row reveal" data-category="${p.category}" href="${esc(p.url)}">
            <div class="post-row-date">
                <span class="row-month">${d.month}</span>
                <span class="row-day">${d.day}</span>
                <span class="row-year">${d.year}</span>
            </div>
            <div class="post-row-badge" aria-hidden="true">
                <span class="icon ${meta.icon}"></span>
            </div>
            <div class="post-row-main">
                <div class="post-row-type">${esc(meta.label)}</div>
                <h3>${esc(p.title)}</h3>
                <p class="post-row-excerpt">${esc(p.excerpt)}</p>
            </div>
            <span class="post-row-action">Read <span class="arrow">&rarr;</span></span>
        </a>`;
    };

    /* ---------- Inject into DOM ---------- */
    const main = document.querySelector('main');
    const listContainer = document.createElement('div');
    listContainer.className = 'posts-list';
    listContainer.innerHTML = posts.map(renderRow).join('');

    const filterBar = document.querySelector('.post-filters');
    filterBar.insertAdjacentHTML('beforebegin', await renderFeatured(featured));
    filterBar.insertAdjacentElement('afterend', listContainer);

    /* ---------- Filters ---------- */
    const filters = document.querySelectorAll('.filter-button');
    const rows    = document.querySelectorAll('.post-row');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.filter;
            rows.forEach(row => {
                row.hidden = !(cat === 'all' || row.dataset.category === cat);
            });
        });
    });

    /* ---------- Reveal on scroll ---------- */
    const revealTargets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach(el => el.classList.add('revealed'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
});