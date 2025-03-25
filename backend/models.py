import re
import pickle
import os
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import login
import warnings
warnings.filterwarnings("ignore")
load_dotenv()
login(os.getenv("Hugging_face_token"))


# Load trained SVM model & vectorizer
with open("svm_model.pkl", "rb") as model_file:
    Loaded_model = pickle.load(model_file)
    Loaded_model.classes_ = ["Negative", "Neutral", "Positive"]

with open("tfidf_vectorizer.pkl", "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

# Load Hugging Face model
tokenizer = AutoTokenizer.from_pretrained("google/gemma-3-1b-it")
model = AutoModelForCausalLM.from_pretrained("google/gemma-3-1b-it")
if tokenizer is None:
    raise ValueError("Tokenizer failed to load! Check your model name or authentication.")

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", "", text) 
    text = re.sub(r"\d+", "", text)  
    text = re.sub(r"[^\w\s]", "", text)  
    return text

def predict_sentiment(text):
    cleaned_text = clean_text(text)
    text_vectorized = vectorizer.transform([cleaned_text]).toarray()  
    prediction = Loaded_model.predict(text_vectorized)  
    return prediction[0]


def chat_with_model(user_message, history, feeling):
    prompt = """
You are an empathetic mental health chatbot trained to give mental health support to the user.
User is currently feeling """ + feeling + """ make the user happy.
Try your best to make the user happy and reply in short english message.
Here is the history chat for reference.
User: I feel sad ChatBot: Every storm runs out of rain. No matter how tough today feels, it won't last forever. You are stronger than you think, and brighter days are ahead. Keep going.
"""

    for i in history:
        if i["type"] == "user":
            prompt += " User: " + i["msg"]
        else:
            prompt += "ChatBot: " + i["msg"]
        prompt += "\n"
    
    prompt = prompt + "User: " + user_message + " ChatBot: "
    input_ids = tokenizer(prompt, return_tensors="pt").input_ids
    output_ids = model.generate(
        input_ids,
        max_new_tokens=80,
        temperature=0.7,
        top_p=0.80,
        eos_token_id=tokenizer.eos_token_id,
        do_sample=True,
    )
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    print(output_text)
    refined = output_text[len(prompt):].split("User:")[0]
    refined = refined.replace("\n", " ").replace("```", "").strip()
    return refined





