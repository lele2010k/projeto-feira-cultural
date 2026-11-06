
const texto = document.getElementById("texto");
const seletorVoz = document.getElementById("voz");
const velocidade = document.getElementById("velocidade");
const statusTexto = document.getElementById("status");

let vozes = [];

function carregarVozes() {
    vozes = speechSynthesis.getVoices();

    seletorVoz.innerHTML = "";

    const portuguesas = vozes.filter(voz =>
        voz.lang.toLowerCase().startsWith("pt")
    );

    const lista = portuguesas.length ? portuguesas : vozes;

    lista.forEach(voz => {
        const opcao = document.createElement("option");

        opcao.value = vozes.indexOf(voz);
        opcao.textContent = voz.name + " (" + voz.lang + ")";

        seletorVoz.appendChild(opcao);
    });

    if (!lista.length) {
        seletorVoz.innerHTML =
            '<option value="">Nenhuma voz disponível</option>';
    }
}

speechSynthesis.onvoiceschanged = carregarVozes;
carregarVozes();

function falar() {
    const conteudo = texto.value.trim();

    if (!conteudo) {
        statusTexto.textContent =
            "Por favor, escreva um texto primeiro.";
        texto.focus();
        return;
    }

    speechSynthesis.cancel();

    const mensagem = new SpeechSynthesisUtterance(conteudo);

    const vozSelecionada = vozes[
        Number(seletorVoz.value)
    ];

    if (vozSelecionada) {
        mensagem.voice = vozSelecionada;
    }

    mensagem.lang = vozSelecionada
        ? vozSelecionada.lang
        : "pt-BR";

    mensagem.rate = Number(velocidade.value);

    mensagem.onstart = () => {
        statusTexto.textContent = "Lendo seu texto...";
    };

    mensagem.onend = () => {
        statusTexto.textContent = "Leitura finalizada!";
    };

    mensagem.onerror = () => {
        statusTexto.textContent =
            "Não foi possível reproduzir a voz.";
    };

    speechSynthesis.speak(mensagem);
}

function pausar() {
    if (speechSynthesis.speaking &&
        !speechSynthesis.paused) {

        speechSynthesis.pause();

        statusTexto.textContent = "Leitura pausada.";
    }
}

function continuar() {
    if (speechSynthesis.paused) {

        speechSynthesis.resume();

        statusTexto.textContent =
            "Continuando a leitura...";
    }
}

function parar() {
    speechSynthesis.cancel();

    statusTexto.textContent = "Leitura interrompida.";
}

function limpar() {
    speechSynthesis.cancel();

    texto.value = "";

    statusTexto.textContent = "Texto apagado.";

    texto.focus();
}
