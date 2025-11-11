# Enhanced Workflow Init - Project Setup Instructions (Enhanced Version)

<critical>The enhanced workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>This workflow handles BOTH new projects AND legacy projects being migrated to BMad Method</critical>
<critical>ENHANCED VERSION: Includes intelligent project analysis, modern tool detection, and improved UX</critical>

<workflow>

<step n="1" goal="Enhanced comprehensive project scan and analysis">
<output>Welcome to Enhanced BMad Method, {user_name}! 🚀

I'm performing an intelligent analysis of your project to provide the best workflow recommendations.</output>

<action>Perform comprehensive project scan with enhanced detection:

**Enhanced BMM Planning Artifacts Detection:**
- PRD files: {output*folder}/\_prd*.md or {output*folder}/\_prd*/index.md
- Tech-spec files: {output*folder}/\_tech-spec*.md or {output*folder}/\_spec*.md
- Epic files: {output*folder}/\_epic*.md or {output*folder}/\_epic*/index.md
- Architecture: {output*folder}/\_architecture*.md or {output*folder}/\_arch*.md
- UX Design: {output*folder}/\_ux*.md or {output*folder}/\_design*.md
- Product Brief: {output*folder}/\_brief*.md
- Research docs: {output*folder}/\_research*.md
- Brainstorm docs: {output*folder}/\_brainstorm*.md

**Enhanced Implementation Artifacts Detection:**
- Story files: {output*folder}/stories/*.md or {ephemeral*location}/stories/*.md
- Sprint status: {output_folder}/sprint-status.yaml or {ephemeral_location}/sprint-status.yaml
- Workflow status: {output_folder}/bmm-workflow-status.yaml or {ephemeral_location}/bmm-workflow-status.yaml
- Task management: {output_folder}/tasks.json or {ephemeral_location}/tasks.json

**Modern Development Tools & Frameworks Detection:**
- Frontend Frameworks: package.json (React, Vue, Angular, Next.js, Nuxt, Svelte)
- Backend Frameworks: package.json, go.mod, pom.xml, requirements.txt, Cargo.toml
- Mobile Development: pubspec.yaml, android/app/build.gradle, Podfile
- DevOps Tools: Dockerfile, docker-compose.yml, .github/workflows/, .gitlab-ci.yml
- Build Tools: webpack.config.js, vite.config.js, rollup.config.js, angular.json
- Testing: jest.config.js, cypress.json, playwright.config.js, pytest.ini
- Monitoring: prometheus.yml, grafana/, datadog/, sentry.properties
- Documentation: docs/, README.md, API.md, CHANGELOG.md

**Modern Development Practices Detection:**
- CI/CD: .github/workflows/, .gitlab-ci.yml, .circleci/, azure-pipelines.yml
- Code Quality: .eslintrc.*, .prettierrc, sonarqube-project.properties
- Security: .snyk, safety-requirements.txt, dependency-check-config.xml
- Accessibility: .pa11yci.json, axe-core integration
- Performance: lighthouse.config.js, web-vitals tracking
- API Documentation: OpenAPI/Swagger files, Postman collections

**Project Size & Complexity Analysis:**
- File count analysis (lines of code, file complexity)
- Dependency count and depth analysis
- Architecture pattern detection (MVC, microservices, monorepo, etc.)
- Team collaboration indicators (multiple contributors, PR templates)
- Production readiness indicators (Docker, monitoring, error tracking)
</action>

<action>Enhanced project state categorization with intelligent scoring:

**STATE 1:** Clean slate (no artifacts, minimal/no code)
**STATE 2:** Planning in progress (has PRD/tech-spec, no implementation)
**STATE 3:** Implementation in progress (has stories/sprint status)
**STATE 4:** Legacy codebase (has code, modern tools, no BMM artifacts)
**STATE 5:** Partial/unclear (inconsistent artifacts/state)
**STATE 6:** Modern enterprise (has modern tools, devops, no BMM)

**Complexity Scoring Algorithm:**
- Simple (1-3): < 5 dependencies, < 1000 LOC, single module
- Moderate (4-6): 5-20 dependencies, 1000-5000 LOC, some modules
- Complex (7-9): 20+ dependencies, 5000+ LOC, multiple modules/services
- Enterprise (10): Microservices, complex architecture, enterprise tools

**Modern Development Maturity Assessment:**
- Basic: Core framework + basic tooling
- Advanced: Modern tooling, testing, CI/CD
- Enterprise: Full DevOps, monitoring, security, compliance
</action>

<ask>What's your project called? {{#if project_name}}(Config shows: {{project_name}}){{/if}}</ask>
<action>Store project_name</action>
<template-output>project_name</template-output>
</step>

<step n="2" goal="Enhanced project state validation with smart recommendations">

<check if="STATE 1: Clean slate">
  <output>Perfect! This looks like a fresh start. 🎯

I'm detecting this as a greenfield project with the potential for modern development practices.</output>
  <action>Set new_project = true</action>
  <action>Set field_type = "greenfield"</action>
  <action>Continue to Step 3 (enhanced work inquiry)</action>
</check>

<check if="STATE 2: Planning artifacts found">
  <output>📋 **I found existing planning documents:**

{{#if found_prd}}
**PRD:** {{prd_path}}
{{#if epic_count}}- {{epic_count}} epics, {{story_count}} stories{{/if}}
- Last modified: {{prd_modified}}
{{/if}}

{{#if found_tech_spec}}
**Tech-Spec:** {{spec_path}}
{{#if story_count}}- {{story_count}} stories{{/if}}
- Last modified: {{spec_modified}}
{{/if}}

{{#if found_architecture}}
**Architecture:** {{arch_path}}
- Last modified: {{arch_modified}}
{{/if}}

{{#if found_ux}}
**UX Design:** {{ux_path}}
- Last modified: {{ux_modified}}
{{/if}}

{{#if found_brief}}
**Product Brief:** {{brief_path}}
- Last modified: {{brief_modified}}
{{/if}}</output>

<ask>What's your situation with these documents?

a) **Continue this work** - These docs describe what I'm building now
b) **Override/replace** - These are old, I'm starting something NEW  
c) **Already done** - This work is complete, I'm starting a NEW project
d) **Not sure** - Let me explain my situation

Your choice [a/b/c/d]:</ask>

  <check if="choice == a (Continue)">
    <output>Great! I'll create workflow tracking for your existing planning. 

Based on your artifacts, I can see this is a {{complexity_level}} complexity project.</output>
    <action>Set continuing_existing_planning = true</action>
    <action>Store found artifacts for auto-completion</action>
    <action>Continue to Step 5 (detect track from artifacts)</action>
  </check>

  <check if="choice == b (Override)">
    <ask>Should I archive these old documents before we start fresh?

I can move them to {output_folder}/archive/ so they're not in the way.

Archive old docs? (y/n)</ask>
    <action if="answer == y">Create archive folder if needed</action>
    <action if="answer == y">Move all found planning artifacts to {output_folder}/archive/</action>
    <output>{{#if archived}}✅ Old documents archived to {output_folder}/archive/{{else}}Starting fresh - old docs will be ignored{{/if}}</output>
    <action>Set new_project = true</action>
    <action>Set field_type = "greenfield"</action>
    <action>Continue to Step 3 (enhanced work inquiry)</action>
  </check>

  <check if="choice == c (Already done)">
    <ask>Should I archive the completed work before starting your new project? (y/n)</ask>
    <action if="answer == y">Archive old planning docs</action>
    <output>{{#if archived}}✅ Completed work archived{{else}}Ready for your new project!{{/if}}</output>
    <action>Set new_project = true</action>
    <action>Set field_type = "greenfield"</action>
    <action>Continue to Step 3 (enhanced work inquiry)</action>
  </check>
</check>

<check if="STATE 4: Legacy codebase (modern tools detected)">
  <output>💡 **Interesting! I found a modern codebase:**

{{codebase_summary}}

**Modern Development Tools Detected:**
{{#if modern_tools}}
{{#each modern_tools}}
- {{tool_name}} ({{version_info}})
{{/each}}
{{/if}}

**Development Maturity:** {{maturity_level}}

**No BMM artifacts found** - this project could benefit from structured planning.</output>

<action>Set field_type = "brownfield"</action>
<action>Set new_project = true</action>
<output>

💡 **For modern projects, I recommend the Document-Project workflow first:**
This will analyze your codebase and create BMM-compatible documentation.

**Would you like me to:**
a) Run document-project workflow now (recommended)
b) Skip to BMM planning workflows  
c) Set up both

Your choice [a/b/c]:</output>
<ask>Your choice [a/b/c]:</ask>

  <check if="choice == a">
    <action>Set needs_documentation = true</action>
    <action>Set selected_documentation_workflow = "document-project"</action>
  </check>

  <check if="choice == b">
    <action>Set needs_documentation = false</action>
  </check>

  <check if="choice == c">
    <action>Set needs_documentation = true</action>
    <action>Set selected_documentation_workflow = "document-project"</action>
    <action>Set continue_with_bmm_after_docs = true</action>
  </check>

  <action>Continue to Step 3 (enhanced work inquiry)</action>
</check>

<check if="STATE 6: Modern enterprise project">
  <output>🏢 **Enterprise-grade project detected!**

**Advanced Tools & Practices Found:**
{{#each enterprise_features}}
- {{feature_name}}: {{details}}
{{/each}}

**Maturity Level:** {{maturity_assessment}}

This looks like a production-ready system that could benefit from enterprise BMM workflows.</output>

<action>Set project_maturity = "enterprise"</action>
<action>Set field_type = "brownfield"</action>
<action>Set new_project = true</action>

<ask>What would you like to accomplish?

a) **Enhance existing system** - Add new features using enterprise BMM
b) **Create new module** - Extend this system with new capabilities
c) **Infrastructure optimization** - Improve DevOps, monitoring, etc.
d) **Full documentation** - Create comprehensive BMM documentation

Your choice [a/b/c/d]:</ask>

  <check if="choice == a">
    <action>Set enhancement_type = "feature_addition"</action>
  </check>

  <check if="choice == b">
    <action>Set enhancement_type = "new_module"</action>
  </check>

  <check if="choice == c">
    <action>Set enhancement_type = "infrastructure"</action>
  </check>

  <check if="choice == d">
    <action>Set enhancement_type = "documentation"</action>
    <action>Set needs_documentation = true</action>
  </check>

  <action>Continue to Step 3 (enhanced work inquiry)</action>
</check>

<check if="STATE 3: Implementation in progress OR STATE 5: Partial/unclear">
  <action>Handle similar to original logic but with enhanced detection</action>
  <action>Continue to appropriate next step based on state</action>
</check>

</step>

<step n="3" goal="Enhanced user work inquiry with intelligent project understanding">
<ask>Tell me about what you're working on. What's your goal?

Please describe:
- What you want to build or improve
- Who will use it
- Any specific requirements or constraints

The more details you provide, the better I can recommend the perfect workflow!</ask>

<action>Store user_description</action>
<action>Enhanced project analysis:

**Text Analysis for Project Intelligence:**
- Extract keywords for project type detection
- Identify complexity indicators
- Detect domain-specific requirements
- Identify user experience needs
- Detect integration requirements
- Extract performance/compliance requirements

**Smart Field Type Detection:**
- Brownfield indicators: "existing", "current", "add to", "modify", "enhance", "refactor", "integrate", "extend"
- Greenfield indicators: "new", "build", "create", "from scratch", "start", "design"
- Enhancement indicators: "improve", "optimize", "upgrade", "modernize", "scale"

**Project Type Classification:**
- Web Application: "web", "website", "dashboard", "portal", "SPA", "PWA"
- API/Backend: "API", "microservice", "backend", "server", "database"
- Mobile App: "iOS", "Android", "React Native", "Flutter", "mobile"
- Desktop App: "desktop", "electron", "Qt", "WPF", "macOS app"
- Game: "game", "player", "level", "gameplay", "unity", "unreal"
- CLI Tool: "CLI", "command line", "terminal", "script"
- Data Platform: "data pipeline", "analytics", "BI", "machine learning", "AI"
- Infrastructure: "DevOps", "CI/CD", "monitoring", "deployment", "infrastructure"

**Complexity Assessment:**
- Simple: < 3 core features, basic functionality
- Moderate: Multiple integrated features, some complexity
- Complex: Many features, complex integrations, advanced requirements
- Enterprise: Mission-critical, compliance, high-scale, multi-tenant
</action>

<check if="found codebase AND field_type still unclear">
  <ask>I see you have existing code here. Are you:

1. **Adding to or modifying** the existing codebase (brownfield)
2. **Starting fresh** - the existing code is just a scaffold/template (greenfield)  
3. **Something else** - let me clarify

Your choice [1/2/3]:</ask>

  <check if="choice == 1">
    <action>Set field_type = "brownfield"</action>
  </check>

  <check if="choice == 2">
    <action>Set field_type = "greenfield"</action>
    <output>Got it - treating as greenfield despite the scaffold.</output>
  </check>

  <check if="choice == 3">
    <ask>Please explain your situation:</ask>
    <action>Analyze explanation and set field_type accordingly</action>
  </check>
</check>

<action if="field_type not yet set">Set field_type based on codebase presence and analysis</action>

<check if="project_type == game">
  <output>
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🎮 **GAME DEVELOPMENT DETECTED**
  
  For game development projects, I recommend using the **BMad Game Development (BMGD)** module
  which provides specialized game development workflows and agents.
  
  The BMM module is optimized for software development workflows.

  **Would you like to:**
  a) Install BMGD module now (recommended for game projects)
  b) Continue with BMM workflows (for software projects only)
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>Your choice [a/b]:</ask>

  <check if="choice == a">
    <output>
    Please run the following command to install the BMGD module:
    
    ```bash
    bmad install bmgd
    ```
    
    After installation, you can start your game development workflow with the Game Designer agent.
    
    This workflow-init will now exit. Re-run it after installing BMGD.
    </output>
    <action>Exit workflow with success status</action>
  </check>

  <check if="choice == b">
    <output>
    ⚠️ **Warning:** BMM workflows are optimized for software development, not game development.
    
    You may encounter mismatched terminology and workflows. Consider installing BMGD for
    a better game development experience.
    
    Continuing with software development workflows...
    </output>
    <action>Set project_type = "software" (override game detection)</action>
  </check>
</check>

<template-output>user_description</template-output>
<template-output>field_type</template-output>
<template-output>project_type</template-output>
<template-output>complexity_assessment</template-output>
</step>

<step n="4" goal="Enhanced optional discovery workflows with intelligent recommendations">
<action>Generate smart discovery recommendations based on project analysis:

**Smart Recommendation Logic:**
- Research recommended for: Enterprise projects, compliance requirements, complex integrations
- Brainstorm recommended for: New product concepts, feature ideation, user experience design
- Both recommended for: Greenfield projects with unclear requirements
- Neither recommended for: Simple enhancements, clear technical specifications
</action>

<output>Based on my analysis, here are optional discovery workflows that could help:

{{#if research_recommended}}
🔍 **Research** - I recommend this for your project type and complexity level
{{else}}
🔍 **Research** - For domain knowledge and competitive analysis
{{/if}}

{{#if brainstorm_recommended}}
🧠 **Brainstorm** - I recommend this for creative exploration
{{else}}
🧠 **Brainstorm** - For idea generation and creative thinking
{{/if}}

These can help clarify your vision and requirements before planning.</output>

<ask>Would you like to:

a) Yes, brainstorm first ({{#if brainstorm_recommended}}recommended{{/if}})
b) Yes, research first ({{#if research_recommended}}recommended{{/if}})
c) Yes, both ({{#if both_recommended}}highly recommended{{/if}})
d) No, I'm ready to plan

Your choice [a/b/c/d]:</ask>

<check if="choice == a">
  <action>Set brainstorm_requested = true</action>
  <action>Set research_requested = false</action>
</check>

<check if="choice == b">
  <action>Set brainstorm_requested = false</action>
  <action>Set research_requested = true</action>
</check>

<check if="choice == c">
  <action>Set brainstorm_requested = true</action>
  <action>Set research_requested = true</action>
</check>

<check if="choice == d">
  <action>Set brainstorm_requested = false</action>
  <action>Set research_requested = false</action>
</check>

<template-output>brainstorm_requested</template-output>
<template-output>research_requested</template-output>
</step>

<step n="5" goal="Enhanced track selection with intelligent recommendation engine">
<check if="continuing_existing_planning OR migrating_legacy_project">
  <action>Enhanced track detection with confidence scoring:

**Enhanced Track Detection Logic:**
- Has PRD + Architecture → BMad Method (High Confidence)
- Has PRD only → BMad Method (Medium Confidence - architecture was optional)
- Has tech-spec only → BMad Quick Flow (High Confidence)
- Has Security/DevOps docs → BMad Enterprise Method (High Confidence)
- Has complex codebase + modern tools → Enterprise Method (Medium Confidence)
- Has simple features + clear scope → Quick Flow (Medium Confidence)

**Confidence Scoring:**
- High (90-100%): Clear artifact patterns match workflow intent
- Medium (70-89%): Some indicators present, reasonable inference
- Low (50-69%): Limited indicators, educated guess
</action>

  <output>Based on your existing planning documents, I've detected you're using:

**{{detected_track_name}}** (Confidence: {{confidence_score}}%)

{{#if found_artifacts_list}}
Found completed workflows:
{{#each found_artifacts_list}}
- {{workflow_name}}: {{file_path}}
{{/each}}
{{/if}}

I'll create workflow tracking that matches your existing approach and
automatically marks these completed workflows as done.

{{#if medium_confidence}}**Note:** This is a medium-confidence detection based on available artifacts.{{/if}}

Does this look right? (y/n)</output>

  <ask if="answer == n">Which track should I use instead?

1. BMad Quick Flow
2. BMad Method  
3. BMad Enterprise Method

Your choice:</ask>

  <action if="user_corrects">Update selected_track based on choice</action>
  <action>Store selected_track</action>
  <template-output>selected_track</template-output>
  <action>Continue to Step 6</action>
</check>

<check if="new_project">
  <action>Generate enhanced recommendation engine:

**Advanced Recommendation Logic:**
- Complexity Assessment + Project Type + Field Type + Team Size
- Modern Development Maturity + Compliance Requirements + Performance Needs
- User Experience Requirements + Integration Complexity + Data Sensitivity

**Scoring Algorithm:**
Each factor contributes points to workflow recommendation:
- Quick Flow: 1-3 points
- Method: 4-7 points  
- Enterprise: 8-10 points
</action>

  <output>Now, let me explain your planning options with smart recommendations:

━━━

🚀 **BMad Quick Flow** - Fast Implementation Path

⏱️ **Time:** Hours to 1 day of planning
📝 **Approach:** Tech-spec focused - just enough detail to start coding
✅ **Best for:** Simple features, clear scope, bug fixes, minor enhancements
⚠️ **Trade-off:** Less upfront planning = higher risk of rework
🤖 **Agent Support:** Basic - AI will have minimal context

**Perfect for your project if:**
{{#if quick_flow_reasons}}
{{#each quick_flow_reasons}}
- {{reason}}
{{/each}}
{{else}}
- Simple feature additions
- Clear, well-defined scope
- Limited integration requirements
{{/if}}

**Example:** "Add export button" or "Fix login bug"

━━━

🎯 **BMad Method** - Full Product Planning (RECOMMENDED)

⏱️ **Time:** 1-3 days of planning
📝 **Approach:** PRD + UX + Architecture - complete product and system design
✅ **Best for:**
- **GREENFIELD:** New products, platforms, feature-rich applications
- **BROWNFIELD:** Complex enhancements, architectural changes, new modules

✅ **Benefits:**
- AI agents have COMPLETE context for superior code generation
- Architecture creates focused solution design from complex context
- Prevents architectural drift and ensures consistency
- Faster overall delivery (planning investment pays off!)
- Higher code quality and maintainability

**Perfect for your project if:**
{{#if method_reasons}}
{{#each method_reasons}}
- {{reason}}
{{/each}}
{{else}}
- Multiple integrated features
- Complex user experience requirements
- Need for architectural consistency
- Building something substantial
{{/if}}

**Example:** "User dashboard with analytics" or "Payment integration system"

━━━

🏢 **BMad Enterprise Method** - Extended Enterprise Planning

⏱️ **Time:** 3-7 days of planning  
📝 **Approach:** BMad Method + Security + DevOps + Testing strategies
✅ **Best for:** Enterprise requirements, compliance, mission-critical systems

✅ **Benefits:** All of BMad Method PLUS specialized planning for:
- Security architecture and threat modeling
- DevOps pipeline and infrastructure planning
- Comprehensive test strategy and quality assurance
- Compliance, audit, and governance requirements

**Perfect for your project if:**
{{#if enterprise_reasons}}
{{#each enterprise_reasons}}
- {{reason}}
{{/each}}
{{else}}
- Enterprise-scale requirements
- Compliance or regulatory needs
- Mission-critical functionality
- Multi-tenant or high-scale requirements
{{/if}}

**Example:** "Multi-tenant SaaS platform" or "HIPAA-compliant patient portal"

━━━</output>

  <action>Generate final recommendation with reasoning:

**AI-Generated Recommendation:**
{{smart_recommendation_with_reasoning}}

━━━</output>

  <ask>Based on my analysis, which approach fits your situation best?

1. **BMad Quick Flow** - Fast, minimal planning ({{#if recommended_quick_flow}}RECOMMENDED{{/if}})
2. **BMad Method** - Full planning for better results ({{#if recommended_method}}RECOMMENDED{{/if}})
3. **BMad Enterprise Method** - Enterprise-grade planning ({{#if recommended_enterprise}}RECOMMENDED{{/if}})
4. **I'm not sure** - Help me decide

Your choice [1/2/3/4]:</ask>

  <check if="choice == 4 (Not sure)">
    <ask>Tell me more about your specific concerns or uncertainties:

- What aspects worry you most about the planning process?
- Are there particular requirements or constraints I should know about?
- Do you have experience with similar projects?

This will help me give you more targeted advice.</ask>
    <action>Analyze response and provide tailored guidance</action>
    <action>Present choices again with specific recommendations</action>
  </check>

  <action>Map choice to track name and store recommendation reasoning

- 1 → "quick-flow"
- 2 → "method"  
- 3 → "enterprise"</action>

  <action>Store selected_track with confidence level</action>
  <template-output>selected_track</template-output>
  <template-output>recommendation_reasoning</template-output>
</check>

</step>

<step n="6" goal="Enhanced product brief and configuration validation">
<check if="field_type == brownfield OR selected_track == quick-flow">
  <action>Skip product brief for brownfield or quick flow</action>
  <action>Set product_brief_requested = false</action>
  <action>Continue to Step 7 (generate enhanced workflow path)</action>
</check>

<check if="field_type == greenfield AND selected_track in [method, enterprise]">
  <output>📋 **Enhanced Product Brief Recommendation**

For your {{project_type}} project, I'm {{#if strongly_recommend_product_brief}}strongly recommending{{else}}suggesting{{/if}} the Product Brief workflow because:

{{#if product_brief_reasons}}
{{#each product_brief_reasons}}
- {{reason}}
{{/each}}
{{else}}
- It's a greenfield project requiring strategic alignment
- Multi-feature development benefits from product vision clarity
- Complex user experience requirements need strategic foundation
{{/if}}

**What Product Brief provides:**
- Product vision and unique value proposition articulation
- Target user analysis and needs identification  
- Success criteria and business goals definition
- Market positioning and competitive strategy
- Strategic foundation for PRD and architecture decisions

**Time Investment:** 2-4 hours but can save days of rework later.</output>

<ask>a) Yes, include Product Brief ({{#if strongly_recommend_product_brief}}recommended{{/if}})
b) No, skip to PRD (I'll figure it out as I go)

Your choice [a/b]:</ask>

  <check if="choice == a">
    <action>Set product_brief_requested = true</action>
  </check>

  <check if="choice == b">
    <action>Set product_brief_requested = false</action>
  </check>

  <template-output>product_brief_requested</template-output>
</check>

<action>Enhanced configuration validation:

**Validate BMM Configuration:**
- Check for required config files
- Validate output folder permissions
- Ensure ephemeral location accessibility
- Verify user preferences and defaults
- Check for configuration conflicts

**Configuration Health Check:**
- Output folder write permissions
- Path length and character constraints
- Available disk space for artifacts
- User skill level appropriateness
- Communication language preferences</action>

</step>

<step n="7" goal="Enhanced workflow path generation with intelligent customization">
<action>Enhanced path determination with smart customization:

**Smart Path File Selection:**
- Base path selection: {{selected_track}} + {{field_type}}
- Additional customizations based on:
  - Project complexity (simple/moderate/complex/enterprise)
  - Modern tool stack (adds specialized workflows)
  - Compliance requirements (adds security workflows)
  - Team size indicators (adds collaboration workflows)
  - Domain-specific needs (adds specialized workflows)</action>

<action>Enhanced workflow path loading and customization:

**Load Base Path:** {path_files}/{determined_path_file}
**Apply Customizations:** {{customization_rules}}

**Smart Workflow Inclusion Logic:**
- Conditional inclusion based on project characteristics
- Optional workflow elevation based on complexity
- Specialized workflow addition based on detected tools
- Compliance workflow inclusion based on domain requirements
- Team collaboration workflow inclusion based on project indicators</action>

<action>Enhanced workflow items generation with intelligent defaults:

**Phase 0: Discovery (Smart Recommendations)**
{{#if brainprocess_requested}}✅ Brainstorm - AI-recommended based on project type
{{/if}}{{#if research_requested}}✅ Research - Targeted based on domain and complexity
{{/if}}{{#if product_brief_requested}}✅ Product Brief - Strategic foundation
{{/if}}

**Phase 1: Planning (Complexity-Adapted)**
{{#if selected_track == "quick-flow"}}✅ Tech-Spec - Enhanced with auto-epic detection
{{/if}}
{{#if selected_track == "method"}}✅ PRD - Smart story estimation and epic structuring
✅ UX Design - Conditional based on UI requirements detection
{{/if}}
{{#if selected_track == "enterprise"}}✅ PRD - Enterprise-grade with compliance considerations
✅ UX Design - Comprehensive design system planning
✅ Test Framework - Automated test infrastructure setup
✅ CI/CD Pipeline - DevOps workflow automation
{{/if}}

**Phase 2: Solutioning (Architecture-Enhanced)**  
{{#if selected_track == "quick-flow"}}{{#if needs_architecture}}✅ Architecture - Minimal but effective system design
{{/if}}{{/if}}
{{#if selected_track == "method"}}✅ Architecture - Complete system design with integration planning
✅ Validation - Quality gates for architecture decisions
{{/if}}
{{#if selected_track == "enterprise"}}✅ Architecture - Enterprise-grade with scalability planning
✅ Security Architecture - Threat modeling and security design
✅ DevOps Strategy - Infrastructure and deployment planning  
✅ Validation - Comprehensive quality gates
{{/if}}

**Phase 3: Implementation (Team-Adapted)**
✅ Sprint Planning - Intelligent story sizing and dependency detection
✅ Story Development - AI-enhanced implementation guidance

{{#if has_compliance_requirements}}**Compliance Phase:** Specialized compliance workflows
{{/if}}
</action>

<template-output>enhanced_workflow_path_file</template-output>
<template-output>enhanced_workflow_items</template-output>
<template-output>customization_applied</template-output>

</step>

<step n="8" goal="Enhanced workflow status creation and smart guidance">
<action>Enhanced workflow status file generation:

**Template Variable Preparation:**
- All standard variables from enhanced analysis
- Smart complexity indicators: {{complexity_score}}, {{maturity_level}}
- Modern tool stack: {{detected_modern_tools}}
- Recommendation confidence: {{confidence_level}}
- Customization applied: {{customization_summary}}
- Project insights: {{project_insights}}
- Next steps guidance: {{smart_next_steps}}
</action>

<action>Generate enhanced YAML with smart defaults and project intelligence</action>

<output>✨ **Enhanced BMad Workflow Generated!**

━━━

**🎯 Project Intelligence Summary:**
- **Project:** {{project_name}} ({{project_type}})
- **Complexity:** {{complexity_score}}/10 ({{complexity_level}})
- **Maturity:** {{maturity_level}}
- **Modern Tools:** {{modern_tools_count}} detected
- **Recommendation Confidence:** {{confidence_level}}%

━━━

**🚀 Your Personalized Workflow Path:**

**Track:** {{selected_track_display_name}}
**Field Type:** {{field_type}}
**Specializations:** {{specialization_features}}

{{#if needs_documentation}}📚 **Prerequisites:** Document-Project (Required)
{{/if}}

{{#if has_discovery_phase}}🧠 **Phase 0: Discovery** (Smart recommendations)
{{#if brainstorm_requested}}✅ Brainstorm - Targeted to your domain
{{/if}}{{#if research_requested}}✅ Research - Deep-dive analysis
{{/if}}{{#if product_brief_requested}}✅ Product Brief - Strategic foundation
{{/if}}{{/if}}

📋 **Phase 1: Planning** (Enhanced)
{{#if selected_track == "quick-flow"}}✅ Tech-Spec - AI-enhanced with auto-detections
{{/if}}
{{#if selected_track == "method"}}✅ PRD - Smart estimation and structuring
{{#if has_ui_requirements}}✅ UX Design - Customized for your app type
{{/if}}{{/if}}
{{#if selected_track == "enterprise"}}✅ PRD - Enterprise-grade with compliance
✅ UX Design - Comprehensive design system
✅ Test Framework - Automated infrastructure
✅ CI/CD - DevOps pipeline setup
{{/if}}

🏗️ **Phase 2: Solutioning** (Intelligent)
{{#if selected_track == "quick-flow"}}✅ Architecture - Minimal but effective
{{/if}}
{{#if selected_track == "method"}}✅ Architecture - Complete system design
✅ Validation - Quality gates
{{/if}}
{{#if selected_track == "enterprise"}}✅ Architecture - Enterprise-scale planning
✅ Security - Threat modeling & design
✅ DevOps - Infrastructure strategy
✅ Validation - Comprehensive gates
{{/if}}

🚀 **Phase 3: Implementation** (Smart)
✅ Sprint Planning - AI-assisted story sizing
✅ Story Development - Enhanced with project context

{{#if found_existing_artifacts}}━━━

📁 **Existing Work Integration:**
✅ {{completed_count}} workflow(s) detected and marked complete
✅ Starting from: {{next_workflow_name}}
{{/if}}

━━━</output>

<ask>Ready to create your enhanced workflow tracking? (y/n)</ask>

<check if="answer == y">
  <action>Generate enhanced workflow status file with all intelligence applied</action>
  <action>Save to {output_folder}/bmm-workflow-status.yaml</action>
  <action>Generate smart next workflow recommendation with reasoning</action>

  <output>✅ **Enhanced workflow tracking created!** {output_folder}/bmm-workflow-status.yaml

━━━

🎉 **Congratulations!** Your project is now powered by Enhanced BMad Method.

**📈 What's New in Your Workflow:**
- **Intelligent Project Analysis** - Deep understanding of your project
- **Smart Recommendations** - AI-guided workflow selection
- **Modern Tool Integration** - Leverages your existing development stack
- **Enhanced UX** - Streamlined, contextual interactions
- **Quality Gates** - Better validation and error handling

**Next Steps:**
1. **{{next_workflow_name}}** ({{next_agent}} agent)
2. **Command:** /bmad:bmm:workflows:{{next_workflow_id}}
3. **Why this workflow:** {{next_workflow_reasoning}}

{{#if needs_specific_agent}}💡 **Load the {{next_agent}} agent** before running the workflow.
{{/if}}

━━━

**🔧 Smart Features Activated:**
- Auto-detection of project complexity and requirements
- Intelligent workflow customization based on your tools
- Context-aware recommendations throughout the process
- Enhanced error handling and recovery options

**📊 To track your progress anytime:**
Load any BMM agent and run: **/bmad:bmm:workflows:workflow-status**

Happy building with Enhanced BMad Method! 🚀</output>
</check>

<check if="answer == n">
  <output>No problem! You can run the enhanced workflow-init again anytime.

To get started later, load the Analyst agent and run:
**/bmad:bmm:workflows:workflow-init**

The enhanced version will remember your project analysis and provide even better recommendations next time!</output>
</check>

</step>

</workflow>