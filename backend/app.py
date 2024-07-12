from flask import Flask, request, jsonify
import moviepy.editor as mp
import speech_recognition as sr
from textblob import TextBlob
import re
import language_tool_python

app = Flask(__name__)

# Function to transcribe audio from video
def transcribe_video(video_path):
    try:
        # Load video and extract audio
        video = mp.VideoFileClip(video_path)
        audio_path = "temp_audio.wav"
        video.audio.write_audiofile(audio_path)

        # Transcribe audio
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source, duration=None)  # No timeout set
            transcript = recognizer.recognize_google(audio_data)
        return transcript
    except Exception as e:
        print("Error during transcription:", e)
        return ""

# Function to perform sentiment analysis
def analyze_sentiment(text):
    blob = TextBlob(text)
    sentiment_score = blob.sentiment.polarity
    return sentiment_score

# Function to count filler words
def count_fillers(text):
    fillers = re.findall(r'\b(um|uh|you know)\b', text, flags=re.IGNORECASE)
    filler_count = len(fillers)
    return filler_count

# Function to check grammar errors
def check_grammar(text):
    try:
        tool = language_tool_python.LanguageTool('en-US')
        matches = tool.check(text)
        errors = len(matches)
        return errors
    except Exception as e:
        print("Error checking grammar:", e)
        return 0

# Function to provide suggestions based on analysis results
def provide_suggestions(sentiment_score, filler_count, grammar_errors):
    suggestions = []

    # Suggestions based on sentiment score
    if sentiment_score > 0.1:
        suggestions.append("Your speech seems quite positive. Maybe you can emphasize your positive experiences or achievements more.")
    else:
        suggestions.append("Try to inject more positivity into your speech. Share some positive anecdotes or experiences.")

    # Suggestions based on filler count
    if filler_count > 4:
        suggestions.append("You used a lot of filler words in your speech. Try to speak more slowly and pause instead of using fillers like 'um' or 'uh'.")
    else:
        suggestions.append("Your speech could be smoother with fewer filler words. Try to speak more slowly and think before speaking.")

    # Suggestions based on grammar errors
    if grammar_errors > 4:
        suggestions.append("There are several grammar errors in your speech. Review and correct them to improve clarity and professionalism.")
    else:
        suggestions.append("Your speech has some minor grammar errors. Review them to improve clarity and professionalism.")

    return suggestions

@app.route('/analyze-video', methods=['POST'])
def analyze_video():
    try:
        # Specify your video file path here
        video_path = r"C:\Users\abhis\Downloads\SELF-INTRODUCTION video for ESL Teaching _ #Selfintroductionforeslteacher #selfintroduction.mp4"

        # Transcribe video
        transcript = transcribe_video(video_path)

        if transcript:
            # Perform sentiment analysis
            sentiment_score = analyze_sentiment(transcript)

            # Count filler words
            filler_count = count_fillers(transcript)

            # Check grammar errors
            grammar_errors = check_grammar(transcript)

            # Provide suggestions based on analysis results
            suggestions = provide_suggestions(sentiment_score, filler_count, grammar_errors)

            # Return analysis results
            return jsonify({
                'transcript': transcript,
                'sentiment_score': sentiment_score,
                'filler_count': filler_count,
                'grammar_errors': grammar_errors,
                'suggestions': suggestions
            })
        else:
            return jsonify({'error': 'Transcription failed or no speech detected in the audio.'})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
