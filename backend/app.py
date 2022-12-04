from flask import Flask, render_template, request
from pytube import YouTube
import re

YOUTUBE_REGEX = re.compile(
    r"^(https?:\/\/)?(www\.)?youtube\.com\/(watch\?v=)?[a-zA-Z0-9_-]+$"
)
app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Get the link from the post request
        link = request.form.get("ytlink")

        try:
            # Create the YouTube object and get the title
            yt = YouTube(link)
            title = yt.title

            # Filter the streams to get only get the highest quality audio stream
            audio_stream = yt.streams.get_audio_only()

            # Get the URL of the audio stream
            audio_url = audio_stream.url

            # Send the information to the user on the client side
            return render_template(
                "success.html",
                link=link,
                title=title,
                stream=audio_stream,
                audio_url=audio_url,
            )
        except:
            return render_template("failure.html")

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
