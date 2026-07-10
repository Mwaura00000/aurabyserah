// Aura by Serah - JavaScript Logic & Interactivity

// 1. Configuration & Data
const PHONE_NUMBER = "254706386242";

const SCENTS = {
  "Creamy Vanilla": {
    name: "Creamy Vanilla",
    descriptors: "Warm · Sweet · Comforting",
    waxColor: "#ffddc8", // Soft warm pink/cream
    swatchColor: "#f7d6c8",
    notes: "A rich creamy vanilla fragrance that creates a cozy, relaxing atmosphere perfect for winding down and feeling at home."
  },
  "Cherry Blossom": {
    name: "Cherry Blossom",
    descriptors: "Floral · Fresh · Calming",
    waxColor: "#e8dbfc", // Soft purple/lilac
    swatchColor: "#decbf6",
    notes: "A soft floral scent inspired by peaceful, feminine, and refreshing moments."
  },
  "Lady Luxury": {
    name: "Lady Luxury",
    descriptors: "Bold · Elegant · Sophisticated",
    waxColor: "#e5ccd5", // Soft mauve
    swatchColor: "#d2b1bf",
    notes: "A rich luxurious fragrance designed to feel classy, confident, and unforgettable."
  }
};

const PRODUCTS = {
  "tin-jar": {
    id: "tin-jar",
    containerType: "Aluminium Tin Jar",
    price: "Ksh. 1,100",
    defaultScent: "Creamy Vanilla"
  },
  "glass-jar": {
    id: "glass-jar",
    containerType: "Glass Jar",
    price: "Ksh. 800",
    defaultScent: "Creamy Vanilla"
  }
};

// State to track selected scents per product card
const productSelections = {
  "tin-jar": "Creamy Vanilla",
  "glass-jar": "Creamy Vanilla"
};

// 2. Initialize App
function initApp() {
  initProductSwatches();
  initWhatsAppCTAs();
  initQuiz();
  initReviews();
  initScrollAnimations();
  initMobileMenu();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// 3. Product Swatch Interactivity
function initProductSwatches() {
  const productCards = document.querySelectorAll(".product-card");
  
  productCards.forEach(card => {
    const productId = card.dataset.productId;
    const swatches = card.querySelectorAll(".swatch");
    const scentDesc = card.querySelector(".product-scent-desc");
    const scentNotes = card.querySelector(".product-scent-notes");
    const waxIndicator = card.querySelector(".wax-color-dot");
    const orderBtn = card.querySelector(".order-whatsapp-btn");

    swatches.forEach(swatch => {
      swatch.addEventListener("click", () => {
        // Remove active class from all swatches in this card
        swatches.forEach(s => s.classList.remove("active"));
        // Add active class to clicked swatch
        swatch.classList.add("active");

        const scentName = swatch.dataset.scent;
        productSelections[productId] = scentName;

        // Update card details based on selected scent
        const scentData = SCENTS[scentName];
        if (scentData) {
          scentDesc.textContent = scentData.descriptors;
          scentNotes.textContent = scentData.notes;
          
          if (waxIndicator) {
            waxIndicator.style.backgroundColor = scentData.waxColor;
            waxIndicator.setAttribute("title", `Wax Color: ${scentName}`);
          }

          // Update WhatsApp link parameters dynamically
          const productData = PRODUCTS[productId];
          updateWhatsAppLink(orderBtn, productData.containerType, scentName, productData.price);
        }
      });
    });

    // Initialize first state
    const activeSwatch = card.querySelector(".swatch.active");
    if (activeSwatch) {
      activeSwatch.click();
    }
  });
}

// 4. WhatsApp Link Building
function updateWhatsAppLink(buttonElement, containerType, scentName, price) {
  const message = `Hi Aura by Serah, I would like to order the ${containerType} in the ${scentName} scent for ${price}. Please let me know about delivery!`;
  const encodedMessage = encodeURIComponent(message);
  buttonElement.setAttribute("href", `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`);
}

function initWhatsAppCTAs() {
  // General Inquiry Buttons
  const generalBtns = document.querySelectorAll("[data-whatsapp-general]");
  generalBtns.forEach(btn => {
    const message = "Hi Aura by Serah, I visited your website and would love to ask a few questions about your candles!";
    btn.setAttribute("href", `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`);
  });

  // Gift Order Button
  const giftBtn = document.querySelector("[data-whatsapp-gift]");
  if (giftBtn) {
    const message = "Hi Aura by Serah, I would like to order a customized candle gift set. Please let me know about packaging options and delivery details!";
    giftBtn.setAttribute("href", `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`);
  }
}

// 5. Interactive Scent Finder Quiz
function initQuiz() {
  const quizContainer = document.getElementById("quiz-container");
  if (!quizContainer) return;

  const slides = quizContainer.querySelectorAll(".quiz-slide");
  const nextBtns = quizContainer.querySelectorAll(".quiz-next-btn");
  const prevBtns = quizContainer.querySelectorAll(".quiz-prev-btn");
  const optionCards = quizContainer.querySelectorAll(".quiz-option");
  const resultCard = document.getElementById("quiz-result");
  const resultScentName = document.getElementById("result-scent-name");
  const resultScentDesc = document.getElementById("result-scent-desc");
  const resultScentNotes = document.getElementById("result-scent-notes");
  const resultScentDot = document.getElementById("result-scent-dot");
  const resultActionBtn = document.getElementById("result-action-btn");
  const restartBtn = document.getElementById("quiz-restart-btn");

  let currentSlideIndex = 0;
  
  // Track scent scores
  let scores = {
    "Creamy Vanilla": 0,
    "Cherry Blossom": 0,
    "Lady Luxury": 0
  };

  // Option selection
  optionCards.forEach(option => {
    option.addEventListener("click", () => {
      // Unselect siblings
      const siblingOptions = option.parentElement.querySelectorAll(".quiz-option");
      siblingOptions.forEach(opt => opt.classList.remove("selected"));
      
      // Select current
      option.classList.add("selected");

      // Go to next slide after a short delay for nice UX
      setTimeout(() => {
        navigateQuiz(1);
      }, 300);
    });
  });

  function navigateQuiz(direction) {
    // Hide current slide
    slides[currentSlideIndex].classList.remove("active");
    
    currentSlideIndex += direction;

    if (currentSlideIndex < 0) currentSlideIndex = 0;
    
    if (currentSlideIndex >= slides.length) {
      calculateResult();
    } else {
      slides[currentSlideIndex].classList.add("active");
    }
  }

  // Next and Prev click events
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => navigateQuiz(1));
  });

  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => navigateQuiz(-1));
  });

  restartBtn.addEventListener("click", () => {
    scores = { "Creamy Vanilla": 0, "Cherry Blossom": 0, "Lady Luxury": 0 };
    currentSlideIndex = 0;
    optionCards.forEach(opt => opt.classList.remove("selected"));
    resultCard.classList.remove("active");
    slides[0].classList.add("active");
  });

  function calculateResult() {
    // Collect selected options
    const selectedOptions = quizContainer.querySelectorAll(".quiz-option.selected");
    
    // Sum scores
    selectedOptions.forEach(opt => {
      const targetScent = opt.dataset.scentTarget;
      if (scores[targetScent] !== undefined) {
        scores[targetScent]++;
      }
    });

    // Find scent with highest score
    let recommendedScent = "Creamy Vanilla"; // default fallback
    let maxScore = -1;
    for (const [scent, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        recommendedScent = scent;
      }
    }

    // Display Result
    const scentInfo = SCENTS[recommendedScent];
    if (scentInfo) {
      resultScentName.textContent = scentInfo.name;
      resultScentDesc.textContent = scentInfo.descriptors;
      resultScentNotes.textContent = scentInfo.notes;
      resultScentDot.style.backgroundColor = scentInfo.waxColor;
      
      // Setup Action Button to scroll to collections and trigger selection
      resultActionBtn.textContent = `Order ${scentInfo.name} on WhatsApp`;
      
      // On click, scroll to products, auto-select this scent on all cards, and trigger WhatsApp checkout
      resultActionBtn.onclick = (e) => {
        e.preventDefault();
        
        // Auto-select this scent on all product cards
        const swatchesToActivate = document.querySelectorAll(`.swatch[data-scent="${recommendedScent}"]`);
        swatchesToActivate.forEach(s => s.click());

        // Scroll to products section
        const productsSection = document.getElementById("products");
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: "smooth" });
        }
      };

      // Show results card
      resultCard.classList.add("active");
    }
  }
}

// 6. Testimonials & Reviews (localStorage persistence)
function initReviews() {
  const reviewsContainer = document.getElementById("reviews-grid");
  const reviewForm = document.getElementById("review-form");
  
  if (!reviewsContainer) return;

  // Empty default reviews so it starts completely clean
  const defaultReviews = [];

  // Load reviews from localStorage or fallback to default, wrapped in try-catch to prevent iframe/sandboxed crashes
  let storedReviews = defaultReviews;
  try {
    const localData = localStorage.getItem("aura_user_reviews");
    if (localData) {
      storedReviews = JSON.parse(localData);
    } else {
      localStorage.setItem("aura_user_reviews", JSON.stringify(defaultReviews));
    }
  } catch (e) {
    console.warn("localStorage is not accessible. Reviews will be kept in memory.", e);
  }

  // Render Reviews
  function renderReviews() {
    reviewsContainer.innerHTML = "";
    
    if (storedReviews.length === 0) {
      reviewsContainer.innerHTML = `
        <div class="no-reviews-placeholder reveal visible" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
          <p class="placeholder-text" style="font-family: var(--font-accent); font-style: italic; font-size: 1.25rem; margin-bottom: 8px; color: var(--color-orange);">No reviews yet</p>
          <p style="font-size: 0.95rem;">Be the first to share your experience with Aura candles below!</p>
        </div>
      `;
      return;
    }
    
    storedReviews.forEach(review => {
      const card = document.createElement("div");
      card.className = "review-card reveal";
      
      // Star display
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
          starsHTML += '<span class="star filled">★</span>';
        } else {
          starsHTML += '<span class="star">☆</span>';
        }
      }

      card.innerHTML = `
        <div class="review-header">
          <div class="review-meta">
            <h4 class="review-author">${escapeHTML(review.name)}</h4>
            <span class="review-date">${escapeHTML(review.date || "Recent")}</span>
          </div>
          <div class="review-rating">${starsHTML}</div>
        </div>
        <p class="review-text">"${escapeHTML(review.comment)}"</p>
      `;
      reviewsContainer.appendChild(card);
    });
  }

  // Handle Submit
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById("review-name");
      const commentInput = document.getElementById("review-comment");
      const ratingInput = document.querySelector('input[name="rating"]:checked');
      
      if (!nameInput.value.trim() || !commentInput.value.trim() || !ratingInput) {
        alert("Please fill in all fields and select a star rating.");
        return;
      }

      const newReview = {
        name: nameInput.value.trim(),
        comment: commentInput.value.trim(),
        rating: parseInt(ratingInput.value),
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })
      };

      storedReviews.unshift(newReview); // Put newest reviews at the top
      try {
        localStorage.setItem("aura_user_reviews", JSON.stringify(storedReviews));
      } catch (e) {
        console.warn("Unable to save review to localStorage:", e);
      }
      
      // Reset form
      reviewForm.reset();
      
      // Re-render
      renderReviews();
      
      // Show success notification
      const feedbackMsg = document.createElement("p");
      feedbackMsg.className = "review-success-msg";
      feedbackMsg.textContent = "Thank you! Your review has been added.";
      reviewForm.appendChild(feedbackMsg);
      setTimeout(() => feedbackMsg.remove(), 4000);
      
      // Re-trigger scroll animations for the new elements
      initScrollAnimations();
    });
  }

  renderReviews();
}

// Helpers
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// 7. Scroll Reveal Animations (Intersection Observer)
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add("visible"));
  }
}

// 8. Mobile Navigation Menu
function initMobileMenu() {
  const burger = document.querySelector(".mobile-burger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      burger.classList.toggle("toggle");
    });

    // Close menu when clicking link
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        navLinks.classList.remove("active");
        burger.classList.remove("toggle");
      });
    });
  }
}
