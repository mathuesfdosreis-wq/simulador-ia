const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/simulado", async (req, res) => {
  const { materia, subtemas, banca, dificuldade, quantidade } = req.body;

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
          { role: "system", content: "Você é um gerador de simulados de concursos." },
          { role: "user", content: `Gere ${quantidade} questões de ${materia}, com subtemas: ${subtemas}, nível ${dificuldade}, estilo ${banca}.` }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
