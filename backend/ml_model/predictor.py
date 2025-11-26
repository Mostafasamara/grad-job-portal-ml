# ml_model/predictor.py
import os
import joblib
import docx2txt
import PyPDF2

# Paths to model and vectorizer files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.joblib')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'vectorizer.joblib')

# Load once at module level
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

def extract_text_from_file(file_path):
    if file_path.endswith(".pdf"):
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            text = " ".join(page.extract_text() or "" for page in reader.pages)
    elif file_path.endswith(".docx"):
        text = docx2txt.process(file_path)
    else:
        raise ValueError("Unsupported file type: only .pdf or .docx allowed")
    return text

def predict_category(file_path):
    text = extract_text_from_file(file_path)
    features = vectorizer.transform([text])
    prediction = model.predict(features)[0]
    return prediction
