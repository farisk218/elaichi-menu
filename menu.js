/**
 * Elaichi Menu - Renders menu from menu.json
 * Note: Serve via HTTP (e.g. npx serve . or python -m http.server) for fetch to work.
 */
(async function () {
    let menu;
    try {
        const res = await fetch('menu.json');
        if (!res.ok) throw new Error(res.statusText);
        menu = await res.json();
    } catch (err) {
        console.error('Failed to load menu.json:', err.message, '- Serve via HTTP (npx serve .)');
        document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;inset:0;background:rgba(0,0,0,0.9);color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;padding:2rem;text-align:center;z-index:9999;"><p style="font-size:1.2rem;">Menu failed to load. Open via a local server:</p><code style="background:#333;padding:0.5rem 1rem;border-radius:8px;">npx serve .</code><p style="font-size:0.9rem;opacity:0.8;">or python -m http.server 8000</p></div>');
        return;
    }

    function renderMenuSection(section, fullwidthMobile = false) {
        const iconStyle = section.iconStyle === 'gold' ? ' style="background: var(--elaichi-gold);"' : '';
        const listClass = section.autoGrid ? 'menu-list auto-grid' : 'menu-list';
        const sectionClass = fullwidthMobile ? 'menu-section fullwidth-mobile' : 'menu-section';
        const dataType = section.type ? ` data-section-type="${section.type}"` : '';
        return `
            <div class="${sectionClass}"${dataType}>
                <div class="section-title">
                    <div class="section-icon"${iconStyle}>${section.icon}</div>
                    ${section.title}
                </div>
                <div class="${listClass}">
                    ${section.items.map(i => `<div class="menu-item"><span class="item-name">${i.name}</span><span class="item-price">${i.price}</span></div>`).join('')}
                </div>
            </div>
        `;
    }

    function renderFeaturedCard(featured) {
        const style = featured.dark ? 'style="background: linear-gradient(135deg, var(--elaichi-dark) 0%, #1a1a1a 100%);"' : '';
        return `
            <div class="featured-card" ${style}>
                <div class="featured-content">
                    <div>
                        <div class="featured-title">${featured.title}</div>
                        <div class="featured-desc">${featured.desc}</div>
                    </div>
                    <div class="featured-price">${featured.price}</div>
                </div>
            </div>
        `;
    }

    function renderHighlightBox(highlight) {
        if (typeof highlight === 'string') {
            return `<div class="highlight-box" style="text-align: center; margin-top: var(--space-lg);"><span style="color: var(--elaichi-gold); font-weight: 600; font-size: var(--text-lg);">${highlight}</span></div>`;
        }
        return `
            <div class="highlight-box">
                <div style="font-weight: 700; color: var(--elaichi-green); font-size: var(--text-base); margin-bottom: var(--space-xs);">${highlight.title}</div>
                <div style="color: #666; font-size: var(--text-sm); margin-bottom: var(--space-xs);">${highlight.desc}</div>
                <div style="font-weight: 700; color: var(--elaichi-dark); font-size: var(--text-lg);">${highlight.price}</div>
            </div>
        `;
    }

    function renderFoodCategory(cat) {
        const dataType = cat.type ? ` data-section-type="${cat.type}"` : '';
        return `
            <div class="food-category"${dataType}>
                <div class="category-header"><div class="category-icon">${cat.icon}</div><div class="category-title">${cat.title}</div></div>
                <div class="items-grid">
                    ${cat.items.map(i => `<div class="food-item"><span class="food-name">${i.name}</span><span class="food-price">${i.price}</span></div>`).join('')}
                </div>
            </div>
        `;
    }

    function renderComboCard(item) {
        const featured = item.featured ? ' featured' : '';
        return `<div class="combo-card${featured}"><div class="combo-name">${item.name}</div><div class="combo-price">${item.price}</div></div>`;
    }

    // Juices
    const juicesEl = document.getElementById('juices-content');
    if (juicesEl) {
        const d = menu.juices;
        juicesEl.innerHTML = `
            <div class="menu-grid">
                ${d.sections.map((s, i) => renderMenuSection(s, i === d.sections.length - 1)).join('')}
            </div>
        `;
    }

    // Shakes
    const shakesEl = document.getElementById('shakes-content');
    if (shakesEl) {
        const d = menu.shakes;
        shakesEl.innerHTML = `
            ${renderFeaturedCard(d.featured)}
            <div class="menu-grid">
                ${d.sections.map(s => renderMenuSection(s)).join('')}
            </div>
            ${renderHighlightBox(d.highlight)}
        `;
    }

    // Hot beverages
    const hotEl = document.getElementById('hot-content');
    if (hotEl) {
        const d = menu.hot;
        const headerStyle = d.dark ? ' style="color: var(--elaichi-green);"' : '';
        const titleStyle = d.dark ? ' style="color: var(--elaichi-gold);"' : '';
        hotEl.innerHTML = `
            <div class="page-header">
                <div class="header-logo"${headerStyle}>elaichi</div>
                <h1 class="page-title">Hot <span${titleStyle}>Beverages</span> & Mojitos</h1>
            </div>
            <div class="menu-grid">
                ${d.sections.map((s, i) => renderMenuSection(s, i === d.sections.length - 1)).join('')}
            </div>
            ${renderHighlightBox(d.highlight)}
        `;
    }

    // Snacks
    const snacksEl = document.getElementById('snacks-content');
    if (snacksEl) {
        const d = menu.snacks;
        snacksEl.innerHTML = d.categories.map(renderFoodCategory).join('');
    }

    // Meals
    const mealsEl = document.getElementById('meals-content');
    if (mealsEl) {
        const d = menu.meals;
        mealsEl.innerHTML = `
            ${renderFeaturedCard(d.featured)}
            <div class="menu-grid">
                ${d.sections.map(s => renderMenuSection(s)).join('')}
            </div>
            <div class="menu-section" data-section-type="${d.comboSection.type || 'sandwiches'}" style="margin-top: var(--space-lg);">
                <div class="section-title"><div class="section-icon">${d.comboSection.icon}</div>${d.comboSection.title}</div>
                <div class="combo-grid">
                    ${d.comboSection.items.map(renderComboCard).join('')}
                </div>
            </div>
        `;
    }

    // Malabar
    const malabarEl = document.getElementById('malabar-content');
    if (malabarEl) {
        const d = menu.malabar;
        malabarEl.innerHTML = `
            <div class="specials-grid">
                ${d.specials.map(s => `
                    <div class="special-card">
                        <div class="special-name">${s.name}</div>
                        <div class="special-desc">${s.desc}</div>
                        <div class="special-price">${s.price}</div>
                    </div>
                `).join('')}
            </div>
            <div style="background: rgba(154, 205, 50, 0.1); padding: var(--space-lg); border-radius: 20px; border: 2px solid var(--elaichi-green); text-align: center; margin-bottom: var(--space-lg);">
                <div style="font-family: 'Playfair Display', serif; font-size: var(--text-xl); color: var(--elaichi-green); margin-bottom: var(--space-sm);">${d.smoothies.title}</div>
                <div style="color: rgba(255,255,255,0.8); margin-bottom: var(--space-sm);">${d.smoothies.items}</div>
                <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--elaichi-gold);">${d.smoothies.price}</div>
            </div>
            <div class="traditional-grid">
                ${d.traditional.map(t => `<div class="trad-item"><div class="trad-name">${t.name}</div><div class="trad-price">${t.price}</div></div>`).join('')}
            </div>
            <div style="margin-top: var(--space-xl); text-align: center; padding: var(--space-md); background: rgba(212, 175, 55, 0.1); border-radius: 15px;">
                <div style="color: var(--elaichi-gold); font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-xs);">${d.snacksNote.title}</div>
                <div style="color: rgba(255,255,255,0.7); font-size: var(--text-sm);">${d.snacksNote.items}</div>
            </div>
        `;
    }
})();
