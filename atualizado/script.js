// Períodos de coleta por bairro (exemplo, trocar pelos dados reais da prefeitura)
const periodos = {
    "Centro": "Segundas-feiras, das 8h às 12h",
    "Jardim das Flores": "Terças-feiras, das 8h às 12h",
    "Vila Nova": "Quartas-feiras, das 13h às 17h",
    "Parque Industrial": "Quintas-feiras, das 8h às 12h",
    "Santa Cruz": "Sextas-feiras, das 13h às 17h"
};

const botaoColeta = document.getElementById("botao-coleta");
const modalColeta = document.getElementById("modal-coleta");
const fecharColeta = document.getElementById("fechar-coleta");
const formularioColeta = modalColeta.querySelector("form");
const retornoColeta = modalColeta.querySelector(".retorno");
const campoBairro = document.getElementById("campo-bairro");
const consultaBairro = document.getElementById("consulta-bairro");
const resultadoBairro = document.getElementById("resultado-bairro");
const consultaProtocolo = document.getElementById("consulta-protocolo");
const botaoProtocolo = document.getElementById("botao-protocolo");
const resultadoProtocolo = document.getElementById("resultado-protocolo");

// Preenche as listas de bairros
Object.keys(periodos).forEach((bairro) => {
    campoBairro.add(new Option(bairro, bairro));
    consultaBairro.add(new Option(bairro, bairro));
});

// Pedidos ficam salvos no navegador
function lerPedidos() {
    try {
        return JSON.parse(localStorage.getItem("pedidos")) || [];
    } catch (erro) {
        return [];
    }
}

function salvarPedidos(lista) {
    localStorage.setItem("pedidos", JSON.stringify(lista));
}

// Máscara do telefone: (00) 00000-0000
const campoTelefone = document.getElementById("campo-telefone");

campoTelefone.addEventListener("input", () => {
    let numeros = campoTelefone.value.replace(/\D/g, "").slice(0, 11);
    if (numeros.length > 6) {
        const inicio = numeros.length === 11 ? 7 : 6;
        numeros = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, inicio) + "-" + numeros.slice(inicio);
    } else if (numeros.length > 2) {
        numeros = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
    }
    campoTelefone.value = numeros;
});

// Modal
botaoColeta.addEventListener("click", () => {
    retornoColeta.textContent = "";
    modalColeta.showModal();
});

fecharColeta.addEventListener("click", () => {
    modalColeta.close();
});

// Fecha ao clicar fora da caixa
modalColeta.addEventListener("click", (evento) => {
    if (evento.target === modalColeta) {
        modalColeta.close();
    }
});

// Envio do formulário
formularioColeta.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = new FormData(formularioColeta);
    const pedidos = lerPedidos();
    const protocolo = "EC-" + String(pedidos.length + 1).padStart(4, "0");

    pedidos.push({
        protocolo: protocolo,
        nome: dados.get("nome"),
        bairro: dados.get("bairro"),
        endereco: dados.get("endereco"),
        residuo: dados.get("residuo"),
        volume: dados.get("volume"),
        data: new Date().toLocaleDateString("pt-BR"),
        status: "Recebida"
    });
    salvarPedidos(pedidos);

    formularioColeta.reset();
    retornoColeta.textContent = "Solicitação enviada! Seu protocolo é " + protocolo + ". Previsão de coleta: " + periodos[dados.get("bairro")] + ".";
});

// Consulta por bairro
consultaBairro.addEventListener("change", () => {
    const bairro = consultaBairro.value;
    resultadoBairro.textContent = bairro ? "Coleta em " + bairro + ": " + periodos[bairro] + "." : "";
});

// Consulta por protocolo
botaoProtocolo.addEventListener("click", () => {
    const codigo = consultaProtocolo.value.trim().toUpperCase();
    const pedido = lerPedidos().find((p) => p.protocolo === codigo);

    if (!codigo) {
        resultadoProtocolo.textContent = "Digite o número do protocolo.";
    } else if (!pedido) {
        resultadoProtocolo.textContent = "Protocolo não encontrado neste navegador.";
    } else {
        resultadoProtocolo.textContent = pedido.protocolo + " — " + pedido.status + " em " + pedido.data + ". " + pedido.residuo + " (" + pedido.volume + "), " + pedido.bairro + ".";
    }
});
