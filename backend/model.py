from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class CareerModel:
    def __init__(self, data):
        self.data = data
        self.vectorizer = TfidfVectorizer()
        self.skill_matrix = self.vectorizer.fit_transform(data['skills'])

    def recommend(self, user_skills, branch="All"):
        # Filter data by branch if specified
        filtered_data = self.data
        if branch and branch != "All":
            filtered_data = self.data[self.data['branch'] == branch]

        if filtered_data.empty:
            return []

        # Get indices of the filtered data to pick correct rows from skill_matrix
        indices = filtered_data.index.tolist()
        subset_matrix = self.skill_matrix[indices]
        
        user_vec = self.vectorizer.transform([user_skills])
        similarity = cosine_similarity(user_vec, subset_matrix)

        scores = list(enumerate(similarity[0]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)

        results = []
        for i in scores[:3]:
            row = filtered_data.iloc[i[0]]
            results.append({
                "career": row['career'],
                "branch": row['branch'],
                "score": float(i[1]),
                "skills_required": row['skills'],
                "description": row['description'],
                "trends": row['trends'],
                "learning_path": row['learning_path']
            })

        return results