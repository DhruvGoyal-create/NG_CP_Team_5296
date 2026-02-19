import streamlit as st
import google.generativeai as genai
import json
from datetime import datetime

st.title("Proto Assist")

genai.configure(api_key="AIzaSyBesPAyzg03eWWH32v167SbiLfc429NDmM")
models = genai.GenerativeModel("models/gemini-2.5-flash")

# Project-specific context
PROJECT_CONTEXT = """
You are a helpful assistant for this project. The project appears to be a web application with:
- Frontend built with HTML, CSS, JavaScript
- Backend using Python with Streamlit
- Multiple modules including user authentication, support system, and main interface
- Located in the et--ankush--t7p directory structure

Please provide assistance related to:
- Web development questions
- Python/Streamlit coding help
- Project structure and organization
- Debugging and troubleshooting
- Best practices for web applications

If asked about topics unrelated to this project, gently redirect the conversation back to project-related matters.
"""

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "Hello! I'm your assistant. How can I help you with your project today?"}]

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Sidebar for chat history
st.sidebar.title("Chat History")

# Save current chat to history
if st.sidebar.button("Save Current Chat"):
    if len(st.session_state.messages) > 1:
        chat_name = f"Chat {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        st.session_state.chat_history.append({
            "name": chat_name,
            "messages": st.session_state.messages.copy(),
            "timestamp": datetime.now().isoformat()
        })
        st.sidebar.success(f"Chat saved as '{chat_name}'")
    else:
        st.sidebar.warning("No messages to save")

# Display and load previous chats
if st.session_state.chat_history:
    st.sidebar.subheader("Previous Chats")
    for i, chat in enumerate(st.session_state.chat_history):
        if st.sidebar.button(chat["name"], key=f"load_{i}"):
            st.session_state.messages = chat["messages"].copy()
            st.rerun()

# Main chat interface
st.subheader("Current Chat")
for message in st.session_state.messages:
    st.chat_message(message["role"]).write(message["content"])

# User input
user_input = st.chat_input("What are your thoughts, today?")

if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})
    st.chat_message("user").write(user_input)
    
    try:
        full_prompt = f"{PROJECT_CONTEXT}\n\nUser Question: {user_input}"
        response = models.generate_content(full_prompt)
        
        assistant_response = response.text
        st.session_state.messages.append({"role": "assistant", "content": assistant_response})
        st.chat_message("assistant").write(assistant_response)
        
    except Exception as e:
        error_message = f"Sorry, I encountered an error: {str(e)}"
        st.session_state.messages.append({"role": "assistant", "content": error_message})
        st.chat_message("assistant").write(error_message)

# Clear chat button
if st.button("Clear Current Chat"):
    st.session_state.messages = [{"role": "assistant", "content": "Hello! I'm your assistant. How can I help you with your questions today?"}]
    st.rerun()

# Clear all history button
if st.sidebar.button("Clear All History"):
    st.session_state.chat_history = []
    st.session_state.messages = [{"role": "assistant", "content": "Hello! I'm your assistant. How can I help you with your questions today?"}]
    st.rerun()
