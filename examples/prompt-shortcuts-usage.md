# Prompt Shortcuts Usage Examples

This document provides comprehensive examples of how to use and create prompt shortcuts with the Shortcut MCP.

## 🚀 Quick Start

### Built-in Shortcuts

The system comes with 5 built-in shortcuts ready to use:

| Command | Purpose | Usage Example |
|---------|---------|---------------|
| `/th` | Think Harder | `/th How can we solve climate change?` |
| `/ider` | Sci-Fi Writer | `/ider A robot becomes self-aware` |
| `/code` | Expert Programmer | `/code Create a Python REST API` |
| `/explain` | Simple Explainer | `/explain How does quantum computing work?` |
| `/pros-cons` | Analysis | `/pros-cons Remote work vs office work` |

### How Shortcuts Work

When you type a shortcut command, it gets expanded into a full prompt:

```
Input:  "/th What are the best programming languages for AI?"
Output: "Think harder about this problem. Analyze it step by step with deep reasoning and consider multiple perspectives. What are the best programming languages for AI?"
```

## 💡 Creating Your Own Shortcuts

### Example 1: Creative Writing Assistant

```json
{
  "name": "create_shortcut",
  "arguments": {
    "command": "/poet",
    "name": "Poetry Writer",
    "description": "Write beautiful poetry in various styles",
    "prompt": "You are a talented poet with deep knowledge of various poetry forms and styles. Write a beautiful poem based on: {input}. Consider rhythm, imagery, and emotional depth.",
    "category": "writing",
    "tags": ["poetry", "creative", "literature"]
  }
}
```

**Usage:**
```
User: "/poet The beauty of a sunset over the ocean"
→ Expands to full poetry writing prompt with detailed instructions
```

### Example 2: Business Analyst

```json
{
  "name": "create_shortcut",
  "arguments": {
    "command": "/biz",
    "name": "Business Analyst",
    "description": "Analyze business scenarios and provide insights",
    "prompt": "You are an experienced business analyst. Analyze the following business scenario and provide strategic insights, potential risks, opportunities, and actionable recommendations: {input}",
    "category": "analysis",
    "tags": ["business", "strategy", "analysis"]
  }
}
```

### Example 3: Language Tutor

```json
{
  "name": "create_shortcut",
  "arguments": {
    "command": "/teach",
    "name": "Language Tutor",
    "description": "Teach languages with examples and explanations",
    "prompt": "You are a patient and knowledgeable language tutor. Help me learn by explaining the following concept clearly, providing examples, and suggesting practice exercises: {input}",
    "category": "explaining",
    "tags": ["education", "language", "teaching"]
  }
}
```

## 🎯 Real-World Scenarios

### Scenario 1: Daily Workflow Enhancement

**Morning Planning:**
```
User: "/th What should I prioritize today to maximize productivity?"
→ Gets deep analysis of productivity strategies and prioritization methods
```

**Content Creation:**
```
User: "/ider A story about AI and human collaboration in 2050"
→ Gets a compelling sci-fi story with rich details and character development
```

**Technical Problem Solving:**
```
User: "/code Fix memory leaks in React applications"
→ Gets expert-level code solutions and best practices
```

### Scenario 2: Learning and Research

**Understanding Complex Topics:**
```
User: "/explain The relationship between quantum mechanics and consciousness"
→ Gets clear, accessible explanation with analogies and examples
```

**Decision Making:**
```
User: "/pros-cons Should I learn Python or JavaScript first?"
→ Gets balanced analysis of both options with recommendations
```

### Scenario 3: Creative Projects

**Story Development:**
```
User: "/ider 在2150年的火星殖民地，人类和AI共同治理社会。主要角色是一名女科学家和她的AI助手，他们在一次实验中发现了火星地下未知生命。"
→ Gets rich sci-fi story following the detailed prompt requirements
```

**Poetry Creation:**
```
User: "/poet The melancholy of autumn leaves falling"
→ Gets beautiful, evocative poetry capturing the essence of autumn
```

## 🔧 Advanced Usage

### Managing Your Shortcuts

**List all shortcuts:**
```json
{
  "name": "list_shortcuts",
  "arguments": {}
}
```

**Find shortcuts by category:**
```json
{
  "name": "list_shortcuts",
  "arguments": {
    "category": "writing",
    "favorites": true
  }
}
```

**Search for specific shortcuts:**
```json
{
  "name": "list_shortcuts",
  "arguments": {
    "search": "debug",
    "limit": 5
  }
}
```

### Updating Shortcuts

**Make a shortcut your favorite:**
```json
{
  "name": "update_shortcut",
  "arguments": {
    "id": "shortcut_12345",
    "isFavorite": true
  }
}
```

**Update the prompt template:**
```json
{
  "name": "update_shortcut",
  "arguments": {
    "id": "shortcut_12345",
    "prompt": "Enhanced prompt with better instructions and more context: {input}"
  }
}
```

### Getting Detailed Information

```json
{
  "name": "get_shortcut_details",
  "arguments": {
    "id": "shortcut_12345"
  }
}
```

## 🎨 Template Variables

### Basic Variable Usage

Use `{input}` in your prompt templates to insert user input:

```
Prompt: "You are an expert in {input}. Explain this topic clearly."
Input: "/myshortcut quantum physics"
Result: "You are an expert in quantum physics. Explain this topic clearly."
```

### Advanced Template Ideas

**Conditional Logic (Future Feature):**
```
"You are a {role}. {if:technical}Provide technical details.{else}Keep it simple.{endif} Topic: {input}"
```

**Multiple Variables (Future Feature):**
```
"You are a {role} helping with {task}. Focus on {aspect}. Topic: {input}"
```

## 📊 Best Practices

### 1. Naming Conventions

- **Use short, memorable commands**: `/th`, `/code`, `/debug`
- **Be consistent**: If you use `/code`, use `/debug` not `/dbg`
- **Avoid conflicts**: Check existing shortcuts before creating new ones

### 2. Prompt Design

- **Be specific**: Clear instructions yield better results
- **Include context**: Specify the role or expertise level
- **Use examples**: Include example formats when helpful
- **Test iterations**: Refine prompts based on actual usage

### 3. Organization

- **Use categories**: Group related shortcuts together
- **Add meaningful tags**: Help with discovery and organization
- **Set favorites**: Mark your most-used shortcuts
- **Regular cleanup**: Remove shortcuts you no longer use

### 4. Template Variables

- **Always use {input}**: Include user input in your templates
- **Consider context**: Some prompts might need additional context
- **Plan for expansion**: Design templates that can grow with features

## 🛠️ Troubleshooting

### Common Issues

**Shortcut not expanding:**
- Ensure command starts with `/`
- Check spelling (commands are case-sensitive)
- Verify the shortcut exists with `list_shortcuts`

**Template not working:**
- Ensure you use `{input}` in your prompt template
- Check for typos in variable names
- Test with simple inputs first

**Permission errors:**
- Check file permissions for `~/.shortcut-mcp/`
- Ensure the MCP server has write access
- Try running with different permissions if needed

### Debug Commands

**Check if shortcut exists:**
```json
{
  "name": "list_shortcuts",
  "arguments": {
    "search": "th"
  }
}
```

**Test shortcut expansion:**
```json
{
  "name": "parse_shortcut",
  "arguments": {
    "input": "/th test input"
  }
}
```

## 🚀 Tips for Power Users

### 1. Create Shortcut Families

Group related shortcuts with consistent naming:
- `/code-python`, `/code-js`, `/code-rust`
- `/write-blog`, `/write-email`, `/write-report`
- `/analyze-data`, `/analyze-market`, `/analyze-code`

### 2. Use Descriptive Tags

Tag shortcuts for easy discovery:
- `["urgent", "work"]` for work-related shortcuts
- `["creative", "fun"]` for creative writing
- `["learning", "technical"]` for educational content

### 3. Build Custom Workflows

Combine shortcuts for complex workflows:
1. Use `/th` to analyze a problem
2. Use `/pros-cons` to evaluate options
3. Use `/code` to implement the solution

### 4. Share Your Best Shortcuts

Export your favorite shortcuts to share with others:
- Document your most effective prompts
- Share with team members or community
- Build collections for specific domains

This comprehensive guide should help you master the Prompt Shortcut system and build powerful, personalized AI interactions!
