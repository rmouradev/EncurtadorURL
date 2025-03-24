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

function calcularParcela() {
    const salario = parseFloat(document.getElementById("salario").value);
    const emprestimo = parseFloat(document.getElementById("emprestimo").value);
    const parcelas = parseInt(document.getElementById("parcelas").value);
    
    if (isNaN(salario) || isNaN(emprestimo) || isNaN(parcelas) || salario <= 0 || emprestimo <= 0 || parcelas <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const margemConsignavel = salario * 0.35;
    const taxaJuros = 0.018; // 1.8% ao mês

    // Cálculo da parcela com juros compostos (Fórmula do sistema PRICE)
    const parcela = (emprestimo * taxaJuros) / (1 - Math.pow(1 + taxaJuros, -parcelas));

    const valorTotal = parcela * parcelas;
    const vezesAntes = margemConsignavel / parcela;

    // Exibir resultados
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
        <p><strong>Margem Consignável:</strong> R$ ${margemConsignavel.toFixed(2)}</p>
        <p><strong>Valor da Parcela:</strong>  ${parcelas.toFixed(0)} x de R$ ${parcela.toFixed(2)}</p>
        <p><strong>Valor Total das Parcelas:</strong> R$ ${valorTotal.toFixed(2)}</p>
    
    `;

    const alerta = document.getElementById("alerta");
    if (parcela > margemConsignavel) {
        alerta.innerHTML = "A parcela está acima da margem consignável!";
    } else {
        alerta.innerHTML = "";
    }
}
