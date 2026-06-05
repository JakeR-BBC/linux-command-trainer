- Data foundation ✅
- Basic drill loop ✅
- Scoring and progression ✅ 
- Modes (recall, recognition, scenario) ✅
- Polish ✅
- Side rail for quick navigation ✅
- Expanded scenario mode requiring specific arguments (e.g. chmod -r)

- **Realism** — type the full command including flags and arguments for a practical situation (beginner challenges)
- **Mastery** — same but with more complex, expert-level challenges

### Challenge data
Each command in `commands.json` will gain a `challenges` array:
```json
"challenges": [
  {
    "prompt": "Practical situation description",
    "valid_answers": ["cmd -flag arg", "cmd -alternative arg"],
    "mode": "realism"
  },
  {
    "prompt": "More complex expert situation",
    "valid_answers": ["cmd -flag arg", "cmd -alternative arg"],
    "mode": "mastery"
  }
]
```

### Hint system
Optional hints available during drilling, with a scoring penalty for use.

### Score / results screen
End of session summary showing correct, incorrect, streak, and commands to revisit.

- User accounts as an upgrade from localStorage
- Proper score/results screen at the end of a session
- Guided journey mode (recognition → recall → scenario)
- Hint system