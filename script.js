(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const copyrightYear = document.getElementById("copyright-year");

  if (copyrightYear) {
    copyrightYear.textContent = String(new Date().getFullYear());
  }

  const navigation = document.getElementById("navigation");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const mobileMenuQuery = window.matchMedia("(max-width: 620px)");

  if (navigation && menuToggle && navLinks) {
    navigation.classList.add("menu-enhanced");

    const setMenuOpen = (isOpen) => {
      navigation.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "收合導覽選單" : "開啟導覽選單"
      );
    };

    menuToggle.addEventListener("click", () => {
      setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    navLinks.addEventListener("click", (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest('a[href^="#"]') &&
        mobileMenuQuery.matches
      ) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (
        mobileMenuQuery.matches &&
        menuToggle.getAttribute("aria-expanded") === "true" &&
        event.target instanceof Node &&
        !navigation.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    const handleBreakpointChange = (event) => {
      if (!event.matches) {
        setMenuOpen(false);
      }
    };

    if (typeof mobileMenuQuery.addEventListener === "function") {
      mobileMenuQuery.addEventListener("change", handleBreakpointChange);
    } else {
      mobileMenuQuery.addListener(handleBreakpointChange);
    }
  }

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.relList.add("noopener", "noreferrer");
  });

  const projectDetails = {
    poster: {
      title: "海報視覺設計",
      category: "海報設計 · 視覺示意素材",
      description:
        "海報以標題層級、影像節奏與留白共同傳達訊息。正式案例可在此補充活動背景、設計目標、視覺概念與實際應用。",
      image: "image/plan.png",
      alt: "含多款海報版面的視覺提案合成圖",
    },
    packaging: {
      title: "產品包裝設計",
      category: "產品包裝 · 視覺示意素材",
      description:
        "包裝設計可從產品定位、材質與開箱使用情境開始，建立品牌識別與功能間的平衡。請以實際案例說明設計脈絡。",
      image: "image/stage.png",
      alt: "設計工作情境與印刷品的合成展示圖",
    },
    brand: {
      title: "品牌視覺識別",
      category: "品牌視覺 · 視覺示意素材",
      description:
        "品牌視覺透過色彩、字體與圖像的一致運用，形成可辨識的溝通方式。此處可補上經確認的識別作品與應用項目。",
      image: "image/member.png",
      alt: "品牌識別與產品包裝的合成視覺展示圖",
    },
    campaign: {
      title: "創意概念提案",
      category: "創意設計 · 視覺示意素材",
      description:
        "以視覺敘事整理想法並轉化為明確的畫面方向。請在發布前換成實際提案素材及真實專案說明。",
      image: "image/cover.png",
      alt: "設計師人像與概念文字構成的創意視覺合成圖",
    },
  };

  const projectDialog = document.getElementById("project-dialog");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogCategory = document.getElementById("dialog-category");
  const dialogDescription = document.getElementById("dialog-description");
  const dialogImage = document.getElementById("dialog-image");
  const dialogImageLink = document.getElementById("dialog-image-link");
  const dialogClose = document.getElementById("dialog-close");
  let lastProjectTrigger = null;

  if (
    projectDialog instanceof HTMLDialogElement &&
    dialogTitle &&
    dialogCategory &&
    dialogDescription &&
    dialogImage instanceof HTMLImageElement &&
    dialogImageLink instanceof HTMLAnchorElement &&
    dialogClose
  ) {
    document.querySelectorAll("[data-project]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const key = trigger.getAttribute("data-project");
        const detail = key ? projectDetails[key] : null;
        if (!detail) {
          return;
        }

        lastProjectTrigger = trigger;
        dialogTitle.textContent = detail.title;
        dialogCategory.textContent = detail.category;
        dialogDescription.textContent = detail.description;
        dialogImage.src = detail.image;
        dialogImage.alt = detail.alt;
        dialogImageLink.href = detail.image;
        projectDialog.showModal();
        document.body.classList.add("dialog-open");
        dialogClose.focus();
      });
    });

    const closeProjectDialog = () => {
      if (projectDialog.open) {
        projectDialog.close();
      }
      document.body.classList.remove("dialog-open");
      if (lastProjectTrigger instanceof HTMLElement) {
        const triggerToRestore = lastProjectTrigger;
        lastProjectTrigger = null;
        window.setTimeout(() => triggerToRestore.focus(), 0);
      }
    };

    dialogClose.addEventListener("click", closeProjectDialog);
    projectDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeProjectDialog();
    });
    projectDialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProjectDialog();
      }
    });
    projectDialog.addEventListener("click", (event) => {
      if (event.target === projectDialog) {
        closeProjectDialog();
      }
    });
  }

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    });

    const aboutSection = document.getElementById("about");
    if (aboutSection && "IntersectionObserver" in window) {
      const topButtonObserver = new IntersectionObserver(([entry]) => {
        backToTop.classList.toggle("is-visible", !entry.isIntersecting);
      });
      topButtonObserver.observe(aboutSection);
    } else {
      const updateBackToTop = () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 450);
      };
      window.addEventListener("scroll", updateBackToTop, { passive: true });
      updateBackToTop();
    }
  }

  const revealTargets = document.querySelectorAll(
    ".section-heading, .project-card, .timeline-item, .skills-panel, .philosophy-card, .detail-block, .contact-panel"
  );

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((target) => {
      target.classList.add("reveal");
      revealObserver.observe(target);
    });
  }
})();
