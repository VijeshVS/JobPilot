import json

def extract_edit_and_clean_json(file_path: str):
    # ---------- READ FILE ----------
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    # ---------- EXTRACT JSON ----------
    start = text.find("{")
    if start == -1:
        raise ValueError("No JSON object found")

    brace_count = 0
    json_str = None

    for i in range(start, len(text)):
        if text[i] == "{":
            brace_count += 1
        elif text[i] == "}":
            brace_count -= 1

        if brace_count == 0:
            json_str = text[start:i + 1]
            break

    if not json_str:
        raise ValueError("Incomplete JSON")

    data = json.loads(json_str)

    # ---------- EDIT / NORMALIZE JSON ----------

    # 1️⃣ Ensure arrays exist
    data.setdefault("links", [])
    data.setdefault("projects", [])
    data.setdefault("experience", [])
    data.setdefault("technical_skills", [])

    # 2️⃣ Remove duplicate GitHub links
    seen = set()
    unique_links = []

    for link in data["links"]:
        key = (link.get("platform"), link.get("username"))
        if key not in seen:
            seen.add(key)
            unique_links.append(link)

    data["links"] = unique_links

    # 3️⃣ Trim whitespace everywhere
    def clean_value(val):
        if isinstance(val, str):
            return val.strip()
        if isinstance(val, list):
            return [clean_value(v) for v in val]
        if isinstance(val, dict):
            return {k: clean_value(v) for k, v in val.items()}
        return val

    data = clean_value(data)

    # ---------- WRITE CLEAN JSON ONLY ----------
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return data

