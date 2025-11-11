/**
 * Enhanced Recommendation System
 * Intelligent workflow and track recommendation engine for BMad Method
 */

class RecommendationSystem {
    constructor() {
        this.confidenceThresholds = {
            high: 90,
            medium: 70,
            low: 50
        };
        
        this.scoringWeights = {
            complexity: 0.3,
            maturity: 0.25,
            enterprise: 0.2,
            team: 0.15,
            compliance: 0.1
        };
        
        this.recommendationRules = {
            quick_flow: {
                minScore: 1,
                maxScore: 3,
                conditions: [
                    'simple_features',
                    'clear_scope',
                    'low_complexity',
                    'basic_requirements'
                ]
            },
            method: {
                minScore: 4,
                maxScore: 7,
                conditions: [
                    'moderate_complexity',
                    'multiple_features',
                    'integration_requirements',
                    'user_experience_focus'
                ]
            },
            enterprise: {
                minScore: 8,
                maxScore: 10,
                conditions: [
                    'enterprise_scale',
                    'compliance_requirements',
                    'high_availability',
                    'security_critical',
                    'multi_tenant'
                ]
            }
        };
    }
    
    /**
     * Generate intelligent recommendations based on project analysis
     */
    generateRecommendations(analysisResults) {
        const recommendations = {
            primary: null,
            alternatives: [],
            confidence: 0,
            reasoning: [],
            warnings: [],
            suggestions: []
        };
        
        // Calculate base recommendation score
        const baseScore = this.calculateBaseScore(analysisResults);
        
        // Generate primary recommendation
        recommendations.primary = this.determinePrimaryRecommendation(baseScore, analysisResults);
        recommendations.confidence = this.calculateConfidence(analysisResults, recommendations.primary);
        recommendations.reasoning = this.generateReasoning(analysisResults, recommendations.primary);
        recommendations.warnings = this.generateWarnings(analysisResults);
        recommendations.suggestions = this.generateSuggestions(analysisResults);
        
        // Generate alternative recommendations
        recommendations.alternatives = this.generateAlternatives(baseScore, analysisResults);
        
        return recommendations;
    }
    
    /**
     * Calculate base recommendation score
     */
    calculateBaseScore(analysisResults) {
        let score = 0;
        const details = [];
        
        // Complexity factors
        if (analysisResults.complexity) {
            score += analysisResults.complexity.score * this.scoringWeights.complexity;
            details.push(`Complexity: ${analysisResults.complexity.score}/10`);
        }
        
        // Maturity factors
        if (analysisResults.maturity) {
            score += analysisResults.maturity.score * this.scoringWeights.maturity;
            details.push(`Maturity: ${analysisResults.maturity.score}/10`);
        }
        
        // Enterprise features
        const enterpriseFeatures = analysisResults.enterpriseFeatures || [];
        if (enterpriseFeatures.length > 3) {
            score += 8 * this.scoringWeights.enterprise;
            details.push(`Enterprise features: ${enterpriseFeatures.length}`);
        } else if (enterpriseFeatures.length > 0) {
            score += 4 * this.scoringWeights.enterprise;
            details.push(`Some enterprise features: ${enterpriseFeatures.length}`);
        }
        
        // Modern tools count
        const modernTools = analysisResults.modernTools || [];
        if (modernTools.length > 15) {
            score += 7 * 0.15; // Team/process factor
            details.push(`Advanced tooling: ${modernTools.length} tools`);
        } else if (modernTools.length > 8) {
            score += 5 * 0.15;
            details.push(`Modern tooling: ${modernTools.length} tools`);
        }
        
        // Compliance indicators
        const complianceIndicators = this.detectComplianceRequirements(analysisResults);
        if (complianceIndicators.length > 2) {
            score += 8 * this.scoringWeights.compliance;
            details.push(`Compliance: ${complianceIndicators.length} requirements`);
        } else if (complianceIndicators.length > 0) {
            score += 5 * this.scoringWeights.compliance;
            details.push(`Some compliance: ${complianceIndicators.length}`);
        }
        
        return {
            total: Math.min(score, 10),
            breakdown: details
        };
    }
    
    /**
     * Determine primary recommendation
     */
    determinePrimaryRecommendation(score, analysisResults) {
        const totalScore = score.total;
        
        if (totalScore >= 8) {
            return {
                track: 'enterprise',
                confidence: 'high',
                rationale: 'Enterprise-grade requirements detected'
            };
        } else if (totalScore >= 4) {
            return {
                track: 'method',
                confidence: 'medium',
                rationale: 'Moderate complexity warrants full planning'
            };
        } else {
            return {
                track: 'quick-flow',
                confidence: 'high',
                rationale: 'Simple scope suitable for quick implementation'
            };
        }
    }
    
    /**
     * Calculate recommendation confidence
     */
    calculateConfidence(analysisResults, recommendation) {
        let confidence = 50; // Base confidence
        
        // Increase confidence based on clear indicators
        if (analysisResults.bmmArtifacts?.length > 0) {
            confidence += 20; // Existing artifacts provide clear direction
        }
        
        if (analysisResults.modernTools?.length > 10) {
            confidence += 15; // Modern stack indicates maturity
        }
        
        if (analysisResults.enterpriseFeatures?.length > 3) {
            confidence += 20; // Strong enterprise indicators
        }
        
        if (analysisResults.complexity?.score > 7) {
            confidence += 15; // High complexity is clear indicator
        }
        
        // Decrease confidence for conflicting signals
        if (analysisResults.bmmArtifacts?.length === 0 && analysisResults.modernTools?.length === 0) {
            confidence -= 20; // Limited indicators
        }
        
        return Math.max(30, Math.min(95, confidence));
    }
    
    /**
     * Generate recommendation reasoning
     */
    generateReasoning(analysisResults, recommendation) {
        const reasoning = [];
        
        // Add complexity reasoning
        if (analysisResults.complexity?.indicators) {
            reasoning.push(...analysisResults.complexity.indicators);
        }
        
        // Add maturity reasoning
        if (analysisResults.maturity?.indicators) {
            reasoning.push(...analysisResults.maturity.indicators);
        }
        
        // Add tool-based reasoning
        const modernTools = analysisResults.modernTools || [];
        if (modernTools.length > 10) {
            reasoning.push('Modern development stack detected');
        }
        
        // Add enterprise reasoning
        const enterpriseFeatures = analysisResults.enterpriseFeatures || [];
        if (enterpriseFeatures.length > 2) {
            reasoning.push('Enterprise-grade features identified');
        }
        
        // Add project type reasoning
        const insights = analysisResults.insights;
        if (insights?.projectType) {
            reasoning.push(`Project type: ${insights.projectType}`);
        }
        
        return reasoning;
    }
    
    /**
     * Generate warnings based on analysis
     */
    generateWarnings(analysisResults) {
        const warnings = [];
        
        // Complexity warnings
        if (analysisResults.complexity?.score > 8 && analysisResults.modernTools?.length < 5) {
            warnings.push('High complexity project with limited tooling - consider enterprise workflows');
        }
        
        // Tooling warnings
        if (analysisResults.modernTools?.length < 3) {
            warnings.push('Limited modern tooling detected - may benefit from development process improvements');
        }
        
        // Enterprise warnings
        if (analysisResults.enterpriseFeatures?.length > 3 && analysisResults.maturity?.score < 6) {
            warnings.push('Enterprise requirements with limited maturity - consider additional planning');
        }
        
        // BMM artifacts warnings
        if (analysisResults.bmmArtifacts?.length > 0 && analysisResults.implementationArtifacts?.length === 0) {
            warnings.push('Planning artifacts exist but no implementation - consider continuing planning or starting development');
        }
        
        return warnings;
    }
    
    /**
     * Generate suggestions for improvement
     */
    generateSuggestions(analysisResults) {
        const suggestions = [];
        
        // Tooling suggestions
        const modernTools = analysisResults.modernTools || [];
        if (modernTools.length < 5) {
            suggestions.push('Consider adding modern development tools (testing, linting, CI/CD)');
        }
        
        if (!modernTools.some(t => t.category === 'testing')) {
            suggestions.push('Add testing framework for better code quality');
        }
        
        if (!modernTools.some(t => t.category === 'devops')) {
            suggestions.push('Consider implementing CI/CD pipeline');
        }
        
        // Process suggestions
        if (analysisResults.complexity?.score > 6 && analysisResults.bmmArtifacts?.length === 0) {
            suggestions.push('High complexity project would benefit from structured BMad Method planning');
        }
        
        // Enterprise suggestions
        if (analysisResults.enterpriseFeatures?.length > 2 && analysisResults.maturity?.score < 7) {
            suggestions.push('Enterprise features detected - consider BMad Enterprise Method for comprehensive planning');
        }
        
        // Documentation suggestions
        if (analysisResults.modernTools?.length > 8 && analysisResults.bmmArtifacts?.length === 0) {
            suggestions.push('Complex modern project would benefit from documentation workflows');
        }
        
        return suggestions;
    }
    
    /**
     * Generate alternative recommendations
     */
    generateAlternatives(score, analysisResults) {
        const alternatives = [];
        const primary = this.determinePrimaryRecommendation(score, analysisResults);
        
        // If primary is enterprise, suggest method as alternative
        if (primary.track === 'enterprise') {
            alternatives.push({
                track: 'method',
                reason: 'Full planning without enterprise overhead - suitable if compliance is not critical',
                confidence: 'medium'
            });
        }
        
        // If primary is method, suggest quick flow
        if (primary.track === 'method') {
            alternatives.push({
                track: 'quick-flow',
                reason: 'Faster implementation if scope is well-defined and time is critical',
                confidence: 'low'
            });
        }
        
        // If primary is quick flow, suggest method
        if (primary.track === 'quick-flow') {
            alternatives.push({
                track: 'method',
                reason: 'Better for complex features or if rework risk is unacceptable',
                confidence: 'medium'
            });
        }
        
        return alternatives;
    }
    
    /**
     * Detect compliance requirements
     */
    detectComplianceRequirements(analysisResults) {
        const compliance = [];
        const enterpriseFeatures = analysisResults.enterpriseFeatures || [];
        
        for (const feature of enterpriseFeatures) {
            if (feature.type === 'compliance') {
                compliance.push(...feature.files);
            }
        }
        
        return compliance;
    }
    
    /**
     * Smart track recommendation for existing artifacts
     */
    recommendForExistingArtifacts(artifacts) {
        const hasPRD = artifacts.some(a => a.type === 'prd');
        const hasArchitecture = artifacts.some(a => a.type === 'architecture');
        const hasTechSpec = artifacts.some(a => a.type === 'techSpec');
        const hasSecurity = artifacts.some(a => a.type === 'security');
        
        let track = 'method';
        let confidence = 'high';
        let reasoning = [];
        
        if (hasPRD && hasArchitecture) {
            track = 'method';
            confidence = 'high';
            reasoning.push('PRD and Architecture found - clear BMad Method pattern');
        } else if (hasPRD) {
            track = 'method';
            confidence = 'medium';
            reasoning.push('PRD found - Architecture workflow recommended');
        } else if (hasTechSpec) {
            track = 'quick-flow';
            confidence = 'high';
            reasoning.push('Tech-spec found - BMad Quick Flow pattern detected');
        } else if (hasSecurity) {
            track = 'enterprise';
            confidence = 'medium';
            reasoning.push('Security artifacts suggest enterprise requirements');
        } else {
            track = 'method';
            confidence = 'low';
            reasoning.push('Some artifacts found - recommend full BMad Method');
        }
        
        return {
            track,
            confidence,
            reasoning,
            recommendations: this.generateReasoningForArtifacts(artifacts, track)
        };
    }
    
    /**
     * Generate reasoning for artifact-based recommendations
     */
    generateReasoningForArtifacts(artifacts, track) {
        const reasoning = [];
        
        const artifactTypes = artifacts.map(a => a.type);
        
        if (artifactTypes.includes('prd')) {
            reasoning.push('Product planning completed - ready for solutioning phase');
        }
        
        if (artifactTypes.includes('architecture')) {
            reasoning.push('Architecture design completed - implementation ready');
        }
        
        if (artifactTypes.includes('ux')) {
            reasoning.push('UX design completed - ready for technical implementation');
        }
        
        if (artifactTypes.length > 3) {
            reasoning.push('Multiple planning artifacts suggest comprehensive approach');
        }
        
        return reasoning;
    }
}

module.exports = RecommendationSystem;