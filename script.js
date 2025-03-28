document.getElementById("alunoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let nome = document.getElementById("nome").value;
    let sexo = document.getElementById("sexo").value;
    let equipe = document.getElementById("equipe").value;
    let anoNascimento = parseInt(document.getElementById("anoNascimento").value);
    let peso = parseFloat(document.getElementById("peso").value);
    let faixa = document.getElementById("faixa").value;
    let idade = new Date().getFullYear() - anoNascimento;

    let categoriaIdade = calcularCategoriaIdade(idade);
    let categoriaPeso = calcularCategoriaPeso(idade, peso, sexo);

    let aluno = { nome, sexo, equipe, idade, peso, faixa, categoriaIdade, categoriaPeso };

    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    alunos.push(aluno);
    localStorage.setItem("alunos", JSON.stringify(alunos));

    atualizarListaAlunos();
    alert("Aluno cadastrado com sucesso!");
    this.reset();
});

function calcularCategoriaIdade(idade) {
    if (idade <= 5) return "Pré-Mirim";
    if (idade <= 7) return "Mirim";
    if (idade <= 9) return "Infantil 1";
    if (idade <= 11) return "Infantil 2";
    if (idade <= 13) return "Infanto Juvenil 1";
    if (idade <= 15) return "Infanto Juvenil 2";
    if (idade <= 17) return "Juvenil";
    return "Adulto / Master";
}

function calcularCategoriaPeso(idade, peso, sexo) {
    let categorias = ["Galo", "Pluma", "Pena", "Leve", "Médio", "Meio-Pesado", "Pesado", "Super-Pesado", "Pesadíssimo"];
    let valores;

    if (idade >= 4 && idade <= 5) {  
        valores = [17, 20, 23, 26, 29, 32, 35, 35.1];  
    } else if (idade >= 6 && idade <= 7) {  
        valores = [21, 24, 27, 30, 33, 36, 39, 39.1];  
    } else if (idade >= 8 && idade <= 9) {  
        valores = [24, 27, 30, 33, 36, 39, 42, 45, 45.1];  
    } else if (idade >= 10 && idade <= 11) {  
        valores = [32, 36, 40, 44, 48, 52, 56, 60, 60.1];  
    } else if (idade >= 12 && idade <= 13) {  
        valores = [36, 40, 44, 48, 52, 56, 60, 65, 65.1];  
    } else if (idade >= 14 && idade <= 15) {  
        valores = [44, 48, 52, 56, 60, 65, 69, 73, 73.1];  
    } else if (idade >= 16 && idade <= 17) {  
        valores = (sexo === "Masculino") ? 
            [53, 58, 64, 69, 74, 79, 84, 89, 89.1] :  
            [44, 48, 52, 56, 60, 65, 69, 73, 73.1];  
    } else {  
        valores = (sexo === "Masculino") ? 
            [57, 64, 70, 76, 82, 88, 94, 100, 100.1] :  
            [48, 53, 58, 64, 69, 74, 79, 84, 81.1];  
    }

    for (let i = 0; i < valores.length; i++) {
        if (peso <= valores[i]) {
            return categorias[i];
        }
    }
    return "Pesadíssimo"; 
}

let mostrarTodos = false;

function atualizarListaAlunos() {
    let listaAlunos = document.getElementById("listaAlunos");
    listaAlunos.innerHTML = "";

    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

    if (alunos.length === 0) {
        listaAlunos.innerHTML = "<p style='text-align:center;'>Nenhum aluno cadastrado.</p>";
        return;
    }

    let alunosExibir = mostrarTodos ? alunos : alunos.slice(-2);

    alunosExibir.forEach((aluno, index) => {
        listaAlunos.innerHTML += `
            <div class="aluno-card">
                <p><strong>${aluno.nome}</strong></p>
                <button onclick="verPerfil(${index})">👀 Ver Perfil</button>
                <button class="excluir-btn" onclick="removerAluno('${aluno.nome}')">❌ Remover</button>
            </div>
        `;
    });

    if (alunos.length > 2) {
        listaAlunos.innerHTML += `
            <button onclick="alternarListaAlunos()" id="verMaisBtn" style="margin-top:10px;">
                ${mostrarTodos ? "Ver Menos" : "Ver Mais"}
            </button>
        `;
    }
}

function alternarListaAlunos() {
    mostrarTodos = !mostrarTodos;
    atualizarListaAlunos();
}

function filtrarCategorias() {
    let filtroSexo = document.getElementById("filtroSexo").value;
    let categoriasDiv = document.getElementById("categorias");
    categoriasDiv.innerHTML = "";

    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

    if (!filtroSexo) {
        categoriasDiv.innerHTML = "<p style='color: red;'>Selecione um sexo antes de pesquisar.</p>";
        return;
    }

    let filtrados = alunos.filter(aluno => aluno.sexo === filtroSexo);

    if (filtrados.length === 0) {
        categoriasDiv.innerHTML = "<p style='color: red;'>Nenhum aluno encontrado para esse sexo.</p>";
        return;
    }

    let categoriasOrganizadas = {};
    filtrados.forEach(aluno => {
        let categoria = `${aluno.categoriaIdade} | ${aluno.faixa} | ${aluno.categoriaPeso}`;
        if (!categoriasOrganizadas[categoria]) {
            categoriasOrganizadas[categoria] = [];
        }
        categoriasOrganizadas[categoria].push(aluno);
    });

    let totalCategorias = Object.keys(categoriasOrganizadas).length;

    for (let categoria in categoriasOrganizadas) {
        let alunosNaCategoria = categoriasOrganizadas[categoria]
            .map(aluno => `<p>01 - <strong>${aluno.nome} (${aluno.idade})</strong> / ${aluno.equipe}</p>`)
            .join("");

        categoriasDiv.innerHTML += `
            <div style="background: #333; color: white; padding: 5px; margin-top: 10px;">
                <strong>CATEGORIA | ${categoria}</strong>
            </div>
            <div style="padding: 10px; background: #f1f1f1; border-bottom: 2px solid #333;">
                ${alunosNaCategoria}
            </div>
        `;
    }

    categoriasDiv.innerHTML += `<p style="margin-top: 15px;"><strong>CATEGORIAS - ${totalCategorias}</strong></p>`;
}

// Função para fechar o modal do perfil
document.getElementById("fecharModal").addEventListener("click", function () {
    document.getElementById("perfilModal").classList.remove("show");
});

// Função para imprimir as categorias
function imprimirCategorias() {
    let categoriasDiv = document.getElementById("categorias");
    if (!categoriasDiv.innerHTML.trim()) {
        alert("Nenhuma categoria para imprimir.");
        return;
    }

    let janelaImpressao = window.open("", "_blank");
    janelaImpressao.document.write("<html><head><title>Impressão de Categorias</title></head><body>");
    janelaImpressao.document.write(categoriasDiv.innerHTML);
    janelaImpressao.document.write("</body></html>");
    janelaImpressao.document.close();
    janelaImpressao.print();
}

// Evento para filtrar categorias
document.getElementById("pesquisarCategorias").addEventListener("click", filtrarCategorias);

// Função para remover um aluno
function removerAluno(nome) {
    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    let novosAlunos = alunos.filter(aluno => aluno.nome !== nome);
    localStorage.setItem("alunos", JSON.stringify(novosAlunos));

    atualizarListaAlunos();
    filtrarCategorias();
}

// Função para visualizar perfil do aluno
function verPerfil(index) {
    let alunos = JSON.parse(localStorage.getItem("alunos"));
    let aluno = alunos[index];

    let modal = document.getElementById("perfilModal");
    if (!modal) {
        console.error("Elemento 'perfilModal' não encontrado!");
        return;
    }

    document.getElementById("perfilNome").innerText = aluno.nome;
    document.getElementById("perfilSexo").innerText = aluno.sexo;
    document.getElementById("perfilEquipe").innerText = aluno.equipe;
    document.getElementById("perfilIdade").innerText = aluno.idade;
    document.getElementById("perfilPeso").innerText = aluno.peso;
    document.getElementById("perfilFaixa").innerText = aluno.faixa;
    document.getElementById("perfilCategoriaIdade").innerText = aluno.categoriaIdade;
    document.getElementById("perfilCategoriaPeso").innerText = aluno.categoriaPeso;

    modal.classList.add("show");
}

document.addEventListener("DOMContentLoaded", atualizarListaAlunos);
// Função para fechar o modal do perfil
function fecharModal() {
    let modal = document.getElementById("perfilModal");
    if (modal) {
        modal.classList.remove("show"); // Remove a classe que exibe o modal
        modal.style.display = "none"; // Garante que ele suma da tela
    }
}

document.getElementById("fecharModal").addEventListener("click", fecharModal);

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    let modal = document.getElementById("perfilModal");
    if (event.target === modal) {
        fecharModal();
    }
};