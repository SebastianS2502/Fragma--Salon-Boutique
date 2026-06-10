// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Menú móvil toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer click en un link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Intersection Observer para animaciones de scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Agregar delay escalonado para cards
                if (entry.target.classList.contains('pricing-card') || 
                    entry.target.classList.contains('review-card') || 
                    entry.target.classList.contains('gallery-item')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observar elementos
    document.querySelectorAll('.pricing-card, .gallery-item, .review-card').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Ajustar por navbar fija
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cambiar navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Lazy loading para imágenes de galería
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Esto activa la carga
                imageObserver.unobserve(img);
            }
        });
    });

    galleryImages.forEach(img => imageObserver.observe(img));

    // Efecto parallax sutil en hero
    const hero = document.querySelector('.hero');
    const heroLogo = document.querySelector('.hero-logo');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            if (heroLogo) {
                heroLogo.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
    });

    // Validación de formulario de contacto (si se agrega en el futuro)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría la lógica de envío
            alert('Formulario enviado. Nos pondremos en contacto pronto.');
            this.reset();
        });
    });

    // Animación de contador para precios (efecto visual)
    const priceElements = document.querySelectorAll('.price');
    
    const priceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const priceEl = entry.target;
                const finalPrice = priceEl.textContent;
                animateValue(priceEl, 0, parseInt(finalPrice.replace(/\D/g, '')), 1000);
                priceObserver.unobserve(priceEl);
            }
        });
    }, observerOptions);

    priceElements.forEach(price => priceObserver.observe(price));

    // Función para animar números
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            obj.innerHTML = '$' + current.toLocaleString('es-CO');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = '$' + end.toLocaleString('es-CO');
            }
        };
        window.requestAnimationFrame(step);
    }

    // Prevenir clic derecho en imágenes (protección básica)
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });

    // Detección de dispositivo móvil para optimizaciones
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        // Desactivar animaciones pesadas en móviles
        document.querySelectorAll('.hero-decoration').forEach(el => {
            el.style.animation = 'none';
        });
    }

    console.log('Fragma Salon Boutique - Website cargado correctamente');
});

// Service Worker básico para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Función para ajustar Calendly dinámicamente
function initCalendlyResponsive() {
    const container = document.getElementById('calendlyContainer');
    if (!container) return;

    // Escuchar mensajes de Calendly
    window.addEventListener('message', function(e) {
        if (e.data && e.data.event === 'calendly.page_ready') {
            container.classList.add('loaded');
            adjustCalendlyHeight();
        }
    });

    // Ajustar altura del contenedor
    function adjustCalendlyHeight() {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            // Forzar altura completa
            const windowHeight = window.innerHeight;
            const containerTop = container.getBoundingClientRect().top;
            const availableHeight = windowHeight - containerTop - 50; // 50px de margen
            
            container.style.height = Math.min(availableHeight, 900) + 'px';
            iframe.style.height = '100%';
        }
    }

    // Ajustar en resize y load
    window.addEventListener('resize', debounce(adjustCalendlyHeight, 250));
    window.addEventListener('load', adjustCalendlyHeight);
    
    // Observar cambios en el DOM por si Calendly tarda en cargar
    const observer = new MutationObserver(function(mutations) {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            container.classList.add('loaded');
            adjustCalendlyHeight();
            observer.disconnect();
        }
    });
    
    observer.observe(container, { childList: true, subtree: true });
    
    // Timeout de seguridad
    setTimeout(() => {
        container.classList.add('loaded');
        adjustCalendlyHeight();
    }, 3000);
}

// Función debounce para optimizar resize
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

// Inicializar Calendly cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // ... tu código existente ...
    
    // Inicializar Calendly responsive
    initCalendlyResponsive();
});

// Script adicional para inyectar en el head (opcional pero recomendado)
function injectCalendlyStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Forzar que el widget de Calendly ocupe todo el espacio */
        .calendly-inline-widget iframe {
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
        }
        
        /* Eliminar scrollbars del contenedor */
        .calendly-container {
            overflow: hidden !important;
            -webkit-overflow-scrolling: touch;
        }
        
        /* Asegurar que no haya overflow en el widget */
        .calendly-inline-widget {
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(style);
}

// Llamar a esta función también en DOMContentLoaded
injectCalendlyStyles();