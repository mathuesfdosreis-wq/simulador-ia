const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // versão 2
const cors = require("cors");

const app = express();

// Habilita CORS
app.use(cors());
app.use(bodyParser.json());

app.post("/simulado", async (req, res) => {
  const { materia, subtemas, banca, dificuldade, quantidade, descricaoProva } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um gerador de simulados, capaz de criar questões acadêmicas, concursos ou provas de qualquer instituição conforme solicitado."
          },
          {
            role: "user",
            content: `Gere ${quantidade} questões de ${materia}, com subtemas: ${subtemas}, nível ${dificuldade}, estilo ${banca}. ${descricaoProva || ""}`
          }
        ]
      })
    });

    const data = await response.json();
    res.json({ resultado: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar simulado" });
  }
});

// Porta dinâmica exigida pelo Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
