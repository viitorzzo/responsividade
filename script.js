// Global variables
let currentTestimonial = 0;
let testimonialInterval;
let isScrolling = false;

// DOM elements
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const themeToggle = document.getElementById("theme-toggle");
const loadingScreen = document.getElementById("loading-screen");
const backToTop = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const serviceModal = document.getElementById("service-modal");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// Main initialization function
function initializeApp() {
  // Hide loading screen
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  }, 1500);

  // Initialize all components
  initializeNavigation();
  initializeTheme();
  initializeScrollEffects();
  initializeAnimations();
  initializeTestimonials();
  initializePortfolio();
  initializeContactForm();
  initializeServiceModals();
  initializeAccessibility();

  // Performance optimizations
  optimizeImages();
  preloadCriticalResources();
}

// Navigation functionality
function initializeNavigation() {
  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", toggleMobileMenu);
    navToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMobileMenu();
      }
    });
  }

  // Close mobile menu when clicking on links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  // Smooth scrolling for navigation links - FIX: Check for valid href
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      // Skip empty or invalid hrefs
      if (!href || href === "#" || href.length <= 1) {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        smoothScrollTo(target);
      }
    });
  });
}

function toggleMobileMenu() {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
  navToggle.setAttribute("aria-expanded", navMenu.classList.contains("active"));

  // Prevent body scroll when menu is open
  document.body.style.overflow = navMenu.classList.contains("active")
    ? "hidden"
    : "";
}

function closeMobileMenu() {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

// Theme functionality
function initializeTheme() {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  // Theme toggle functionality
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Update theme toggle icon
  if (themeToggle) {
    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
    }
  }
}

// Scroll effects
function initializeScrollEffects() {
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

function handleScroll() {
  const scrollY = window.pageYOffset;

  // Navbar scroll effect
  if (navbar) {
    if (scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Back to top button
  if (backToTop) {
    if (scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  // Update scroll progress
  updateScrollProgress();

  // Parallax effects
  updateParallaxEffects(scrollY);
}

function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.offsetHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  // Update progress bar if it exists
  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    progressBar.style.width = scrollPercent + "%";
  }
}

function updateParallaxEffects(scrollY) {
  // Hero parallax
  const heroShapes = document.querySelectorAll(".hero-bg-shapes .shape");
  heroShapes.forEach((shape, index) => {
    const speed = 0.5 + index * 0.1;
    shape.style.transform = `translateY(${scrollY * speed}px) rotate(${
      scrollY * 0.05
    }deg)`;
  });

  // Floating cards parallax
  const floatingCards = document.querySelectorAll(".floating-card");
  floatingCards.forEach((card, index) => {
    const speed = 0.3 + index * 0.1;
    const currentTransform = card.style.transform || "";
    const translateY = scrollY * speed;
    card.style.transform =
      currentTransform.replace(/translateY$$[^)]*$$/, "") +
      ` translateY(${translateY}px)`;
  });
}

// Smooth scrolling function
function smoothScrollTo(target) {
  const targetPosition = target.offsetTop - 70; // Account for fixed navbar
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 800;
  let start = null;

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Back to top functionality
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Scroll to section function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    smoothScrollTo(section);
  }
}

// Animation system
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate");

        // Trigger specific animations
        if (entry.target.classList.contains("stats")) {
          animateStats();
        }

        if (entry.target.classList.contains("hero")) {
          animateHeroElements();
        }
      }
    });
  }, observerOptions);

  // Observe all elements with data-aos attribute
  document.querySelectorAll("[data-aos]").forEach((el) => {
    observer.observe(el);
  });

  // Observe sections for general animations
  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });
}

// Stats counter animation
function animateStats() {
  const stats = document.querySelectorAll(".stat-number[data-target]");

  stats.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        stat.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target;
      }
    };

    updateCounter();
  });
}

// Hero elements animation
function animateHeroElements() {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle && !heroTitle.classList.contains("animated")) {
    heroTitle.classList.add("animated");
    // Add any specific hero animations here
  }
}

// Portfolio functionality
function initializePortfolio() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      const filterValue = button.getAttribute("data-filter");

      // Filter portfolio items
      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        const shouldShow = filterValue === "all" || category === filterValue;

        if (shouldShow) {
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 10);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

// Testimonials functionality
function initializeTestimonials() {
  const testimonials = document.querySelectorAll(".testimonial-item");
  const dots = document.querySelectorAll(".nav-dot");

  if (testimonials.length === 0) return;

  // Auto-rotate testimonials
  startTestimonialRotation();

  // Pause on hover
  const testimonialContainer = document.querySelector(".testimonials-slider");
  if (testimonialContainer) {
    testimonialContainer.addEventListener(
      "mouseenter",
      stopTestimonialRotation
    );
    testimonialContainer.addEventListener(
      "mouseleave",
      startTestimonialRotation
    );
  }
}

function showTestimonial(index) {
  const testimonials = document.querySelectorAll(".testimonial-item");
  const dots = document.querySelectorAll(".nav-dot");

  // Hide all testimonials
  testimonials.forEach((testimonial) => {
    testimonial.classList.remove("active");
  });

  // Remove active class from all dots
  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  // Show selected testimonial
  if (testimonials[index]) {
    testimonials[index].classList.add("active");
  }

  if (dots[index]) {
    dots[index].classList.add("active");
  }

  currentTestimonial = index;
}

function nextTestimonial() {
  const testimonials = document.querySelectorAll(".testimonial-item");
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

function prevTestimonial() {
  const testimonials = document.querySelectorAll(".testimonial-item");
  currentTestimonial =
    currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1;
  showTestimonial(currentTestimonial);
}

function startTestimonialRotation() {
  stopTestimonialRotation();
  testimonialInterval = setInterval(nextTestimonial, 5000);
}

function stopTestimonialRotation() {
  if (testimonialInterval) {
    clearInterval(testimonialInterval);
  }
}

// Contact form functionality
function initializeContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", handleFormSubmission);

  // Real-time validation
  const inputs = contactForm.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearFieldError(input));
  });

  // Phone number formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", formatPhoneNumber);
  }
}

function handleFormSubmission(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;

  // Show loading state
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitButton.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    showNotification(
      "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      "success"
    );
    contactForm.reset();
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }, 2000);
}

function validateForm() {
  const requiredFields = contactForm.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let errorMessage = "";

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    errorMessage = "Este campo é obrigatório.";
    isValid = false;
  }

  // Email validation
  if (fieldName === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = "Por favor, insira um email válido.";
      isValid = false;
    }
  }

  // Phone validation
  if (fieldName === "phone" && value) {
    const phoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(value)) {
      errorMessage = "Por favor, insira um telefone válido.";
      isValid = false;
    }
  }

  // Name validation
  if (fieldName === "name" && value) {
    if (value.length < 2) {
      errorMessage = "Nome deve ter pelo menos 2 caracteres.";
      isValid = false;
    }
  }

  // Message validation
  if (fieldName === "message" && value) {
    if (value.length < 10) {
      errorMessage = "Mensagem deve ter pelo menos 10 caracteres.";
      isValid = false;
    }
  }

  // Privacy checkbox validation
  if (fieldName === "privacy" && field.type === "checkbox") {
    if (!field.checked) {
      errorMessage = "Você deve aceitar os termos de privacidade.";
      isValid = false;
    }
  }

  showFieldError(field, errorMessage);
  return isValid;
}

function showFieldError(field, message) {
  const errorElement = document.getElementById(field.name + "-error");
  if (errorElement) {
    errorElement.textContent = message;
    field.classList.toggle("error", !!message);
  }
}

function clearFieldError(field) {
  const errorElement = document.getElementById(field.name + "-error");
  if (errorElement) {
    errorElement.textContent = "";
    field.classList.remove("error");
  }
}

function formatPhoneNumber(e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length >= 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (value.length >= 10) {
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (value.length >= 6) {
    value = value.replace(/(\d{2})(\d{4})/, "($1) $2");
  } else if (value.length >= 2) {
    value = value.replace(/(\d{2})/, "($1) ");
  }

  e.target.value = value;
}

// Service modals
function initializeServiceModals() {
  // Close modal when clicking outside
  if (serviceModal) {
    serviceModal.addEventListener("click", (e) => {
      if (e.target === serviceModal) {
        closeServiceModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      serviceModal &&
      serviceModal.classList.contains("active")
    ) {
      closeServiceModal();
    }
  });
}

function openServiceModal(serviceType) {
  if (!serviceModal) return;

  const modalTitle = serviceModal.querySelector("#modal-title");
  const modalBody = serviceModal.querySelector("#modal-body");

  const serviceData = getServiceData(serviceType);

  if (modalTitle) modalTitle.textContent = serviceData.title;
  if (modalBody) modalBody.innerHTML = serviceData.content;

  serviceModal.classList.add("active");
  serviceModal.setAttribute("aria-hidden", "false");

  // Focus management
  const firstFocusable = serviceModal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (firstFocusable) {
    firstFocusable.focus();
  }

  // Prevent body scroll
  document.body.style.overflow = "hidden";
}

function closeServiceModal() {
  if (!serviceModal) return;

  serviceModal.classList.remove("active");
  serviceModal.setAttribute("aria-hidden", "true");

  // Restore body scroll
  document.body.style.overflow = "";

  // Return focus to trigger element
  const triggerElement = document.activeElement;
  if (triggerElement) {
    triggerElement.blur();
  }
}

function getServiceData(serviceType) {
  const services = {
    web: {
      title: "Desenvolvimento Web",
      content: `
                <div class="service-modal-content">
                    <div class="service-hero">
                        <div class="service-icon-large">
                            <i class="fas fa-code"></i>
                        </div>
                        <h3>Desenvolvimento Web Profissional</h3>
                        <p>Criamos sites e aplicações web modernas, responsivas e otimizadas para performance.</p>
                    </div>
                    
                    <div class="service-details">
                        <h4>O que está incluído:</h4>
                        <ul class="service-includes">
                            <li><i class="fas fa-check"></i> Design responsivo para todos os dispositivos</li>
                            <li><i class="fas fa-check"></i> Otimização para mecanismos de busca (SEO)</li>
                            <li><i class="fas fa-check"></i> Integração com sistemas de pagamento</li>
                            <li><i class="fas fa-check"></i> Painel administrativo personalizado</li>
                            <li><i class="fas fa-check"></i> Hospedagem e domínio por 1 ano</li>
                            <li><i class="fas fa-check"></i> Suporte técnico por 6 meses</li>
                        </ul>
                        
                        <h4>Tecnologias utilizadas:</h4>
                        <div class="tech-badges">
                            <span class="tech-badge">React</span>
                            <span class="tech-badge">Next.js</span>
                            <span class="tech-badge">Node.js</span>
                            <span class="tech-badge">MongoDB</span>
                            <span class="tech-badge">AWS</span>
                        </div>
                        
                        <div class="service-pricing">
                            <div class="price-card">
                                <h5>Básico</h5>
                                <div class="price">R$ 2.500</div>
                                <p>Site institucional com até 5 páginas</p>
                            </div>
                            <div class="price-card featured">
                                <h5>Profissional</h5>
                                <div class="price">R$ 5.000</div>
                                <p>Site completo com funcionalidades avançadas</p>
                            </div>
                            <div class="price-card">
                                <h5>Enterprise</h5>
                                <div class="price">R$ 10.000+</div>
                                <p>Solução personalizada para grandes empresas</p>
                            </div>
                        </div>
                        
                        <div class="service-cta">
                            <button class="btn btn-primary" onclick="closeServiceModal(); scrollToSection('contact');">
                                Solicitar Orçamento
                            </button>
                        </div>
                    </div>
                </div>
            `,
    },
    mobile: {
      title: "Aplicativos Mobile",
      content: `
                <div class="service-modal-content">
                    <div class="service-hero">
                        <div class="service-icon-large">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h3>Aplicativos Mobile Nativos e Híbridos</h3>
                        <p>Desenvolvemos apps para iOS e Android com experiência excepcional do usuário.</p>
                    </div>
                    
                    <div class="service-details">
                        <h4>O que está incluído:</h4>
                        <ul class="service-includes">
                            <li><i class="fas fa-check"></i> App nativo para iOS e Android</li>
                            <li><i class="fas fa-check"></i> Design UI/UX personalizado</li>
                            <li><i class="fas fa-check"></i> Integração com APIs e serviços</li>
                            <li><i class="fas fa-check"></i> Sistema de notificações push</li>
                            <li><i class="fas fa-check"></i> Publicação nas lojas de apps</li>
                            <li><i class="fas fa-check"></i> Suporte e atualizações por 1 ano</li>
                        </ul>
                        
                        <h4>Tecnologias utilizadas:</h4>
                        <div class="tech-badges">
                            <span class="tech-badge">React Native</span>
                            <span class="tech-badge">Flutter</span>
                            <span class="tech-badge">Firebase</span>
                            <span class="tech-badge">Swift</span>
                            <span class="tech-badge">Kotlin</span>
                        </div>
                        
                        <div class="service-pricing">
                            <div class="price-card">
                                <h5>Básico</h5>
                                <div class="price">R$ 5.000</div>
                                <p>App simples com funcionalidades básicas</p>
                            </div>
                            <div class="price-card featured">
                                <h5>Profissional</h5>
                                <div class="price">R$ 12.000</div>
                                <p>App completo com recursos avançados</p>
                            </div>
                            <div class="price-card">
                                <h5>Enterprise</h5>
                                <div class="price">R$ 25.000+</div>
                                <p>Solução empresarial personalizada</p>
                            </div>
                        </div>
                        
                        <div class="service-cta">
                            <button class="btn btn-primary" onclick="closeServiceModal(); scrollToSection('contact');">
                                Solicitar Orçamento
                            </button>
                        </div>
                    </div>
                </div>
            `,
    },
    marketing: {
      title: "Marketing Digital",
      content: `
                <div class="service-modal-content">
                    <div class="service-hero">
                        <div class="service-icon-large">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <h3>Marketing Digital Estratégico</h3>
                        <p>Estratégias completas para aumentar sua presença online e gerar mais conversões.</p>
                    </div>
                    
                    <div class="service-details">
                        <h4>O que está incluído:</h4>
                        <ul class="service-includes">
                            <li><i class="fas fa-check"></i> Auditoria completa da presença digital</li>
                            <li><i class="fas fa-check"></i> Estratégia de SEO e SEM</li>
                            <li><i class="fas fa-check"></i> Gestão de redes sociais</li>
                            <li><i class="fas fa-check"></i> Criação de conteúdo</li>
                            <li><i class="fas fa-check"></i> Campanhas de Google Ads</li>
                            <li><i class="fas fa-check"></i> Relatórios mensais de performance</li>
                        </ul>
                        
                        <h4>Ferramentas utilizadas:</h4>
                        <div class="tech-badges">
                            <span class="tech-badge">Google Analytics</span>
                            <span class="tech-badge">Google Ads</span>
                            <span class="tech-badge">Facebook Ads</span>
                            <span class="tech-badge">SEMrush</span>
                            <span class="tech-badge">Mailchimp</span>
                        </div>
                        
                        <div class="service-pricing">
                            <div class="price-card">
                                <h5>Básico</h5>
                                <div class="price">R$ 1.500/mês</div>
                                <p>Gestão básica de redes sociais e SEO</p>
                            </div>
                            <div class="price-card featured">
                                <h5>Profissional</h5>
                                <div class="price">R$ 3.500/mês</div>
                                <p>Estratégia completa com campanhas pagas</p>
                            </div>
                            <div class="price-card">
                                <h5>Enterprise</h5>
                                <div class="price">R$ 7.000+/mês</div>
                                <p>Solução completa para grandes empresas</p>
                            </div>
                        </div>
                        
                        <div class="service-cta">
                            <button class="btn btn-primary" onclick="closeServiceModal(); scrollToSection('contact');">
                                Solicitar Orçamento
                            </button>
                        </div>
                    </div>
                </div>
            `,
    },
    design: {
      title: "UI/UX Design",
      content: `
                <div class="service-modal-content">
                    <div class="service-hero">
                        <div class="service-icon-large">
                            <i class="fas fa-palette"></i>
                        </div>
                        <h3>Design de Interface e Experiência</h3>
                        <p>Criamos interfaces intuitivas e experiências que convertem visitantes em clientes.</p>
                    </div>
                    
                    <div class="service-details">
                        <h4>O que está incluído:</h4>
                        <ul class="service-includes">
                            <li><i class="fas fa-check"></i> Pesquisa de usuário e personas</li>
                            <li><i class="fas fa-check"></i> Wireframes e protótipos</li>
                            <li><i class="fas fa-check"></i> Design system completo</li>
                            <li><i class="fas fa-check"></i> Testes de usabilidade</li>
                            <li><i class="fas fa-check"></i> Guia de estilo e componentes</li>
                            <li><i class="fas fa-check"></i> Handoff para desenvolvimento</li>
                        </ul>
                        
                        <h4>Ferramentas utilizadas:</h4>
                        <div class="tech-badges">
                            <span class="tech-badge">Figma</span>
                            <span class="tech-badge">Adobe XD</span>
                            <span class="tech-badge">Sketch</span>
                            <span class="tech-badge">InVision</span>
                            <span class="tech-badge">Principle</span>
                        </div>
                        
                        <div class="service-pricing">
                            <div class="price-card">
                                <h5>Básico</h5>
                                <div class="price">R$ 2.000</div>
                                <p>Design de interface para projeto simples</p>
                            </div>
                            <div class="price-card featured">
                                <h5>Profissional</h5>
                                <div class="price">R$ 5.000</div>
                                <p>UX completo com pesquisa e testes</p>
                            </div>
                            <div class="price-card">
                                <h5>Enterprise</h5>
                                <div class="price">R$ 12.000+</div>
                                <p>Design system completo para empresa</p>
                            </div>
                        </div>
                        
                        <div class="service-cta">
                            <button class="btn btn-primary" onclick="closeServiceModal(); scrollToSection('contact');">
                                Solicitar Orçamento
                            </button>
                        </div>
                    </div>
                </div>
            `,
    },
  };

  return services[serviceType] || services.web;
}

// Accessibility improvements
function initializeAccessibility() {
  // Skip link for screen readers
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.className = "skip-link";
  skipLink.textContent = "Pular para o conteúdo principal";
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add main content landmark
  const mainContent = document.querySelector(".hero");
  if (mainContent) {
    mainContent.id = "main-content";
  }

  // Improve focus management
  document.addEventListener("keydown", handleKeyboardNavigation);

  // Add aria-labels to interactive elements
  enhanceAriaLabels();

  // Announce page changes to screen readers
  announcePageChanges();
}

function handleKeyboardNavigation(e) {
  // Escape key handling
  if (e.key === "Escape") {
    // Close any open modals or menus
    if (serviceModal && serviceModal.classList.contains("active")) {
      closeServiceModal();
    }
    if (navMenu && navMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  }

  // Tab trapping in modals
  if (serviceModal && serviceModal.classList.contains("active")) {
    trapFocus(e, serviceModal);
  }
}

function trapFocus(e, container) {
  if (e.key !== "Tab") return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
}

function enhanceAriaLabels() {
  // Add aria-labels to buttons without text
  document.querySelectorAll("button:not([aria-label])").forEach((button) => {
    const icon = button.querySelector("i");
    if (icon && !button.textContent.trim()) {
      const iconClass = icon.className;
      if (iconClass.includes("fa-times")) {
        button.setAttribute("aria-label", "Fechar");
      } else if (iconClass.includes("fa-arrow-up")) {
        button.setAttribute("aria-label", "Voltar ao topo");
      }
    }
  });

  // Add aria-labels to social links
  document.querySelectorAll(".social-link").forEach((link) => {
    const icon = link.querySelector("i");
    if (icon) {
      const iconClass = icon.className;
      if (iconClass.includes("linkedin")) {
        link.setAttribute("aria-label", "LinkedIn");
      } else if (iconClass.includes("instagram")) {
        link.setAttribute("aria-label", "Instagram");
      } else if (iconClass.includes("twitter")) {
        link.setAttribute("aria-label", "Twitter");
      } else if (iconClass.includes("github")) {
        link.setAttribute("aria-label", "GitHub");
      } else if (iconClass.includes("whatsapp")) {
        link.setAttribute("aria-label", "WhatsApp");
      }
    }
  });
}

function announcePageChanges() {
  // Create live region for announcements
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "sr-only";
  liveRegion.id = "live-region";
  document.body.appendChild(liveRegion);
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById("live-region");
  if (liveRegion) {
    liveRegion.textContent = message;
    setTimeout(() => {
      liveRegion.textContent = "";
    }, 1000);
  }
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);

  // Announce to screen readers
  announceToScreenReader(message);
}

function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  };
  return icons[type] || icons.info;
}

// Performance optimizations
function optimizeImages() {
  // Lazy loading for images with loading="lazy" attribute
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Only process if image has data-src attribute
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => {
      // Only observe images that have data-src
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
}

function preloadCriticalResources() {
  // Preload critical fonts
  const fontLink = document.createElement("link");
  fontLink.rel = "preload";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
  fontLink.as = "style";
  document.head.appendChild(fontLink);

  // Remove placeholder image preloading to avoid 404 errors
  // Only preload actual images that exist
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error);
  // You could send this to an error tracking service
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled Promise Rejection:", e.reason);
  // You could send this to an error tracking service
});

// Remove Service Worker registration to avoid 404 error
// Comment out or remove this section:
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
  // Google Analytics 4 example
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, eventData);
  }

  // You can add other analytics services here
  console.log("Event tracked:", eventName, eventData);
}

// Track important user interactions
document.addEventListener("click", (e) => {
  const target = e.target.closest("button, a");
  if (target) {
    const eventData = {
      element_type: target.tagName.toLowerCase(),
      element_text: target.textContent.trim(),
      element_class: target.className,
    };

    if (target.classList.contains("btn-primary")) {
      trackEvent("cta_click", eventData);
    } else if (target.classList.contains("nav-link")) {
      trackEvent("navigation_click", eventData);
    } else if (target.classList.contains("service-btn")) {
      trackEvent("service_interest", eventData);
    }
  }
});

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showTestimonial = showTestimonial;
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;
window.showNotification = showNotification;
window.trackEvent = trackEvent;

// Initialize everything when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
