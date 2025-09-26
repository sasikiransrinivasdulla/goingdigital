// Landing Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Navbar background change on scroll
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(0, 0, 0, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(0, 212, 255, 0.2)";
      } else {
        navbar.style.background = "rgba(0, 0, 0, 0.95)";
        navbar.style.boxShadow = "0 2px 20px rgba(255, 255, 255, 0.1)";
      }
    });
  }

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe feature cards
  document.querySelectorAll(".feature-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe about section
  const aboutText = document.querySelector(".about-text");
  const aboutImage = document.querySelector(".about-image");

  if (aboutText) {
    aboutText.style.opacity = "0";
    aboutText.style.transform = "translateX(-30px)";
    aboutText.style.transition = "all 0.8s ease";
    observer.observe(aboutText);
  }

  if (aboutImage) {
    aboutImage.style.opacity = "0";
    aboutImage.style.transform = "translateX(30px)";
    aboutImage.style.transition = "all 0.8s ease 0.2s";
    observer.observe(aboutImage);
  }

  // Counter animation for stats
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = formatNumber(target);
        clearInterval(timer);
      } else {
        element.textContent = formatNumber(Math.floor(start));
      }
    }, 16);
  }

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M+";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "+";
    } else if (num === 99.9) {
      return "99.9%";
    }
    return num.toString();
  }

  // Animate stats when they come into view
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("animated")
        ) {
          entry.target.classList.add("animated");

          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach((stat) => {
            const text = stat.textContent;
            if (text.includes("500+")) {
              animateCounter(stat, 500);
            } else if (text.includes("1M+")) {
              animateCounter(stat, 1000000);
            } else if (text.includes("99.9%")) {
              animateCounter(stat, 99.9);
            }
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Add hover effects to buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Floating animation for hero card
  const heroCard = document.querySelector(".hero-card");
  if (heroCard) {
    let floatDirection = 1;
    setInterval(() => {
      heroCard.style.transform = `translateY(${floatDirection * 10}px)`;
      floatDirection *= -1;
    }, 3000);
  }

  // Add parallax effect to hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");

    if (heroContent && heroImage && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  });

  // Add click ripple effect to buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS for ripple animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
  document.head.appendChild(style);

  // Preload images
  const imagesToPreload = [
    "images/menu/chicken-biryani.jpg",
    "images/menu/butter-naan.jpg",
    "images/logo.png",
  ];

  imagesToPreload.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // Add loading animation
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });

  // Back to top functionality
  const backToTop = document.createElement("button");
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTop.className = "back-to-top";
  backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #4a6fa5, #166ba0);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(74, 111, 165, 0.3);
    `;

  document.body.appendChild(backToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTop.style.opacity = "1";
      backToTop.style.visibility = "visible";
    } else {
      backToTop.style.opacity = "0";
      backToTop.style.visibility = "hidden";
    }
  });

  backToTop.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px)";
    this.style.boxShadow = "0 6px 20px rgba(74, 111, 165, 0.4)";
  });

  backToTop.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "0 4px 15px rgba(74, 111, 165, 0.3)";
  });
});

// Performance optimization
document.addEventListener("DOMContentLoaded", function () {
  // Lazy load images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
});

// Add some easter eggs
let clickCount = 0;
document.querySelector(".logo")?.addEventListener("click", function () {
  clickCount++;
  if (clickCount === 5) {
    this.style.animation = "spin 1s ease-in-out";
    setTimeout(() => {
      this.style.animation = "";
      clickCount = 0;
    }, 1000);
  }
});

// Add CSS for logo spin
const logoStyle = document.createElement("style");
logoStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(logoStyle);
