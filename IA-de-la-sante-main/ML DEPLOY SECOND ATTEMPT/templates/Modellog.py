import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import pickle

# Load the dataset
df = pd.read_csv('data.csv')

# Drop columns with missing values
df = df.dropna(axis=1)

# Encode the diagnosis (target) variable
df['diagnosis'] = df['diagnosis'].map({'M': 1, 'B': 0})

# Feature Selection
selected_features = ['radius_mean', 'texture_mean', ..., 'fractal_dimension_worst']
X = df[selected_features].values
y = df['diagnosis'].values

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# Standardize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train logistic regression model
logistic_model = LogisticRegression()
logistic_model.fit(X_train, y_train)

# Save the trained model to a file
pickle.dump(logistic_model, open("breast_cancer_model.pkl", "wb"))
pickle.load(open("breast_cancer_model.pkl", "rb"))
