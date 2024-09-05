from flask import Flask, request, g, current_app, jsonify, Response
from flask_cors import CORS
from config import Config
from services.llm_client import LlmClient


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    with app.app_context():
        get_llm_client()

    @app.route("/ping", methods=["GET"])
    def ping():
        return jsonify({"ok": True})

    @app.route("/prompt", methods=["POST"], endpoint="prompt")
    def prompt():
        input = request.json["content"].strip()
        llm_client = get_llm_client()

        output = llm_client.get_llm_response(input=input)

        return jsonify({"content": output})
    
    @app.route("/prompt/stream", methods=["POST"], endpoint="prompt_stream")
    def prompt_stream():
        input = request.json["content"].strip()
        llm_client = get_llm_client()

        output = llm_client.get_llm_response_stream(input=input)

        return Response(output, mimetype="text/event-stream")

    return app


def get_llm_client():
    if not hasattr(g, "llm_client"):
        g.llm_client = LlmClient(
            ollama_instance_url=current_app.config["OLLAMA_INSTANCE_URL"],
            model=current_app.config["MODEL"],
        )
    return g.llm_client


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=app.config["APP_PORT"], debug=app.config["DEBUG"])
