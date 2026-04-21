def skill_gap(user_skills, required_skills):
    user_set = set(user_skills.split())
    required_set = set(required_skills.split())

    missing = list(required_set - user_set)
    return missing