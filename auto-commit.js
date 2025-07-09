
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function autoCommit() {
  try {
    // Check if there are changes
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
      console.log('📝 Changes detected, committing...');
      
      // Add all changes
      execSync('git add .');
      
      // Create commit with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const commitMessage = `Auto-commit: ${timestamp}`;
      
      execSync(`git commit -m "${commitMessage}"`);
      
      // Push to origin main
      execSync('git push origin main');
      
      console.log('✅ Changes committed and pushed successfully!');
    } else {
      console.log('💤 No changes to commit');
    }
  } catch (error) {
    console.error('❌ Auto-commit failed:', error.message);
  }
}

// Run the auto-commit
autoCommit();
