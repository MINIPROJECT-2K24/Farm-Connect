from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import manhattan_distances
from imblearn.over_sampling import SMOTE

app = Flask(__name__)
CORS(app)

# Load datasets
data = pd.read_csv("./godnpk.csv")
production_data = pd.read_csv("./crop production.csv")  # Columns: Crop, District, Yield, Production

# Feature Engineering (Calculate N/P, P/K, K/N ratios)
data['N_P'] = data['N'] / data['P']
data['P_K'] = data['P'] / data['K']
data['K_N'] = data['K'] / data['N']

# Feature Scaling
scaler = StandardScaler()
scaled_features = scaler.fit_transform(data[['N', 'P', 'K', 'N_P', 'P_K', 'K_N']])

# Prepare Data for Random Forest
X = data[['N', 'P', 'K', 'N_P', 'P_K', 'K_N']]
y = data['Crop']

# Handle Class Imbalance using SMOTE
smote = SMOTE(random_state=42)
X_balanced, y_balanced = smote.fit_resample(X, y)

# Train Random Forest Classifier
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_balanced, y_balanced)

@app.route('/recommend', methods=['POST'])
def recommend_crops():
    request_data = request.get_json()
    n = int(request_data['N'])  # Convert to integer
    p = int(request_data['P'])  # Convert to integer
    k = int(request_data['K'])  # Convert to integer
    user_district = request_data['District']

    # Calculate ratios for input values
    n_p = n / p
    p_k = p / k
    k_n = k / n

    # Standardize input features
    input_features = np.array([[n, p, k, n_p, p_k, k_n]])
    input_scaled = scaler.transform(input_features)

    # Predict suitable crops
    predicted_crops = rf_model.predict(input_scaled)

    # Get crop recommendations based on Manhattan distance
    crop_features = data.groupby('Crop')[['N', 'P', 'K']].mean().reset_index()
    crop_npk_values = crop_features[['N', 'P', 'K']].values
    input_npk = np.array([n, p, k]).reshape(1, -1)
    distances = manhattan_distances(input_npk, crop_npk_values).flatten()
    crop_features['Distance'] = distances
    recommended_crops = crop_features.sort_values(by='Distance').head(4)['Crop'].tolist()

    # Compare recommendations with historical production data
    relevant_production_data = production_data[
        (production_data['Crop'].isin(recommended_crops)) & (production_data['District'] == user_district)
    ]

    if relevant_production_data.empty:
        district_data = production_data[production_data['District'] == user_district]
        if district_data.empty:
            return jsonify({"error": "No data available for the selected district."})
        highest_yield_crop = district_data.groupby('Crop')['Production'].mean().reset_index()
        best_crop = highest_yield_crop.sort_values(by='Production', ascending=False).iloc[0]['Crop']
    else:
        crop_summary = relevant_production_data.groupby('Crop')[['Yield', 'Production']].mean().reset_index()
        best_crop = crop_summary.sort_values(by=['Production', 'Yield'], ascending=False).iloc[0]['Crop']

    # Prepare the final JSON response
    all_crops = [best_crop] + recommended_crops
    response = {"crops": all_crops}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
