hatgpt-clone/.bmad/bmm/workflows/scraping-ai/instructions.md</path>
<content"># Scraping AI Workflow - Instructions

<critical>This workflow is part of BMad Method enhanced capabilities</critical>
<critical>Requires web access and content analysis capabilities</critical>
<critical>Integrates with existing chatgpt-clone project scraping engine</critical>

<workflow>

<step n="1" goal="Validate input and setup scraping environment">
<output>🔍 **Starting Scraping AI Workflow**

I'll help you extract and analyze content from web pages using AI-powered scraping capabilities.</output>

<action>Validate input parameters:
- Check URL format and accessibility
- Validate configuration options
- Setup scraping engine with appropriate settings</action>

<ask>What URL would you like to scrape?

Please provide:
1. **URL**: The website or page you want to scrape
2. **Extract mode**: text (default), html, or structured
3. **AI prompts** (optional): summarize, extract_key_points, clean_text, etc.

Example:
- URL: https://example.com
- Extract mode: text
- AI prompts: summarize, extract_key_points</ask>

<action>Store user inputs:
- target_url
- extract_mode
- ai_prompts (if provided)
- scraping_config</action>
</step>

<step n="2" goal="Execute intelligent web scraping">
<output>🚀 **Executing AI-Enhanced Web Scraping**

Now I'll scrape the content with intelligent processing based on your requirements.</output>

<action>Initialize scraping engine with configuration:
- Load ScrapingAIEngine from chatgpt-clone project
- Apply user-specified extract mode
- Apply AI prompts for content enhancement
- Set appropriate timeout and retry settings</action>

<action>Perform web scraping:
- Fetch content from target URL
- Extract metadata (title, description, images, links)
- Apply AI processing if prompts specified
- Extract structured data if requested
- Handle errors and timeouts gracefully</action>

<check if="scraping successful">
  <output>✅ **Scraping completed successfully!**

**Content Summary:**
- **URL**: {{target_url}}
- **Content Length**: {{content_length}} characters
- **Title**: {{page_title}}
- **Description**: {{page_description}}

{{#if ai_enhanced}}
**AI Processing Applied:**
{{#each applied_prompts}}
- {{prompt}} ✅
{{/each}}
{{/if}}

**Extracted Content Preview:**
{{content_preview}}
</output>

  <action>Store scraping results:
- raw_content
- enhanced_content
- metadata
- structured_data
- processing_stats</action>
</check>

<check if="scraping failed">
  <output>❌ **Scraping Failed**

**Error**: {{error_message}}

**Possible Solutions:**
- Check if URL is accessible
- Verify the website allows scraping
- Try a different extract mode
- Increase timeout settings</output>

  <ask>Would you like to:
  a) Try a different URL
  b) Adjust scraping configuration
  c) Get more detailed error information
  d) Exit and try later

Your choice [a/b/c/d]:</ask>

  <check if="choice == a">
    <action>Prompt for new URL</action>
    <action>Restart scraping process</action>
  </check>

  <check if="choice == b">
    <action>Show configuration options</action>
    <action>Re-run with new config</action>
  </check>

  <check if="choice == c">
    <action>Provide detailed technical information</action>
    <action>Suggest debugging steps</action>
  </check>

  <check if="choice == d">
    <output>No problem! You can run this workflow again anytime with a different URL or configuration.</output>
    <action>Exit workflow gracefully</action>
  </check>
</check>
</step>

<step n="3" goal="Process and analyze extracted content">
<output>🧠 **Content Analysis & Processing**

Let me analyze the extracted content and provide insights based on your requirements.</output>

<action>Apply content analysis based on extract mode:

**Text Mode Analysis:**
- Text extraction and cleaning
- AI prompt applications
- Content summarization
- Key point identification

**HTML Mode Analysis:**
- HTML structure preservation
- Element extraction
- Link and image analysis
- Metadata extraction

**Structured Mode Analysis:**
- JSON-LD extraction
- Table and list parsing
- Form data extraction
- Structured data organization</action>

<action>Generate analysis results:
- Content quality assessment
- Information density analysis
- Structure evaluation
- Key insights extraction</action>

<check if="structured_data extracted">
  <output>📊 **Structured Data Found**

**Available Structured Elements:**
{{#if headings}}
- **Headings**: {{headings.length}} headings found
{{/if}}
{{#if lists}}
- **Lists**: {{lists.length}} lists extracted
{{/if}}
{{#if tables}}
- **Tables**: {{tables.length}} tables found
{{/if}}
{{#if forms}}
- **Forms**: {{forms.length}} forms detected
{{/if}}
{{#if jsonLd}}
- **JSON-LD**: {{jsonLd.length}} structured data blocks
{{/if}}</output>
</check>

<action>Prepare final output based on analysis type</action>
</step>

<step n="4" goal="Generate comprehensive output and save results">
<output>📝 **Generating Final Report**

Creating a comprehensive report of the scraping results and analysis.</output>

<action>Generate comprehensive output file:

**Report Structure:**
- Executive summary
- Technical details
- Content analysis
- AI-enhanced insights
- Recommendations for use

**File Location**: {{output_folder}}/scraping-results-{{timestamp}}.md</action>

<output>✅ **Scraping AI Workflow Completed!**

**Summary:**
- **Target URL**: {{target_url}}
- **Extract Mode**: {{extract_mode}}
- **Content Length**: {{content_length}} characters
- **AI Processing**: {{ai_prompts_count}} enhancements applied
- **Success Rate**: 100%

**Output Files:**
- **Main Report**: {{output_folder}}/scraping-results-{{timestamp}}.md
- **Raw Content**: {{output_folder}}/raw-content-{{timestamp}}.txt
- **Structured Data**: {{output_folder}}/structured-data-{{timestamp}}.json (if applicable)

**Next Steps:**
{{#if recommendations}}
**Recommended Actions:**
{{#each recommendations}}
- {{recommendation}}
{{/each}}
{{else}}
- Review the extracted content for accuracy
- Use the structured data for further analysis
- Consider running additional AI workflows on the content
{{/if}}</output>

<ask>Would you like to:
a) View the complete report
b) Run another scraping operation
c) Process the extracted content with other BMad workflows
d) Exit

Your choice [a/b/c/d]:</ask>

<check if="choice == a">
  <action>Display full report content</action>
</check>

<check if="choice == b">
  <action>Prompt for new URL and restart workflow</action>
</check>

<check if="choice == c">
  <action>Suggest relevant BMad workflows for content processing</action>
</check>

<check if="choice == d">
  <output>Thank you for using the Scraping AI workflow! 

You can run this workflow again anytime to scrape new content.
Good luck with your data extraction and analysis! 🚀</output>
</check>
</step>

</workflow>

## Workflow Integration Notes

This workflow integrates with the chatgpt-clone project by:
1. Using the ScrapingAIEngine from `/src/lib/scraping-engine.ts`
2. Leveraging the API endpoint at `/api/scraping`
3. Following BMad Method documentation standards
4. Generating outputs in BMad-compatible formats

## Configuration Options

### Extract Modes
- **text**: Plain text extraction with AI enhancement
- **html**: Full HTML content with structure preservation
- **structured**: Enhanced with structured data parsing

### AI Prompts
- **summarize**: Create content summary
- **extract_key_points**: Identify main points
- **clean_text**: Remove formatting and noise
- **extract_numbers**: Extract numerical data
- **extract_emails**: Find email addresses
- **custom**: User-defined prompts

## Error Handling
- Network timeouts and connection issues
- Invalid URLs and inaccessible content
- Content parsing and extraction errors
- AI processing failures with fallback options