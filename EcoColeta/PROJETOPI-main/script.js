// Bairros de Matão-SP. O período de cada um ainda precisa ser confirmado com a prefeitura.
const aDefinir = "a definir com a prefeitura";
const periodos = {
    "Centro": aDefinir,
    "Jardim Pereira": aDefinir,
    "Jardim Primavera": aDefinir,
    "Nova Cidade": aDefinir,
    "Nova Matão": aDefinir,
    "Parque Industrial": aDefinir,
    "Residencial Nova Aurora": aDefinir,
    "Senhor Bom Jesus": aDefinir,
    "Outro bairro": aDefinir
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
    resultadoBairro.textContent = bairro ? "Período de coleta em " + bairro + ": " + periodos[bairro] + "." : "";
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

async function consultarCep() {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("Digite um CEP válido!");
        return;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (!resposta.ok) {
            throw new Error("Erro na consulta");
        }

        const endereco = await resposta.json();

        if (endereco.erro) {
            alert("CEP não encontrado!");
            return;
        }

        // Preencher a rua
        document.getElementById("campo-endereco").value = endereco.logradouro;

        // Selecionar o bairro
        const campoBairro = document.getElementById("campo-bairro");

        if (endereco.bairro) {
            let opcao = Array.from(campoBairro.options).find(
                item => item.value.toLowerCase() === endereco.bairro.toLowerCase()
            );

            if (!opcao) {
                opcao = new Option(endereco.bairro, endereco.bairro);
                campoBairro.add(opcao);
            }

            campoBairro.value = opcao.value;
        }

    } catch (erro) {
        alert("Não foi possível consultar o CEP.");
    }
}
