const form = document.getElementById('linkForm');
const listaLinks = document.getElementById('listaLinks');
const botoesFiltro = document.querySelectorAll('.filter-btn');

let links = JSON.parse(localStorage.getItem('linkPocket_links')) || [];
renderizarLinks();

form.addEventListener('submit', function(e) {
e.preventDefault();
const titulo = document.getElementById('titulo').value;
const url = document.getElementById('url').value;
const categoria = document.getElementById('categoria').value;

const novoLink = { id: Date.now(), titulo, url, categoria };
links.unshift(novoLink);
salvarLinks();
renderizarLinks();
form.reset();

});

function renderizarLinks(filtro = 'todos') {
const linksFiltrados = filtro === 'todos' ? links : links.filter(l => l.categoria === filtro);

if (linksFiltrados.length === 0) {
listaLinks.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open"></i><p>Nenhum link encontrado.</p></div>`;
return;
}

listaLinks.innerHTML = linksFiltrados.map(link => `

        <div class="link-card ${link.categoria}">
<div class="link-header">
<h4 class="link-titulo">${escapeHtml(link.titulo)}</h4>
<span class="link-categoria ${link.categoria}">${link.categoria}</span>
</div>
<a href="${escapeHtml(link.url)}" target="_blank" class="link-url">${escapeHtml(link.url)}</a>
<div class="link-acoes">
<button class="btn-excluir" data-id="${link.id}"><i class="fas fa-trash-alt"></i> Excluir</button>
</div>
</div>
`).join('');
document.querySelectorAll('.btn-excluir').forEach(btn => {
btn.addEventListener('click', function() {
if (confirm('Excluir este link?')) {
links = links.filter(l => l.id !== parseInt(this.dataset.id));
salvarLinks();
renderizarLinks(document.querySelector('.filter-btn.active').dataset.filter);
}
});
});

}

function salvarLinks() {
localStorage.setItem('linkPocket_links', JSON.stringify(links));
}

botoesFiltro.forEach(btn => {
btn.addEventListener('click', function() {
botoesFiltro.forEach(b => b.classList.remove('active'));
this.classList.add('active');
renderizarLinks(this.dataset.filter);
});
});

function escapeHtml(texto) {
const div = document.createElement('div');
div.textContent = texto;
return div.innerHTML;
}
