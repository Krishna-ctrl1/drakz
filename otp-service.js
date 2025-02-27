require('dotenv').config();
const mysql = require('mysql2');

// Create MySQL connection with same config as your server
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'DRAKZDatabase'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to the database: ', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL database');
  
  // Check if users table exists
  db.query("SHOW TABLES LIKE 'users'", (err, results) => {
    if (err) {
      console.error('❌ Error checking tables:', err);
      return;
    }
    
    if (results.length === 0) {
      console.error('❌ Users table does not exist!');
      createTables();
    } else {
      console.log('✅ Users table exists');
      checkColumns();
    }
  });
});

function checkColumns() {
  db.query("DESCRIBE users", (err, results) => {
    if (err) {
      console.error('❌ Error describing users table:', err);
      return;
    }
    
    console.log('📊 User table schema:');
    results.forEach(column => {
      console.log(`  - ${column.Field} (${column.Type}, ${column.Null === 'YES' ? 'nullable' : 'not nullable'})`);
    });
    
    // Check required columns
    const requiredColumns = [
      'name', 'email', 'password', 'monthly_income', 'employment_status', 
      'financial_goals', 'risk_tolerance', 'aadhaar_number', 'pan_number', 
      'email_verified', 'created_at'
    ];
    
    const missingColumns = requiredColumns.filter(col => 
      !results.some(dbCol => dbCol.Field === col)
    );
    
    if (missingColumns.length > 0) {
      console.error(`❌ Missing columns: ${missingColumns.join(', ')}`);
    } else {
      console.log('✅ All required columns exist');
    }
    
    console.log('\n✨ Database check complete');
    process.exit(0);
  });
}