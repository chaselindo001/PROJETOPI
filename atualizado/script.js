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
    return JSON.parse(localStorage.getItem("pedidos")) || [];
}

function salvarPedidos(lista) {
    localStorage.setItem("pedidos", JSON.stringify(lista));
}

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

    const pedidos = lerPedidos();
    const protocolo = "EC-" + (pedidos.length + 1);
    const bairro = formularioColeta.elements["bairro"].value;

    pedidos.push({
        protocolo: protocolo,
        nome: formularioColeta.elements["nome"].value,
        bairro: bairro,
        endereco: formularioColeta.elements["endereco"].value,
        residuo: formularioColeta.elements["residuo"].value,
        volume: formularioColeta.elements["volume"].value,
        data: new Date().toLocaleDateString("pt-BR"),
        status: "Recebida"
    });
    salvarPedidos(pedidos);

    formularioColeta.reset();
    retornoColeta.textContent = "Solicitação enviada! Seu protocolo é " + protocolo + ". Previsão de coleta: " + periodos[bairro] + ".";
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
