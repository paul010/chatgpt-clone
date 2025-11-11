/**
 * Enhanced Intelligence Engine
 * Integrates all enhanced BMad Method components for intelligent workflow initialization
 */

const ProjectAnalyzer = require('./project-analyzer');
const RecommendationSystem = require('./recommendation-system');
const ConfigValidator = require('./config-validator');

class IntelligenceEngine {
    constructor(config = {}) {
        this.config = {
            projectPath: config.projectPath || '.',
            outputFolder: config.outputFolder || './docs',
            ephemeralLocation: config.ephemeralLocation || './temp',
            ...config
        };
        
        this.analyzer = new ProjectAnalyzer({
            outputFolder: this.config.outputFolder,
            ephemeralLocation: this.config.ephemeralLocation
        });
        
        this.recommender = new RecommendationSystem();
        this.validator = new ConfigValidator();
        
        this.analysisResults = null;
        this.recommendations = null;
        this.validationResults = null;
    }
    
    /**
     * Main intelligence processing method
     */
    async processEnhancedInitialization() {
        console.log('🧠 Starting Enhanced BMad Method Intelligence Engine...');
        
        try {
            // Step 1: Validate configuration
            console.log('Step 1: Configuration Validation');
            await this.validateConfiguration();
            
            // Step 2: Perform comprehensive project analysis
            console.log('Step 2: Project Analysis');
            await this.analyzeProject();
            
            // Step 3: Generate intelligent recommendations
            console.log('Step 3: Recommendation Generation');
            this.generateRecommendations();
            
            // Step 4: Create enhanced workflow path
            console.log('Step 4: Workflow Path Creation');
            const workflowPath = this.createEnhancedWorkflowPath();
            
            // Step 5: Generate final output
            console.log('Step 5: Output Generation');
            const output = this.generateEnhancedOutput();
            
            console.log('✅ Enhanced initialization completed successfully');
            return output;
            
        } catch (error) {
            console.error('❌ Enhanced initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Validate configuration with enhanced error handling
     */
    async validateConfiguration() {
        try {
            this.validationResults = await this.validator.validateConfig();
            
            if (!this.validationResults.isValid) {
                const criticalErrors = this.validationResults.errors.filter(e => 
                    e.includes('required') || e.includes('not found')
                );
                
                if (criticalErrors.length > 0) {
                    throw new Error(`Critical configuration issues: ${criticalErrors.join(', ')}`);
                }
            }
            
            // Apply automatic fixes if available
            if (this.validationResults.recoverableErrors.length > 0) {
                const autoFixes = await this.validator.applyAutomaticFixes();
                if (autoFixes.length > 0) {
                    console.log('🔧 Applied automatic fixes:', autoFixes);
                }
            }
            
        } catch (error) {
            console.warn('⚠️ Configuration validation had issues:', error.message);
            // Continue with analysis but note the issues
            this.validationResults = {
                isValid: false,
                errors: [error.message],
                warnings: ['Configuration validation failed - continuing with analysis'],
                suggestions: this.validator.generateRecoverySuggestions()
            };
        }
    }
    
    /**
     * Perform comprehensive project analysis
     */
    async analyzeProject() {
        try {
            this.analysisResults = await this.analyzer.analyzeProject(this.config.projectPath);
            
            // Add validation insights to analysis
            if (this.validationResults) {
                this.analysisResults.configValidation = this.validationResults;
            }
            
        } catch (error) {
            console.warn('⚠️ Project analysis had issues:', error.message);
            // Provide fallback analysis
            this.analysisResults = this.createFallbackAnalysis();
        }
    }
    
    /**
     * Generate intelligent recommendations
     */
    generateRecommendations() {
        try {
            this.recommendations = this.recommender.generateRecommendations(this.analysisResults);
            
            // Enhance recommendations with project context
            this.enhanceRecommendationsWithContext();
            
        } catch (error) {
            console.warn('⚠️ Recommendation generation had issues:', error.message);
            this.recommendations = this.createFallbackRecommendations();
        }
    }
    
    /**
     * Create enhanced workflow path
     */
    createEnhancedWorkflowPath() {
        try {
            const pathConfig = {
                track: this.recommendations.primary.track,
                confidence: this.recommendations.confidence,
                fieldType: this.analysisResults.insights?.fieldType || 'unknown',
                projectType: this.analysisResults.insights?.projectType || 'software',
                complexity: this.analysisResults.complexity?.level || 'moderate',
                maturity: this.analysisResults.maturity?.level || 'basic',
                modernTools: this.analysisResults.modernTools?.length || 0,
                enterpriseFeatures: this.analysisResults.enterpriseFeatures?.length || 0,
                existingArtifacts: this.analysisResults.bmmArtifacts?.length || 0,
                implementationArtifacts: this.analysisResults.implementationArtifacts?.length || 0
            };
            
            return this.customizeWorkflowPath(pathConfig);
            
        } catch (error) {
            console.warn('⚠️ Workflow path creation had issues:', error.message);
            return this.createFallbackWorkflowPath();
        }
    }
    
    /**
     * Generate enhanced output
     */
    generateEnhancedOutput() {
        const timestamp = new Date().toISOString();
        
        return {
            // Basic information
            project: {
                name: this.config.projectName || 'Unknown Project',
                type: this.analysisResults.insights?.projectType || 'software',
                path: this.config.projectPath
            },
            
            // Analysis results
            analysis: {
                timestamp,
                complexity: this.analysisResults.complexity,
                maturity: this.analysisResults.maturity,
                insights: this.analysisResults.insights,
                detectedTools: this.analysisResults.modernTools,
                enterpriseFeatures: this.analysisResults.enterpriseFeatures,
                existingArtifacts: {
                    planning: this.analysisResults.bmmArtifacts,
                    implementation: this.analysisResults.implementationArtifacts
                }
            },
            
            // Recommendations
            recommendations: {
                primary: this.recommendations.primary,
                confidence: this.recommendations.confidence,
                reasoning: this.recommendations.reasoning,
                alternatives: this.recommendations.alternatives,
                warnings: this.recommendations.warnings,
                suggestions: this.recommendations.suggestions
            },
            
            // Workflow configuration
            workflow: {
                path: this.createEnhancedWorkflowPath(),
                track: this.recommendations.primary.track,
                fieldType: this.analysisResults.insights?.fieldType,
                customization: this.generateCustomizationSummary()
            },
            
            // Configuration status
            configuration: {
                validation: this.validationResults,
                healthScore: this.calculateConfigurationHealthScore()
            },
            
            // Next steps
            nextSteps: this.generateNextSteps(),
            
            // Metadata
            metadata: {
                engineVersion: '2.0',
                processingTime: Date.now(),
                features: this.getEnabledFeatures()
            }
        };
    }
    
    /**
     * Enhance recommendations with project context
     */
    enhanceRecommendationsWithContext() {
        // Add project-specific reasoning
        const context = this.analysisResults.insights || {};
        
        if (context.projectType === 'web-application' && this.analysisResults.complexity?.score > 6) {
            this.recommendations.suggestions.push('Web application with complexity - consider UX Design workflow for better user experience');
        }
        
        if (this.analysisResults.modernTools?.some(t => t.name === 'next')) {
            this.recommendations.suggestions.push('Next.js detected - consider Architecture workflow for optimal project structure');
        }
        
        if (this.analysisResults.modernTools?.some(t => t.category === 'testing')) {
            this.recommendations.reasoning.push('Testing framework detected - project is development-ready');
        }
        
        if (context.fieldType === 'brownfield' && this.analysisResults.complexity?.score > 5) {
            this.recommendations.reasoning.push('Brownfield + complexity - Architecture workflow strongly recommended for integration planning');
        }
    }
    
    /**
     * Customize workflow path based on analysis
     */
    customizeWorkflowPath(config) {
        let basePath = `${config.track}-${config.fieldType}`;
        let customizations = [];
        
        // Complexity-based customizations
        if (config.complexity === 'enterprise') {
            customizations.push('enterprise-features');
        } else if (config.complexity === 'complex') {
            customizations.push('enhanced-validation');
        }
        
        // Modern tooling customizations
        if (config.modernTools > 10) {
            customizations.push('advanced-tooling');
        }
        
        // Enterprise features customizations
        if (config.enterpriseFeatures > 2) {
            customizations.push('security-compliance');
        }
        
        // Artifact-based customizations
        if (config.existingArtifacts > 0) {
            customizations.push('artifact-integration');
        }
        
        return {
            base: basePath,
            customizations,
            confidence: config.confidence,
            estimatedDuration: this.estimateWorkflowDuration(config),
            complexity: config.complexity
        };
    }
    
    /**
     * Generate customization summary
     */
    generateCustomizationSummary() {
        const customizations = [];
        
        if (this.analysisResults.modernTools?.length > 5) {
            customizations.push('Modern tool stack integration');
        }
        
        if (this.analysisResults.enterpriseFeatures?.length > 2) {
            customizations.push('Enterprise feature workflows');
        }
        
        if (this.analysisResults.complexity?.score > 6) {
            customizations.push('Enhanced validation gates');
        }
        
        if (this.analysisResults.maturity?.score > 6) {
            customizations.push('Advanced development workflows');
        }
        
        if (this.analysisResults.bmmArtifacts?.length > 0) {
            customizations.push('Existing artifact integration');
        }
        
        return customizations;
    }
    
    /**
     * Generate next steps guidance
     */
    generateNextSteps() {
        const steps = [];
        
        // Configuration fixes
        if (this.validationResults?.errors?.length > 0) {
            steps.push({
                type: 'configuration',
                priority: 'high',
                action: 'Fix configuration issues',
                details: this.validationResults.errors
            });
        }
        
        // Primary recommendation
        steps.push({
            type: 'workflow',
            priority: 'primary',
            action: `Start with ${this.recommendations.primary.track} workflow`,
            reasoning: this.recommendations.reasoning[0] || 'Recommended based on project analysis'
        });
        
        // Suggestions
        for (const suggestion of this.recommendations.suggestions.slice(0, 3)) {
            steps.push({
                type: 'suggestion',
                priority: 'medium',
                action: suggestion
            });
        }
        
        return steps;
    }
    
    /**
     * Calculate configuration health score
     */
    calculateConfigurationHealthScore() {
        let score = 100;
        
        // Deduct for errors
        if (this.validationResults?.errors) {
            score -= this.validationResults.errors.length * 15;
        }
        
        // Deduct for warnings
        if (this.validationResults?.warnings) {
            score -= this.validationResults.warnings.length * 5;
        }
        
        // Add for successful validations
        if (this.validationResults?.isValid) {
            score += 10;
        }
        
        return Math.max(0, Math.min(100, score));
    }
    
    /**
     * Get enabled features
     */
    getEnabledFeatures() {
        return [
            'intelligent_detection',
            'modern_tool_recognition', 
            'smart_recommendations',
            'confidence_scoring',
            'enhanced_ux',
            'configuration_validation',
            'error_recovery',
            'project_intelligence'
        ];
    }
    
    /**
     * Estimate workflow duration
     */
    estimateWorkflowDuration(config) {
        const baseDurations = {
            'quick-flow': '2-8 hours',
            'method': '1-3 days',
            'enterprise': '3-7 days'
        };
        
        let duration = baseDurations[config.track] || '1-2 days';
        
        // Adjust for complexity
        if (config.complexity === 'enterprise') {
            duration = duration.replace('days', 'weeks').replace('hours', 'days');
        } else if (config.complexity === 'minimal') {
            duration = duration.replace('days', 'hours').replace('hours', 'minutes');
        }
        
        return duration;
    }
    
    /**
     * Create fallback analysis
     */
    createFallbackAnalysis() {
        return {
            bmmArtifacts: [],
            implementationArtifacts: [],
            modernTools: [],
            enterpriseFeatures: [],
            codebase: { stats: { totalFiles: 0 } },
            complexity: { score: 3, level: 'moderate', indicators: ['Basic project'] },
            maturity: { score: 3, level: 'basic', indicators: ['Standard setup'] },
            insights: {
                projectType: 'software',
                fieldType: 'unknown',
                recommendedTrack: 'method',
                keyFeatures: ['Fallback analysis'],
                warnings: ['Analysis failed - using basic configuration'],
                recommendations: ['Use standard BMad Method workflows']
            }
        };
    }
    
    /**
     * Create fallback recommendations
     */
    createFallbackRecommendations() {
        return {
            primary: { track: 'method', confidence: 'low', rationale: 'Default recommendation' },
            confidence: 50,
            reasoning: ['Fallback recommendation due to analysis issues'],
            alternatives: [{ track: 'quick-flow', reason: 'Alternative if scope is simple' }],
            warnings: ['Using fallback recommendations - analysis may be incomplete'],
            suggestions: ['Consider running analysis again for better recommendations']
        };
    }
    
    /**
     * Create fallback workflow path
     */
    createFallbackWorkflowPath() {
        return {
            base: 'method-greenfield',
            customizations: ['fallback-mode'],
            confidence: 'low',
            estimatedDuration: '1-2 days',
            complexity: 'moderate'
        };
    }
}

module.exports = IntelligenceEngine;