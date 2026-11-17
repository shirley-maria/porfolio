"use strict";
// ==========================================
// 1. ALTERNÂNCIA DE TEMAS
// ==========================================
// Seleciona o botão pelo ID e define seu tipo como HTMLButtonElement.
// O | null indica que o elemento pode não existir no HTML.
const themeButton = document.querySelector('#btn-tema');
// O evento click executa a função quando o usuário clica no botão.
// O ?. garante que o evento só seja registrado se o botão existir.
themeButton === null || themeButton === void 0 ? void 0 : themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeButton.setAttribute('aria-pressed', String(isDarkMode));
    themeButton.setAttribute('aria-label', isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro');
    const themeIcon = themeButton.querySelector('.theme-switch__icon');
    if (themeIcon) {
        themeIcon.textContent = isDarkMode ? '☾' : '☀';
    }
});
// Projetos que já fazem parte do portfólio
// Vou preencher esta lista posteriormente
const fixedProjects = [];
// ==========================================
// 3. SELEÇÃO DOS ELEMENTOS DO HTML
// ==========================================
const projectForm = document.querySelector('#project-form');
const projectList = document.querySelector('#project-list');
const projectNameInput = document.querySelector('#project-name');
const projectTechnologiesInput = document.querySelector('#project-technologies');
const projectUrlInput = document.querySelector('#project-url');
const projectImageInput = document.querySelector('#project-image');
const toggleFormButton = document.querySelector('#toggle-project-form');
const imagePreviewContainer = document.querySelector('#image-preview-container');
const imagePreview = document.querySelector('#project-image-preview');
// ==========================================
// 4. ABRIR E FECHAR O FORMULÁRIO
// ==========================================
if (projectForm && toggleFormButton) {
    toggleFormButton.addEventListener('click', () => {
        // Inverte o estado de visibilidade do formulário
        projectForm.hidden = !projectForm.hidden;
        // Atualiza a acessibilidade do botão
        toggleFormButton.setAttribute('aria-expanded', String(!projectForm.hidden));
        // Se abriu, direciona o foco para o campo nome
        if (!projectForm.hidden && projectNameInput) {
            projectNameInput.focus();
        }
    });
}
// ==========================================
// 5. PRÉVIA DA IMAGEM
// ==========================================
if (projectImageInput && imagePreview && imagePreviewContainer) {
    // Observa quando o usuário digita no campo da imagem
    projectImageInput.addEventListener('input', () => {
        const imageUrl = projectImageInput.value.trim();
        if (imageUrl) {
            imagePreview.src = imageUrl;
            imagePreviewContainer.hidden = false;
        }
        else {
            imagePreview.src = '';
            imagePreviewContainer.hidden = true;
        }
    });
    // Caso o endereço da imagem não funcione
    imagePreview.addEventListener('error', () => {
        imagePreviewContainer.hidden = true;
    });
    // Mostra a imagem quando ela carregar corretamente
    imagePreview.addEventListener('load', () => {
        imagePreviewContainer.hidden = false;
    });
}
// ==========================================
// 6. ARMAZENAMENTO DOS PROJETOS
// ==========================================
const storageKey = 'portfolio-projects';
// Verifica se os dados recuperados possuem a estrutura esperada
function isProject(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const project = value;
    return (typeof project.id === 'string' &&
        typeof project.name === 'string' &&
        Array.isArray(project.technologies) &&
        project.technologies.every((technology) => typeof technology === 'string') &&
        typeof project.url === 'string' &&
        typeof project.image === 'string');
}
// Recupera os projetos salvos no navegador
function loadProjects() {
    try {
        const savedData = localStorage.getItem(storageKey);
        if (!savedData) {
            return [];
        }
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
            return parsedData.filter(isProject);
        }
        return [];
    }
    catch (_a) {
        return [];
    }
}
// Salva os projetos no navegador
function saveProjects() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(savedProjects));
    }
    catch (_a) {
        console.error('Não foi possível salvar os projetos no navegador.');
    }
}
// Lista dos projetos cadastrados pelo formulário
let savedProjects = loadProjects();
// ==========================================
// 7. CRIAÇÃO DOS CARDS
// ==========================================
// document.createElement cria novos elementos HTML diretamente no DOM.
// textContent insere textos com segurança.
// appendChild adiciona os elementos criados dentro de seus elementos pais.
function createProjectCard(project, canDelete) {
    // Cria o card
    const card = document.createElement('article');
    card.classList.add('project-card');
    // Imagem de capa
    const image = document.createElement('img');
    image.classList.add('project-image');
    image.src = project.image;
    image.alt = `Imagem de apresentação do projeto ${project.name}`;
    // Esconde a imagem se o endereço estiver inválido
    image.addEventListener('error', () => {
        image.hidden = true;
    });
    // Área de conteúdo
    const content = document.createElement('div');
    content.classList.add('project-card-content');
    // Nome do projeto
    const title = document.createElement('h3');
    title.classList.add('project-title');
    title.textContent = project.name;
    // Área das tecnologias
    const technologiesContainer = document.createElement('div');
    technologiesContainer.classList.add('project-technologies');
    project.technologies.forEach((technology) => {
        const tag = document.createElement('span');
        tag.classList.add('technology-tag');
        tag.textContent = technology;
        technologiesContainer.appendChild(tag);
    });
    // Área dos botões
    const actions = document.createElement('div');
    actions.classList.add('project-card-actions');
    // Link para acessar o projeto
    const link = document.createElement('a');
    link.classList.add('project-link');
    link.textContent = 'Ver projeto';
    link.href = project.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    actions.appendChild(link);
    // Botão de exclusão, somente para projetos cadastrados
    if (canDelete) {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-project');
        deleteButton.type = 'button';
        deleteButton.textContent = '🗑';
        deleteButton.setAttribute('aria-label', `Excluir projeto ${project.name}`);
        deleteButton.addEventListener('click', () => {
            // Remove o projeto da lista
            savedProjects = savedProjects.filter((item) => item.id !== project.id);
            // Atualiza o armazenamento e os cards
            saveProjects();
            renderProjects();
        });
        actions.appendChild(deleteButton);
    }
    // Organiza os elementos dentro do card
    content.append(title, technologiesContainer, actions);
    card.append(image, content);
    return card;
}
// ==========================================
// 8. EXIBIÇÃO DOS PROJETOS
// ==========================================
function renderProjects() {
    if (!projectList) {
        return;
    }
    // Limpa os cards atuais antes de renderizar novamente
    projectList.replaceChildren();
    // Exibe os projetos fixos
    fixedProjects.forEach((project) => {
        projectList.appendChild(createProjectCard(project, false));
    });
    // Exibe os projetos cadastrados pelo formulário
    savedProjects.forEach((project) => {
        projectList.appendChild(createProjectCard(project, true));
    });
}
// ==========================================
// 9. CADASTRO DE NOVOS PROJETOS
// ==========================================
if (projectForm &&
    projectList &&
    projectNameInput &&
    projectTechnologiesInput &&
    projectUrlInput &&
    projectImageInput) {
    projectForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Captura os valores dos campos
        const projectName = projectNameInput.value.trim();
        const projectTechnologies = projectTechnologiesInput.value
            .split(',')
            .map((technology) => technology.trim())
            .filter((technology) => technology !== '');
        const projectUrl = projectUrlInput.value.trim();
        const projectImage = projectImageInput.value.trim();
        // Verifica se todos os dados foram preenchidos
        if (!projectName ||
            projectTechnologies.length === 0 ||
            !projectUrl ||
            !projectImage) {
            return;
        }
        // Cria o objeto do novo projeto
        const newProject = {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
            name: projectName,
            technologies: projectTechnologies,
            url: projectUrl,
            image: projectImage
        };
        // Adiciona o projeto à lista
        savedProjects.push(newProject);
        // Salva e atualiza os cards
        saveProjects();
        renderProjects();
        // Limpa o formulário
        projectForm.reset();
        // Esconde a prévia da imagem
        if (imagePreviewContainer && imagePreview) {
            imagePreviewContainer.hidden = true;
            imagePreview.src = '';
        }
        // Fecha o formulário após o cadastro
        projectForm.hidden = true;
        if (toggleFormButton) {
            toggleFormButton.setAttribute('aria-expanded', 'false');
            toggleFormButton.focus();
        }
    });
}
// ==========================================
// 10. FORMULÁRIO DE CONTATO
// ==========================================
const contactForm = document.querySelector('.contact-form');
const contactFeedback = document.querySelector('#contact-feedback');
if (contactForm && contactFeedback) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        contactFeedback.textContent = 'Mensagem enviada com sucesso! 💜';
        contactForm.reset();
    });
}
// ==========================================
// 11. INICIALIZAÇÃO
// ==========================================
// Exibe os projetos salvos assim que a página é carregada
renderProjects();
