
// ==================== Technology to icon mapping ====================
const techIcons = {
    "React": "fa-brands fa-react",
    "Node.js": "fa-brands fa-node-js",
    "MongoDB": "fa-brands fa-envira",
    "Stripe API": "fa-solid fa-credit-card",
    "Bootstrap": "fa-brands fa-bootstrap",
    "Weather API": "fa-solid fa-cloud-sun-rain",
    "Geolocation API": "fa-solid fa-location-crosshairs",
    "Firebase": "fa-solid fa-fire",
    "HealthKit API": "fa-solid fa-heart-pulse",
    "JavaScript": "fa-brands fa-square-js",
    "HTML": "fa-brands fa-html5",
    "CSS": "fa-brands fa-css3-alt",
    "Vue.js": "fa-brands fa-vuejs",
    "WebSockets": "fa-solid fa-network-wired",
    "PHP": "fa-brands fa-php",
    "WordPress": "fa-brands fa-wordpress",
    "Google Maps API": "fa-solid fa-map-location-dot"
};

// Function to get icon class for a technology
function getTechIcon(tech) {
    return techIcons[tech] || "fa-solid fa-code";
}

// ==================== Pagination Setup ====================
let currentPage = 1;
const projectsPerPage = 3;
let totalPages = 1;

// Render projects with pagination
function renderProjects(projects, container) {
    container.innerHTML = ''; // clear old content

    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const paginatedProjects = projects.slice(start, end);

    // Render current page projects
    paginatedProjects.forEach(project => {
        const projectEl = document.createElement('div');
        projectEl.classList.add('project');
        projectEl.style.display = 'flex';

        projectEl.innerHTML = `
            <div class="project-content">
                <h2>${project.name}</h2>
                <p>${project.description}</p>
                <a href="${project.projectUrl}" target="_blank">
                    ${project.projectUrl === "#" ? "Coming Soon" : "View Project"}
                </a>
                <ul class="tech-icons">
                    ${project.technologies.map(tech => `
                        <li><i class="${getTechIcon(tech)}" title="${tech}"></i></li>
                    `).join('')}
                </ul>
            </div>
            <img src="${project.imageUrl}" alt="${project.name}" style="width:50%">
        `;

        container.appendChild(projectEl);
    });

    renderPagination(container, projects);
}

// Render pagination controls with arrows
function renderPagination(container, projects) {
    let pagination = document.querySelector('.pagination');
    if (!pagination) {
        pagination = document.createElement('div');
        pagination.classList.add('pagination');
        container.after(pagination);
    }
    pagination.innerHTML = '';

    totalPages = Math.ceil(projects.length / projectsPerPage);

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('prev');
    prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProjects(projects, container);
        }
    });
    pagination.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('page');
        pageBtn.textContent = i;

        if (i === currentPage) pageBtn.classList.add('active');

        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderProjects(projects, container);
        });

        pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('next');
    nextBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProjects(projects, container);
        }
    });
    pagination.appendChild(nextBtn);
}

// ==================== Load Projects ====================
async function loadProjects() {
    const container = document.querySelector('.projects-container');
    if (!container) {
        console.error('Projects container not found');
        return;
    }

    try {
        const response = await fetch('./projects.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const loading = container.querySelector('.loading');
        if (loading) loading.remove();

        if (!data.projects || data.projects.length === 0) {
            throw new Error('No projects found in the JSON file');
        }

        renderProjects(data.projects, container);

    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading projects: ${error.message}</p>
                <p>Please check if your JSON file is correctly formatted and accessible.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);
