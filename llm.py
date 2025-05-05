def get_financial_advice_llm(query):
    """Generate financial advice using open source LLM."""
    try:
        # Load the model
        model = load_llm_model()
        if model is None:
            return "I'm sorry, the language model could not be loaded. Please try again later."
        
        # Add context about the user's financial situation if available
        context = ""
        if st.session_state.user_data['monthly_income'] > 0:
            income = st.session_state.user_data['monthly_income']
            savings = st.session_state.user_data['savings']
            
            if st.session_state.currency == "INR":
                # Convert to INR for display
                income_inr = convert_currency(income, 'INR')
                savings_inr = convert_currency(savings, 'INR')
                context = f"With a monthly income of ₹{income_inr:,.2f} and savings of ₹{savings_inr:,.2f}: "
            else:
                context = f"With a monthly income of ${income:,.2f} and savings of ${savings:,.2f}: "

        # Create a prompt with financial advisor context
        prompt = f"""
        <|system|>
        You are a knowledgeable financial advisor assistant. Provide clear, accurate, and helpful advice on personal finance topics. 
        Keep responses concise but informative. Don't recommend specific investments or make promises about returns.
        </|system|>
        
        <|user|>
        {context}{query}
        </|user|>
        
        <|assistant|>
        """
        
        # Generate response
        response = model(prompt, max_length=400, temperature=0.7, num_return_sequences=1)
        
        # Extract the response text
        generated_text = response[0]['generated_text']
        
        # Extract only the assistant's response
        assistant_response = generated_text.split("<|assistant|>")[-1].strip()
        
        # Clean up the response if needed
        if "<|" in assistant_response:
            assistant_response = assistant_response.split("<|")[0].strip()
            
        return assistant_response
        
    except Exception as e:
        st.error(f"Error with LLM service: {e}")
        return "I'm sorry, I couldn't process your request. Please try again or ask a different question."
    
def load_llm_model():
    try:
        return pipeline("text-generation", model="TinyLlama/TinyLlama-1.1B-Chat-v1.0")
    except Exception as e:
        st.error(f"Error loading LLM model: {e}")
        return None
import sys

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else ""
    if query:
        from transformers import pipeline

        def load_llm_model():
            return pipeline("text-generation", model="TinyLlama/TinyLlama-1.1B-Chat-v1.0")

        def get_response(prompt):
            model = load_llm_model()
            response = model(prompt, max_length=400, temperature=0.7)[0]['generated_text']
            assistant_response = response.split("<|assistant|>")[-1].strip()
            if "<|" in assistant_response:
                assistant_response = assistant_response.split("<|")[0].strip()
            print(assistant_response)

        get_response(query)
    else:
        print("Error: No query provided.")
