// ============================================================
// NeonCode Club – Main JavaScript
// ============================================================


// ── Mobile Menu Toggle ──────────────────────────────────────
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu       = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});


// ── Back-to-Top Button ──────────────────────────────────────
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ── Events Carousel ─────────────────────────────────────────
const prevEventButton  = document.getElementById('prev-event');
const nextEventButton  = document.getElementById('next-event');
const eventsCarousel   = document.getElementById('events-carousel');
const events           = eventsCarousel.children;
let   currentEventIndex = 0;

function showEvent(index) {
    // Hide all events
    for (let i = 0; i < events.length; i++) {
        events[i].classList.add('hidden');
    }

    // Show the current event and the next two (wrapping around)
    for (let i = 0; i < 3; i++) {
        const eventIndex = (index + i) % events.length;
        events[eventIndex].classList.remove('hidden');
    }
}

prevEventButton.addEventListener('click', () => {
    currentEventIndex = (currentEventIndex - 1 + events.length) % events.length;
    showEvent(currentEventIndex);
});

nextEventButton.addEventListener('click', () => {
    currentEventIndex = (currentEventIndex + 1) % events.length;
    showEvent(currentEventIndex);
});

// Initialise carousel
showEvent(0);


// ── Projects Filter ─────────────────────────────────────────
const filterButtons = document.querySelectorAll('[id^="filter-"]');
const projectCards  = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle active state on filter buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('bg-primary');
            btn.classList.add('bg-gray-800');
        });
        button.classList.remove('bg-gray-800');
        button.classList.add('bg-primary');

        const category = button.id.replace('filter-', '');

        // Show / hide project cards based on category
        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Initialise filter – show all
document.getElementById('filter-all').click();


// ── Contact Form Submission ──────────────────────────────────
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value;
    const email   = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // TODO: replace with real server-side submission
    console.log('Form submitted:', { name, email, subject, message });

    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});


// ── Stats Counter Animation ──────────────────────────────────
function animateCounter(element, start, end, duration) {
    let current       = start;
    const range       = end - start;
    const increment   = end > start ? 1 : -1;
    const stepTime    = Math.abs(Math.floor(duration / range));

    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;

        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top    >= 0 &&
        rect.left   >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right  <= (window.innerWidth  || document.documentElement.clientWidth)
    );
}

function handleScroll() {
    const membersCount  = document.getElementById('members-count');
    const projectsCount = document.getElementById('projects-count');
    const eventsCount   = document.getElementById('events-count');
    const awardsCount   = document.getElementById('awards-count');

    if (isElementInViewport(membersCount) && membersCount.textContent === '0') {
        animateCounter(membersCount,  0, 120, 2000);
        animateCounter(projectsCount, 0,  45, 2000);
        animateCounter(eventsCount,   0,  32, 2000);
        animateCounter(awardsCount,   0,  18, 2000);
    }
}

window.addEventListener('scroll', handleScroll);


// ── Activity Chart (Chart.js) ────────────────────────────────
const activityCtx   = document.getElementById('activity-chart').getContext('2d');
const activityChart = new Chart(activityCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label:           'GitHub Commits',
                data:            [120, 190, 150, 220, 180, 250, 200, 300, 270, 220, 190, 310],
                borderColor:     'rgba(108, 92, 231, 1)',
                backgroundColor: 'rgba(108, 92, 231, 0.2)',
                tension:         0.4,
                fill:            true
            },
            {
                label:           'Events Hosted',
                data:            [2, 3, 1, 4, 2, 5, 3, 4, 2, 3, 4, 6],
                borderColor:     'rgba(0, 210, 211, 1)',
                backgroundColor: 'rgba(0, 210, 211, 0.2)',
                tension:         0.4,
                fill:            true
            },
            {
                label:           'New Members',
                data:            [15, 22, 18, 30, 25, 35, 28, 40, 32, 27, 20, 45],
                borderColor:     'rgba(253, 121, 168, 1)',
                backgroundColor: 'rgba(253, 121, 168, 0.2)',
                tension:         0.4,
                fill:            true
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels:   { color: '#ffffff' }
            }
        },
        scales: {
            x: {
                grid:  { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#ffffff' }
            },
            y: {
                grid:  { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#ffffff' }
            }
        }
    }
});


// ── 3-D Rotating Cube (Three.js) ────────────────────────────
function initCube() {
    const container = document.getElementById('cube-container');
    const scene     = new THREE.Scene();
    const camera    = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    const renderer  = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Build cube with six coloured faces
    const geometry  = new THREE.BoxGeometry();
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x6c5ce7 }),
        new THREE.MeshBasicMaterial({ color: 0xfd79a8 }),
        new THREE.MeshBasicMaterial({ color: 0x00d2d3 }),
        new THREE.MeshBasicMaterial({ color: 0x00b894 }),
        new THREE.MeshBasicMaterial({ color: 0xd63031 }),
        new THREE.MeshBasicMaterial({ color: 0xfdcb6e })
    ];
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    camera.position.z = 3;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();

    // Keep renderer in sync with container size
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Lazy-init the cube only when it scrolls into view
const cubeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initCube();
            cubeObserver.unobserve(entry.target);
        }
    });
});

cubeObserver.observe(document.getElementById('cube-container'));


// ── Floating Particles Background ───────────────────────────
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount      = 30;
    const colors             = ['#6c5ce7', '#fd79a8', '#00d2d3', '#00b894', '#fdcb6e'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random size between 2 px and 6 px
        const size = Math.random() * 4 + 2;
        particle.style.width  = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top  = `${Math.random() * 100}%`;

        // Random colour
        particle.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        // Random animation timing
        const duration = Math.random() * 15 + 10;
        const delay    = Math.random() * 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay    = `${delay}s`;

        // Random movement direction
        const angle    = Math.random() * 360;
        const distance = Math.random() * 100 + 50;
        particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);

        particlesContainer.appendChild(particle);
    }
}

window.addEventListener('load', createParticles);


// ── Smooth Scrolling for Anchor Links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            mobileMenu.classList.add('hidden'); // close mobile menu if open
        }
    });
});


// ── Active Nav Link on Scroll ────────────────────────────────
function setActiveNavLink() {
    const sections  = document.querySelectorAll('.section');
    const navLinks  = document.querySelectorAll('.nav-link');
    let   currentSection = '';

    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-accent');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('text-accent');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);
setActiveNavLink(); // run once on load


// ── Terminal Typewriter Effect ───────────────────────────────
function typeWriter(element, text, speed) {
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
}

const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const typewriterElement = document.querySelector('.typewriter');
            typewriterElement.textContent = '';
            typeWriter(typewriterElement, '$ python neoncode.py', 50);
            terminalObserver.unobserve(entry.target);
        }
    });
});

terminalObserver.observe(document.querySelector('.terminal-window'));


// ── Code-Block Glow on Hover ─────────────────────────────────
document.querySelectorAll('.code-block').forEach(block => {
    block.addEventListener('mouseenter', () => {
        block.classList.add('shadow-lg', 'shadow-primary');
    });
    block.addEventListener('mouseleave', () => {
        block.classList.remove('shadow-lg', 'shadow-primary');
    });
});