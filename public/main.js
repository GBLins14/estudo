// Seleciona o input e os ícones
const sendIcons = document.querySelector('.send-icon');
const chatInput = document.querySelector('.chat');
const chatPreview = document.querySelector('.chat-preview');
const materiaSelect = document.querySelector('#materia');
const modoExplicacaoSelect = document.getElementById('modo-explicacao');
const assuntosInput = document.getElementById("assuntosInput");

// Função para criar uma bolha de chat
function addMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", sender); // sender = "user" ou "ai"
    bubble.innerText = text; // respeita \n
    chatPreview.appendChild(bubble);

    // Scroll automático pro final
    chatPreview.scrollTop = chatPreview.scrollHeight;
}

// Função para enviar mensagem
async function sendMessage() {
    const prompt = chatInput.value.trim();
    const materia = materiaSelect.value;
    const modo = modoExplicacaoSelect.value
    if (!prompt) return;

    const modoInstrucoes = {
        simples: "Explique de forma bem simples, como se fosse para alguém iniciante ou 'como se fosse um demente'.",
        normal: "Explique de forma normal, nível estudante médio.",
        detalhada: "Explique detalhadamente, passo a passo, mais completa.",
        profissional: "Explique como um professor ou especialista faria, com profundidade.",
        criativa: "Explique de forma criativa/divertida, usando exemplos lúdicos ou metáforas."
    };

    const estilo = modoInstrucoes[modo] || "Explique normalmente";

    // Mostra mensagem do usuário
    addMessage(prompt, "user");
    chatInput.value = "";

    // Mostra bolha "digitando..." da IA
    const loadingBubble = document.createElement("div");
    loadingBubble.classList.add("chat-bubble", "ai");
    loadingBubble.textContent = "Digitando...";
    chatPreview.appendChild(loadingBubble);
    chatPreview.scrollTop = chatPreview.scrollHeight;

    try {
        const response = await fetch("http://localhost:3000/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, materia, modo })
        });

        const data = await response.json();
        const aiText = data.text;

        // Substitui "Digitando..." pela resposta da IA
        loadingBubble.textContent = aiText;
    } catch (error) {
        console.error(error);
        loadingBubble.textContent = "❌ Erro ao gerar resposta";
    }
}

// Enviar com clique no ícone do chat de baixo
sendIcons.addEventListener("click", sendMessage);

// Enviar com Enter
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

// Mensagem inicial da IA
window.addEventListener("DOMContentLoaded", () => {
    addMessage("👋 Olá, eu sou a IA da Bruninha! Pergunte o que quiser sobre seus estudos!", "ai");
});

const modoSelect = document.getElementById("modo-explicacao");
modoSelect.addEventListener("change", () => {
    const selected = modoSelect.options[modoSelect.selectedIndex];
    modoSelect.title = selected.getAttribute("data-full");
});
window.addEventListener("DOMContentLoaded", () => {
    const selected = modoSelect.options[modoSelect.selectedIndex];
    modoSelect.title = selected.getAttribute("data-full");
});

const botao = document.getElementById("meuBotao");
const simuladorBotao = document.getElementById("simuladorBotao");

// Função para criar bolhas de chat
function addMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", sender); // "user" ou "ai"
    bubble.innerText = text;
    chatPreview.appendChild(bubble);
    chatPreview.scrollTop = chatPreview.scrollHeight;
}

// Função que envia mensagem para a IA
async function enviarParaIA(mensagem) {
    addMessage(mensagem, "user"); // Mensagem do usuário
    const materia = materiaSelect.value;
    const modo = modoExplicacaoSelect.value
    const assuntos = assuntosInput.value

    // Bolha "digitando..." da IA
    const loadingBubble = document.createElement("div");
    loadingBubble.classList.add("chat-bubble", "ai");
    loadingBubble.innerText = "Digitando...";
    chatPreview.appendChild(loadingBubble);
    chatPreview.scrollTop = chatPreview.scrollHeight;

    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: mensagem,
                materia: materia,  // aqui você pode usar o select de matéria
                assunto: assuntos,
                modo: modo          // aqui você pode usar o select de modo de explicação
            })
        });
        const data = await response.json();
        loadingBubble.innerText = data.text; // substitui "digitando..." pela resposta
    } catch (err) {
        console.error(err);
        loadingBubble.innerText = "❌ Erro ao enviar mensagem";
    }
}

let usuario = {
  nome: "Bruna Manuela",
  nivel: 0,
  xp: 0,
  xpParaProximoNivel: 100
};

// Ganhar XP por interação
function salvarUsuario() {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

function atualizarUI() {
    const nivelElemento = document.querySelector("#nivel");

    if (nivelElemento) nivelElemento.textContent = `Nível: ${usuario.nivel}`;
}

// Carregar
function carregarUsuario() {
  const dados = localStorage.getItem("usuario");
  if (dados) {
    usuario = JSON.parse(dados);
  }
  atualizarUI();
}

// Depois de ganhar XP
function ganharXP(valor) {
  usuario.xp += valor;

  while (usuario.xp >= usuario.xpParaProximoNivel) {
    usuario.xp -= usuario.xpParaProximoNivel;
    usuario.nivel += 1;
    usuario.xpParaProximoNivel = Math.floor(usuario.xpParaProximoNivel * 1.2);
    alert(`🎉 Você subiu para o nível ${usuario.nivel}`);
  }

  atualizarUI();
  salvarUsuario(); // salva sempre que atualizar XP
}

// Inicializa ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  carregarUsuario();
  atualizarUI();
});

// Ao clicar no botão, a IA inicia a conversa
botao.addEventListener("click", () => {
    const mensagemInicial = "Olá IA da Bruninha! Quero iniciar uma sessão de perguntas. Pergunte quantas questões quero, nível de dificuldade e o assunto. A cada resposta minha, me da um feedback, do que eu acertei, do que eu errei. Quanto mais eu acerto mais a dificuldade aumenta e quanto mais eu erro, mais a dificuldade diminui. No final das questões, me diga quantas eu acertei, quantas eu errei e minha pontuação final. E no final faça uma revisão com os assuntos que mais errei.";
    enviarParaIA(mensagemInicial);
    ganharXP(10); // Exemplo: ganhar 10 XP ao iniciar
});

simuladorBotao.addEventListener("click", () => {
    const mensagemInicial = "Olá IA da Bruninha! Quero iniciar um simulador de prova. Escolha um numero de questões de 10 a 20, me pergunte o nível de dificuldade e o assunto. No final, me da um feedback, do que eu acertei, do que eu errei e me diga quantas eu acertei, quantas eu errei e minha pontuação final. E no final faça uma revisão com os assuntos que mais errei.";
    enviarParaIA(mensagemInicial);
    ganharXP(30); // Exemplo: ganhar 10 XP ao iniciar
});
