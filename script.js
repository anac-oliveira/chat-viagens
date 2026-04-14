const apiKey = ""; // Substitua pela sua chave de API do Azure OpenAI

//elemento da pagina
//pega a secao do chat onde as ensagnes vao aparecer 
const secaoConversa = document.getElementById("div_conversa");

//pega o campo de texto (textarea) onde o usuario digita a mensagem
const pergunta = document.getElementById("pergunta");

// ------------------- FUNÇÃO PARA CHAMAR A API -------------------
function callAzureOpenAI(pergunta2) {
    const url = `https://chat-ana.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview`;

    // Configuração da requisição (o que será enviado para a API)
    const config = {
        //trocando a mensagem do content voce consegue controlar o comportamento da IA, dando instruções sobre como ela deve responder.
        messages: [
            {
                role: "system",
                content: `Você é um assistente especializado em viagens econômicas e personalizadas.

Seu objetivo é ajudar o usuário a encontrar destinos que caibam no orçamento dele, levando em consideração preferências, datas e perfil de viagem.

Sempre siga estas regras:

1. Entenda as informações do usuário:
- Orçamento total (em reais ou outra moeda)
- Cidade de saída (se informado)
- Datas ou período (ou se é flexível)
- Preferências (praia, frio, natureza, luxo, aventura, cultura, etc.)

2. Quando faltar informação importante, faça perguntas antes de recomendar.

3. Sugira entre 2 e 4 destinos no máximo.

4. Para cada destino, inclua:
- Nome do destino
- Tipo de viagem (ex: praia, natureza, urbano)
- Por que combina com o usuário
- Estimativa simples de custo (baixo, médio dentro do orçamento)
- Uma dica útil (melhor época, economia, etc.)

5. Priorize destinos que:
- Caibam no orçamento informado
- Combinen com as preferências
- Sejam viáveis na época desejada

6. Seja direto, útil e amigável. Evite respostas muito longas.

7. Se o orçamento for baixo, priorize destinos próximos ou mais baratos.

8. Se o usuário pedir algo impossível (ex: viajar internacionalmente com orçamento muito baixo), explique de forma clara e sugira alternativas realistas.

Formato da resposta:

- Use lista com emojis
- Não seja genérico — personalize com base no que o usuário falou

Exemplo de resposta:

🌊 Destino 1 – Nome  
Breve descrição personalizada  
💰 Custo: dentro do orçamento  
💡 Dica: ...

🌿 Destino 2 – Nome  
.`,
            },
            {
                // "user" é a mensagem enviada pelo usuário
                role: "user",
                content: pergunta2,
            },
        ],
        max_tokens: 800, // Define o tamanho máximo da resposta em "tokens".
        temperature: 0, // Controla a criatividade da IA.
        top_p: 0.95, // Controla a "probabilidade cumulativa" das palavras escolhidas.
        frequency_penalty: 0, // Penaliza repetições de palavras/frases.
        presence_penalty: 0, // Incentiva ou não trazer novos assuntos.
    };

    // ------------------- CHAMADA À API -------------------
    try {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            body: JSON.stringify(config),
        })
            .then((response) => response.json())
            .then((result) => {
                addMessageToChat(
                    "div_card_conversa_chat",
                    result.choices[0].message.content
                );
                console.log(result.choices[0].message.content);
            })
            .catch((error) => {
                addMessageToChat("div_card_conversa_chat", `Erro: ${error.message}`);
                console.log(error);
            });
    } catch (error) {
        addMessageToChat("div_card_conversa_chat", error);
        console.log(error.message);
        console.log(error);
    }
}

function addMessageToChat(className, messageContent) {
    if (className === "div_card_conversa_chat") {
        secaoConversa.innerHTML += `
<div class="div_card_conversa ${className}">
    <button type="button" class="audio-button">
        <img class="img_audio" <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 128L192 128C139 128 96 171 96 224L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 224C544 171 501 128 448 128L352 128L352 64zM160 432C160 418.7 170.7 408 184 408L216 408C229.3 408 240 418.7 240 432C240 445.3 229.3 456 216 456L184 456C170.7 456 160 445.3 160 432zM280 432C280 418.7 290.7 408 304 408L336 408C349.3 408 360 418.7 360 432C360 445.3 349.3 456 336 456L304 456C290.7 456 280 445.3 280 432zM400 432C400 418.7 410.7 408 424 408L456 408C469.3 408 480 418.7 480 432C480 445.3 469.3 456 456 456L424 456C410.7 456 400 445.3 400 432zM224 240C250.5 240 272 261.5 272 288C272 314.5 250.5 336 224 336C197.5 336 176 314.5 176 288C176 261.5 197.5 240 224 240zM368 288C368 261.5 389.5 240 416 240C442.5 240 464 261.5 464 288C464 314.5 442.5 336 416 336C389.5 336 368 314.5 368 288zM64 288C64 270.3 49.7 256 32 256C14.3 256 0 270.3 0 288L0 384C0 401.7 14.3 416 32 416C49.7 416 64 401.7 64 384L64 288zM608 256C590.3 256 576 270.3 576 288L576 384C576 401.7 590.3 416 608 416C625.7 416 640 401.7 640 384L640 288C640 270.3 625.7 256 608 256z"/></svg> 
    </button>
    <p>${messageContent}</p>
</div>
`;
    } else {
        secaoConversa.innerHTML += `
<div class="div_card_conversa ${className}">
    <p>${messageContent}</p>
</div>
`;
    }
    secaoConversa.scrollTop = secaoConversa.scrollHeight;
}

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();

    const userMessage = pergunta.value.trim();

    addMessageToChat("div_card_conversa_usuario", userMessage);

    callAzureOpenAI(userMessage);

    pergunta.value = "";
});