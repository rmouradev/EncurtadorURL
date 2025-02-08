from flask import Flask, request, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
import string, random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///urls.db'
db = SQLAlchemy(app)

class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(500), nullable=False)
    short_url = db.Column(db.String(10), unique=True, nullable=False)

def generate_short_url():
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=6))

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        original_url = request.form['url']
        short_url = generate_short_url()
        
        while URL.query.filter_by(short_url=short_url).first():
            short_url = generate_short_url()

        new_url = URL(original_url=original_url, short_url=short_url)
        db.session.add(new_url)
        db.session.commit()

        return f"URL encurtada: {request.host}/{short_url}"

    return render_template('index.html')

@app.route('/<short_url>')
def redirect_to_url(short_url):
    url_entry = URL.query.filter_by(short_url=short_url).first()
    if url_entry:
        return redirect(url_entry.original_url)
    return "URL não encontrada", 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
