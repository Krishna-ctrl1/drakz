const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_ATLAS_URI, {});

// Users Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  monthly_income: {
    type: Number
  },
  employment_status: {
    type: String
  },
  financial_goals: {
    type: String
  },
  risk_tolerance: {
    type: String
  },
  aadhaar_number: {
    type: String,
    unique: true
  },
  pan_number: {
    type: String,
    unique: true
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  is_premium: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create Users Model
const User = mongoose.model('User', userSchema);

// Hash function
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Insertion Function
const insertUsers = async () => {
  try {
    const users = [
      {
        name: 'XD Phantom',
        email: 'xdphantom1202@gmail.com',
        password: hashPassword('user_xd'),
        monthly_income: 82000.00,
        employment_status: 'Employed',
        financial_goals: 'Buy a house, Travel abroad',
        risk_tolerance: 'Moderate',
        aadhaar_number: '998877665544',
        pan_number: 'SXCVB1234Y',
        is_premium: 1,
        email_verified: true
      },
      {
        name: 'Ragamaie Nagineni',
        email: 'ragamaie.n23@iiits.in',
        password: hashPassword('user_ragamaie'),
        monthly_income: 75000.00,
        employment_status: 'Software Engineer',
        financial_goals: 'Save for retirement, Build emergency fund',
        risk_tolerance: 'Moderate',
        aadhaar_number: '334455667788',
        pan_number: 'RSTUV9012W',
        is_premium: 1,
        email_verified: true
      },
      {
        name: 'Abhinay Malle',
        email: 'abhinay.m23@iiits.in',
        password: hashPassword('user_abhinay'),
        monthly_income: 91000.00,
        employment_status: 'Business Owner',
        financial_goals: 'Expand business, Invest in stocks',
        risk_tolerance: 'High',
        aadhaar_number: '445566778899',
        pan_number: 'XYZAB3456C',
        is_premium: 1,
        email_verified: false
      },
      {
        name: 'Arjun Patel',
        email: 'arjun.patel@gmail.com',
        password: hashPassword('user_arjun'),
        monthly_income: 65000.00,
        employment_status: 'Employed',
        financial_goals: 'Save for higher education',
        risk_tolerance: 'Low',
        aadhaar_number: '556677889900',
        pan_number: 'MNOPQ7890Z',
        is_premium: 1,
        email_verified: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@yahoo.com',
        password: hashPassword('user_priya'),
        monthly_income: 95000.00,
        employment_status: 'Marketing Manager',
        financial_goals: 'Buy luxury car, Global travel',
        risk_tolerance: 'High',
        aadhaar_number: '667788990011',
        pan_number: 'DEFGH5678W',
        is_premium: 1,
        email_verified: true
      },
      {
        name: 'Rohan Khanna',
        email: 'rohan.khanna@outlook.com',
        password: hashPassword('user_rohan'),
        monthly_income: 87000.00,
        employment_status: 'Consultant',
        financial_goals: 'Build passive income, Real estate investment',
        risk_tolerance: 'Moderate',
        aadhaar_number: '778899001122',
        pan_number: 'JKLMN2345X',
        is_premium: 1,
        email_verified: true
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@hotmail.com',
        password: hashPassword('user_sneha'),
        monthly_income: 72000.00,
        employment_status: 'Data Scientist',
        financial_goals: 'Save for startup capital',
        risk_tolerance: 'Low',
        aadhaar_number: '889900112233',
        pan_number: 'PQRST6789Y',
        is_premium: 1,
        email_verified: true
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@gmail.com',
        password: hashPassword('user_vikram'),
        monthly_income: 105000.00,
        employment_status: 'Tech Lead',
        financial_goals: 'Early retirement, Global investments',
        risk_tolerance: 'High',
        aadhaar_number: '990011223344',
        pan_number: 'UVWXY4567Z',
        is_premium: 1,
        email_verified: true
      },
      {
        name: 'Neha Gupta',
        email: 'neha.gupta@yahoo.com',
        password: hashPassword('user_neha'),
        monthly_income: 68000.00,
        employment_status: 'Teacher',
        financial_goals: 'Child education fund, Home renovation',
        risk_tolerance: 'Low',
        aadhaar_number: '001122334455',
        pan_number: 'BCDEF9012W',
        is_premium: 1,
        email_verified: true
      },
      {
        name: 'Arun Kumar',
        email: 'arun.kumar@outlook.com',
        password: hashPassword('user_arun'),
        monthly_income: 80000.00,
        employment_status: 'Sales Manager',
        financial_goals: 'Build diverse investment portfolio',
        risk_tolerance: 'Moderate',
        aadhaar_number: '112233445566',
        pan_number: 'GHIJK3456X',
        is_premium: 1,
        email_verified: true
      }
    ];

    // Insert users
    const result = await User.insertMany(users);
    console.log('Users inserted successfully:', result);
  } catch (error) {
    console.error('Error inserting users:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the insertion
insertUsers();