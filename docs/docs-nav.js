(function () {
    // 1. 五语目录配置（链接统一使用 /docs/ 路径，适配 download/index.html 与 docs/ 各页面）
    const NAV_CONFIG = {
        zh: {
            ariaLabel: "页面目录导航",
            sectionTitle: "文档目录",
            items: [
                { file: "/docs/about.html", label: "关于 AIR²Aim" },
                { file: "/docs/UserGuide.html", label: "使用指南" },
                { file: "/docs/Permissions.html", label: "权限设置" },
                { file: "/docs/ServiceTerms.html", label: "服务条款" },
                { file: "/docs/Privacy.html", label: "隐私政策" },
                { file: "/docs/UsageStatus.html", label: "使用状态与额度" },
                { file: "/docs/Feedback.html", label: "意见反馈" }
            ]
        },
        en: {
            ariaLabel: "Page directory navigation",
            sectionTitle: "Documentation",
            items: [
                { file: "/docs/about.html", label: "About AIR²Aim" },
                { file: "/docs/UserGuide.html", label: "User Guide" },
                { file: "/docs/Permissions.html", label: "Permissions" },
                { file: "/docs/ServiceTerms.html", label: "Service Terms" },
                { file: "/docs/Privacy.html", label: "Privacy Policy" },
                { file: "/docs/UsageStatus.html", label: "Usage Status" },
                { file: "/docs/Feedback.html", label: "Feedback" }
            ]
        },
        ru: {
            ariaLabel: "Навигация по разделам",
            sectionTitle: "Документация",
            items: [
                { file: "/docs/about.html", label: "О приложении AIR²Aim" },
                { file: "/docs/UserGuide.html", label: "Руководство пользователя" },
                { file: "/docs/Permissions.html", label: "Разрешения" },
                { file: "/docs/ServiceTerms.html", label: "Условия использования" },
                { file: "/docs/Privacy.html", label: "Политика конфиденциальности" },
                { file: "/docs/UsageStatus.html", label: "Статус использования" },
                { file: "/docs/Feedback.html", label: "Обратная связь" }
            ]
        },
        fr: {
            ariaLabel: "Navigation des pages",
            sectionTitle: "Documentation",
            items: [
                { file: "/docs/about.html", label: "À propos d’AIR²Aim" },
                { file: "/docs/UserGuide.html", label: "Guide d’utilisation" },
                { file: "/docs/Permissions.html", label: "Autorisations" },
                { file: "/docs/ServiceTerms.html", label: "Conditions d’utilisation" },
                { file: "/docs/Privacy.html", label: "Politique de confidentialité" },
                { file: "/docs/UsageStatus.html", label: "Statut d’utilisation" },
                { file: "/docs/Feedback.html", label: "Commentaires" }
            ]
        },
        es: {
            ariaLabel: "Navegación de páginas",
            sectionTitle: "Documentación",
            items: [
                { file: "/docs/about.html", label: "Acerca de AIR²Aim" },
                { file: "/docs/UserGuide.html", label: "Guía de uso" },
                { file: "/docs/Permissions.html", label: "Permisos" },
                { file: "/docs/ServiceTerms.html", label: "Términos de servicio" },
                { file: "/docs/Privacy.html", label: "Política de privacidad" },
                { file: "/docs/UsageStatus.html", label: "Estado de uso" },
                { file: "/docs/Feedback.html", label: "Comentarios" }
            ]
        }
    };

    const SUPPORTED_LANGS = Object.keys(NAV_CONFIG);

    // 2. 自动注入样式：半透明带点灰的轻磨砂菜单，契合整体暗色透明体系，无纯白或重灰块
    function injectStyles() {
        if (document.getElementById("air2aim-docs-nav-style")) return;
        const style = document.createElement("style");
        style.id = "air2aim-docs-nav-style";
        style.textContent = `
            .docs-nav-dropdown {
                position: relative;
            }
            .docs-nav-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.35);
                border: 1px solid rgba(255, 255, 255, 0.35);
                color: #ffffff;
                padding: 5px 10px;
                border-radius: 999px;
                cursor: pointer;
                transition: border-color 0.25s ease, background-color 0.25s ease;
                line-height: 1;
            }
            .docs-nav-btn:hover,
            .docs-nav-dropdown.open .docs-nav-btn {
                background: rgba(255, 255, 255, 0.16);
                border-color: #ffffff;
            }
            .docs-nav-btn .icon-close {
                display: none;
            }
            .docs-nav-dropdown.open .docs-nav-btn .icon-menu {
                display: none;
            }
            .docs-nav-dropdown.open .docs-nav-btn .icon-close {
                display: inline-block;
            }
            .docs-nav-menu {
                display: none;
                position: absolute;
                right: 0;
                top: calc(100% + 6px);
                min-width: 205px;
                background: rgba(110, 110, 116, 0.34);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border: 1px solid rgba(255, 255, 255, 0.28);
                border-radius: 10px;
                padding: 5px;
                z-index: 40;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.32);
            }
            .docs-nav-dropdown.open .docs-nav-menu {
                display: block;
            }
            .docs-nav-header {
                font-size: 0.68rem;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.65);
                padding: 5px 10px 4px 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                margin-bottom: 4px;
                user-select: none;
            }
            .docs-nav-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                color: rgba(255, 255, 255, 0.88);
                text-decoration: none;
                font-size: 0.81rem;
                padding: 7px 10px;
                border-radius: 7px;
                transition: background-color 0.2s ease, color 0.2s ease;
            }
            .docs-nav-item:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }
            .docs-nav-item.active {
                background: rgba(255, 255, 255, 0.13);
                color: #ffffff;
                font-weight: 600;
            }
            .docs-nav-item.active::after {
                content: "•";
                font-size: 0.95rem;
                line-height: 1;
                margin-left: 8px;
                color: #ffffff;
            }
        `;
        document.head.appendChild(style);
    }

    // 3. 实时读取当前页面生效的语言（优先读取 <html lang="xx">，其次读取 URL ?lang=，最后系统语言）
    function getCurrentLang() {
        const htmlLang = (document.documentElement.lang || "").toLowerCase().split("-")[0];
        if (SUPPORTED_LANGS.includes(htmlLang)) return htmlLang;

        const params = new URLSearchParams(window.location.search);
        const queryLang = (params.get("lang") || "").toLowerCase().split("-")[0];
        if (SUPPORTED_LANGS.includes(queryLang)) return queryLang;

        const sysLang = (navigator.language || "en").toLowerCase().split("-")[0];
        if (SUPPORTED_LANGS.includes(sysLang)) return sysLang;

        return "en";
    }

    // 获取当前页面路径（小写，用于匹配高亮）
    function getCurrentPath() {
        return (window.location.pathname || "").toLowerCase();
    }

    function initDocsNav() {
        const topControls = document.querySelector(".top-controls");
        if (!topControls || document.getElementById("docsNavDropdown")) return;

        injectStyles();

        const dropdown = document.createElement("div");
        dropdown.className = "docs-nav-dropdown";
        dropdown.id = "docsNavDropdown";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "docs-nav-btn";
        btn.id = "docsNavBtn";
        btn.setAttribute("aria-expanded", "false");
        btn.innerHTML = `
            <svg class="icon-menu" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg class="icon-close" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;

        const menu = document.createElement("nav");
        menu.className = "docs-nav-menu";
        menu.id = "docsNavMenu";
        menu.setAttribute("role", "menu");

        dropdown.appendChild(btn);
        dropdown.appendChild(menu);
        topControls.appendChild(dropdown);

        function renderNavMenu() {
            const lang = getCurrentLang();
            const pack = NAV_CONFIG[lang] || NAV_CONFIG.en;
            const currentPath = getCurrentPath();

            btn.setAttribute("aria-label", pack.ariaLabel);
            menu.innerHTML = "";

            const header = document.createElement("div");
            header.className = "docs-nav-header";
            header.textContent = pack.sectionTitle;
            menu.appendChild(header);

            pack.items.forEach(function (item) {
                const link = document.createElement("a");
                link.className = "docs-nav-item";
                link.href = item.file + "?lang=" + encodeURIComponent(lang);
                link.textContent = item.label;
                link.setAttribute("role", "menuitem");

                if (currentPath.endsWith(item.file.toLowerCase())) {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                }

                menu.appendChild(link);
            });
        }

        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const willOpen = !dropdown.classList.contains("open");
            const langDropdown = document.getElementById("langDropdown");
            const langGlobeBtn = document.getElementById("langGlobeBtn");
            if (langDropdown && langDropdown.classList.contains("open")) {
                langDropdown.classList.remove("open");
                if (langGlobeBtn) langGlobeBtn.setAttribute("aria-expanded", "false");
            }
            dropdown.classList.toggle("open", willOpen);
            btn.setAttribute("aria-expanded", String(willOpen));
        });

        document.addEventListener("click", function (e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove("open");
                btn.setAttribute("aria-expanded", "false");
            }
        });

        const observer = new MutationObserver(function (mutations) {
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].attributeName === "lang") {
                    renderNavMenu();
                    break;
                }
            }
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["lang"]
        });

        renderNavMenu();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDocsNav);
    } else {
        initDocsNav();
    }
})();