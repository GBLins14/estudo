// api/gemini.js
import fetch from "node-fetch";

const systemPrompt = `Você é a "IA da Bruninha", uma tutora amigável ... (copie todo seu systemPrompt aqui)`;

// histórico simples por sessão (pode resetar a cada request se quiser)
let conversationHistory = [
    { role: "user", parts: [{ text: systemPrompt }] }
];

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).send({ error: "Método não permitido" });
        return;
    }

    try {
        const { prompt, materia, assunto, modo } = req.body;

        const modoInstrucoes = {
            simples: "Explique de forma bem simples, como se fosse para alguém iniciante ou 'como se fosse um demente'.",
            normal: "Explique de forma normal, nível estudante médio.",
            detalhada: "Explique detalhadamente, passo a passo, mais completa.",
            profissional: "Explique como um professor ou especialista faria, com profundidade.",
            criativa: "Explique de forma criativa/divertida, usando exemplos lúdicos ou metáforas."
        };

        const estilo = modoInstrucoes[modo] || "Explique normalmente";
        const assuntosFinal = assunto || "Todos os assuntos relacionados à matéria";

        conversationHistory.push({
            role: "user",
            parts: [{ text: `Matéria: ${materia}\nAssuntos: ${assuntosFinal}\nEstilo de explicação: ${estilo}\nPergunta: ${prompt}` }]
        });

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": process.env.GOOGLE_API_KEY
                },
                body: JSON.stringify({ contents: conversationHistory })
            }
        );

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Resposta vazia";

        conversationHistory.push({ role: "model", parts: [{ text: aiText }] });

        res.status(200).json({ text: aiText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor" });
    }
}
