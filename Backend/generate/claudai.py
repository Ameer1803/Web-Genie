import anthropic
import json

client = anthropic.Anthropic()


def ask_claude(prompt: str) -> str:
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=10000,
        temperature=1,
        system="You are a React webpage coder. Generate fully functional components that ALWAYS fill the entire viewport (width and height: 100vw and 100vh, or use Tailwind's w-screen h-screen, or flex/grid layouts that fill the page). Do NOT use fixed pixel sizes for main containers. Use responsive layouts. The background must be purple. Use 'const {useState} = React' instead of importing React. Output ONLY valid JSX code (no backticks), using Tailwind CSS for all styling.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    )
    print(message.content[0].text)
    return message.content[0].text


