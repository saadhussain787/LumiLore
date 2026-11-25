# Workspace Token-Efficiency & Model-Advisor Rules

1. **Model & Thinking Header:** Output a 1-line `⚡ Recommended Model & Thinking Level` header before starting any multi-step plan or execution (e.g., `Flash (Low Thinking)` for mechanical edits/builds; `Pro / Hydrogen (Low-Medium Thinking)` for complex architecture or debugging).
2. **Batch Parallel Tool Calls:** Always issue independent `read_file`, search, and `edit_file` calls in parallel per turn—never 1 tool call per turn when multiple targets are known.
3. **Lightweight Subagent Routing:** Route read-only bulk checks, file scans, or boilerplate subagent tasks to `Model: 'flash'` or `'flash_lite'` when delegating.
4. **Context Hygiene:** Recommend `/compact` when a conversation exceeds ~15–20 turns, or suggest starting a fresh chat per Sprint to keep baseline context overhead minimal.
