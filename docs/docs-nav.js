(function () {
    // 1. 五语目录配置（顺序按 1-about, 2-UserGuide, 3-Permissions, 4-ServiceTerms, 5-Privacy, 6-UsageStatus 排列）
    const NAV_CONFIG = {
        zh: {
            ariaLabel: "页面目录导航",
            sectionTitle: "文档目录",
            items: [
                { file: "about.html", label: "关于 AIR²Aim" },
                { file: "UserGuide.html", label: "使用指南" },
                { file: "Permissions.html", label: "权限设置" },
                { file: "ServiceTerms.html", label: "服务条款" },
                { file: "Privacy.html", label: "隐私政策" },
                { file: "UsageStatus.html", label: "使用状态与额度" }
            ]
        },
        en: {
            ariaLabel: "Page directory navigation",
            sectionTitle: "Documentation",
            items: [
                { file: "about.html", label: "About AIR²Aim" },
                { file: "UserGuide.html", label: "User Guide" },
                { file: "Permissions.html", label: "Permissions" },
                { file: "ServiceTerms.html", label: "Service Terms" },
                { file: "Privacy.html", label: "Privacy Policy" },
                { file: "UsageStatus.html", label: "Usage Status" }
            ]
        },
        ru: {
            ariaLabel: "Навигация по разделам",
            sectionTitle: "Документация",
            items: [
                { file: "about.html", label: "О приложении AIR²Aim" },
                { file: "UserGuide.html", label: "Руководство пользователя" },
                { file: "Permissions.html", label: "Разрешения" },
                { file: "ServiceTerms.html", label: "Условия использования" },
                { file: "Privacy.html", label: "Политика конфиденциальности" },
                { file: "UsageStatus.html", label: "Статус использования" }
            ]
        },
        fr: {
            ariaLabel: "Navigation des pages",
            sectionTitle: "Documentation",
            items: [
                { file: "about.html", label: "À propos d’AIR²Aim" },
                { file: "UserGuide.html", label: "Guide d’utilisation" },
                { file: "Permissions.html", label: "Autorisations" },
                { file: "ServiceTerms.html", label: "Conditions d’utilisation" },
                { file: "Privacy.html", label: "Politique de confidentialité" },
                { file: "UsageStatus.html", label: "Statut d’utilisation" }
            ]
        },
        es: {
            ariaLabel: "Navegación de páginas",
            sectionTitle: "Documentación",
            items: [
                { file: "about.html", label: "Acerca de AIR²Aim" },
                { file: "UserGuide.html", label: "Guía de uso" },
                { file: "Permissions.html", label: "Permisos" },
                { file: "ServiceTerms.html", label: "Términos de servicio" },
                { file: "Privacy.html", label: "Política de privacidad" },
                { file: "UsageStatus.html", label: "Estado de uso" }
            ]
        }
    };

    const SUPPORTED_LANGS = Object.keys(NAV_CONFIG);

    // 2. 自动注入与现有界面完全一致的胶囊按钮 + 深色毛玻璃下拉菜单样式
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
                background: rgba(20, 20, 22, 0.94);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 10px;
                padding: 5px;
                z-index: 40;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.48);
            }
            .docs-nav-dropdown.open .docs-nav-menu {
                display: block;
            }
            .docs-nav-header {
                font-size: 0.68rem;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.52);
                padding: 5px 10px 4px 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 4px;
                user-select: none;
            }
            .docs-nav-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                color: rgba(255, 255, 255, 0.9);
                text-decoration: none;
                font-size: 0.81rem;
                padding: 7px 10px;
                border-radius: 7px;
                transition: background-color 0.2s ease, color 0.2s ease;
            }
            .docs-nav-item:hover {
                background: rgba(255, 255, 255, 0.14);
                color: #ffffff;
            }
            .docs-nav-item.active {
                background: rgba(255, 255, 255, 0.2);
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

    // 获取当前页面文件名（不区分大小写匹配高亮）
    function getCurrentFileName() {
        const path = window.location.pathname || "";
        const raw = path.substring(path.lastIndexOf("/") + 1);
        return (raw || "index.html").toLowerCase();
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
            const currentFile = getCurrentFileName();

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

                if (item.file.toLowerCase() === currentFile) {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                }

                menu.appendChild(link);
            });
        }

        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const willOpen = !dropdown.classList.contains("open");
            // 若语言下拉框正开着，顺便将其关闭，避免两个下拉菜单重叠
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

        // 监听 <html lang="..."> 变化：用户在页面上切换语言时，目录标题和跳转链接自动同步更新
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
