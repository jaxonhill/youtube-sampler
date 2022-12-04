from flask import Flask, render_template, request, jsonify
from pytube import YouTube
import re

YOUTUBE_REGEX = re.compile(
    r"^(https?:\/\/)?(www\.)?youtube\.com\/(watch\?v=)?[a-zA-Z0-9_-]+$"
)
app = Flask(__name__)


@app.post("/youtube")
def youtube_link():
    # Get the link from the post request
    link = request.values.get("ytlink")

    try:
        # Create the YouTube object and get the title
        yt = YouTube(link)
        title = yt.title

        # Filter the streams to get only get the highest quality audio stream
        audio_stream = yt.streams.get_audio_only()

        # Get the URL of the audio stream
        audio_url = audio_stream.url

        # Return JSON to user on client side
        return jsonify(
            {
                "link": link,
                "title": title,
                "audio_url": audio_url,
            }
        )
    except:
        return jsonify({"error": "Failed to fetch the YouTube information."})


@app.get("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
