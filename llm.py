from flask import Flask, request, jsonify
from transformers import pipeline
import sys

# --- Load the model ONCE when the server starts ---
print("Loading financial advisor LLM...")
try:
    # Load the text-generation pipeline with your chosen model
    model = pipeline("text-generation", model="TinyLlama/TinyLlama-1.1B-Chat-v1.0")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Create a Flask web server
app = Flask(__name__)

@app.route('/get-advice', methods=['POST'])
def get_advice():
    """
    This endpoint receives a prompt and returns financial advice from the LLM.
    """
    if model is None:
        return jsonify({"error": "Model is not available."}), 500

    data = request.get_json()
    if not data or 'prompt' not in data:
        return jsonify({"error": "Prompt not provided."}), 400

    prompt = data['prompt']

    try:
        # --- Generate response using the pre-loaded model ---
        response = model(prompt, max_length=400, temperature=0.7)[0]['generated_text']

        # Extract only the assistant's response from the generated text
        assistant_response = response.split("<|assistant|>")[-1].strip()
        if "<|" in assistant_response:
            assistant_response = assistant_response.split("<|")[0].strip()

        return jsonify({"response": assistant_response})

    except Exception as e:
        print(f"Error during text generation: {e}")
        return jsonify({"error": "Failed to generate response."}), 500

if __name__ == '__main__':
    # Run the Flask server on port 5000, accessible from any IP
    app.run(host='0.0.0.0', port=5000)