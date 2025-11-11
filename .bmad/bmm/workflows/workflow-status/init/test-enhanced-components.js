/**
 * Test Suite for Enhanced BMad Method Components
 * Validates all enhanced workflow initialization components
 */

const ProjectAnalyzer = require('./project-analyzer');
const RecommendationSystem = require('./recommendation-system');
const ConfigValidator = require('./config-validator');
const IntelligenceEngine = require('./intelligence-engine');

class EnhancedComponentTester {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            errors: [],
            warnings: []
        };
    }
    
    /**
     * Run all component tests
     */
    async runAllTests() {
        console.log('🧪 Starting Enhanced BMad Method Component Tests...\n');
        
        try {
            // Test individual components
            await this.testProjectAnalyzer();
            await this.testRecommendationSystem();
            await this.testConfigValidator();
            
            // Test integration
            await this.testIntelligenceEngine();
            
            // Test enhanced workflow configuration
            await this.testEnhancedWorkflowConfig();
            
            // Print final results
            this.printTestResults();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.testResults.errors.push(`Test suite error: ${error.message}`);
        }
    }
    
    /**
     * Test Project Analyzer
     */
    async testProjectAnalyzer() {
        console.log('Testing Project Analyzer...');
        
        try {
            // Test initialization
            const analyzer = new ProjectAnalyzer({
                outputFolder: './test-docs',
                ephemeralLocation: './test-temp'
            });
            
            this.assert(analyzer !== null, 'ProjectAnalyzer should initialize');
            this.assert(analyzer.scanResults !== null, 'Should have scan results object');
            this.assert(analyzer.patterns !== null, 'Should have patterns defined');
            
            // Test pattern definitions
            this.assert(analyzer.patterns.bmm !== undefined, 'Should have BMM patterns');
            this.assert(analyzer.patterns.modern !== undefined, 'Should have modern tool patterns');
            this.assert(analyzer.patterns.enterprise !== undefined, 'Should have enterprise patterns');
            
            // Test scoring methods
            const complexity = analyzer.getComplexityLevel(8);
            this.assert(complexity === 'enterprise', 'High complexity should return enterprise');
            
            const maturity = analyzer.getMaturityLevel(8);
            this.assert(maturity === 'enterprise', 'High maturity should return enterprise');
            
            // Test project type detection
            const projectType = analyzer.detectProjectType();
            this.assert(['web-application', 'api-backend', 'infrastructure', 'software'].includes(projectType), 
                'Should detect valid project type');
            
            this.logSuccess('Project Analyzer');
            
        } catch (error) {
            this.logError('Project Analyzer', error);
        }
    }
    
    /**
     * Test Recommendation System
     */
    async testRecommendationSystem() {
        console.log('Testing Recommendation System...');
        
        try {
            // Test initialization
            const recommender = new RecommendationSystem();
            
            this.assert(recommender !== null, 'RecommendationSystem should initialize');
            this.assert(recommender.confidenceThresholds !== null, 'Should have confidence thresholds');
            this.assert(recommender.scoringWeights !== null, 'Should have scoring weights');
            
            // Test confidence threshold values
            this.assert(recommender.confidenceThresholds.high >= 90, 'High confidence should be >= 90');
            this.assert(recommender.confidenceThresholds.medium >= 70, 'Medium confidence should be >= 70');
            this.assert(recommender.confidenceThresholds.low >= 50, 'Low confidence should be >= 50');
            
            // Test scoring weights sum to reasonable value
            const weightSum = Object.values(recommender.scoringWeights).reduce((a, b) => a + b, 0);
            this.assert(weightSum > 0.9 && weightSum < 1.1, 'Weights should sum to approximately 1');
            
            // Test recommendation rules
            this.assert(recommender.recommendationRules.quick_flow !== undefined, 'Should have quick-flow rules');
            this.assert(recommender.recommendationRules.method !== undefined, 'Should have method rules');
            this.assert(recommender.recommendationRules.enterprise !== undefined, 'Should have enterprise rules');
            
            this.logSuccess('Recommendation System');
            
        } catch (error) {
            this.logError('Recommendation System', error);
        }
    }
    
    /**
     * Test Configuration Validator
     */
    async testConfigValidator() {
        console.log('Testing Configuration Validator...');
        
        try {
            // Test initialization
            const validator = new ConfigValidator();
            
            this.assert(validator !== null, 'ConfigValidator should initialize');
            this.assert(validator.validationRules !== null, 'Should have validation rules');
            this.assert(validator.validationResults !== null, 'Should have validation results object');
            
            // Test validation rule structure
            this.assert(validator.validationRules.requiredPaths !== undefined, 'Should have required paths rules');
            this.assert(validator.validationRules.outputFolder !== undefined, 'Should have output folder rules');
            this.assert(validator.validationRules.userPreferences !== undefined, 'Should have user preferences rules');
            
            // Test validation result structure
            this.assert(validator.validationResults.isValid !== undefined, 'Should have isValid property');
            this.assert(Array.isArray(validator.validationResults.errors), 'Errors should be array');
            this.assert(Array.isArray(validator.validationResults.warnings), 'Warnings should be array');
            this.assert(Array.isArray(validator.validationResults.suggestions), 'Suggestions should be array');
            
            this.logSuccess('Configuration Validator');
            
        } catch (error) {
            this.logError('Configuration Validator', error);
        }
    }
    
    /**
     * Test Intelligence Engine Integration
     */
    async testIntelligenceEngine() {
        console.log('Testing Intelligence Engine Integration...');
        
        try {
            // Test initialization
            const engine = new IntelligenceEngine({
                projectPath: './test-project',
                outputFolder: './test-docs',
                ephemeralLocation: './test-temp',
                projectName: 'Test Project'
            });
            
            this.assert(engine !== null, 'IntelligenceEngine should initialize');
            this.assert(engine.analyzer !== null, 'Should have analyzer component');
            this.assert(engine.recommender !== null, 'Should have recommender component');
            this.assert(engine.validator !== null, 'Should have validator component');
            
            // Test fallback methods
            const fallbackAnalysis = engine.createFallbackAnalysis();
            this.assert(fallbackAnalysis !== null, 'Should create fallback analysis');
            this.assert(fallbackAnalysis.complexity !== undefined, 'Fallback should have complexity');
            
            const fallbackRecommendations = engine.createFallbackRecommendations();
            this.assert(fallbackRecommendations !== null, 'Should create fallback recommendations');
            this.assert(fallbackRecommendations.primary !== undefined, 'Fallback should have primary recommendation');
            
            const fallbackWorkflow = engine.createFallbackWorkflowPath();
            this.assert(fallbackWorkflow !== null, 'Should create fallback workflow path');
            this.assert(fallbackWorkflow.base !== undefined, 'Fallback should have base path');
            
            this.logSuccess('Intelligence Engine Integration');
            
        } catch (error) {
            this.logError('Intelligence Engine Integration', error);
        }
    }
    
    /**
     * Test Enhanced Workflow Configuration
     */
    async testEnhancedWorkflowConfig() {
        console.log('Testing Enhanced Workflow Configuration...');
        
        try {
            // Test that enhanced files exist
            const fs = require('fs');
            const path = require('path');
            
            const baseDir = __dirname;
            const requiredFiles = [
                'enhanced-workflow.yaml',
                'enhanced-instructions.md',
                'ENHANCED_README.md',
                'project-analyzer.js',
                'recommendation-system.js',
                'config-validator.js',
                'intelligence-engine.js'
            ];
            
            for (const file of requiredFiles) {
                const filePath = path.join(baseDir, file);
                this.assert(fs.existsSync(filePath), `Required file should exist: ${file}`);
            }
            
            // Test enhanced workflow YAML structure
            const workflowPath = path.join(baseDir, 'enhanced-workflow.yaml');
            const workflowContent = fs.readFileSync(workflowPath, 'utf8');
            
            this.assert(workflowContent.includes('enhanced_mode'), 'Should have enhanced mode flag');
            this.assert(workflowContent.includes('intelligent_detection'), 'Should have intelligent detection features');
            this.assert(workflowContent.includes('scan_patterns'), 'Should have scan patterns defined');
            this.assert(workflowContent.includes('confidence_weights'), 'Should have confidence weights');
            
            this.logSuccess('Enhanced Workflow Configuration');
            
        } catch (error) {
            this.logError('Enhanced Workflow Configuration', error);
        }
    }
    
    /**
     * Assert helper method
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    /**
     * Log success
     */
    logSuccess(component) {
        console.log(`  ✅ ${component} - All tests passed`);
        this.testResults.passed++;
    }
    
    /**
     * Log error
     */
    logError(component, error) {
        console.log(`  ❌ ${component} - Test failed: ${error.message}`);
        this.testResults.failed++;
        this.testResults.errors.push(`${component}: ${error.message}`);
    }
    
    /**
     * Print final test results
     */
    printTestResults() {
        console.log('\n' + '='.repeat(50));
        console.log('🎯 ENHANCED COMPONENT TEST RESULTS');
        console.log('='.repeat(50));
        
        console.log(`✅ Tests Passed: ${this.testResults.passed}`);
        console.log(`❌ Tests Failed: ${this.testResults.failed}`);
        console.log(`📊 Success Rate: ${Math.round((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100)}%`);
        
        if (this.testResults.errors.length > 0) {
            console.log('\n🚨 Errors:');
            this.testResults.errors.forEach(error => {
                console.log(`  • ${error}`);
            });
        }
        
        if (this.testResults.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            this.testResults.warnings.forEach(warning => {
                console.log(`  • ${warning}`);
            });
        }
        
        console.log('\n' + '='.repeat(50));
        
        if (this.testResults.failed === 0) {
            console.log('🎉 All enhanced components are working correctly!');
        } else {
            console.log('⚠️ Some components need attention.');
        }
        
        console.log('='.repeat(50));
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new EnhancedComponentTester();
    tester.runAllTests().catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = EnhancedComponentTester;