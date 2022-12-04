from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
from pytube import YouTube
import re
import json

YOUTUBE_REGEX = re.compile(
    r"^(https?:\/\/)?(www\.)?youtube\.com\/(watch\?v=)?[a-zA-Z0-9_-]+$"
)
app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@cross_origin()
@app.post("/youtube")
def youtube_link():
    # Get the link from the post request
    print(request.method)
    json_data = request.get_json()

    try:
        link = json_data["ytlink"]
        # Create the YouTube object and get the title
        yt = YouTube(link)
        title = yt.title

        # Filter the streams to get only get the highest quality audio stream
        audio_stream = yt.streams.get_audio_only()

        # Get the URL of the audio stream
        audio_url = audio_stream.url

        # Return JSON to user on client side
        response = jsonify(
            {
                "link": link,
                "title": title,
                "audio_url": audio_url,
            }
        )

        return response

    except:
        response = jsonify(
            {
                "error": "Failed to fetch the YouTube information.",
            }
        )

        return response
        # return jsonify({"error": "Failed to fetch the YouTube information."})


@app.get("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
