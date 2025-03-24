from flask import Flask, request, jsonify, render_template, redirect
import sqlite3
import hashlib

app = Flask(__name__)

# Criar o banco de dados e a tabela se não existir
def criar_tabela():
    conexao = sqlite3.connect("database.db")
    cursor = conexao.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS links (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        url_original TEXT NOT NULL,
                        url_encurtada TEXT NOT NULL)''')
    conexao.commit()
    conexao.close()

criar_tabela()  # Garante que a tabela existe

# Função para encurtar o link gerando um hash curto
def gerar_encurtado(url):
    hash_obj = hashlib.md5(url.encode())  # Gerando um hash MD5
    return hash_obj.hexdigest()[:6]  # Pegando os primeiros 6 caracteres

# Rota principal (renderiza o frontend)
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/politica-de-privacidade')
def politica():
    return render_template('politica.html')

@app.route('/calculadora-credito-ctps')
def credito():
    return render_template('credito.html')

@app.route('/ads.txt')
def noindex():
    # r = Response(response="User-Agent: *\nDisallow: /\n", status=200, mimetype="text/plain")
    # r.headers["Content-Type"] = "text/plain; charset=utf-8"
    return render_template("ads.txt")
    

# API para encurtar link
@app.route('/encurtar', methods=['POST'])
def encurtar():
    data = request.json
    url_original = data.get("url")

    if not url_original:
        return jsonify({"erro": "Nenhuma URL fornecida"}), 400

    url_encurtada = gerar_encurtado(url_original)
    
    # Captura o domínio atual do site automaticamente
    dominio_atual = request.host_url  # Exemplo: "https://meusite.com/"
    link_final = f"{dominio_atual}{url_encurtada}"  # Cria o link encurtado correto

    # Salvar no banco SQLite
    conexao = sqlite3.connect("database.db")
    cursor = conexao.cursor()
    cursor.execute("INSERT INTO links (url_original, url_encurtada) VALUES (?, ?)", (url_original, link_final))
    conexao.commit()
    conexao.close()

    return jsonify({"link_encurtado": link_final})

# Redirecionamento ao acessar um link encurtado
@app.route('/<codigo>')
def redirecionar(codigo):
    conexao = sqlite3.connect("database.db")
    cursor = conexao.cursor()
    cursor.execute("SELECT url_original FROM links WHERE url_encurtada LIKE ?", (f"%/{codigo}",))
    resultado = cursor.fetchone()
    conexao.close()

    if resultado:
        return redirect(resultado[0])  # Redireciona para o link original
    else:
        return "Link não encontrado", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
