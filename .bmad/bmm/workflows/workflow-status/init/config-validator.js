/**
 * Enhanced Configuration Validator
 * Validates BMad configuration and provides smart error recovery
 */

class ConfigValidator {
    constructor() {
        this.validationRules = {
            requiredPaths: [
                { path: '.bmad/bmm/config.yaml', required: true },
                { path: '.bmad/bmm/workflows', required: true }
            ],
            outputFolder: {
                required: true,
                writable: true,
                minFreeSpaceMB: 100,
                maxPathLength: 200
            },
            ephemeralLocation: {
                required: true,
                accessible: true,
                tempWritable: true
            },
            userPreferences: {
                userName: { required: true, minLength: 1 },
                communicationLanguage: { required: true, validValues: ['zh-CN', 'en-US'] },
                documentOutputLanguage: { required: true },
                userSkillLevel: { required: true, validValues: ['beginner', 'intermediate', 'advanced'] }
            }
        };
        
        this.validationResults = {
            isValid: true,
            errors: [],
            warnings: [],
            suggestions: [],
            recoverableErrors: []
        };
    }
    
    /**
     * Validate complete BMad configuration
     */
    async validateConfig(configSource = '.bmad/bmm/config.yaml') {
        console.log('🔍 Validating BMad configuration...');
        
        try {
            // Reset validation results
            this.resetResults();
            
            // Validate configuration file
            await this.validateConfigFile(configSource);
            
            // Validate output folder
            await this.validateOutputFolder();
            
            // Validate ephemeral location
            await this.validateEphemeralLocation();
            
            // Validate user preferences
            await this.validateUserPreferences();
            
            // Validate workflow paths
            await this.validateWorkflowPaths();
            
            // Check for common issues
            await this.checkCommonIssues();
            
            console.log('✅ Configuration validation completed');
            return this.validationResults;
            
        } catch (error) {
            console.error('❌ Configuration validation failed:', error);
            this.validationResults.isValid = false;
            this.validationResults.errors.push(`Validation failed: ${error.message}`);
            return this.validationResults;
        }
    }
    
    /**
     * Validate configuration file
     */
    async validateConfigFile(configPath) {
        try {
            // Check if config file exists
            if (!await this.fileExists(configPath)) {
                this.validationResults.errors.push(`Configuration file not found: ${configPath}`);
                return;
            }
            
            // Read and parse config
            const config = await this.readConfigFile(configPath);
            
            // Validate required fields
            this.validateRequiredFields(config);
            
            // Validate field values
            this.validateFieldValues(config);
            
        } catch (error) {
            this.validationResults.errors.push(`Config file error: ${error.message}`);
        }
    }
    
    /**
     * Validate output folder configuration
     */
    async validateOutputFolder() {
        try {
            const outputFolder = await this.getConfigValue('output_folder');
            
            if (!outputFolder) {
                this.validationResults.errors.push('Output folder not configured');
                return;
            }
            
            // Check if path is valid
            if (!this.isValidPath(outputFolder)) {
                this.validationResults.errors.push(`Invalid output folder path: ${outputFolder}`);
                return;
            }
            
            // Check if folder is writable
            if (!await this.isWritable(outputFolder)) {
                this.validationResults.errors.push(`Output folder not writable: ${outputFolder}`);
                this.validationResults.recoverableErrors.push({
                    type: 'folder_permissions',
                    suggestion: `Try running: chmod 755 ${outputFolder}`,
                    autoFix: true
                });
            }
            
            // Check available space
            const freeSpace = await this.getFreeSpace(outputFolder);
            if (freeSpace < this.validationRules.outputFolder.minFreeSpaceMB) {
                this.validationResults.warnings.push(
                    `Low disk space: ${freeSpace}MB available, ${this.validationRules.outputFolder.minFreeSpaceMB}MB recommended`
                );
            }
            
            // Check path length
            if (outputFolder.length > this.validationRules.outputFolder.maxPathLength) {
                this.validationResults.warnings.push(
                    `Long path may cause issues: ${outputFolder.length} characters`
                );
            }
            
        } catch (error) {
            this.validationResults.errors.push(`Output folder validation error: ${error.message}`);
        }
    }
    
    /**
     * Validate ephemeral location
     */
    async validateEphemeralLocation() {
        try {
            const ephemeralLocation = await this.getConfigValue('dev_ephemeral_location');
            
            if (!ephemeralLocation) {
                this.validationResults.errors.push('Ephemeral location not configured');
                return;
            }
            
            // Check accessibility
            if (!await this.isAccessible(ephemeralLocation)) {
                this.validationResults.errors.push(`Ephemeral location not accessible: ${ephemeralLocation}`);
                this.validationResults.recoverableErrors.push({
                    type: 'ephemeral_access',
                    suggestion: `Create directory: mkdir -p ${ephemeralLocation}`,
                    autoFix: true
                });
            }
            
            // Check temp writable
            if (!await this.isTempWritable(ephemeralLocation)) {
                this.validationResults.warnings.push(
                    `Ephemeral location may not be writable for temp files: ${ephemeralLocation}`
                );
            }
            
        } catch (error) {
            this.validationResults.errors.push(`Ephemeral location validation error: ${error.message}`);
        }
    }
    
    /**
     * Validate user preferences
     */
    async validateUserPreferences() {
        try {
            const userName = await this.getConfigValue('user_name');
            const communicationLanguage = await this.getConfigValue('communication_language');
            const documentOutputLanguage = await this.getConfigValue('document_output_language');
            const userSkillLevel = await this.getConfigValue('user_skill_level');
            
            // Validate user name
            if (!userName || userName.trim().length === 0) {
                this.validationResults.errors.push('User name is required');
            } else if (userName.length > 100) {
                this.validationResults.warnings.push('User name is very long, may cause formatting issues');
            }
            
            // Validate communication language
            if (!communicationLanguage) {
                this.validationResults.errors.push('Communication language not configured');
            } else if (!this.validationRules.userPreferences.communicationLanguage.validValues.includes(communicationLanguage)) {
                this.validationResults.errors.push(`Invalid communication language: ${communicationLanguage}`);
            }
            
            // Validate document output language
            if (!documentOutputLanguage) {
                this.validationResults.warnings.push('Document output language not specified, will use default');
            }
            
            // Validate user skill level
            if (!userSkillLevel) {
                this.validationResults.errors.push('User skill level not configured');
            } else if (!this.validationRules.userPreferences.userSkillLevel.validValues.includes(userSkillLevel)) {
                this.validationResults.errors.push(`Invalid user skill level: ${userSkillLevel}`);
            }
            
        } catch (error) {
            this.validationResults.errors.push(`User preferences validation error: ${error.message}`);
        }
    }
    
    /**
     * Validate workflow paths
     */
    async validateWorkflowPaths() {
        try {
            // Check if workflow directories exist
            const workflowPaths = [
                '.bmad/bmm/workflows',
                '.bmad/bmm/workflows/workflow-status',
                '.bmad/bmm/workflows/workflow-status/paths'
            ];
            
            for (const path of workflowPaths) {
                if (!await this.directoryExists(path)) {
                    this.validationResults.errors.push(`Workflow path not found: ${path}`);
                    this.validationResults.recoverableErrors.push({
                        type: 'missing_workflow_path',
                        suggestion: `Workflow path missing: ${path}`,
                        autoFix: false
                    });
                }
            }
            
            // Check if required workflow files exist
            const requiredWorkflowFiles = [
                'workflow-status/init/workflow.yaml',
                'workflow-status/init/instructions.md',
                'workflow-status/paths/method-greenfield.yaml'
            ];
            
            for (const file of requiredWorkflowFiles) {
                if (!await this.fileExists(`.bmad/bmm/workflows/${file}`)) {
                    this.validationResults.errors.push(`Required workflow file not found: ${file}`);
                }
            }
            
        } catch (error) {
            this.validationResults.errors.push(`Workflow paths validation error: ${error.message}`);
        }
    }
    
    /**
     * Check for common issues
     */
    async checkCommonIssues() {
        try {
            // Check for existing workflow status files
            const statusFiles = [
                'docs/bmm-workflow-status.yaml',
                '.bmad-ephemeral/bmm-workflow-status.yaml'
            ];
            
            for (const file of statusFiles) {
                if (await this.fileExists(file)) {
                    this.validationResults.warnings.push(
                        `Existing workflow status found: ${file}. New initialization may conflict.`
                    );
                }
            }
            
            // Check for conflicting BMM artifacts
            const artifactPatterns = [
                '_prd*.md',
                '_tech-spec*.md',
                '_epic*.md',
                '_architecture*.md'
            ];
            
            for (const pattern of artifactPatterns) {
                const matches = await this.findFilesByPattern(pattern);
                if (matches.length > 0) {
                    this.validationResults.warnings.push(
                        `Found existing BMM artifacts matching ${pattern}. Initialization will need to handle these.`
                    );
                }
            }
            
        } catch (error) {
            this.validationResults.errors.push(`Common issues check error: ${error.message}`);
        }
    }
    
    /**
     * Generate smart recovery suggestions
     */
    generateRecoverySuggestions() {
        const suggestions = [];
        
        for (const error of this.validationResults.recoverableErrors) {
            switch (error.type) {
                case 'folder_permissions':
                    suggestions.push({
                        issue: 'Output folder not writable',
                        solution: error.suggestion,
                        automatic: error.autoFix
                    });
                    break;
                    
                case 'ephemeral_access':
                    suggestions.push({
                        issue: 'Ephemeral location not accessible',
                        solution: error.suggestion,
                        automatic: error.autoFix
                    });
                    break;
                    
                case 'missing_workflow_path':
                    suggestions.push({
                        issue: 'Workflow path missing',
                        solution: 'Reinstall BMad Method or check installation',
                        automatic: false
                    });
                    break;
            }
        }
        
        return suggestions;
    }
    
    /**
     * Apply automatic fixes
     */
    async applyAutomaticFixes() {
        const appliedFixes = [];
        
        for (const error of this.validationResults.recoverableErrors) {
            if (error.autoFix) {
                try {
                    switch (error.type) {
                        case 'folder_permissions':
                            await this.makeWritable(error.path);
                            appliedFixes.push(`Fixed permissions for ${error.path}`);
                            break;
                            
                        case 'ephemeral_access':
                            await this.createDirectory(error.path);
                            appliedFixes.push(`Created directory ${error.path}`);
                            break;
                    }
                } catch (fixError) {
                    this.validationResults.errors.push(
                        `Failed to apply automatic fix for ${error.type}: ${fixError.message}`
                    );
                }
            }
        }
        
        return appliedFixes;
    }
    
    // Helper methods
    resetResults() {
        this.validationResults = {
            isValid: true,
            errors: [],
            warnings: [],
            suggestions: [],
            recoverableErrors: []
        };
    }
    
    async fileExists(path) {
        // Placeholder implementation
        return false;
    }
    
    async directoryExists(path) {
        // Placeholder implementation
        return false;
    }
    
    async readConfigFile(path) {
        // Placeholder implementation
        return {};
    }
    
    async getConfigValue(key) {
        // Placeholder implementation
        return null;
    }
    
    async isValidPath(path) {
        // Placeholder implementation
        return true;
    }
    
    async isWritable(path) {
        // Placeholder implementation
        return true;
    }
    
    async isAccessible(path) {
        // Placeholder implementation
        return true;
    }
    
    async isTempWritable(path) {
        // Placeholder implementation
        return true;
    }
    
    async getFreeSpace(path) {
        // Placeholder implementation
        return 1000;
    }
    
    async findFilesByPattern(pattern) {
        // Placeholder implementation
        return [];
    }
    
    async makeWritable(path) {
        // Placeholder implementation
    }
    
    async createDirectory(path) {
        // Placeholder implementation
    }
    
    validateRequiredFields(config) {
        // Placeholder implementation
    }
    
    validateFieldValues(config) {
        // Placeholder implementation
    }
}

module.exports = ConfigValidator;