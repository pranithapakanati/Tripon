document.addEventListener("DOMContentLoaded", () => {
  const setActive = (items, activeItem, className = "active") => {
    items.forEach((item) => item.classList.remove(className));
    if (activeItem) {
      activeItem.classList.add(className);
    }
  };

  const showStatus = (message) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "18px";
    toast.style.right = "18px";
    toast.style.padding = "10px 14px";
    toast.style.background = "#102937";
    toast.style.color = "#fff";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "13px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 8px 18px rgba(0,0,0,0.2)";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1700);
  };

  const homeRoot = document.querySelector("#homeScreen");

  // Navbar: switch between Home, People Reviews, and Packages screens
  const pageRoot = document.querySelector(".page");
  const homeScreen = document.querySelector("#homeScreen");
  const reviewsScreen = document.querySelector("#peopleReviewsScreen");
  const packagesScreen = document.querySelector("#packagesScreen");
  const contactScreen = document.querySelector("#contactScreen");
  const reviewsNavLink = document.querySelector('.main-nav a[data-view="reviews"]');
  const packagesNavLink = document.querySelector('.main-nav a[data-view="packages"]');
  const contactBtn = document.querySelector(".contact-btn");
  const reviewsContinueBtn = document.querySelector(".reviews-continue");

  const paintNavState = (active) => {
    [reviewsNavLink, packagesNavLink].forEach((link) => link?.classList.remove("is-active"));
    contactBtn?.classList.remove("is-active");
    if (active === "reviews") {
      reviewsNavLink?.classList.add("is-active");
    }
    if (active === "packages") {
      packagesNavLink?.classList.add("is-active");
    }
    if (active === "contact") {
      contactBtn?.classList.add("is-active");
    }
  };

  const showScreen = (view) => {
    if (!pageRoot || !homeScreen || !reviewsScreen || !packagesScreen || !contactScreen) {
      return;
    }

    pageRoot.classList.remove("reviews-active", "packages-active", "contact-active");
    if (view === "reviews") {
      pageRoot.classList.add("reviews-active");
    }
    if (view === "packages") {
      pageRoot.classList.add("packages-active");
    }
    if (view === "contact") {
      pageRoot.classList.add("contact-active");
    }

    paintNavState(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showReviewsScreen = () => {
    showScreen("reviews");
  };

  const showPackagesScreen = () => {
    showScreen("packages");
  };

  const showHomeScreen = () => {
    showScreen("home");
  };

  const showContactScreen = () => {
    showScreen("contact");
  };

  reviewsNavLink?.addEventListener("click", (event) => {
    event.preventDefault();
    showReviewsScreen();
  });

  packagesNavLink?.addEventListener("click", (event) => {
    event.preventDefault();
    showPackagesScreen();
  });

  reviewsContinueBtn?.addEventListener("click", () => {
    showHomeScreen();
  });

  contactBtn?.addEventListener("click", () => {
    showContactScreen();
  });

  paintNavState("home");

  // Location dropdown toggle
  const locationWrapper = document.querySelector(".location-dropdown-wrapper");
  if (locationWrapper) {
    const locationPill = locationWrapper.querySelector(".location-pill");
    const locationDropdown = locationWrapper.querySelector(".location-dropdown");
    const locationLinks = locationDropdown.querySelectorAll("a");

    locationPill.addEventListener("click", () => {
      locationWrapper.classList.toggle("active");
      locationDropdown.classList.toggle("active");
    });

    locationLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedLocation = link.dataset.location;
        const displayName = link.textContent.trim();
        locationPill.textContent = displayName + " ";
        const chevron = document.createElement("i");
        chevron.className = "fa-solid fa-chevron-down location-chevron";
        chevron.setAttribute("aria-hidden", "true");
        locationPill.appendChild(chevron);
        locationWrapper.classList.remove("active");
        locationDropdown.classList.remove("active");
        showStatus(`Selected: ${displayName}`);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!locationWrapper.contains(e.target)) {
        locationWrapper.classList.remove("active");
        locationDropdown.classList.remove("active");
      }
    });
  }

  // Hero section: lightweight form behavior
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const editableFields = heroSection.querySelectorAll(".search-box .field");
    editableFields.forEach((field) => {
      field.style.cursor = "pointer";
      field.addEventListener("click", () => {
        const label = field.querySelector("label")?.textContent?.trim() || "Value";
        const valueHolder = field.querySelector("span:last-child");
        const current = valueHolder?.textContent?.trim() || "";
        const next = window.prompt(`Enter ${label}`, current);
        if (next !== null && valueHolder) {
          valueHolder.textContent = next.trim() || current;
        }
      });
    });

    const sendBtn = heroSection.querySelector(".send-btn");
    sendBtn?.addEventListener("click", () => {
      const values = Array.from(editableFields).map((field) =>
        field.querySelector("span:last-child")?.textContent?.trim() || ""
      );
      const hasPlaceholders = values.some((value) => /enter|select|guests/i.test(value));
      showStatus(hasPlaceholders ? "Please fill all travel details" : "Trip request sent");
    });
  }

  // Adventure section: simple previous/next place slider
  const adventureSection = homeRoot?.querySelector(".adventure");
  if (adventureSection) {
    const items = Array.from(adventureSection.querySelectorAll(".place-item"));
    const controls = adventureSection.querySelectorAll(".arrow-controls button");
    let activeIndex = 0;

    const paint = () => {
      items.forEach((item, idx) => {
        item.style.opacity = idx === activeIndex ? "1" : "0.45";
        item.style.transform = idx === activeIndex ? "translateY(-2px)" : "translateY(0)";
        item.style.transition = "all 220ms ease";
      });
    };

    controls[0]?.addEventListener("click", () => {
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      paint();
    });
    controls[1]?.addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % items.length;
      paint();
    });
    paint();
  }

  // Trip-days section: choose day card and cycle with arrows
  const daySection = document.querySelector(".trip-days");
  if (daySection) {
    const cards = Array.from(daySection.querySelectorAll(".day-card"));
    const controls = daySection.querySelectorAll(".arrow-controls.side button");
    let activeIndex = 0;

    const renderDays = () => {
      cards.forEach((card, idx) => {
        card.setAttribute("aria-pressed", String(idx === activeIndex));
        card.style.opacity = idx === activeIndex ? "1" : "0.65";
        card.style.transform = idx === activeIndex ? "scale(1.02)" : "scale(1)";
        card.style.transition = "all 180ms ease";
      });
    };

    cards.forEach((card, idx) => {
      card.addEventListener("click", () => {
        activeIndex = idx;
        renderDays();
      });
    });

    controls[0]?.addEventListener("click", () => {
      activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      renderDays();
    });
    controls[1]?.addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % cards.length;
      renderDays();
    });

    renderDays();
  }

  // Reasons section: interactive topic switch
  const reasonsSection = document.querySelector(".reasons");
  if (reasonsSection) {
    const topics = Array.from(reasonsSection.querySelectorAll(".reason-text h4"));
    const articleTitle = reasonsSection.querySelector(".reason-text article h3");
    const articleCopy = reasonsSection.querySelector(".reason-text article p");
    const reasonContent = {
      Festivals: {
        title: "The Culture",
        body: "This is a mixture of Hindu, Muslim and Buddhist culture. These people live together very harmoniously. You can also visit temples and mosques for a deeper understanding of their traditions."
      },
      "Peace and Quiet": {
        title: "Mindful Escapes",
        body: "Bali offers hidden retreats, lush valleys, and calming beaches where you can slow down and reconnect with nature away from crowded city routines."
      },
      "Romantic Ambience": {
        title: "Romantic Moments",
        body: "Sunset dinners, private villas, and scenic viewpoints make Bali one of the most romantic places for couples and honeymoon experiences."
      },
      "Ease of Travel": {
        title: "Easy to Explore",
        body: "From airport transfers to guided day trips, getting around the island is convenient and budget friendly for both short and long vacations."
      }
    };

    topics.forEach((topic) => {
      topic.style.cursor = "pointer";
      topic.addEventListener("click", () => {
        setActive(topics, topic);
        const marker = reasonsSection.querySelector(".reason-marker");
        const textBox = reasonsSection.querySelector(".reason-text");
        if (marker && textBox) {
          const topicTop = topic.getBoundingClientRect().top;
          const boxTop = textBox.getBoundingClientRect().top;
          marker.style.top = (topicTop - boxTop) + "px";
        }
        const key = topic.textContent?.trim() || "";
        const selected = reasonContent[key];
        if (selected && articleTitle && articleCopy) {
          articleTitle.textContent = selected.title;
          articleCopy.textContent = selected.body;
        }
      });
    });

    const initMarker = () => {
      const marker = reasonsSection.querySelector(".reason-marker");
      const activeTopic = reasonsSection.querySelector(".reason-text h4.active");
      const textBox = reasonsSection.querySelector(".reason-text");
      if (marker && activeTopic && textBox) {
        const topicTop = activeTopic.getBoundingClientRect().top;
        const boxTop = textBox.getBoundingClientRect().top;
        marker.style.top = (topicTop - boxTop) + "px";
      }
    };
    requestAnimationFrame(initMarker);

    reasonsSection.querySelector(".more-blogs-btn")?.addEventListener("click", () => {
      homeRoot?.querySelector(".bali-blogs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Popular packages: tab filtering
  const packageSection = document.querySelector(".popular-packages");
  if (packageSection) {
    const tabs = Array.from(packageSection.querySelectorAll(".package-tabs button"));
    const cards = Array.from(packageSection.querySelectorAll(".package-card"));

    const applyPackageFilter = (type) => {
      cards.forEach((card) => {
        const cardType = card.dataset.type || "";
        const visible = type === "all" || type === cardType;
        card.style.display = visible ? "block" : "none";
      });
    };

    // Show only couple cards on load (All tab active shows all)
    applyPackageFilter("all");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setActive(tabs, tab);
        const type = (tab.textContent || "").trim().toLowerCase();
        applyPackageFilter(type);
      });
    });

    packageSection.querySelector(".see-all")?.addEventListener("click", () => {
      setActive(tabs, tabs[0]);
      applyPackageFilter("all");
      showStatus("Showing all packages");
    });
  }

  // Testimonials: compact read-more behavior for longer cards
  const testimonials = document.querySelector(".testimonials");
  if (testimonials) {
    const texts = testimonials.querySelectorAll(".review-text");
    texts.forEach((node) => {
      const text = node.textContent?.trim() || "";
      if (text.length > 150) {
        const short = `${text.slice(0, 150)}...`;
        node.dataset.fullText = text;
        node.dataset.shortText = short;
        node.textContent = short;
        node.style.cursor = "pointer";
        node.addEventListener("click", () => {
          const expanded = node.getAttribute("data-expanded") === "true";
          node.textContent = expanded ? (node.dataset.shortText || "") : (node.dataset.fullText || "");
          node.setAttribute("data-expanded", String(!expanded));
        });
      }
    });
  }

  // Video banner CTA
  const spotlightBtn = document.querySelector(".spotlight-btn");
  spotlightBtn?.addEventListener("click", () => {
    showStatus("3D view feature coming soon");
  });

  // Family-tour CTA -> packages section
  const familyBtn = document.querySelector(".family-tour-btn");
  familyBtn?.addEventListener("click", () => {
    document.querySelector(".popular-packages")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Why choose cards: click highlight
  const whyCards = Array.from(document.querySelectorAll(".why-card"));
  if (whyCards.length) {
    whyCards.forEach((card, idx) => {
      if (idx === 0) {
        card.style.transform = "translateY(-2px)";
      }
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        whyCards.forEach((c) => {
          c.style.outline = "none";
          c.style.transform = "translateY(0)";
        });
        card.style.outline = "2px solid rgba(10, 139, 83, 0.35)";
        card.style.transform = "translateY(-2px)";
      });
    });
  }

  // FAQ section: tab + accordion with category filtering
  const dealsSection = document.querySelector(".deals");
  if (dealsSection) {
    const faqTabs = Array.from(dealsSection.querySelectorAll(".faq-tabs button"));
    const faqItems = Array.from(dealsSection.querySelectorAll(".faq-item"));

    // Handle individual FAQ item toggle
    faqItems.forEach((item) => {
      const row = item.querySelector(".faq-row");
      row?.addEventListener("click", () => {
        const alreadyActive = item.classList.contains("active");
        faqItems.forEach((node) => {
          node.classList.remove("active");
        });
        if (!alreadyActive) {
          item.classList.add("active");
        }
      });
    });

    // Handle category tab filtering
    faqTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setActive(faqTabs, tab);
        const selectedCategory = (tab.textContent || "").trim().toLowerCase();
        faqItems.forEach((item) => {
          const itemCategory = item.dataset.category || "";
          const isVisible = selectedCategory === "general" || itemCategory === selectedCategory;
          item.style.display = isVisible ? "block" : "none";
          item.classList.remove("active");
        });
      });
    });

    // Show only general category on load
    const defaultCategory = "general";
    faqItems.forEach((item) => {
      item.style.display = item.dataset.category === defaultCategory ? "block" : "none";
    });
  }

  // Bali blogs: fake play controls and share actions
  const blogSection = homeRoot?.querySelector(".bali-blogs");
  if (blogSection) {
    const playBars = Array.from(blogSection.querySelectorAll(".blog-video-bar"));
    playBars.forEach((bar) => {
      bar.style.cursor = "pointer";
      bar.addEventListener("click", () => {
        const fill = bar.querySelector(".blog-progress-fill");
        if (fill) {
          const current = parseInt(fill.style.width || "42", 10);
          const next = current >= 96 ? 18 : current + 22;
          fill.style.width = `${next}%`;
          fill.style.transition = "width 260ms ease";
        }
      });
    });

    const shareButtons = blogSection.querySelectorAll(".blog-share-btn");
    shareButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const title = btn.closest(".bali-card")?.querySelector("h3")?.textContent?.trim() || "Bali blog";
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(`${title} - ${window.location.href}`).then(() => {
            showStatus("Blog link copied");
          }).catch(() => showStatus("Share ready"));
        } else {
          showStatus("Share ready");
        }
      });
    });

    blogSection.querySelector(".want-more-btn")?.addEventListener("click", () => {
      homeRoot?.querySelector(".instagram-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Subscribe section: email validation
  const subscribeForm = document.querySelector(".subscribe-showcase-form");
  if (subscribeForm) {
    const input = subscribeForm.querySelector("input[type='email']");
    const triggerBtn = subscribeForm.querySelector("button");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const submitEmail = () => {
      const email = input?.value.trim() || "";
      if (!emailPattern.test(email)) {
        showStatus("Please enter a valid email");
        input?.focus();
        return;
      }
      showStatus("Subscribed successfully");
      if (input) {
        input.value = "";
      }
    };

    triggerBtn?.addEventListener("click", submitEmail);
    subscribeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitEmail();
    });
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitEmail();
      }
    });
  }

  // Instagram showcase: image preview in a simple modal
  const instaSection = homeRoot?.querySelector(".instagram-showcase");
  if (instaSection) {
    const images = instaSection.querySelectorAll(".instagram-strip img");
    const modal = document.createElement("div");
    const modalImg = document.createElement("img");
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.background = "rgba(6, 10, 16, 0.82)";
    modal.style.display = "none";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9998";
    modal.style.padding = "24px";
    modalImg.style.maxWidth = "min(92vw, 980px)";
    modalImg.style.maxHeight = "88vh";
    modalImg.style.borderRadius = "10px";
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    images.forEach((image) => {
      image.style.cursor = "zoom-in";
      image.addEventListener("click", () => {
        modalImg.src = image.currentSrc || image.src;
        modalImg.alt = image.alt || "Instagram image";
        modal.style.display = "flex";
      });
    });

    modal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Footer: social links open matching platforms
  const socialLinks = document.querySelectorAll(".tripon-socials a");
  const socialTargets = {
    X: "https://x.com",
    Facebook: "https://facebook.com",
    Instagram: "https://instagram.com",
    YouTube: "https://youtube.com"
  };
  socialLinks.forEach((link) => {
    const label = link.getAttribute("aria-label") || "";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = socialTargets[label];
      if (target) {
        window.open(target, "_blank", "noopener,noreferrer");
      }
    });
  });
});
