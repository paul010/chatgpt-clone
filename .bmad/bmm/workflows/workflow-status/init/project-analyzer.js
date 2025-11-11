/**
 * Enhanced Project Analyzer
 * Intelligent project detection and analysis engine for BMad Method
 */

class ProjectAnalyzer {
    constructor(config = {}) {
        this.config = {
            outputFolder: config.outputFolder || './docs',
            ephemeralLocation: config.ephemeralLocation || './temp',
            ...config
        };
        
        this.scanResults = {
            bmmArtifacts: [],
            implementationArtifacts: [],
            modernTools: [],
            enterpriseFeatures: [],
            codebase: {},
            complexity: {
                score: 0,
                level: 'unknown',
                indicators: []
            },
            maturity: {
                level: 'basic',
                indicators: [],
                score: 0
            }
        };
        
        this.patterns = {
            // BMM Planning Artifacts
            bmm: {
                prd: [
                    /_prd.*\.md$/i,
                    /_prd\/index\.md$/i
                ],
                techSpec: [
                    /_tech-spec.*\.md$/i,
                    /_spec.*\.md$/i
                ],
                epic: [
                    /_epic.*\.md$/i,
                    /_epic\/index\.md$/i
                ],
                architecture: [
                    /_architecture.*\.md$/i,
                    /_arch.*\.md$/i
                ],
                ux: [
                    /_ux.*\.md$/i,
                    /_design.*\.md$/i
                ],
                productBrief: [
                    /_brief.*\.md$/i
                ],
                research: [
                    /_research.*\.md$/i
                ],
                brainstorm: [
                    /_brainstorm.*\.md$/i
                ]
            },
            
            // Implementation Artifacts
            implementation: {
                stories: [
                    /stories\/.*\.md$/i,
                    /tasks\/.*\.md$/i,
                    /user-stories\/.*\.md$/i
                ],
                sprintStatus: [
                    /sprint-status\.yaml$/i,
                    /sprint-status\.yml$/i
                ],
                workflowStatus: [
                    /bmm-workflow-status\.yaml$/i,
                    /bmm-workflow-status\.yml$/i
                ],
                taskManagement: [
                    /tasks\.json$/i,
                    /taskfile\.yml$/i
                ]
            },
            
            // Modern Development Tools
            modern: {
                frameworks: {
                    react: /react/i,
                    vue: /vue/i,
                    angular: /@angular/i,
                    next: /next/i,
                    nuxt: /nuxt/i,
                    svelte: /svelte/i,
                    express: /express/i,
                    django: /django/i,
                    flask: /flask/i,
                    spring: /spring-boot/i,
                    gin: /gin-gonic/i,
                    fiber: /gofiber/i
                },
                tooling: {
                    typescript: /typescript/i,
                    eslint: /eslint/i,
                    prettier: /prettier/i,
                    webpack: /webpack/i,
                    vite: /vite/i,
                    rollup: /rollup/i
                },
                testing: {
                    jest: /jest/i,
                    cypress: /cypress/i,
                    playwright: /playwright/i,
                    pytest: /pytest/i,
                    junit: /junit/i
                },
                devops: {
                    docker: /docker/i,
                    kubernetes: /kubernetes/i,
                    jenkins: /jenkins/i,
                    githubActions: /github.*workflow/i,
                    gitlabCi: /gitlab-ci\.yml/i,
                    terraform: /terraform/i,
                    ansible: /ansible/i
                },
                monitoring: {
                    prometheus: /prometheus/i,
                    grafana: /grafana/i,
                    datadog: /datadog/i,
                    sentry: /sentry/i
                }
            },
            
            // Enterprise Features
            enterprise: {
                security: [
                    /snyk/i,
                    /dependency-check/i,
                    /owasp/i,
                    /security\.json/i
                ],
                compliance: [
                    /hipaa/i,
                    /gdpr/i,
                    /soc2/i,
                    /iso27001/i
                ],
                performance: [
                    /lighthouse/i,
                    /web-vitals/i,
                    /performance\.json/i
                ],
                accessibility: [
                    /pa11y/i,
                    /axe-core/i,
                    /accessibility\.json/i
                ]
            }
        };
    }
    
    /**
     * Main analysis method - performs comprehensive project scan
     */
    async analyzeProject(projectPath = '.') {
        console.log('🔍 Starting enhanced project analysis...');
        
        try {
            // Scan for all artifact types
            await this.scanBMMArtifacts(projectPath);
            await this.scanImplementationArtifacts(projectPath);
            await this.scanModernTools(projectPath);
            await this.scanEnterpriseFeatures(projectPath);
            await this.analyzeCodebase(projectPath);
            
            // Calculate complexity and maturity scores
            this.calculateComplexity();
            this.calculateMaturity();
            
            // Generate project insights
            const insights = this.generateInsights();
            
            console.log('✅ Project analysis completed');
            return {
                ...this.scanResults,
                insights,
                analysisTimestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ Project analysis failed:', error);
            throw error;
        }
    }
    
    /**
     * Scan for BMM planning artifacts
     */
    async scanBMMArtifacts(projectPath) {
        console.log('📋 Scanning for BMM planning artifacts...');
        
        for (const [artifactType, patterns] of Object.entries(this.patterns.bmm)) {
            for (const pattern of patterns) {
                const files = await this.findFilesByPattern(projectPath, pattern);
                if (files.length > 0) {
                    this.scanResults.bmmArtifacts.push({
                        type: artifactType,
                        files: files,
                        pattern: pattern.toString()
                    });
                }
            }
        }
    }
    
    /**
     * Scan for implementation artifacts
     */
    async scanImplementationArtifacts(projectPath) {
        console.log('🔧 Scanning for implementation artifacts...');
        
        for (const [artifactType, patterns] of Object.entries(this.patterns.implementation)) {
            for (const pattern of patterns) {
                const files = await this.findFilesByPattern(projectPath, pattern);
                if (files.length > 0) {
                    this.scanResults.implementationArtifacts.push({
                        type: artifactType,
                        files: files,
                        pattern: pattern.toString()
                    });
                }
            }
        }
    }
    
    /**
     * Scan for modern development tools and frameworks
     */
    async scanModernTools(projectPath) {
        console.log('🛠️ Scanning for modern development tools...');
        
        // Scan package.json for dependencies
        await this.analyzePackageJson(projectPath);
        
        // Scan for configuration files
        await this.scanConfigFiles(projectPath);
        
        // Scan for build and tooling files
        await this.scanToolingFiles(projectPath);
    }
    
    /**
     * Scan for enterprise-grade features
     */
    async scanEnterpriseFeatures(projectPath) {
        console.log('🏢 Scanning for enterprise features...');
        
        for (const [featureType, patterns] of Object.entries(this.patterns.enterprise)) {
            for (const pattern of patterns) {
                const files = await this.findFilesByPattern(projectPath, pattern);
                if (files.length > 0) {
                    this.scanResults.enterpriseFeatures.push({
                        type: featureType,
                        files: files,
                        pattern: pattern.toString()
                    });
                }
            }
        }
    }
    
    /**
     * Analyze codebase structure and complexity
     */
    async analyzeCodebase(projectPath) {
        console.log('📊 Analyzing codebase structure...');
        
        const structure = await this.analyzeFileStructure(projectPath);
        const stats = await this.analyzeCodeStats(projectPath);
        
        this.scanResults.codebase = {
            structure,
            stats,
            languages: this.detectLanguages(structure),
            architecturePattern: this.detectArchitecturePattern(structure, stats)
        };
    }
    
    /**
     * Analyze package.json for modern dependencies
     */
    async analyzePackageJson(projectPath) {
        const packageJsonPath = await this.findFile(projectPath, 'package.json');
        if (!packageJsonPath) return;
        
        try {
            const content = await this.readFile(packageJsonPath);
            const packageData = JSON.parse(content);
            
            // Analyze dependencies
            const dependencies = { ...packageData.dependencies, ...packageData.devDependencies };
            
            // Check for modern frameworks
            for (const [framework, pattern] of Object.entries(this.patterns.modern.frameworks)) {
                for (const [dep, version] of Object.entries(dependencies)) {
                    if (pattern.test(dep)) {
                        this.scanResults.modernTools.push({
                            category: 'framework',
                            name: framework,
                            dependency: dep,
                            version: version,
                            file: packageJsonPath
                        });
                    }
                }
            }
            
            // Check for modern tooling
            for (const [tool, pattern] of Object.entries(this.patterns.modern.tooling)) {
                for (const [dep, version] of Object.entries(dependencies)) {
                    if (pattern.test(dep)) {
                        this.scanResults.modernTools.push({
                            category: 'tooling',
                            name: tool,
                            dependency: dep,
                            version: version,
                            file: packageJsonPath
                        });
                    }
                }
            }
            
            // Check for testing tools
            for (const [testing, pattern] of Object.entries(this.patterns.modern.testing)) {
                for (const [dep, version] of Object.entries(dependencies)) {
                    if (pattern.test(dep)) {
                        this.scanResults.modernTools.push({
                            category: 'testing',
                            name: testing,
                            dependency: dep,
                            version: version,
                            file: packageJsonPath
                        });
                    }
                }
            }
            
        } catch (error) {
            console.warn('⚠️ Could not parse package.json:', error.message);
        }
    }
    
    /**
     * Calculate project complexity score
     */
    calculateComplexity() {
        let score = 0;
        const indicators = [];
        
        // File count analysis
        const totalFiles = this.scanResults.codebase.stats?.totalFiles || 0;
        if (totalFiles > 1000) {
            score += 3;
            indicators.push('Large codebase (>1000 files)');
        } else if (totalFiles > 500) {
            score += 2;
            indicators.push('Medium codebase (500-1000 files)');
        } else if (totalFiles > 100) {
            score += 1;
            indicators.push('Small codebase (100-500 files)');
        }
        
        // Dependency analysis
        const dependencyCount = this.scanResults.modernTools.length;
        if (dependencyCount > 20) {
            score += 3;
            indicators.push('Many dependencies (>20 tools)');
        } else if (dependencyCount > 10) {
            score += 2;
            indicators.push('Moderate dependencies (10-20 tools)');
        } else if (dependencyCount > 5) {
            score += 1;
            indicators.push('Some dependencies (5-10 tools)');
        }
        
        // Module complexity
        const moduleCount = this.scanResults.codebase.structure?.moduleCount || 0;
        if (moduleCount > 10) {
            score += 3;
            indicators.push('Complex module structure (>10 modules)');
        } else if (moduleCount > 5) {
            score += 2;
            indicators.push('Moderate module structure (5-10 modules)');
        } else if (moduleCount > 2) {
            score += 1;
            indicators.push('Simple module structure (2-5 modules)');
        }
        
        // Enterprise features
        if (this.scanResults.enterpriseFeatures.length > 5) {
            score += 3;
            indicators.push('Enterprise features detected');
        } else if (this.scanResults.enterpriseFeatures.length > 2) {
            score += 2;
            indicators.push('Some enterprise features');
        }
        
        // Architecture pattern
        const pattern = this.scanResults.codebase.architecturePattern;
        if (pattern === 'microservices') {
            score += 3;
            indicators.push('Microservices architecture');
        } else if (pattern === 'modular') {
            score += 2;
            indicators.push('Modular architecture');
        } else if (pattern === 'monolith') {
            score += 1;
            indicators.push('Monolithic architecture');
        }
        
        this.scanResults.complexity = {
            score: Math.min(score, 10), // Cap at 10
            level: this.getComplexityLevel(score),
            indicators
        };
    }
    
    /**
     * Calculate development maturity score
     */
    calculateMaturity() {
        let score = 0;
        const indicators = [];
        
        // Testing maturity
        const testingTools = this.scanResults.modernTools.filter(t => t.category === 'testing');
        if (testingTools.length > 2) {
            score += 3;
            indicators.push('Comprehensive testing stack');
        } else if (testingTools.length > 0) {
            score += 1;
            indicators.push('Basic testing setup');
        }
        
        // DevOps maturity
        const devopsTools = this.scanResults.modernTools.filter(t => t.category === 'devops');
        if (devopsTools.length > 2) {
            score += 3;
            indicators.push('Advanced DevOps pipeline');
        } else if (devopsTools.length > 0) {
            score += 1;
            indicators.push('Basic DevOps tools');
        }
        
        // Code quality tools
        const qualityTools = this.scanResults.modernTools.filter(t => 
            t.name === 'eslint' || t.name === 'prettier' || t.name === 'typescript'
        );
        if (qualityTools.length > 2) {
            score += 2;
            indicators.push('Comprehensive code quality tools');
        } else if (qualityTools.length > 0) {
            score += 1;
            indicators.push('Basic code quality tools');
        }
        
        // Monitoring and security
        if (this.scanResults.enterpriseFeatures.length > 3) {
            score += 2;
            indicators.push('Enterprise monitoring and security');
        }
        
        this.scanResults.maturity = {
            score: Math.min(score, 10),
            level: this.getMaturityLevel(score),
            indicators
        };
    }
    
    /**
     * Generate project insights
     */
    generateInsights() {
        const insights = {
            projectType: this.detectProjectType(),
            fieldType: this.determineFieldType(),
            recommendedTrack: this.recommendTrack(),
            keyFeatures: [],
            warnings: [],
            recommendations: []
        };
        
        // Generate insights based on analysis
        if (this.scanResults.modernTools.length > 10) {
            insights.keyFeatures.push('Modern development stack');
            insights.recommendations.push('Consider enterprise workflows for better integration');
        }
        
        if (this.scanResults.complexity.score > 7) {
            insights.keyFeatures.push('High complexity project');
            insights.recommendations.push('BMad Method recommended over Quick Flow');
        }
        
        if (this.scanResults.enterpriseFeatures.length > 3) {
            insights.keyFeatures.push('Enterprise-grade requirements');
            insights.recommendations.push('BMad Enterprise Method strongly recommended');
        }
        
        return insights;
    }
    
    // Helper methods
    async findFilesByPattern(path, pattern) {
        // Implementation would use file system scanning
        // This is a placeholder for the actual file system operations
        return [];
    }
    
    async findFile(path, filename) {
        // Implementation would search for specific files
        // This is a placeholder for the actual file system operations
        return null;
    }
    
    async readFile(path) {
        // Implementation would read file content
        // This is a placeholder for the actual file operations
        return '';
    }
    
    async analyzeFileStructure(path) {
        // Implementation would analyze directory structure
        return {
            totalFiles: 0,
            moduleCount: 0,
            structure: {}
        };
    }
    
    async analyzeCodeStats(path) {
        // Implementation would calculate code statistics
        return {
            totalFiles: 0,
            totalLines: 0,
            languages: []
        };
    }
    
    detectLanguages(structure) {
        // Implementation would detect programming languages
        return ['javascript'];
    }
    
    detectArchitecturePattern(structure, stats) {
        // Implementation would detect architecture patterns
        return 'modular';
    }
    
    getComplexityLevel(score) {
        if (score >= 8) return 'enterprise';
        if (score >= 6) return 'complex';
        if (score >= 4) return 'moderate';
        if (score >= 2) return 'simple';
        return 'minimal';
    }
    
    getMaturityLevel(score) {
        if (score >= 8) return 'enterprise';
        if (score >= 6) return 'advanced';
        if (score >= 4) return 'intermediate';
        if (score >= 2) return 'basic';
        return 'minimal';
    }
    
    detectProjectType() {
        const tools = this.scanResults.modernTools;
        const hasReact = tools.some(t => t.name === 'react');
        const hasNext = tools.some(t => t.name === 'next');
        
        if (hasNext || hasReact) return 'web-application';
        if (tools.some(t => t.name === 'express')) return 'api-backend';
        if (tools.some(t => t.category === 'devops')) return 'infrastructure';
        return 'software';
    }
    
    determineFieldType() {
        // This would be determined by presence of existing code vs. greenfield
        return this.scanResults.codebase.stats?.totalFiles > 0 ? 'brownfield' : 'greenfield';
    }
    
    recommendTrack() {
        if (this.scanResults.complexity.score >= 8 || this.scanResults.enterpriseFeatures.length > 3) {
            return 'enterprise';
        } else if (this.scanResults.complexity.score >= 5) {
            return 'method';
        } else {
            return 'quick-flow';
        }
    }
}

module.exports = ProjectAnalyzer;