import spacy
import random
import sys


nlp = spacy.load("en_core_web_sm")

# Predefined responses for different users
anonymous_user_responses = {
    "hi": ["Hello! How can I assist you today?", "Hi there! What can I help you with?", "Hey! How can I help you today?"],
    "attendance": ["Please log in to view your attendance details.", "You need to sign in to access your attendance."],
    "fees": ["Please log in to check your fee status.", "Sign in to view your fee details."],
    "marks": ["You need to log in to view your marks.", "Please log in to check your results."],
    "thanks": ["You're welcome! Let me know if you need further help.", "No problem! I'm always here to help."],
}

teacher_responses = {
    "hi": ["Hello! How can I assist you with your teaching tasks?", "Hi there! Do you need assistance with managing your students?"],
    "attendance": ["You can manage and view your students' attendance on the teacher portal.", "Attendance records are available in the teacher's dashboard."],
    "fees": ["Fee details for students are available in the admin portal.", "You can refer to the admin section for fee information."],
    "marks": ["You can update and view student marks in the 'Results' section.", "To manage student marks, go to the 'Marks' tab on your dashboard."],
    "exams": ["Check the exam schedules for your classes on the teacher portal.", "Your upcoming exam dates are listed under the teacher's dashboard."],
    "courses": ["You can view and manage your courses in the 'My Courses' section.", "Courses you're teaching are listed in the teacher's portal."],
    "thanks": ["You're welcome! Let me know if you need further assistance.", "No problem! Feel free to ask if you need anything."],
}


student_responses = {
    "hi": ["Hello! How can I help you with your studies today?", "Hi there! Do you need assistance with your courses?"],
    "attendance": ["You can check your attendance in the student portal.", "Your attendance report is available on your dashboard."],
    "fees": ["Your fee details are available in the student portal.", "Check the 'Fees' section in your student portal for your pending fees."],
    "marks": ["Your marks are available in the 'Results' section of your profile.", "Check the 'Marks' section on your dashboard to view your grades."],
    "exams": ["Your upcoming exam dates are in the 'Exams' tab.", "Check your exam schedule on the student dashboard."],
    "courses": ["Your registered courses are available on your dashboard.", "You can find your enrolled courses under 'My Courses' on the student portal."],
    "thanks": ["You're welcome! Let me know if you need further help.", "No problem! I'm always here to help."],
}




# Function to classify user query
def classify_query(user_input):
    doc = nlp(user_input.lower())  # Convert input to lowercase
    tokens = [token.lemma_ for token in doc]  # Lemmatized tokenized text

    # Check for keywords
    if "attendance" in tokens:
        return "attendance"
    elif "fee" in tokens or "fees" in tokens:
        return "fees"
    elif "mark" in tokens or "grade" in tokens:
        return "marks"
    elif "exam" in tokens or "test" in tokens:
        return "exams"
    elif "course" in tokens or "subject" in tokens:
        return "courses"
    elif "hi" in tokens or "hello" in tokens or "hey" in tokens:
        return "hi"
    elif "thank" in tokens or "thank you" in tokens:
        return "thanks"
    else:
        return "unknown"


# Function to get chatbot response
def get_chatbot_response(query, role="student"):

    category = classify_query(query)

    if role == "Teacher":
        return random.choice(
            teacher_responses.get(category, ["I'm sorry, I don't understand that question."])
        )
    elif role == "Student":
        return random.choice(
            student_responses.get(category, ["I'm sorry, I don't understand that question."])
        )
    else:
        return random.choice(
            anonymous_user_responses.get(category, ["I'm sorry, I don't understand that question."])
        )



# Run the chatbot
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No query provided. Usage: python chatbot.py 'your question'")
    else:
        user_query = sys.argv[1]
        print(get_chatbot_response(user_query,sys.argv[2]))  # Print response
