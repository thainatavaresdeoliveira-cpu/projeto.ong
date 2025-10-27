--Organização das Pastas--
ong-projeto/
├─ index.html
├─ css/
│  ├─ base.css
│  ├─ layout.css
│  ├─ components.css
│  ├─ responsive.css
│  └─ style.css
├─ js/
│  ├─ app.js          ← inicialização do SPA
│  ├─ router.js       ← controle de rotas e troca de telas
│  ├─ templates.js    ← conteúdo dinâmico de cada página
│  └─ form-validation.js ← lógica de validação de formulários
└─ images/

  --js/app.js--
// =============================
// app.js - Inicialização do SPA
// =============================

// Importa os módulos principais
import { router } from './router.js';
import { initFormValidation } from './form-validation.js';

// Inicializa o roteador SPA
document.addEventListener('DOMContentLoaded', () => {
  router();
  initFormValidation();

  // Atualiza o conteúdo ao clicar nos links do menu
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const route = event.target.getAttribute('href').replace('#', '');
      window.location.hash = route;
      router();
    });
  });
});

--js/router.js--
// =============================
// router.js - Sistema de Rotas SPA
// =============================
import { renderHome, renderProjetos, renderCadastro } from './templates.js';

export function router() {
  const main = document.querySelector('main');
  const route = window.location.hash.replace('#', '') || 'home';

  switch (route) {
    case 'projetos':
      main.innerHTML = renderProjetos();
      break;
    case 'cadastro':
      main.innerHTML = renderCadastro();
      break;
    default:
      main.innerHTML = renderHome();
  }

  // Reinicializa a validação após cada renderização
  if (route === 'cadastro') {
    import('./form-validation.js').then(module => {
      module.initFormValidation();
    });
  }
}

--js/templates.js--
// =============================
// templates.js - Páginas dinâmicas
// =============================

export function renderHome() {
  return `
    <section class="hero">
      <div class="hero-content">
        <h1>Bem-vindo à nossa ONG</h1>
        <p>Promovendo impacto social através da tecnologia e solidariedade.</p>
        <a href="#projetos" class="btn">Conheça nossos projetos</a>
      </div>
      <img src="images/hero.jpg" alt="Imagem de destaque">
    </section>
  `;
}

export function renderProjetos() {
  const projetosSalvos = JSON.parse(localStorage.getItem('projetos')) || [];
  const listaProjetos = projetosSalvos.map(p => `
    <div class="project-card">
      <img src="images/projeto-exemplo.jpg" alt="${p.nome}">
      <div class="project-body">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <span class="badge">${p.categoria}</span>
      </div>
    </div>
  `).join('');

  return `
    <section class="container">
      <h2>Projetos Cadastrados</h2>
      <div class="project-list">
        ${listaProjetos || '<p>Nenhum projeto cadastrado ainda.</p>'}
      </div>
    </section>
  `;
}

export function renderCadastro() {
  return `
    <section class="container">
      <h2>Cadastrar Novo Projeto</h2>
      <form id="cadastroForm" novalidate>
        <label>Nome do Projeto</label>
        <input type="text" id="nomeProjeto" required>

        <label>Descrição</label>
        <textarea id="descricaoProjeto" required></textarea>

        <label>Categoria</label>
        <select id="categoriaProjeto" required>
          <option value="">Selecione</option>
          <option>Educação</option>
          <option>Saúde</option>
          <option>Meio Ambiente</option>
          <option>Tecnologia</option>
        </select>

        <button type="submit" class="btn">Salvar Projeto</button>
      </form>
      <div id="mensagem"></div>
    </section>
  `;
}

--js/form-validation.js--
// ==================================
// form-validation.js - Validação + Storage
// ==================================

export function initFormValidation() {
  const form = document.querySelector('#cadastroForm');
  const mensagem = document.querySelector('#mensagem');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.querySelector('#nomeProjeto');
    const descricao = document.querySelector('#descricaoProjeto');
    const categoria = document.querySelector('#categoriaProjeto');

    if (!nome.value.trim() || !descricao.value.trim() || !categoria.value) {
      mensagem.innerHTML = `<div class="alert">⚠️ Preencha todos os campos corretamente.</div>`;
      return;
    }

    const novoProjeto = {
      nome: nome.value.trim(),
      descricao: descricao.value.trim(),
      categoria: categoria.value
    };

    salvarProjeto(novoProjeto);
    mensagem.innerHTML = `<div class="alert" style="background:#2ecc71;">✅ Projeto cadastrado com sucesso!</div>`;
    form.reset();
  });
}

function salvarProjeto(projeto) {
  const projetos = JSON.parse(localStorage.getItem('projetos')) || [];
  projetos.push(projeto);
  localStorage.setItem('projetos', JSON.stringify(projetos));
}
