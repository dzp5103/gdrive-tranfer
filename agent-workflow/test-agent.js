#!/usr/bin/env node

/**
 * Test script for the Continuous Coding Agent
 * Creates sample data and validates the workflow end-to-end
 */

const fs = require('fs').promises;
const path = require('path');
const ContinuousAgent = require('./continuous-agent');

class AgentTester {
    constructor() {
        this.testDir = path.join(process.cwd(), 'agent-workflow', 'test-data');
    }

    async runTests() {
        console.log('🧪 Starting Continuous Agent Tests...\n');

        try {
            // Test 1: Validate agent initialization
            await this.testAgentInitialization();

            // Test 2: Test with mock data
            await this.testWithMockData();

            // Test 3: Validate file generation
            await this.testFileGeneration();

            // Test 4: Test README updates
            await this.testReadmeUpdates();

            console.log('\n✅ All tests passed! The Continuous Coding Agent is working correctly.');
            
        } catch (error) {
            console.error('\n❌ Test failed:', error.message);
            process.exit(1);
        }
    }

    async testAgentInitialization() {
        console.log('📋 Test 1: Agent Initialization...');
        
        const agent = new ContinuousAgent();
        
        // Verify the agent has the required properties
        if (!agent.workflowDir) {
            throw new Error('Agent workflowDir not initialized');
        }
        
        if (!agent.owner || !agent.repo) {
            console.log('   ⚠️  GitHub credentials not available (expected in test environment)');
        }
        
        console.log('   ✅ Agent initialized successfully');
    }

    async testWithMockData() {
        console.log('📋 Test 2: Mock Data Processing...');
        
        const agent = new ContinuousAgent();
        
        // Create mock analysis data
        const mockAnalysis = {
            timestamp: new Date().toISOString(),
            totalPRs: 2,
            recentPRs: [
                {
                    number: 1,
                    title: 'Initial setup',
                    body: 'Set up the repository with basic files',
                    mergedAt: '2025-01-01T10:00:00Z',
                    files: [
                        { filename: 'README.md', status: 'added', additions: 100, deletions: 0 },
                        { filename: 'rclone_gdrive_transfer.ipynb', status: 'added', additions: 500, deletions: 0 }
                    ],
                    summary: 'Initial setup - Modified 2 files (documentation, notebook)'
                },
                {
                    number: 2,
                    title: 'Add continuous agent',
                    body: 'Implement automated development workflow',
                    mergedAt: '2025-01-02T10:00:00Z',
                    files: [
                        { filename: 'agent-workflow/continuous-agent.js', status: 'added', additions: 300, deletions: 0 },
                        { filename: '.github/workflows/continuous-agent.yml', status: 'added', additions: 80, deletions: 0 }
                    ],
                    summary: 'Add continuous agent - Modified 2 files (automation, workflows)'
                }
            ]
        };
        
        // Test task generation with mock data
        const tasks = await agent.generateTasks(mockAnalysis);
        
        if (!Array.isArray(tasks) || tasks.length === 0) {
            throw new Error('Task generation failed or returned no tasks');
        }
        
        // Validate task structure
        for (const task of tasks) {
            if (!task.id || !task.title || !task.description || !task.type) {
                throw new Error('Generated task missing required fields');
            }
        }
        
        console.log(`   ✅ Generated ${tasks.length} tasks from mock data`);
    }

    async testFileGeneration() {
        console.log('📋 Test 3: File Generation...');
        
        // Ensure test directory exists
        await fs.mkdir(this.testDir, { recursive: true });
        
        const agent = new ContinuousAgent();
        
        // Test data structures
        const testAnalysis = {
            timestamp: new Date().toISOString(),
            totalPRs: 1,
            recentPRs: [
                {
                    number: 99,
                    title: 'Test PR',
                    summary: 'Test PR for validation'
                }
            ]
        };
        
        const testTasks = [
            {
                id: 'test-task-1',
                title: 'Test Task',
                description: 'A test task for validation',
                type: 'test',
                priority: 'low',
                estimatedHours: 1,
                files: ['test.txt'],
                createdAt: new Date().toISOString()
            }
        ];
        
        // Test saving workflow data
        await agent.saveWorkflowData(testAnalysis, testTasks);
        
        // Verify files were created
        const latestAnalysisPath = path.join(agent.workflowDir, 'latest-analysis.json');
        const latestTasksPath = path.join(agent.workflowDir, 'latest-tasks.json');
        
        try {
            await fs.access(latestAnalysisPath);
            await fs.access(latestTasksPath);
        } catch (error) {
            throw new Error('Failed to create workflow data files');
        }
        
        // Verify file contents
        const savedAnalysis = JSON.parse(await fs.readFile(latestAnalysisPath, 'utf8'));
        const savedTasks = JSON.parse(await fs.readFile(latestTasksPath, 'utf8'));
        
        if (savedAnalysis.totalPRs !== testAnalysis.totalPRs) {
            throw new Error('Analysis data not saved correctly');
        }
        
        if (savedTasks.length !== testTasks.length) {
            throw new Error('Tasks data not saved correctly');
        }
        
        console.log('   ✅ Workflow data files generated and verified');
    }

    async testReadmeUpdates() {
        console.log('📋 Test 4: README Updates...');
        
        const agent = new ContinuousAgent();
        
        // Create test tasks for README update
        const testTasks = [
            {
                id: 'readme-test-1',
                title: 'Test Documentation Update',
                description: 'Update documentation for testing',
                type: 'documentation',
                priority: 'medium',
                estimatedHours: 2,
                files: ['README.md'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'readme-test-2',
                title: 'Test Feature Addition',
                description: 'Add test feature',
                type: 'feature',
                priority: 'high',
                estimatedHours: 5,
                files: ['src/test.js'],
                createdAt: new Date().toISOString()
            }
        ];
        
        // Generate progress section
        const progressSection = agent.generateProgressSection(testTasks);
        
        // Verify the progress section contains expected elements
        if (!progressSection.includes('Automated Development Status')) {
            throw new Error('Progress section missing title');
        }
        
        if (!progressSection.includes('Test Documentation Update')) {
            throw new Error('Progress section missing task titles');
        }
        
        if (!progressSection.includes('Active tasks: 2')) {
            throw new Error('Progress section missing task count');
        }
        
        if (!progressSection.includes('Total estimated hours: 7h')) {
            throw new Error('Progress section missing hours calculation');
        }
        
        console.log('   ✅ README progress section generated correctly');
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new AgentTester();
    tester.runTests().catch(console.error);
}

module.exports = AgentTester;