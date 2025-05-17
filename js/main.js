/*--------------------------------------------------------------
# Main JavaScript for Portfolio Website
--------------------------------------------------------------*/

$(document).ready(function () {
  "use strict";

  /*--------------------------------------------------------------
    # Preloader Animation
    --------------------------------------------------------------*/
  $(window).on("load", function () {
    // Add animated preloader
    const preloader = `
      <div id="preloader">
        <div class="loader">
          <svg viewBox="0 0 80 80">
            <circle id="loader-circle" cx="40" cy="40" r="32"></circle>
          </svg>
        </div>
      </div>
    `;

    $("body").prepend(preloader);

    // When the page has loaded
    setTimeout(function () {
      $("#preloader").addClass("loaded");
      setTimeout(function () {
        $("#preloader").remove();
        $("body").addClass("page-loaded");

        // Start intro animations after preloader
        animateHeroSection();
      }, 800);
    }, 1000);
  });

  /*--------------------------------------------------------------
    # Hero Section Animations
    --------------------------------------------------------------*/
  function animateHeroSection() {
    const heroElements = [
      "#hero h1",
      "#hero h2",
      "#hero p",
      ".hero-buttons",
      ".hero-img",
    ];

    heroElements.forEach((element, index) => {
      setTimeout(() => {
        $(element).addClass("animated");
      }, 300 * index);
    });
  }

  /*--------------------------------------------------------------
    # Scroll Reveal Animations
    --------------------------------------------------------------*/
  function checkScroll() {
    const windowHeight = $(window).height();
    const scrollTop = $(window).scrollTop();

    // Fade in elements on scroll
    $(".fade-in-up").each(function () {
      const elementTop = $(this).offset().top;

      if (scrollTop > elementTop - windowHeight + 100) {
        $(this).addClass("appear");
      }
    });

    // Staggered animations for items in a group
    $(".stagger-group").each(function () {
      const groupTop = $(this).offset().top;

      if (scrollTop > groupTop - windowHeight + 100) {
        $(this)
          .find(".stagger-item")
          .each(function (index) {
            setTimeout(() => {
              $(this).addClass("appear");
            }, 100 * index);
          });
      }
    });
  }

  // Initialize scroll animations
  $(window).on("scroll resize", checkScroll);
  setTimeout(checkScroll, 100); // Initial check

  /*--------------------------------------------------------------
    # Smooth Scrolling
    --------------------------------------------------------------*/
  // Smooth scroll for nav links
  $("a.nav-link, .hero-buttons a, .footer-links a, #back-to-top").on(
    "click",
    function (e) {
      if (this.hash !== "") {
        e.preventDefault();

        const hash = this.hash;

        $("html, body").animate(
          {
            scrollTop: $(hash).offset().top - 70,
          },
          800,
          "easeInOutQuart"
        );

        // Add hash to URL (without causing page jump)
        if (history.pushState) {
          history.pushState(null, null, hash);
        }
      }
    }
  );

  // jQuery easing function for smoother animations
  jQuery.extend(jQuery.easing, {
    easeInOutQuart: function (x, t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
      return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
    },
  });

  /*--------------------------------------------------------------
    # Navbar Scrolled Effect
    --------------------------------------------------------------*/
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#header").addClass("header-scrolled");
      $("#back-to-top").addClass("active");
    } else {
      $("#header").removeClass("header-scrolled");
      $("#back-to-top").removeClass("active");
    }
  });

  // Activate nav item based on scroll position
  $(window)
    .scroll(function () {
      var scrollDistance = $(window).scrollTop() + 100;

      // Check each section and update nav
      $("section").each(function () {
        if ($(this).offset().top <= scrollDistance) {
          $(".navbar-nav .nav-link.active").removeClass("active");
          $(
            '.navbar-nav .nav-link[href="#' + $(this).attr("id") + '"]'
          ).addClass("active");
        }
      });
    })
    .scroll();

  /*--------------------------------------------------------------
    # Mobile Nav Toggle with Animation
    --------------------------------------------------------------*/
  $(".navbar-toggler").on("click", function () {
    if ($(this).hasClass("collapsed")) {
      $(this).removeClass("collapsed");
    }

    // Add animation to mobile menu items
    setTimeout(function () {
      if ($(".navbar-collapse").hasClass("show")) {
        $(".navbar-collapse .nav-item").each(function (index) {
          setTimeout(() => {
            $(this).addClass("slide-in-nav-item");
          }, 100 * index);
        });
      } else {
        $(".navbar-collapse .nav-item").removeClass("slide-in-nav-item");
      }
    }, 200);
  });

  // Close mobile nav when link is clicked
  $(".navbar-nav .nav-link").on("click", function () {
    $(".navbar-collapse").collapse("hide");
    $(".navbar-collapse .nav-item").removeClass("slide-in-nav-item");
  });

  /*--------------------------------------------------------------
    # Animated Counters
    --------------------------------------------------------------*/
  function initCounters() {
    $(".counter").each(function () {
      const $this = $(this);

      // Only run animation if counter hasn't been animated yet
      if (!$this.hasClass("counted")) {
        $this.addClass("counted");
        $this.prop("Counter", 0).animate(
          {
            Counter: $this.data("count"),
          },
          {
            duration: 2500,
            easing: "swing",
            step: function (now) {
              $this.text(Math.ceil(now));
            },
            complete: function () {
              // Add a little bounce when complete
              $this.addClass("bounce-animation");
              setTimeout(() => $this.removeClass("bounce-animation"), 1000);
            },
          }
        );
      }
    });
  }

  // Observe the about section to trigger counter animation when in view
  const aboutSection = document.querySelector("#about");
  if (aboutSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          initCounters();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(aboutSection);
  }

  /*--------------------------------------------------------------
    # Typed.js for Hero Section with Advanced Configuration
    --------------------------------------------------------------*/
  if ($(".typed-text").length) {
    const typed = new Typed(".typed-text", {
      strings: [
        "Frontend Web Developer",
        "UI/UX Designer",
        "JavaScript Enthusiast",
      ],
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      cursorChar: "|",
      smartBackspace: true,
      fadeOut: true,
      shuffle: false,
      onBegin: (self) => {
        $(".typed-cursor").addClass("typing");
      },
      onStop: (self) => {
        $(".typed-cursor").removeClass("typing");
      },
    });
  }

  /*--------------------------------------------------------------
    # Projects Filtering with Animation
    --------------------------------------------------------------*/
  // Filter projects with animation
  $(".filter-btn").on("click", function () {
    const filterValue = $(this).attr("data-filter");

    // Toggle active class
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    // Add animation class to all items first
    $(".project-item").addClass("filter-animation");

    setTimeout(() => {
      if (filterValue === "all") {
        $(".project-item").show(300).removeClass("filter-animation");
      } else {
        $(".project-item").hide(300).removeClass("filter-animation");
        $(".project-item[data-category='" + filterValue + "']")
          .show(300)
          .removeClass("filter-animation");
      }
    }, 300);
  });

  // Add hover effect to project cards
  $(".project-card").each(function () {
    $(this)
      .on("mouseenter", function () {
        $(this).find(".card-img-top").css("transform", "scale(1.1)");
        $(this).addClass("card-hover");
      })
      .on("mouseleave", function () {
        $(this).find(".card-img-top").css("transform", "scale(1)");
        $(this).removeClass("card-hover");
      });
  });

  /*--------------------------------------------------------------
    # Progress Bar Animation on Scroll
    --------------------------------------------------------------*/
  function animateProgressBars() {
    $(".progress-bar").each(function () {
      const progressValue = $(this).attr("aria-valuenow") + "%";

      // Animate width from 0 to target percent
      $(this).css("width", 0).animate(
        {
          width: progressValue,
        },
        1500,
        "easeInOutQuart"
      );
    });
  }

  // Initialize and animate on scroll using Intersection Observer
  const skillsSection = $("#skills");
  if (skillsSection.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateProgressBars();
          // Unobserve after animation
          observer.unobserve(skillsSection[0]);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(skillsSection[0]);
  }

  /*--------------------------------------------------------------
    # Form Validation & Submission with Animated Feedback
    --------------------------------------------------------------*/
  $("#contactForm").submit(function (e) {
    e.preventDefault();

    // Form validation is handled by Bootstrap
    if (this.checkValidity()) {
      const formData = {
        name: $("#name").val(),
        email: $("#email").val(),
        subject: $("#subject").val(),
        message: $("#message").val(),
      };

      // Save original form content
      const originalForm = $(this).html();

      // Show loading state
      $(this).html(`
        <div class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h5 class="mt-3">Sending message...</h5>
        </div>
      `);

      // Simulate sending (in a real implementation, this would submit to a server)
      setTimeout(() => {
        // Display success message
        $(this).html(`
          <div class="success-animation">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <div class="alert alert-success text-center mt-4" role="alert">
              <h4 class="alert-heading">Message Sent!</h4>
              <p>Thank you for contacting me. I will get back to you soon.</p>
            </div>
          </div>
        `);

        // Reset form after delay
        setTimeout(() => {
          $(this).html(originalForm);
        }, 5000);
      }, 1500);
    } else {
      // Add animation to invalid fields
      $(this).find(":invalid").addClass("shake-animation");
      setTimeout(() => {
        $(this).find(":invalid").removeClass("shake-animation");
      }, 500);
    }
  });

  /*--------------------------------------------------------------
    # Testimonial Carousel with Enhanced Animations
    --------------------------------------------------------------*/
  $("#testimonialsCarousel").carousel({
    interval: 5000,
    pause: "hover",
  });

  // Add special entrance animation for testimonials
  $("#testimonialsCarousel").on("slide.bs.carousel", function (e) {
    const nextItem = $(e.relatedTarget).find(".testimonial-item");
    const prevItem = $(e.from).find(".testimonial-item");

    prevItem.addClass("fadeOutLeft");
    nextItem.addClass("fadeInRight");

    setTimeout(() => {
      prevItem.removeClass("fadeOutLeft");
      nextItem.removeClass("fadeInRight");
    }, 1000);
  });

  /*--------------------------------------------------------------
    # Parallax Effects
    --------------------------------------------------------------*/
  $(window).on("scroll", function () {
    const scrollPosition = window.pageYOffset;

    // Simple parallax for hero section
    $("#hero").css({
      "background-position": "center " + scrollPosition * 0.2 + "px",
    });

    // For any elements with parallax class
    $(".parallax").each(function () {
      const speed = $(this).data("speed") || 0.5;
      $(this).css({
        transform: "translateY(" + scrollPosition * speed + "px)",
      });
    });
  });

  /*--------------------------------------------------------------
    # Tilt Effect for Cards
    --------------------------------------------------------------*/
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
    });
  }

  /*--------------------------------------------------------------
    # Theme Switcher (Optional)
    --------------------------------------------------------------*/
  // If you decide to add a theme switcher in the future, this is where you'd add the code

  /*--------------------------------------------------------------
    # Initialize All Animations and Effects
    --------------------------------------------------------------*/
  // Check for elements with animation classes
  checkScroll();

  // Ensure projects grid is initialized with isotope (if available)
  if (typeof $.fn.isotope !== "undefined") {
    let $grid = $(".project-grid").isotope({
      itemSelector: ".project-item",
      layoutMode: "fitRows",
    });

    $(".filter-btn").on("click", function () {
      const filterValue = $(this).attr("data-filter");
      $grid.isotope({
        filter: filterValue === "all" ? "*" : "." + filterValue,
      });
    });
  }

  // Optimize JavaScript performance
  document.addEventListener("DOMContentLoaded", function () {
    // Cache DOM elements
    const header = document.getElementById("header");
    const backToTop = document.querySelector(".back-to-top");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    // Smooth scrolling function
    function scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }

    // Add click event listeners to navigation links
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const sectionId = this.getAttribute("href").substring(1);
        scrollToSection(sectionId);
      });
    });

    // Header scroll effect
    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset;

      // Header scroll effect
      if (currentScroll > scrollThreshold) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }

      // Back to top button
      if (currentScroll > 300) {
        backToTop.classList.add("active");
      } else {
        backToTop.classList.remove("active");
      }

      lastScroll = currentScroll;
    }

    // Throttle scroll event
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initialize AOS
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }

    // Project filtering
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter");

        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        // Filter projects
        projectCards.forEach((card) => {
          if (
            filter === "all" ||
            card.getAttribute("data-category") === filter
          ) {
            card.style.display = "block";
            setTimeout(() => (card.style.opacity = "1"), 50);
          } else {
            card.style.opacity = "0";
            setTimeout(() => (card.style.display = "none"), 300);
          }
        });
      });
    });

    // Lazy load images
    if ("loading" in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach((img) => {
        img.src = img.dataset.src;
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
      document.body.appendChild(script);
    }
  });
});

/*--------------------------------------------------------------
# Add typed.js Library for Text Animation
--------------------------------------------------------------*/
// This would normally be included via CDN, but is simulated here for completeness
// The real implementation should use the CDN version
// In a real project, you would include this via the CDN in the HTML
/**
 * Simulated Typed.js Constructor (for demo purposes)
 * In a real project, this would be loaded from CDN
 */
function Typed(element, options) {
  this.element = element;
  this.strings = options.strings;
  this.typeSpeed = options.typeSpeed;
  this.backSpeed = options.backSpeed;
  this.backDelay = options.backDelay;
  this.loop = options.loop;
  this.cursorChar = options.cursorChar || "|";
  this.fadeOut = options.fadeOut || false;
  this.smartBackspace = options.smartBackspace || false;
  this.shuffle = options.shuffle || false;
  this.onBegin = options.onBegin || function () {};
  this.onStop = options.onStop || function () {};

  // Initialize
  this.init();
}

Typed.prototype.init = function () {
  const self = this;
  let currentStringIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;

  // Add cursor element
  $(self.element).after(
    '<span class="typed-cursor">' + self.cursorChar + "</span>"
  );

  // Call the onBegin callback
  self.onBegin(self);

  function type() {
    const currentString = self.strings[currentStringIndex];
    let timeout = self.typeSpeed;

    if (isDeleting) {
      // Delete a character
      $(self.element).text(currentString.substring(0, currentCharIndex--));
      timeout = self.backSpeed;

      if (currentCharIndex < 0) {
        isDeleting = false;
        currentStringIndex = self.shuffle
          ? Math.floor(Math.random() * self.strings.length)
          : (currentStringIndex + 1) % self.strings.length;
        timeout = self.backDelay;

        // Trigger stop callback briefly between strings
        self.onStop(self);
        setTimeout(() => {
          self.onBegin(self);
        }, timeout - 100);
      }
    } else {
      // Type a character
      $(self.element).text(currentString.substring(0, ++currentCharIndex));

      if (currentCharIndex === currentString.length) {
        isDeleting = true;
        timeout = self.backDelay;
      }
    }

    setTimeout(type, timeout);
  }

  type();

  // Animate cursor
  setInterval(() => {
    $(".typed-cursor").toggleClass("blink");
  }, 400);
};
