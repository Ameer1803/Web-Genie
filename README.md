
Many things were tried out under experimentation which finally never made the cut. By publicly showing version history, one can learn steps on implementing a project from scratch, building a frontend, backend, integrating etc. and scratching out features if it simply isn't worth the headache. 

__People don't know about what you're "planning" on coding, you have to code the best of what you've coded, quality matters__

## Simpler Implementation

You can find simpler llm inference in `llm.py` which does not use agentic approach. Other llms can also be found under `\archives` folder, including claude, openAI, and github's models.

## Version History


Current Version: v1.2

- Implemented agentic recursive loop for validation using pseudo-compile tool
- Refinement pipeline incorporated to improve via human-in-the-loop concept
- Improved styling issues by precomputing tailwind classes

Previous Version: v1.1

- Significantly improved home UI and theme
- Generated page incorporated with an overlay to refine page
- Virtual file system implemented to sandbox and generate multiple components together

Previous Version: v1

- Well designed loading and home page UI
- Claude API connected for backend
- Organized file structure

Previous Version: v0

- LLM connected using github API
- Base webpage using react+vite template
- Connected makeshift backend to frontend to take in prompts and generate components