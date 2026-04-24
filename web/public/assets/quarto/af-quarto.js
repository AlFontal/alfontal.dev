(() => {
  const init = () => {
    const root = document.documentElement;
    const body = document.body;
    const header = document.querySelector('.site-header');
    const themeButtons = Array.from(document.querySelectorAll('.quarto-site-theme-toggle'));
    const themeLabels = Array.from(document.querySelectorAll('[data-theme-label]'));
    const themeIcons = Array.from(document.querySelectorAll('[data-theme-icon]'));
    const menuButton = document.querySelector('.quarto-site-menu-toggle');
    const menu = document.querySelector('[data-site-menu]');
    const quartoContent = document.getElementById('quarto-content');
    const commentsEmbed = document.querySelector('.comments-panel-embed');
    const commentsPanel = document.querySelector('.comments-panel');
    const footer = document.querySelector('.site-footer');
    const desktopQuery = window.matchMedia('(min-width: 1101px)');

    const syncTheme = () => {
      const isDark = body.classList.contains('quarto-dark');
      themeLabels.forEach((label) => {
        label.textContent = isDark ? 'Dark theme' : 'Light theme';
      });
      themeIcons.forEach((icon) => {
        icon.setAttribute('icon', isDark ? 'fa6-solid:moon' : 'fa6-solid:sun');
      });
      themeButtons.forEach((button) => {
        button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      });
    };

    themeButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        window.quartoToggleColorScheme?.();
        window.requestAnimationFrame(syncTheme);
      });
    });

    new MutationObserver(syncTheme).observe(body, {
      attributes: true,
      attributeFilter: ['class'],
    });
    syncTheme();

    let afterContent = null;

    if (quartoContent instanceof HTMLElement) {
      afterContent = document.createElement('div');
      afterContent.className = 'quarto-after-content';
      quartoContent.insertAdjacentElement('afterend', afterContent);

      if (commentsPanel instanceof HTMLElement) {
        afterContent.appendChild(commentsPanel);
      }

      if (footer instanceof HTMLElement) {
        afterContent.appendChild(footer);
      }
    }

    if (commentsEmbed instanceof HTMLElement && quartoContent instanceof HTMLElement) {
      const moveCommentsIntoPanel = () => {
        const giscusNodes = Array.from(
          quartoContent.querySelectorAll('script[src="https://giscus.app/client.js"], .giscus, iframe.giscus-frame'),
        );

        giscusNodes.forEach((node) => {
          if (node.parentElement === commentsEmbed) {
            return;
          }
          commentsEmbed.appendChild(node);
        });
      };

      moveCommentsIntoPanel();
      new MutationObserver(moveCommentsIntoPanel).observe(quartoContent, {
        childList: true,
        subtree: true,
      });
    }

    const path = window.location.pathname;
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute('href') || '';
      const isActive =
        href === '/'
          ? path === '/'
          : path === href || path.startsWith(`${href}/`) || (href === '/blog' && path.startsWith('/posts/'));
      link.classList.toggle('is-active', isActive);
    });

    if (menuButton instanceof HTMLButtonElement && menu instanceof HTMLElement) {
      const setMenuState = (open) => {
        menu.classList.toggle('is-open', open);
        menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      };

      setMenuState(false);
      menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        setMenuState(!isOpen);
      });

      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
      });

      const onDesktopChange = (event) => {
        if (event.matches) {
          setMenuState(false);
        }
      };

      if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', onDesktopChange);
      } else {
        desktopQuery.addListener(onDesktopChange);
      }
    }

    if (!(header instanceof HTMLElement)) return;

    const getScrollY = () => window.scrollY || root.scrollTop || body.scrollTop || 0;
    let lastY = getScrollY();
    let ticking = false;

    const syncHeaderOffset = () => {
      if (!desktopQuery.matches) {
        root.style.setProperty('--af-header-offset', '0px');
        header.classList.remove('is-hidden');
        return;
      }

      root.style.setProperty('--af-header-offset', `${Math.ceil(header.offsetHeight + 12)}px`);
    };

    const updateHeader = () => {
      const currentY = getScrollY();

      if (!desktopQuery.matches) {
        header.classList.remove('is-hidden');
        lastY = currentY;
        ticking = false;
        return;
      }

      if (currentY <= 72 || currentY < lastY - 10) {
        header.classList.remove('is-hidden');
      } else if (currentY > lastY + 10) {
        header.classList.add('is-hidden');
      }

      lastY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    };

    const onViewportChange = () => {
      syncHeaderOffset();
      updateHeader();
    };

    syncHeaderOffset();
    updateHeader();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onViewportChange);
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', onViewportChange);
    } else {
      desktopQuery.addListener(onViewportChange);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
