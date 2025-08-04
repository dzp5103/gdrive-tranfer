# Continuous Coding Agent

This directory contains the automated development workflow system that implements a self-sustaining coding agent.

## Overview

The continuous coding agent analyzes completed PRs, generates development tasks, and maintains ongoing project development automatically.

## Files

- `continuous-agent.js` - Main agent script that orchestrates the automated workflow
- `analysis-*.json` - Historical PR analysis data
- `tasks-*.json` - Generated development tasks with timestamps
- `latest-analysis.json` - Most recent PR analysis
- `latest-tasks.json` - Current active development tasks

## How It Works

1. **PR Analysis**: Analyzes recently merged PRs to understand development patterns
2. **Task Generation**: Creates new development tasks based on analysis patterns
3. **Progress Tracking**: Updates README with current status and metrics
4. **Self-Triggering**: Automatically continues development cycle

## Triggers

The agent runs automatically on:
- Pull request merges
- Changes to the agent-workflow directory
- Daily schedule (2 AM UTC)
- Manual workflow dispatch

## Configuration

The agent uses environment variables:
- `GH_PAT` - GitHub Personal Access Token for API operations
- `GITHUB_REPOSITORY` - Repository identifier (owner/repo)

## Data Structure

### Analysis Format
```json
{
  "timestamp": "ISO 8601 timestamp",
  "totalPRs": "number of analyzed PRs",
  "recentPRs": [
    {
      "number": "PR number",
      "title": "PR title",
      "body": "PR description",
      "mergedAt": "merge timestamp",
      "files": ["changed files array"],
      "summary": "generated summary"
    }
  ]
}
```

### Task Format
```json
[
  {
    "id": "unique task identifier",
    "title": "task title",
    "description": "detailed description",
    "type": "task type (documentation|automation|feature|maintenance)",
    "priority": "priority level (low|medium|high)",
    "estimatedHours": "estimated completion time",
    "files": ["files to be modified"],
    "createdAt": "creation timestamp"
  }
]
```

## Development

To run the agent locally:

```bash
npm install
GH_PAT=your_token GITHUB_REPOSITORY=owner/repo node agent-workflow/continuous-agent.js
```

## Monitoring

Check the GitHub Actions tab for workflow runs and the README for current status updates.