import pandas as pd
import seaborn as sns
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
df = pd.read_csv('data.csv')
df = df.dropna(axis=1)
df['diagnosis'].value_counts()
sns.countplot(x='diagnosis', data=df, label="count")
lb = LabelEncoder()
df.iloc[:, 1] = lb.fit_transform(df.iloc[:, 1].values)
df.head(20)
plt.figure(figsize=(100,100))
sns.heatmap(df.iloc[:, 1:32].corr(), annot=True)
sns.pairplot(df.iloc[:, 1:5], hue="diagnosis")
X=df.iloc[:, 2:32].values
y = df.iloc[:, 1].values
X_train, X_test, y_train, y_test = train_test_split(X,y, test_size=0.2, random_state=0)
from sklearn.preprocessing import StandardScaler
st  = StandardScaler()
X_train  = st.fit_transform(X_train)
X_test = st.fit_transform(X_test)
from sklearn.linear_model import LinearRegression
lin = LinearRegression()
lin.fit(X_train, y_train)
import pickle
pickle.dump(lin, open("modelpfa.pkl", "wb"))
pickle.load(open("modelpfa.pkl", "rb"))