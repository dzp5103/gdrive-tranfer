#!/usr/bin/env node

/**
 * Continuous Coding Agent - Automated Development Workflow
 * 
 * This script implements a self-sustaining coding agent workflow that:
 * - Analyzes completed PRs and generates summaries
 * - Creates new development tasks based on analysis
 * - Self-triggers by creating new PRs to continue development
 * - Updates README with progress tracking
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

class ContinuousAgent {
    constructor() {
        this.octokit = new Octokit({
            auth: process.env.GH_PAT
        });
        this.owner = process.env.GITHUB_REPOSITORY?.split('/')[0] || 'dzp5103';
        this.repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'gdrive-tranfer';
        this.workflowDir = path.join(process.cwd(), 'agent-workflow');
    }

    /**
     * Main entry point for the continuous agent
     */
    async run() {
        try {
            console.log('🤖 Starting Continuous Coding Agent...');
            
            // Analyze recent PRs
            const analysis = await this.analyzeRecentPRs();
            
            // Generate new tasks based on analysis
            const tasks = await this.generateTasks(analysis);
            
            // Save analysis and tasks
            await this.saveWorkflowData(analysis, tasks);
            
            // Update README with progress
            await this.updateReadmeProgress(tasks);
            
            // Create new PR if there are actionable tasks
            if (tasks.length > 0) {
                await this.createDevelopmentPR(tasks);
            }
            
            console.log('✅ Continuous Agent completed successfully');
        } catch (error) {
            console.error('❌ Error in Continuous Agent:', error.message);
            process.exit(1);
        }
    }

    /**
     * Analyze recent merged PRs to understand development patterns
     */
    async analyzeRecentPRs() {
        console.log('📊 Analyzing recent PRs...');
        
        try {
            const { data: prs } = await this.octokit.pulls.list({
                owner: this.owner,
                repo: this.repo,
                state: 'closed',
                sort: 'updated',
                direction: 'desc',
                per_page: 10
            });

            const mergedPRs = prs.filter(pr => pr.merged_at);
            
            const analysis = {
                timestamp: new Date().toISOString(),
                totalPRs: mergedPRs.length,
                recentPRs: []
            };

            for (const pr of mergedPRs.slice(0, 5)) {
                const prAnalysis = {
                    number: pr.number,
                    title: pr.title,
                    body: pr.body,
                    mergedAt: pr.merged_at,
                    files: [],
                    summary: ''
                };

                // Get files changed in PR
                try {
                    const { data: files } = await this.octokit.pulls.listFiles({
                        owner: this.owner,
                        repo: this.repo,
                        pull_number: pr.number
                    });
                    prAnalysis.files = files.map(f => ({
                        filename: f.filename,
                        status: f.status,
                        additions: f.additions,
                        deletions: f.deletions
                    }));
                } catch (error) {
                    console.warn(`Could not fetch files for PR #${pr.number}`);
                }

                // Generate summary
                prAnalysis.summary = this.generatePRSummary(pr, prAnalysis.files);
                analysis.recentPRs.push(prAnalysis);
            }

            return analysis;
        } catch (error) {
            console.warn('Could not analyze PRs:', error.message);
            return {
                timestamp: new Date().toISOString(),
                totalPRs: 0,
                recentPRs: [],
                error: error.message
            };
        }
    }

    /**
     * Generate a summary for a PR based on its content and files
     */
    generatePRSummary(pr, files) {
        const fileTypes = files.reduce((acc, file) => {
            const ext = path.extname(file.filename);
            acc[ext] = (acc[ext] || 0) + 1;
            return acc;
        }, {});

        const categories = [];
        if (fileTypes['.md']) categories.push('documentation');
        if (fileTypes['.js'] || fileTypes['.json']) categories.push('automation');
        if (fileTypes['.yml'] || fileTypes['.yaml']) categories.push('workflows');
        if (fileTypes['.ipynb']) categories.push('notebook');

        return `${pr.title} - Modified ${files.length} files (${categories.join(', ')})`;
    }

    /**
     * Generate new development tasks based on PR analysis
     */
    async generateTasks(analysis) {
        console.log('🎯 Generating development tasks...');
        
        const tasks = [];
        const now = new Date();
        
        // Base tasks for continuous improvement
        const baseTask = {
            id: `task-${now.getTime()}`,
            createdAt: now.toISOString(),
            priority: 'medium',
            category: 'enhancement'
        };

        // Analyze patterns to suggest improvements
        if (analysis.recentPRs.length > 0) {
            const hasWorkflowChanges = analysis.recentPRs.some(pr => 
                pr.files.some(f => f.filename.includes('.github/workflows'))
            );
            
            const hasDocumentationChanges = analysis.recentPRs.some(pr =>
                pr.files.some(f => f.filename.endsWith('.md'))
            );

            const hasNotebookChanges = analysis.recentPRs.some(pr =>
                pr.files.some(f => f.filename.endsWith('.ipynb'))
            );

            // Suggest documentation improvements
            if (!hasDocumentationChanges) {
                tasks.push({
                    ...baseTask,
                    id: `doc-update-${now.getTime()}`,
                    title: 'Enhance documentation with usage examples',
                    description: 'Add more detailed usage examples and troubleshooting guides to improve user experience',
                    type: 'documentation',
                    estimatedHours: 2,
                    files: ['README.md']
                });
            }

            // Suggest workflow improvements
            if (hasWorkflowChanges) {
                tasks.push({
                    ...baseTask,
                    id: `workflow-opt-${now.getTime()}`,
                    title: 'Optimize automated workflows',
                    description: 'Review and optimize GitHub Actions workflows for better performance and reliability',
                    type: 'automation',
                    estimatedHours: 3,
                    files: ['.github/workflows/*']
                });
            }

            // Suggest notebook enhancements
            if (hasNotebookChanges) {
                tasks.push({
                    ...baseTask,
                    id: `notebook-enhance-${now.getTime()}`,
                    title: 'Add error handling to notebook',
                    description: 'Improve error handling and user feedback in the Google Drive transfer notebook',
                    type: 'feature',
                    estimatedHours: 4,
                    files: ['rclone_gdrive_transfer.ipynb']
                });
            }
        }

        // Always suggest at least one improvement task
        if (tasks.length === 0) {
            tasks.push({
                ...baseTask,
                id: `general-improve-${now.getTime()}`,
                title: 'General codebase improvements',
                description: 'Review and improve code quality, add tests, or enhance user experience',
                type: 'maintenance',
                estimatedHours: 2,
                files: ['README.md', 'rclone_gdrive_transfer.ipynb']
            });
        }

        return tasks;
    }

    /**
     * Save workflow data for tracking and analysis
     */
    async saveWorkflowData(analysis, tasks) {
        console.log('💾 Saving workflow data...');
        
        // Ensure workflow directory exists
        await fs.mkdir(this.workflowDir, { recursive: true });
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Save analysis
        await fs.writeFile(
            path.join(this.workflowDir, `analysis-${timestamp}.json`),
            JSON.stringify(analysis, null, 2)
        );
        
        // Save tasks
        await fs.writeFile(
            path.join(this.workflowDir, `tasks-${timestamp}.json`),
            JSON.stringify(tasks, null, 2)
        );
        
        // Update latest files
        await fs.writeFile(
            path.join(this.workflowDir, 'latest-analysis.json'),
            JSON.stringify(analysis, null, 2)
        );
        
        await fs.writeFile(
            path.join(this.workflowDir, 'latest-tasks.json'),
            JSON.stringify(tasks, null, 2)
        );
    }

    /**
     * Update README with current progress and status
     */
    async updateReadmeProgress(tasks) {
        console.log('📝 Updating README progress...');
        
        try {
            const readmePath = path.join(process.cwd(), 'README.md');
            let readmeContent = await fs.readFile(readmePath, 'utf8');
            
            const progressSection = this.generateProgressSection(tasks);
            
            // Check if progress section already exists
            const progressMarker = '## 🤖 Automated Development Status';
            const existingProgressIndex = readmeContent.indexOf(progressMarker);
            
            if (existingProgressIndex !== -1) {
                // Find the end of the section (next ## or end of file)
                const afterProgress = readmeContent.substring(existingProgressIndex + progressMarker.length);
                const nextSectionIndex = afterProgress.indexOf('\n## ');
                
                if (nextSectionIndex !== -1) {
                    // Replace existing section
                    readmeContent = readmeContent.substring(0, existingProgressIndex) +
                                   progressSection +
                                   afterProgress.substring(nextSectionIndex);
                } else {
                    // Replace to end of file
                    readmeContent = readmeContent.substring(0, existingProgressIndex) + progressSection;
                }
            } else {
                // Add new section before license section
                const licenseIndex = readmeContent.indexOf('## 📄 License');
                if (licenseIndex !== -1) {
                    readmeContent = readmeContent.substring(0, licenseIndex) +
                                   progressSection + '\n\n' +
                                   readmeContent.substring(licenseIndex);
                } else {
                    // Add at the end
                    readmeContent += '\n\n' + progressSection;
                }
            }
            
            await fs.writeFile(readmePath, readmeContent);
        } catch (error) {
            console.warn('Could not update README:', error.message);
        }
    }

    /**
     * Generate progress section for README
     */
    generateProgressSection(tasks) {
        const now = new Date().toLocaleString();
        
        let section = `## 🤖 Automated Development Status\n\n`;
        section += `*Last updated: ${now} by Continuous Coding Agent*\n\n`;
        
        if (tasks.length > 0) {
            section += `### 🎯 Current Development Tasks\n\n`;
            tasks.forEach((task, index) => {
                section += `${index + 1}. **${task.title}**\n`;
                section += `   - Type: ${task.type}\n`;
                section += `   - Priority: ${task.priority}\n`;
                section += `   - Estimated: ${task.estimatedHours}h\n`;
                section += `   - Description: ${task.description}\n\n`;
            });
            
            section += `### 📊 Development Metrics\n\n`;
            section += `- Active tasks: ${tasks.length}\n`;
            section += `- Total estimated hours: ${tasks.reduce((sum, task) => sum + task.estimatedHours, 0)}h\n`;
            section += `- Agent status: ✅ Active\n\n`;
        } else {
            section += `### ✅ No Active Tasks\n\n`;
            section += `The continuous agent has analyzed recent activity and found no immediate tasks requiring attention.\n\n`;
        }
        
        section += `*This section is automatically maintained by the continuous coding agent workflow.*\n`;
        
        return section;
    }

    /**
     * Create a new PR with development tasks
     */
    async createDevelopmentPR(tasks) {
        console.log('🔄 Creating development PR...');
        
        if (tasks.length === 0) {
            console.log('No tasks to create PR for');
            return;
        }

        try {
            const branchName = `automated/development-${Date.now()}`;
            const title = `🤖 Automated Development Tasks (${tasks.length} items)`;
            
            let body = `## Automated Development Tasks\n\n`;
            body += `This PR was automatically generated by the Continuous Coding Agent based on analysis of recent development activity.\n\n`;
            
            body += `### 📋 Proposed Tasks\n\n`;
            tasks.forEach((task, index) => {
                body += `#### ${index + 1}. ${task.title}\n`;
                body += `- **Type**: ${task.type}\n`;
                body += `- **Priority**: ${task.priority}\n`;
                body += `- **Estimated Time**: ${task.estimatedHours} hours\n`;
                body += `- **Files**: ${task.files.join(', ')}\n`;
                body += `- **Description**: ${task.description}\n\n`;
            });
            
            body += `### 🔄 Next Steps\n\n`;
            body += `1. Review the proposed tasks\n`;
            body += `2. Implement the changes\n`;
            body += `3. Test the modifications\n`;
            body += `4. Merge when ready\n\n`;
            
            body += `*Generated by Continuous Coding Agent v1.0*`;

            // For now, just log the PR details since we can't actually create PRs in this context
            console.log('📋 Would create PR with details:');
            console.log(`Title: ${title}`);
            console.log(`Branch: ${branchName}`);
            console.log(`Tasks: ${tasks.length}`);
            
        } catch (error) {
            console.warn('Could not create PR:', error.message);
        }
    }
}

// Run the agent if this script is executed directly
if (require.main === module) {
    const agent = new ContinuousAgent();
    agent.run().catch(console.error);
}

module.exports = ContinuousAgent;