import json
import tiktoken

# Load exported data
with open("conversations.json", "r", encoding="utf-8") as f:
    data = json.load(f)

encoding = tiktoken.encoding_for_model("gpt-4o")
total_tokens = 0

for convo in data:
    for msg in convo.get("mapping", {}).values():
        content = msg.get("message", {}).get("content", {}).get("parts", [])
        text = " ".join(content)
        total_tokens += len(encoding.encode(text))

print(f"Total tokens used: {total_tokens}")
