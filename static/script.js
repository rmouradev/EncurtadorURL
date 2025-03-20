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
            let linkCompleto = data.link_encurtado;
            let linkSemHttp = linkCompleto.replace(/^https?:\/\//, ''); // Remove http:// ou https://

            document.getElementById("resultado").innerHTML = `
                🔗 Link encurtado: <a href="${linkCompleto}" target="_blank">${linkSemHttp}</a>
            `;
        } else {
            alert("Erro ao encurtar o link: " + data.erro);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao conectar ao servidor.");
    }
}

/* Função para abrir/fechar menu no celular */
function toggleMenu() {
    let navLinks = document.querySelector(".nav-links");
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptCookiesButton = document.getElementById("accept-cookies");

    // Verifica se o usuário já aceitou os cookies
    if (localStorage.getItem("cookiesAccepted")) {
        cookieBanner.style.display = "none";
    }

    acceptCookiesButton.addEventListener("click", function () {
        localStorage.setItem("cookiesAccepted", "true");
        cookieBanner.style.display = "none";
    });
});
