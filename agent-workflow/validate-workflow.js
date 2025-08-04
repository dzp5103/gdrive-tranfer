#!/usr/bin/env node

/**
 * End-to-End Validation Script for Continuous Coding Agent
 * Validates the complete workflow implementation
 */

const fs = require('fs').promises;
const path = require('path');

class WorkflowValidator {
    constructor() {
        this.rootDir = process.cwd();
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };
    }

    async validate() {
        console.log('🔍 Starting End-to-End Workflow Validation...\n');

        // Core file validation
        await this.validateCoreFiles();
        
        // Dependencies validation
        await this.validateDependencies();
        
        // Workflow configuration validation
        await this.validateWorkflowConfig();
        
        // Agent functionality validation
        await this.validateAgentFunctionality();
        
        // Integration validation
        await this.validateIntegration();

        this.printResults();
    }

    async validateCoreFiles() {
        console.log('📁 Validating Core Files...');
        
        const requiredFiles = [
            'agent-workflow/continuous-agent.js',
            'agent-workflow/README.md',
            '.github/workflows/continuous-agent.yml',
            'package.json',
            '.gitignore'
        ];

        for (const file of requiredFiles) {
            await this.checkFile(file, true);
        }

        // Check generated files
        const generatedFiles = [
            'agent-workflow/latest-analysis.json',
            'agent-workflow/latest-tasks.json'
        ];

        for (const file of generatedFiles) {
            await this.checkFile(file, false, 'Generated workflow data file');
        }
    }

    async validateDependencies() {
        console.log('📦 Validating Dependencies...');
        
        try {
            const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
            
            // Check required dependencies
            if (!packageJson.dependencies || !packageJson.dependencies['@octokit/rest']) {
                this.fail('Missing required dependency: @octokit/rest');
            } else {
                this.pass('GitHub API dependency present');
            }

            // Check package.json structure
            if (!packageJson.name || !packageJson.main) {
                this.warn('Package.json missing some metadata fields');
            } else {
                this.pass('Package.json structure valid');
            }

            // Check if node_modules exists (dependencies installed)
            try {
                await fs.access('node_modules');
                this.pass('Dependencies installed (node_modules exists)');
            } catch {
                this.warn('Dependencies not installed (run npm install)');
            }

        } catch (error) {
            this.fail(`Error reading package.json: ${error.message}`);
        }
    }

    async validateWorkflowConfig() {
        console.log('⚙️  Validating Workflow Configuration...');
        
        try {
            const workflowContent = await fs.readFile('.github/workflows/continuous-agent.yml', 'utf8');
            
            // Check for required workflow elements
            const requiredElements = [
                'name: Continuous Coding Agent',
                'GH_PAT:',
                'node agent-workflow/continuous-agent.js',
                'pull_request:',
                'schedule:'
            ];

            for (const element of requiredElements) {
                if (workflowContent.includes(element)) {
                    this.pass(`Workflow contains: ${element}`);
                } else {
                    this.fail(`Workflow missing: ${element}`);
                }
            }

            // Check for proper permissions
            if (workflowContent.includes('contents: write') && workflowContent.includes('pull-requests: write')) {
                this.pass('Workflow has required permissions');
            } else {
                this.fail('Workflow missing required permissions');
            }

        } catch (error) {
            this.fail(`Error reading workflow file: ${error.message}`);
        }
    }

    async validateAgentFunctionality() {
        console.log('🤖 Validating Agent Functionality...');
        
        try {
            // Import and test the agent class
            const ContinuousAgent = require('../agent-workflow/continuous-agent');
            const agent = new ContinuousAgent();

            // Test agent methods exist
            const requiredMethods = [
                'run',
                'analyzeRecentPRs',
                'generateTasks',
                'saveWorkflowData',
                'updateReadmeProgress'
            ];

            for (const method of requiredMethods) {
                if (typeof agent[method] === 'function') {
                    this.pass(`Agent method exists: ${method}`);
                } else {
                    this.fail(`Agent method missing: ${method}`);
                }
            }

            // Test task generation with empty data
            const mockAnalysis = { timestamp: new Date().toISOString(), totalPRs: 0, recentPRs: [] };
            const tasks = await agent.generateTasks(mockAnalysis);
            
            if (Array.isArray(tasks) && tasks.length > 0) {
                this.pass('Agent generates tasks with empty analysis');
            } else {
                this.fail('Agent fails to generate fallback tasks');
            }

        } catch (error) {
            this.fail(`Error testing agent functionality: ${error.message}`);
        }
    }

    async validateIntegration() {
        console.log('🔗 Validating Integration...');
        
        try {
            // Check README has been updated with status section
            const readmeContent = await fs.readFile('README.md', 'utf8');
            
            if (readmeContent.includes('## 🤖 Automated Development Status')) {
                this.pass('README contains automated status section');
            } else {
                this.fail('README missing automated status section');
            }

            if (readmeContent.includes('Continuous Coding Agent')) {
                this.pass('README references the continuous agent');
            } else {
                this.warn('README could better reference the agent');
            }

            // Check workflow data structure
            try {
                const latestTasks = JSON.parse(await fs.readFile('agent-workflow/latest-tasks.json', 'utf8'));
                
                if (Array.isArray(latestTasks) && latestTasks.length > 0) {
                    const task = latestTasks[0];
                    const requiredFields = ['id', 'title', 'description', 'type', 'priority', 'estimatedHours'];
                    
                    const hasAllFields = requiredFields.every(field => task[field] !== undefined);
                    
                    if (hasAllFields) {
                        this.pass('Task data structure is valid');
                    } else {
                        this.fail('Task data structure is incomplete');
                    }
                } else {
                    this.warn('No tasks in latest data (expected for new setup)');
                }
            } catch (error) {
                this.warn('Could not validate task data structure');
            }

        } catch (error) {
            this.fail(`Error validating integration: ${error.message}`);
        }
    }

    async checkFile(filePath, required = true, description = null) {
        try {
            await fs.access(filePath);
            this.pass(`File exists: ${filePath}${description ? ` (${description})` : ''}`);
        } catch {
            if (required) {
                this.fail(`Required file missing: ${filePath}`);
            } else {
                this.warn(`Optional file missing: ${filePath}${description ? ` (${description})` : ''}`);
            }
        }
    }

    pass(message) {
        this.results.passed++;
        this.results.details.push({ type: 'PASS', message });
        console.log(`   ✅ ${message}`);
    }

    fail(message) {
        this.results.failed++;
        this.results.details.push({ type: 'FAIL', message });
        console.log(`   ❌ ${message}`);
    }

    warn(message) {
        this.results.warnings++;
        this.results.details.push({ type: 'WARN', message });
        console.log(`   ⚠️  ${message}`);
    }

    printResults() {
        console.log('\n📊 Validation Results:');
        console.log(`   ✅ Passed: ${this.results.passed}`);
        console.log(`   ❌ Failed: ${this.results.failed}`);
        console.log(`   ⚠️  Warnings: ${this.results.warnings}`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 All critical validations passed! The Continuous Coding Agent workflow is ready.');
        } else {
            console.log('\n🚨 Some validations failed. Please address the issues above.');
            process.exit(1);
        }

        if (this.results.warnings > 0) {
            console.log('\n💡 Note: Warnings indicate areas that could be improved but don\'t prevent functionality.');
        }
    }
}

// Run validation if this script is executed directly
if (require.main === module) {
    const validator = new WorkflowValidator();
    validator.validate().catch(console.error);
}

module.exports = WorkflowValidator;