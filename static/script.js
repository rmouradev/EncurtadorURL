async function encurtarLink() {
    let url = document.getElementById("url").value;
    
    if (url.trim() === "") {
        alert("Por favor, insira um link válido!");
        return;
    }

    try {
        let response = await fetch("/encurtar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        });

        let data = await response.json();

        if (response.ok) {
            document.getElementById("resultado").innerHTML = `
                🔗 Link encurtado: <a href="${data.link_encurtado}" target="_blank">${data.link_encurtado}</a>
            `;
        } else {
            alert("Erro ao encurtar o link: " + data.erro);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao conectar ao servidor.");
    }
}
