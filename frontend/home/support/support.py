import streamlit as st
import google.generativeai as genai
from datetime import datetime

st.title("Live Support System")

import os
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")

# Support-specific context
SUPPORT_CONTEXT = """
You are a helpful customer support assistant for Smart Spend, a financial management application. 
Your role is to provide professional, helpful, and concise support to users.

Please assist with:
- Account and billing questions
- Technical support for the Smart Spend application
- Feature explanations and tutorials
- Troubleshooting common issues
- General customer service

Be friendly, professional, and solution-oriented. If you cannot resolve an issue, 
suggest alternative support options like phone or email support.
"""

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "👋 Hello! I'm your Smart Spend support assistant. How can I help you today?"}]

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Sidebar for chat history
st.sidebar.title("Support Chat History")

# Save current chat to history
if st.sidebar.button("Save Current Chat"):
    if len(st.session_state.messages) > 1:
        chat_name = f"Support Chat {datetime.now().strftime('%Y-%m-%d %H:%M')}"
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
    st.sidebar.subheader("Previous Support Chats")
    for i, chat in enumerate(st.session_state.chat_history):
        if st.sidebar.button(chat["name"], key=f"load_{i}"):
            st.session_state.messages = chat["messages"].copy()
            st.rerun()

# Main chat interface
st.subheader("💬 Live Support Chat")
for message in st.session_state.messages:
    st.chat_message(message["role"]).write(message["content"])

# User input
user_input = st.chat_input("Type your support question here...")

if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})
    st.chat_message("user").write(user_input)
    
    try:
        full_prompt = f"{SUPPORT_CONTEXT}\n\nCustomer Question: {user_input}"
        response = model.generate_content(full_prompt)
        
        assistant_response = response.text
        st.session_state.messages.append({"role": "assistant", "content": assistant_response})
        st.chat_message("assistant").write(assistant_response)
        
    except Exception as e:
        error_message = f"Sorry, I encountered an error: {str(e)}. Please try again or contact support through other channels."
        st.session_state.messages.append({"role": "assistant", "content": error_message})
        st.chat_message("assistant").write(error_message)

# Action buttons
col1, col2 = st.columns(2)

with col1:
    if st.button("🔄 Clear Chat"):
        st.session_state.messages = [{"role": "assistant", "content": "👋 Hello! I'm your Smart Spend support assistant. How can I help you today?"}]
        st.rerun()

with col2:
    if st.sidebar.button("🗑️ Clear All History"):
        st.session_state.chat_history = []
        st.session_state.messages = [{"role": "assistant", "content": "👋 Hello! I'm your Smart Spend support assistant. How can I help you today?"}]
        st.rerun()

# Additional support options
st.markdown("---")
st.subheader(" Other Support Options")

col1, col2 = st.columns(3)

with col1:
    st.info("📧 **Email Support**\n\nsupport@smartspend.com\n\nResponse time: 2-4 hours")

with col2:
    st.info("💬 **Live Chat**\n\nAvailable now\n\nAverage response: 2 minutes")

