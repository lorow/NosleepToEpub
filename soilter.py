from flask import Flask
from flask import make_response
from flask import request
from flask import Response
from flask import send_from_directory
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from rq import Queue
from werkzeug.exceptions import NotFound

from worker import conn


app = Flask(__name__, static_folder="./frontend/build/")
app.config.from_object("nosleepToEpub.config.ProductionConfig",)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

q = Queue(connection=conn)

# import the models so that they are known to flask
from nosleepToEpub import db as nosleepModels  # noreorder # noqa


@app.route("/")
def index():
    try:
        return send_from_directory("./frontend/build/", "index.html")
    except NotFound:
        return (
            "Frontend not yet implemented,",
            "working as an API or someone forgot to run npm build",
        )


@app.route("/generate/", methods=["POST"])
def generate():
    """
        Endpoint for processing the data sent from the frontend
    """
    from nosleepToEpub.processors.LinkProcessor import LinkProcessor

    # EpubEntry()
    processor = LinkProcessor(data=request.json, model_uuid="")
    job = q.enqueue_call(processor.start)
    return make_response(job.get_id(), 201)


@app.route("/stream/<book_id>/")
def stream(book_id):
    p = conn.pubsub()
    p.psubscribe("book_status")

    def test(book_id, p):

        should_print = True

        while should_print:
            message = p.get_message()
            status = message["data"]
            yield bytes(status)

    p.unsubscribe()
    return Response(test(book_id, p), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run()
