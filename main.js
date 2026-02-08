"use strict";

/* ==============================
   1. SET CURRENT YEAR
   ============================== */
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ==============================
   2. MOBILE MENU TOGGLE - IMPROVED
   ============================== */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  // Toggle mobile menu
  menuToggle.addEventListener("click", function(e) {
    e.stopPropagation();
    mainNav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });
  
  // Close menu when clicking outside
  document.addEventListener("click", function(event) {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
      mainNav.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  });
  
  // Close menu when clicking a link
  document.querySelectorAll(".main-nav a").forEach(link => {
    link.addEventListener("click", function() {
      mainNav.classList.remove("active");
      menuToggle.classList.remove("active");
    });
  });
  
  // Close menu with Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      mainNav.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  });
  
  // Close menu on window resize (if resizing to desktop)
  window.addEventListener("resize", function() {
    if (window.innerWidth > 992) {
      mainNav.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  });
}

/* ==============================
   3. IMAGE SLIDER
   ============================== */
let currentImageSlide = 0;
let imageSlideInterval;

function initImageSlider() {
  const imageSlides = document.querySelectorAll(".image-slide");
  const dots = document.querySelectorAll(".slider-dots .dot");
  
  if (imageSlides.length === 0) return;
  
  // Show first slide
  imageSlides[0].classList.add("active");
  if (dots.length > 0) dots[0].classList.add("active");
  
  // Start auto-slide
  startImageSlider();
  
  // Dot click events
  dots.forEach(dot => {
    dot.addEventListener("click", function() {
      const index = parseInt(this.getAttribute("data-index"));
      goToImageSlide(index);
    });
  });
  
  // Navigation arrows
  const prevBtn = document.querySelector(".slider-nav.prev");
  const nextBtn = document.querySelector(".slider-nav.next");
  
  if (prevBtn) {
    prevBtn.addEventListener("click", function() {
      prevImageSlide();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener("click", function() {
      nextImageSlide();
    });
  }
}

function goToImageSlide(index) {
  const imageSlides = document.querySelectorAll(".image-slide");
  const dots = document.querySelectorAll(".slider-dots .dot");
  
  if (index >= imageSlides.length) index = 0;
  if (index < 0) index = imageSlides.length - 1;
  
  // Remove active class
  imageSlides[currentImageSlide].classList.remove("active");
  if (dots.length > 0) {
    dots[currentImageSlide].classList.remove("active");
  }
  
  // Update index
  currentImageSlide = index;
  
  // Add active class
  imageSlides[currentImageSlide].classList.add("active");
  if (dots.length > 0) {
    dots[currentImageSlide].classList.add("active");
  }
  
  // Restart auto-slide
  restartImageSlider();
}

function nextImageSlide() {
  const imageSlides = document.querySelectorAll(".image-slide");
  goToImageSlide((currentImageSlide + 1) % imageSlides.length);
}

function prevImageSlide() {
  const imageSlides = document.querySelectorAll(".image-slide");
  goToImageSlide((currentImageSlide - 1 + imageSlides.length) % imageSlides.length);
}

function startImageSlider() {
  imageSlideInterval = setInterval(nextImageSlide, 5000);
}

function stopImageSlider() {
  clearInterval(imageSlideInterval);
}

function restartImageSlider() {
  stopImageSlider();
  startImageSlider();
}

/* ==============================
   4. PASTOR SLIDER
   ============================== */
function initPastorSlider() {
  const pastorSlides = document.querySelectorAll(".Pastor1 .slide");
  let currentPastorSlide = 0;
  
  if (pastorSlides.length > 0) {
    pastorSlides[0].classList.add("active");
    
    setInterval(() => {
      pastorSlides[currentPastorSlide].classList.remove("active");
      currentPastorSlide = (currentPastorSlide + 1) % pastorSlides.length;
      pastorSlides[currentPastorSlide].classList.add("active");
    }, 5000);
  }
}

/* ==============================
   5. SCROLL REVEAL
   ============================== */
function initScrollReveal() {
  const sections = document.querySelectorAll(".section");
  
  function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top < trigger) {
        sec.classList.add("visible");
      }
    });
  }
  
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);
}

/* ==============================
   6. HEADER SCROLL EFFECT
   ============================== */
function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (header) {
    // Initial check
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    }
    
    window.addEventListener("scroll", function() {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }
}

/* ==============================
   7. SMOOTH SCROLL FOR ANCHOR LINKS ONLY
   ============================== */
function initSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      
      // Only handle anchor links that exist on current page
      if (href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: top,
            behavior: "smooth"
          });
          
          // Update URL without page reload
          history.pushState(null, null, href);
        }
        // If target doesn't exist, let browser handle it
      }
      // For page links (href="info.html"), do nothing - they work normally
    });
  });
}

/* ==============================
   8. ACTIVE LINK HIGHLIGHT
   ============================== */
function highlightActiveLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-link");
  const hash = window.location.hash;
  
  links.forEach(link => {
    link.classList.remove("active");
    
    // Check for page links
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
    
    // Check for anchor links on current page
    if (hash && link.getAttribute("href") === hash) {
      link.classList.add("active");
    }
  });
}

/* ==============================
   9. TOUCH SWIPE FOR MOBILE SLIDER
   ============================== */
function initTouchSwipe() {
  const imageBox = document.querySelector(".image-box");
  if (!imageBox) return;
  
  let startX = 0;
  let endX = 0;
  
  imageBox.addEventListener("touchstart", function(e) {
    startX = e.touches[0].clientX;
  });
  
  imageBox.addEventListener("touchend", function(e) {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next slide
        nextImageSlide();
      } else {
        // Swipe right - previous slide
        prevImageSlide();
      }
    }
  });
}

/* ==============================
   10. RESPONSIVE NAVIGATION
   ============================== */
function initResponsiveNav() {
  // Check if mobile menu should be shown
  function checkMobileMenu() {
    if (window.innerWidth <= 992) {
      // Mobile view
      if (menuToggle) menuToggle.style.display = "block";
      if (mainNav) mainNav.style.display = "none";
    } else {
      // Desktop view
      if (menuToggle) menuToggle.style.display = "none";
      if (mainNav) {
        mainNav.style.display = "flex";
        mainNav.classList.remove("active");
      }
    }
  }
  
  // Initial check
  checkMobileMenu();
  
  // Check on resize
  window.addEventListener("resize", checkMobileMenu);
}

/* ==============================
   11. INITIALIZE EVERYTHING
   ============================== */
document.addEventListener("DOMContentLoaded", function() {
  initImageSlider();
  initPastorSlider();
  initScrollReveal();
  initHeaderScroll();
  initSmoothScroll();
  initTouchSwipe();
  initResponsiveNav();
  highlightActiveLink();
  
  // Initialize donation system
  setTimeout(initDonationSystem, 100);
  
  // Pause image slider on hover (desktop only)
  const imageBox = document.querySelector(".image-box");
  if (imageBox && window.innerWidth > 768) {
    imageBox.addEventListener("mouseenter", stopImageSlider);
    imageBox.addEventListener("mouseleave", startImageSlider);
  }
  
  // Update active link on hash change
  window.addEventListener("hashchange", highlightActiveLink);
  
  // Update active link on popstate (back/forward buttons)
  window.addEventListener("popstate", highlightActiveLink);
});

// Simple contact form
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    this.reset();
  });
}

// ============================================
// DOMINANT DONATION SYSTEM WITH REAL LOGOS
// ============================================

// Configuration - These are the links you'll replace later
const PAYMENT_LINKS = {
    // LIVE & SAFE PAYMENT LINKS (UGANDA)

centenary: '#donate', 
// Use this to scroll to your bank details section on the page
// (recommended for bank donations)

mtn: 'tel:*165#', 
// Opens MTN Mobile Money menu on phones

airtel: 'tel:*185#', 
// Opens Airtel Money menu on phones

flutterwave: 'https://flutterwave.com'
// Replace later with your actual Flutterwave checkout link
};

// Global donation variables
let donationModal;
let selectedPaymentMethod = 'flutterwave';
let selectedAmount = 0;
let selectedType = 'tithe';

// Create donation modal HTML with REAL LOGOS
function createDonationModal() {
    const modalHTML = `
        <div class="donation-modal" id="donationModal">
            <div class="modal-content">
                <button class="modal-close" id="modalClose">&times;</button>
                
                <div class="modal-header">
                    <h2><i class="fas fa-heart"></i> Support Our Ministry</h2>
                    <p>Your generous donation helps us continue God's work</p>
                </div>
                
                <div class="modal-body">
                    <!-- Payment Method Selection -->
                    <div class="payment-method">
                        <h3>Choose Payment Method</h3>
                        <div class="payment-options">
                          <!-- <div class="payment-option active" data-method="flutterwave">
                                <div class="real-logo"></div>
                                <span class="payment-name">Flutterwave</span>
                            </div> -->
                            <div class="payment-option" data-method="centenary">
                                <div class="real-logo"></div>
                                <span class="payment-name">Centenary Bank</span>
                            </div>
                            <div class="payment-option" data-method="mtn">
                                <div class="real-logo"></div>
                                <span class="payment-name">MTN Mobile Money</span>
                            </div>
                            <div class="payment-option" data-method="airtel">
                                <div class="real-logo"></div>
                                <span class="payment-name">Airtel Money</span>
                            </div>
                        </div>
                    </div>
                    
                    
                        
                        <div class="custom-amount">
                            <input type="number" id="customAmount" placeholder="Enter Custom Amount (UGX)" min="1000">
                        </div>
                    </div>
                    
                    <!-- Donation Type -->
                    <div class="donation-type">
                        <h3>Donation Type</h3>
                        <div class="type-options">
                            <label class="type-option">
                                <input type="radio" name="donationType" value="tithe" checked>
                                <span class="type-label">Tithe</span>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="donationType" value="offering">
                                <span class="type-label">Offering</span>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="donationType" value="building">
                                <span class="type-label">Building Fund</span>
                            </label>
                            <label class="type-option">
                                <input type="radio" name="donationType" value="mission">
                                <span class="type-label">Missions</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Payment Instructions -->
                    <div id="paymentInstructions">
                        <!-- Instructions will be shown based on selected payment method -->
                    </div>
                    
                    <button class="proceed-btn" id="proceedDonation">
                        <i class="fas fa-lock"></i> Proceed to Payment
                    </button>
                    
                    <p class="security-note">
                        <i class="fas fa-shield-alt"></i> Secure & Encrypted Payment
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Show payment instructions based on selected method
function showPaymentInstructions(method) {
    const instructionsDiv = document.getElementById('paymentInstructions');
    
    const instructions = {
        mtn: `
            <div class="mobile-money-instructions">
                <h4><i class="fas fa-mobile-alt"></i> MTN Mobile Money Instructions</h4>
                <p>1. Dial <span class="ussd-code">*165*3#</span> on your phone</p>
                <p>2. Select "Send Money"</p>
                <p>3. Enter our merchant number: <strong>0774 458 786</strong></p>
                <p>4. Enter amount: <strong>UGX ${selectedAmount.toLocaleString()}</strong></p>
                <p>5. Enter your PIN to complete</p>
                <p style="color: #666; font-size: 0.9rem; margin-top: 10px;">
                    <i class="fas fa-info-circle"></i> Transaction fee may apply
                </p>
            </div>
        `,
        
        airtel: `
            <div class="mobile-money-instructions">
                <h4><i class="fas fa-mobile-alt"></i> Airtel Money Instructions</h4>
                <p>1. Dial <span class="ussd-code">*185*9#</span> on your phone</p>
                <p>2. Select "Send Money"</p>
                <p>3. Enter our merchant number: <strong>0700 592 303</strong></p>
                <p>4. Enter amount: <strong>UGX ${selectedAmount.toLocaleString()}</strong></p>
                <p>5. Enter your PIN to complete</p>
                <p style="color: #666; font-size: 0.9rem; margin-top: 10px;">
                    <i class="fas fa-info-circle"></i> Transaction fee may apply
                </p>
            </div>
        `,
        
        centenary: `
            <div class="bank-details">
                <h4><i class="fas fa-university"></i> Centenary Bank Details</h4>
                <div class="bank-info">
                    <p><strong>Account Name:</strong> Glory of Christ Church</p>
                    <p><strong>Account Number:</strong> 200210030471</p>
                    <p><strong>Bank:</strong> Centenary Bank</p>
                    <p><strong>Branch:</strong> Wakiso Main</p>
                    <p><strong>Swift Code:</strong> CERBUGKA</p>
                    <p><strong>Amount:</strong> UGX ${selectedAmount.toLocaleString()}</p>
                </div>
                <p style="color: #666; font-size: 0.9rem; margin-top: 10px;">
                    <i class="fas fa-info-circle"></i> Use your name as reference
                </p>
            </div>
        ,
     
        `
    };
    
    instructionsDiv.innerHTML = instructions[method] || instructions.flutterwave;
}

// Setup donation system
function setupDonationSystem() {
    // Create modal if it doesn't exist
    if (!document.getElementById('donationModal')) {
        createDonationModal();
    }
    
    donationModal = document.getElementById('donationModal');
    
    // Setup donate buttons
    const donateButtons = document.querySelectorAll('.donate-main-btn, #donateButton, [href="#donate"]');
    
    donateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openDonationModal();
        });
    });
    
    // Modal close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeDonationModal);
    }
    
    // Close modal when clicking outside
    donationModal.addEventListener('click', function(e) {
        if (e.target === donationModal) {
            closeDonationModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && donationModal.classList.contains('active')) {
            closeDonationModal();
        }
    });
    
    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedPaymentMethod = this.dataset.method;
            
            // Show instructions for selected method
            showPaymentInstructions(selectedPaymentMethod);
        });
    });
    
    // Amount selection
    const amountButtons = document.querySelectorAll('.amount-btn');
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedAmount = parseInt(this.dataset.amount);
            document.getElementById('customAmount').value = '';
            
            // Update instructions with new amount
            showPaymentInstructions(selectedPaymentMethod);
        });
    });
    
    // Custom amount input
    const customAmountInput = document.getElementById('customAmount');
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            if (this.value) {
                amountButtons.forEach(btn => btn.classList.remove('active'));
                selectedAmount = parseInt(this.value) || 0;
                
                // Update instructions with new amount
                showPaymentInstructions(selectedPaymentMethod);
            }
        });
    }
    
    // Donation type selection
    const typeInputs = document.querySelectorAll('input[name="donationType"]');
    typeInputs.forEach(input => {
        input.addEventListener('change', function() {
            selectedType = this.value;
        });
    });
    
    // Proceed to payment button
    const proceedBtn = document.getElementById('proceedDonation');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', processDonation);
    }
    
    // Show initial instructions
    showPaymentInstructions(selectedPaymentMethod);
}

// Setup floating donate button
function setupFloatingButton() {
    // Create floating button if it doesn't exist
    if (!document.getElementById('floatingDonateBtn')) {
        const floatingBtnHTML = `
            <div class="donate-floating-btn" id="floatingDonateBtn">
                <button class="btn">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', floatingBtnHTML);
    }
    
    const floatingBtn = document.getElementById('floatingDonateBtn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', openDonationModal);
    }
}

// Setup quick donate buttons
function setupQuickDonateButtons() {
    const quickButtons = document.querySelectorAll('.quick-donate-btn');
    quickButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const method = this.dataset.method;
            const amount = this.dataset.amount;
            
            selectedPaymentMethod = method;
            selectedAmount = parseInt(amount);
            
            showDemoRedirect(method, amount);
        });
    });
}

// Open donation modal
function openDonationModal() {
    donationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close donation modal
function closeDonationModal() {
    donationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Process donation
function processDonation() {
    // Validate amount
    if (selectedAmount <= 0) {
        const customAmount = document.getElementById('customAmount').value;
        if (customAmount) {
            selectedAmount = parseInt(customAmount);
        }
        
        if (selectedAmount <= 0) {
            alert('Please select or enter a donation amount.');
            return;
        }
    }
    
    // Show demo redirect
    showDemoRedirect(selectedPaymentMethod, selectedAmount, selectedType);
}

// Show demo redirect with real logos
function showDemoRedirect(method, amount, type = 'donation') {
    const demoLink = PAYMENT_LINKS[method] || PAYMENT_LINKS.flutterwave;
    const formattedAmount = amount.toLocaleString();
    
    // Brand colors
    const brandColors = {
        mtn: '#FFCC00',
        airtel: '#E40000',
        centenary: '#0033A0',
        flutterwave: '#F5A623'
    };
    
    // Brand names
    const brandNames = {
        mtn: 'MTN Mobile Money',
        airtel: 'Airtel Money',
        centenary: 'Centenary Bank',
        flutterwave: 'Flutterwave'
    };
    
    const demoHTML = `
        <div class="donation-modal active" id="demoRedirect">
            <div class="modal-content" style="max-width: 450px;">
                <div class="modal-header" style="background: ${brandColors[method] || '#094a8c'}">
                    <h2><i class="fas fa-external-link-alt"></i> ${brandNames[method]} Payment</h2>
                    <p>This is a demo. You'll be redirected to payment page.</p>
                </div>
                
                <div class="modal-body" style="text-align: center;">
                    <div class="demo-logo-display">
                        <div class="demo-logo mtn">MTN</div>
                        <div class="demo-logo airtel">airtel</div>
                        <div class="demo-logo centenary">Centenary</div>
                        <div class="demo-logo flutterwave">Flutterwave</div>
                    </div>
                    
                    <h3>Payment Summary</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                            <div class="demo-logo ${method}" style="width: 60px; height: 30px;">
                                ${method.toUpperCase().substring(0, 3)}
                            </div>
                            <h4 style="margin: 0;">${brandNames[method]}</h4>
                        </div>
                        <p><strong>Amount:</strong> UGX ${formattedAmount}</p>
                        <p><strong>Type:</strong> ${type}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: left;">
                        <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 1rem;">
                            <i class="fas fa-info-circle"></i> Demo Mode Active
                        </h4>
                        <p style="color: #856404; margin: 0; font-size: 0.9rem;">
                            In the live version, this will redirect to actual ${brandNames[method]} payment gateway.
                            You'll need to replace the demo links with:
                        </p>
                        <ul style="color: #856404; margin: 10px 0 0 20px; font-size: 0.9rem;">
                            <li>Actual MTN merchant code/USSD</li>
                            <li>Actual Airtel merchant code/USSD</li>
                            <li>Actual Centenary Bank account details</li>
                            <li>Actual Flutterwave payment link</li>
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="closeDemoRedirect()" style="flex: 1; padding: 15px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button onclick="redirectToDemo()" style="flex: 1; padding: 15px; background: ${brandColors[method] || '#094a8c'}; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-external-link-alt"></i> Continue to Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.demoPaymentData = { method, amount, type, demoLink, brandName: brandNames[method] };
    document.body.insertAdjacentHTML('beforeend', demoHTML);
    closeDonationModal();
}

// Close demo redirect
function closeDemoRedirect() {
    const demoModal = document.getElementById('demoRedirect');
    if (demoModal) {
        demoModal.remove();
    }
}

// Redirect to demo link
function redirectToDemo() {
    if (window.demoPaymentData && window.demoPaymentData.demoLink) {
        // Show alert and open demo link
        alert(`Demo: Would redirect to ${window.demoPaymentData.method} payment gateway\n\nAmount: UGX ${window.demoPaymentData.amount.toLocaleString()}\n\nActual links to be added:\n1. Centenary Bank URL\n2. MTN Mobile Money URL\n3. Airtel Money URL\n4. Flutterwave URL`);
        
        // Open demo link in new tab
        window.open(window.demoPaymentData.demoLink, '_blank');
        
        // Close demo modal
        closeDemoRedirect();
        
        // Show thank you message
        showThankYouMessage(window.demoPaymentData);
    }
}

// Show thank you message
function showThankYouMessage(paymentData) {
    const thankYouHTML = `
        <div class="donation-modal active" id="thankYouModal">
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2><i class="fas fa-check-circle"></i> Thank You!</h2>
                    <p>Your donation is being processed</p>
                </div>
                
                <div class="modal-body" style="text-align: center;">
                    <div style="font-size: 4rem; color: #28a745; margin: 20px 0; animation: bounce 1s;">
                        <i class="fas fa-heart"></i>
                    </div>
                    
                    <h3>Donation Summary</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>Reference:</strong> GOC${Date.now().toString().slice(-8)}</p>
                        <p><strong>Amount:</strong> UGX ${paymentData.amount.toLocaleString()}</p>
                        <p><strong>Method:</strong> ${paymentData.method.toUpperCase()}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <p style="color: #666; margin-bottom: 20px;">
                        <i class="fas fa-envelope"></i> 
                        A confirmation email will be sent (in live version).
                    </p>
                    
                    <button onclick="closeThankYouModal()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #094a8c, #2563eb); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Done
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', thankYouHTML);
}

// Close thank you modal
function closeThankYouModal() {
    const thankYouModal = document.getElementById('thankYouModal');
    if (thankYouModal) {
        thankYouModal.remove();
    }
}

// Initialize donation system
function initDonationSystem() {
    setupDonationSystem();
    setupFloatingButton();
    setupQuickDonateButtons();
}

// Make functions globally available
window.closeDemoRedirect = closeDemoRedirect;
window.redirectToDemo = redirectToDemo;
window.closeThankYouModal = closeThankYouModal;


//last added
