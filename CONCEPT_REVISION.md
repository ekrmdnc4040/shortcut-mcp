# Concept Revision: Prompt Shortcut MCP

## Original Concept vs New Understanding

### What Was Built Initially
- macOS Shortcuts integration MCP
- System automation through Shortcuts app
- Creating/executing macOS shortcuts programmatically

### What Is Actually Needed
- **Prompt Shortcut System** for LLMs
- Custom command shortcuts like `/th`, `/ider`
- Quick prompt templates and role assignments
- User-defined shortcuts for common LLM interactions

## New Vision: Prompt Shortcut MCP

### Core Concept
Allow users to create custom shortcuts that LLMs can recognize and execute:

```
/th → "Think harder about this problem. Analyze it step by step with deep reasoning."

/ider → "You are a science fiction writer. Based on the following prompt, write a 500-word story: [user input]"

/code → "You are an expert programmer. Write clean, documented code for: [user input]"

/explain → "Explain this concept in simple terms that a beginner can understand: [user input]"
```

### Key Features Needed

1. **Custom Shortcut Creation**
   - Users define their own shortcuts
   - Flexible prompt templates with variables
   - Role-based shortcuts for different personas

2. **Shortcut Management**
   - Add, edit, delete shortcuts
   - List available shortcuts
   - Import/export shortcut collections

3. **Smart Execution**
   - Parse shortcuts in user messages
   - Replace with full prompts
   - Handle variables and parameters

4. **Categories and Organization**
   - Group shortcuts by type (writing, coding, analysis, etc.)
   - Tag system for easy discovery
   - Favorites and frequently used

## Example Usage Scenarios

### Scenario 1: Quick Thinking Enhancement
```
User: "/th How can we solve climate change?"
System: Expands to: "Think harder about this problem. Analyze it step by step with deep reasoning. How can we solve climate change?"
```

### Scenario 2: Role-Playing Shortcut
```
User: "/ider 故事发生在2150年的火星殖民地..."
System: Expands to: "You are a science fiction writer. Based on the following prompt, write a 500-word story: 故事发生在2150年的火星殖民地..."
```

### Scenario 3: Code Generation
```
User: "/code Create a Python function to calculate Fibonacci numbers"
System: Expands to: "You are an expert programmer. Write clean, documented code for: Create a Python function to calculate Fibonacci numbers"
```

## Implementation Plan

### Phase 1: Core Shortcut System
- Shortcut storage and retrieval
- Basic command parsing
- CRUD operations for shortcuts

### Phase 2: Advanced Features
- Template variables and parameters
- Category and tag system
- Import/export functionality

### Phase 3: Smart Features
- Auto-completion suggestions
- Usage analytics
- Smart recommendations

Would you like me to proceed with redesigning the MCP based on this new understanding?
