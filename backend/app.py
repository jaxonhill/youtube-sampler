from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from pytube import YouTube
import re

YOUTUBE_REGEX = re.compile(
    r"^(https?:\/\/)?(www\.)?youtube\.com\/(watch\?v=)?[a-zA-Z0-9_-]+$"
)
app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Get the link from the post request
        frontend_request_info = request.get_json()
        link = frontend_request_info["ytLink"]
        print(frontend_request_info)
        print(link)

        # Check if the link is a YouTube link
        if not re.match(YOUTUBE_REGEX, link):
            return jsonify({"error": "That YouTube link failed."})

        # Create the YouTube object and get the title
        yt = YouTube(link)
        title = yt.title

        # Filter the streams to get only get the highest quality audio stream
        audio_stream = yt.streams.get_audio_only()

        # Get the URL of the audio stream
        audio_url = audio_stream.url

        # Create some json for the frontend to fetch
        response = {
            "link": link,
            "title": title,
            "audio_url": audio_url,
        }

        return jsonify(response)

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
