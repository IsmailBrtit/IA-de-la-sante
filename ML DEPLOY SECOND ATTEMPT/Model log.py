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
selected_features = ['radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean', 'smoothness_mean',
                     'compactness_mean', 'concavity_mean', 'concave points_mean', 'symmetry_mean',
                     'fractal_dimension_mean', 'radius_se', 'texture_se', 'perimeter_se', 'area_se',
                     'smoothness_se', 'compactness_se', 'concavity_se', 'concave points_se', 'symmetry_se',
                     'fractal_dimension_se', 'radius_worst', 'texture_worst', 'perimeter_worst', 'area_worst',
                     'smoothness_worst', 'compactness_worst', 'concavity_worst', 'concave points_worst',
                     'symmetry_worst', 'fractal_dimension_worst']
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
