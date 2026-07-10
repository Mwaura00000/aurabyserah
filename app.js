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
  initOrderList();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// 3. Product Swatch Interactivity & Card Quantity
function initProductSwatches() {
  const productCards = document.querySelectorAll(".product-card");
  
  productCards.forEach(card => {
    const productId = card.dataset.productId;
    const swatches = card.querySelectorAll(".swatch");
    const scentDesc = card.querySelector(".product-scent-desc");
    const scentNotes = card.querySelector(".product-scent-notes");
    const waxIndicator = card.querySelector(".wax-color-dot");
    const orderBtn = card.querySelector(".order-whatsapp-btn");
    
    // Card Quantity details
    const qtyMinus = card.querySelector(".qty-minus");
    const qtyPlus = card.querySelector(".qty-plus");
    const qtyValue = card.querySelector(".qty-value");
    const addToOrderBtn = card.querySelector(".add-to-order-btn");
    
    let localQty = 1;

    const triggerLinkUpdate = () => {
      const scentName = productSelections[productId];
      const productData = PRODUCTS[productId];
      updateWhatsAppLink(orderBtn, productData.containerType, scentName, productData.price, localQty);
    };

    if (qtyMinus && qtyPlus && qtyValue) {
      qtyMinus.addEventListener("click", (e) => {
        e.preventDefault();
        if (localQty > 1) {
          localQty--;
          qtyValue.textContent = localQty;
          triggerLinkUpdate();
        }
      });

      qtyPlus.addEventListener("click", (e) => {
        e.preventDefault();
        localQty++;
        qtyValue.textContent = localQty;
        triggerLinkUpdate();
      });
    }

    if (addToOrderBtn) {
      addToOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const scentName = productSelections[productId];
        const productData = PRODUCTS[productId];
        
        addToOrder(productData.containerType, scentName, localQty, productData.price);
        
        // Reset card state
        localQty = 1;
        if (qtyValue) qtyValue.textContent = "1";
        triggerLinkUpdate();
        
        // Brief button feedback
        const originalText = addToOrderBtn.textContent;
        addToOrderBtn.textContent = "Added! ✓";
        addToOrderBtn.disabled = true;
        addToOrderBtn.style.backgroundColor = "var(--color-light-cyan)";
        addToOrderBtn.style.color = "var(--color-dark-red)";
        setTimeout(() => {
          addToOrderBtn.textContent = originalText;
          addToOrderBtn.disabled = false;
          addToOrderBtn.style.backgroundColor = "";
          addToOrderBtn.style.color = "";
        }, 1000);
      });
    }

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

          triggerLinkUpdate();
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
function updateWhatsAppLink(buttonElement, containerType, scentName, price, quantity = 1) {
  const qtyPrefix = quantity > 1 ? `${quantity}x ` : "";
  const suffix = quantity > 1 ? " each" : "";
  const message = `Hi Aura by Serah, I would like to order ${qtyPrefix}${containerType} in the ${scentName} scent for ${price}${suffix}. Please let me know about delivery!`;
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
  const backdrop = document.getElementById("nav-backdrop");

  const toggleMenu = () => {
    navLinks.classList.toggle("active");
    burger.classList.toggle("toggle");
    if (backdrop) {
      backdrop.classList.toggle("active");
    }
  };

  const closeMenu = () => {
    navLinks.classList.remove("active");
    burger.classList.remove("toggle");
    if (backdrop) {
      backdrop.classList.remove("active");
    }
  };

  if (burger && navLinks) {
    burger.addEventListener("click", toggleMenu);

    // Close menu when clicking link
    navItems.forEach(item => {
      item.addEventListener("click", closeMenu);
    });

    // Close menu when clicking backdrop
    if (backdrop) {
      backdrop.addEventListener("click", closeMenu);
    }
  }
}

// 9. Order List / Shopping Cart Management (In-Memory)
let orderList = [];

function initOrderList() {
  const pill = document.getElementById("order-summary-pill");
  const overlay = document.getElementById("order-modal-overlay");
  const closeBtn = document.getElementById("order-modal-close-btn");
  const continueBtn = document.getElementById("order-modal-continue-shopping");

  if (pill && overlay) {
    pill.addEventListener("click", () => {
      overlay.classList.add("active");
    });
  }

  const closeModal = () => {
    if (overlay) {
      overlay.classList.remove("active");
    }
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (continueBtn) continueBtn.addEventListener("click", closeModal);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }

  renderOrderSummary();
}

function addToOrder(containerType, scent, quantity, price) {
  // Check if combination already exists
  const existingIndex = orderList.findIndex(item => item.containerType === containerType && item.scent === scent);
  
  if (existingIndex > -1) {
    orderList[existingIndex].quantity += quantity;
  } else {
    orderList.push({
      id: `${containerType}-${scent}`.replace(/\s+/g, '-').toLowerCase(),
      containerType,
      scent,
      quantity,
      price
    });
  }
  
  renderOrderSummary();
}

function updateOrderQuantity(itemId, change) {
  const index = orderList.findIndex(item => item.id === itemId);
  if (index > -1) {
    orderList[index].quantity += change;
    if (orderList[index].quantity <= 0) {
      orderList.splice(index, 1);
    }
    renderOrderSummary();
  }
}

function removeFromOrder(itemId) {
  const index = orderList.findIndex(item => item.id === itemId);
  if (index > -1) {
    orderList.splice(index, 1);
    renderOrderSummary();
  }
}

function renderOrderSummary() {
  const pill = document.getElementById("order-summary-pill");
  const pillText = document.getElementById("summary-pill-text");
  const itemsList = document.getElementById("order-items-list");
  const totalVal = document.getElementById("order-total-value");
  const checkoutBtn = document.getElementById("order-modal-whatsapp-checkout");
  
  // Calculate totals
  let totalItemsCount = 0;
  let grandTotal = 0;
  
  orderList.forEach(item => {
    totalItemsCount += item.quantity;
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
    grandTotal += priceNum * item.quantity;
  });

  // Update Floating Pill
  if (pillText) {
    pillText.textContent = `${totalItemsCount} item${totalItemsCount > 1 ? 's' : ''} — Review Order`;
  }
  
  if (pill) {
    if (orderList.length > 0) {
      pill.classList.add("visible");
    } else {
      pill.classList.remove("visible");
    }
  }

  // Populate Modal Items List
  if (itemsList) {
    if (orderList.length === 0) {
      itemsList.innerHTML = `
        <div class="empty-order-msg">
          <p class="empty-order-text">Your list is empty</p>
          <p>Add some candles to start your order!</p>
        </div>
      `;
    } else {
      itemsList.innerHTML = "";
      orderList.forEach(item => {
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
        const lineTotal = priceNum * item.quantity;
        const suffix = item.quantity > 1 ? " each" : "";

        const row = document.createElement("div");
        row.className = "order-item-row";
        row.innerHTML = `
          <div class="order-item-details">
            <h4 class="order-item-title">${item.containerType}</h4>
            <span class="order-item-scent">${item.scent} scent</span>
            <div class="order-item-math">
              <div class="order-item-qty-controls">
                <button type="button" class="order-item-qty-btn" onclick="updateOrderQuantity('${item.id}', -1)">-</button>
                <span class="order-item-qty-val">${item.quantity}</span>
                <button type="button" class="order-item-qty-btn" onclick="updateOrderQuantity('${item.id}', 1)">+</button>
              </div>
              <span class="order-item-price">${item.price}${suffix}</span>
            </div>
          </div>
          <div class="order-item-right">
            <span class="order-item-total">Ksh. ${lineTotal.toLocaleString()}</span>
            <button type="button" class="order-item-remove" onclick="removeFromOrder('${item.id}')">Remove</button>
          </div>
        `;
        itemsList.appendChild(row);
      });
    }
  }

  // Update Modal Grand Total
  if (totalVal) {
    totalVal.textContent = `Ksh. ${grandTotal.toLocaleString()}`;
  }

  // Update WhatsApp Checkout Link
  if (checkoutBtn) {
    if (orderList.length === 0) {
      checkoutBtn.setAttribute("href", "#");
      checkoutBtn.style.pointerEvents = "none";
      checkoutBtn.style.opacity = "0.5";
    } else {
      checkoutBtn.style.pointerEvents = "auto";
      checkoutBtn.style.opacity = "1";
      
      let message = "Hi Aura by Serah, I would like to order:\n";
      orderList.forEach(item => {
        const suffix = item.quantity > 1 ? " each" : "";
        message += `${item.quantity}x ${item.containerType} - ${item.scent} - ${item.price}${suffix}\n`;
      });
      message += `Total: Ksh. ${grandTotal.toLocaleString()}\n\nPlease let me know about delivery!`;
      
      checkoutBtn.setAttribute("href", `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`);
    }
  }
}

// Bind functions to window so they are globally accessible from inline onclick events
window.updateOrderQuantity = updateOrderQuantity;
window.removeFromOrder = removeFromOrder;
