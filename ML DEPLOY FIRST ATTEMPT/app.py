import numpy as np
import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle

# Create Flask app
flask_app = Flask(__name__)

# Load the trained model
model = pickle.load(open("modelpfa.pkl", "rb"))

@flask_app.route("/")
def home():
    return render_template("index.html")

@flask_app.route("/predict", methods=["POST"])
def predict():
    # Extract input features from the form
    float_features = [float(x) for x in request.form.values()]
    # Convert features to a numpy array
    features = np.array(float_features).reshape(1, -1)
    # Make prediction
    prediction = model.predict(features)
    # Map prediction to diagnosis
    diagnosis = "Malignant" if prediction == 1 else "Benign"
    # Render diagnosis on the web page
    return render_template("index.html", prediction_text="The tumor is {}".format(diagnosis))

if __name__ == "__main__":
    flask_app.run(debug=True)

