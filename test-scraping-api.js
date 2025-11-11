/**
 * Test Scraping API Logic
 * Tests the scraping functionality without running the full Next.js server
 */

const ScrapingAIEngine = require('./.bmad/bmm/workflows/scraping-ai/scraping-engine.js')

async function testScrapingAPI() {
  console.log('🧪 Testing Scraping AI API Logic...\n')
  
  const engine = new ScrapingAIEngine()
  
  // Test data similar to what the API would receive
  const testCases = [
    {
      name: 'Basic Text Scraping',
      input: {
        url: 'https://example.com',
        config: {
          extractMode: 'text',
          timeout: 10000
        }
      }
    },
    {
      name: 'AI-Enhanced Scraping',
      input: {
        url: 'https://example.com',
        config: {
          extractMode: 'text',
          aiPrompts: ['summarize', 'extract_key_points'],
          timeout: 10000
        }
      }
    },
    {
      name: 'Structured Data Extraction',
      input: {
        url: 'https://example.com',
        config: {
          extractMode: 'structured',
          timeout: 10000
        }
      }
    },
    {
      name: 'Error Handling - Invalid URL',
      input: {
        url: 'invalid-url',
        config: {
          extractMode: 'text',
          timeout: 5000
        }
      }
    }
  ]
  
  let passed = 0
  let failed = 0
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`)
    
    try {
      const result = await engine.scrape(testCase.input)
      
      // Validate result structure
      if (result.success !== undefined && 
          typeof result.content === 'string' && 
          result.metadata !== undefined) {
        console.log('  ✅ API logic test passed')
        console.log(`     Success: ${result.success}`)
        console.log(`     Content length: ${result.content.length}`)
        console.log(`     Metadata title: ${result.metadata.title || 'N/A'}`)
        if (result.structuredData) {
          console.log(`     Structured data keys: ${Object.keys(result.structuredData).join(', ')}`)
        }
        passed++
      } else {
        throw new Error('Invalid result structure')
      }
      
    } catch (error) {
      console.log(`  ❌ API logic test failed: ${error.message}`)
      failed++
    }
    
    console.log('')
  }
  
  console.log('='.repeat(50))
  console.log('🕷️  SCRAPING API TEST RESULTS')
  console.log('='.repeat(50))
  console.log(`✅ Tests Passed: ${passed}`)
  console.log(`❌ Tests Failed: ${failed}`)
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)
  
  if (failed === 0) {
    console.log('\n🎉 Scraping API logic is working correctly!')
    console.log('🚀 Ready for integration with Next.js application!')
  } else {
    console.log('\n⚠️  Some API tests failed.')
  }
  
  console.log('='.repeat(50))
}

// Run the test
testScrapingAPI().catch(console.error)