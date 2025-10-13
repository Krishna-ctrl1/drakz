const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';
mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  monthly_income: Number,
  employment_status: String,
  financial_goals: String,
  risk_tolerance: String,
  aadhaar_number: String,
  pan_number: String,
  email_verified: Boolean,
  is_premium: Boolean,
  created_at: Date
});

const User = mongoose.model('User', userSchema, 'users');

const userGoalsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal_name: {
    type: String,
    required: true
  },
  target_amount: {
    type: Number,
    required: true
  },
  current_savings: {
    type: Number,
    default: 0
  },
  target_date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  priority: {
    type: String,
    default: 'medium'
  },
  category: {
    type: String,
    default: 'other'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const UserGoal = mongoose.model('UserGoal', userGoalsSchema, 'user_goals');

const insertUserGoals = async () => {
  try {
    const users = await User.find().select('_id email');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }

    console.log(`Found ${users.length} users in the database`);

    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user._id;
    });

    const goalsData = [
      { email: 'xdphantom1202@gmail.com', goal_name: 'Buy a New Car', target_amount: 20000.00, target_date: new Date('2026-12-31'), description: 'Save for a luxury sedan', priority: 'high', category: 'car' },
      { email: 'xdphantom1202@gmail.com', goal_name: 'Vacation Fund', target_amount: 5000.00, target_date: new Date('2025-06-30'), description: 'Trip to Europe', priority: 'medium', category: 'travel' },
      
      { email: 'ragamaie.n23@iiits.in', goal_name: 'Higher Education', target_amount: 15000.00, target_date: new Date('2027-03-15'), description: 'Masters degree funding', priority: 'high', category: 'education' },
      { email: 'ragamaie.n23@iiits.in', goal_name: 'Emergency Fund', target_amount: 10000.00, target_date: new Date('2025-12-31'), description: 'Build safety net', priority: 'medium', category: 'other' },
      
      { email: 'abhinay.m23@iiits.in', goal_name: 'Business Expansion', target_amount: 30000.00, target_date: new Date('2026-09-01'), description: 'Invest in new venture', priority: 'high', category: 'other' },
      { email: 'abhinay.m23@iiits.in', goal_name: 'Retirement Savings', target_amount: 50000.00, target_date: new Date('2030-01-01'), description: 'Long-term retirement plan', priority: 'low', category: 'other' },
      
      { email: 'arjun.patel@gmail.com', goal_name: 'Home Down Payment', target_amount: 25000.00, target_date: new Date('2026-05-20'), description: 'First home purchase', priority: 'high', category: 'house' },
      { email: 'arjun.patel@gmail.com', goal_name: 'Wedding Fund', target_amount: 15000.00, target_date: new Date('2025-11-15'), description: 'Save for wedding expenses', priority: 'medium', category: 'other' },
      
      { email: 'priya.sharma@yahoo.com', goal_name: 'Luxury Vacation', target_amount: 10000.00, target_date: new Date('2025-08-10'), description: 'High-end travel experience', priority: 'medium', category: 'travel' },
      { email: 'priya.sharma@yahoo.com', goal_name: 'Jewelry Purchase', target_amount: 8000.00, target_date: new Date('2025-12-25'), description: 'Buy diamond jewelry', priority: 'low', category: 'other' },
      
      { email: 'rohan.khanna@outlook.com', goal_name: 'New Laptop', target_amount: 2000.00, target_date: new Date('2025-03-01'), description: 'Upgrade work equipment', priority: 'high', category: 'other' },
      { email: 'rohan.khanna@outlook.com', goal_name: 'Investment Portfolio', target_amount: 15000.00, target_date: new Date('2026-01-01'), description: 'Diversify investments', priority: 'medium', category: 'other' },
      
      { email: 'sneha.reddy@hotmail.com', goal_name: 'Conference Attendance', target_amount: 3000.00, target_date: new Date('2025-07-15'), description: 'Tech conference fees', priority: 'medium', category: 'education' },
      { email: 'sneha.reddy@hotmail.com', goal_name: 'Home Office Setup', target_amount: 5000.00, target_date: new Date('2025-04-30'), description: 'Ergonomic workspace', priority: 'low', category: 'house' },
      
      { email: 'vikram.singh@gmail.com', goal_name: 'Yacht Purchase', target_amount: 100000.00, target_date: new Date('2027-06-01'), description: 'Luxury yacht investment', priority: 'low', category: 'other' },
      { email: 'vikram.singh@gmail.com', goal_name: 'Charity Donation', target_amount: 5000.00, target_date: new Date('2025-12-31'), description: 'Annual charity goal', priority: 'medium', category: 'other' },
      
      { email: 'neha.gupta@yahoo.com', goal_name: 'Child Education Fund', target_amount: 20000.00, target_date: new Date('2030-09-01'), description: 'Save for college', priority: 'high', category: 'education' },
      { email: 'neha.gupta@yahoo.com', goal_name: 'Family Vacation', target_amount: 4000.00, target_date: new Date('2025-07-01'), description: 'Summer family trip', priority: 'medium', category: 'travel' },
      
      { email: 'arun.kumar@outlook.com', goal_name: 'New Car', target_amount: 25000.00, target_date: new Date('2026-02-28'), description: 'Upgrade to electric vehicle', priority: 'high', category: 'car' },
      { email: 'arun.kumar@outlook.com', goal_name: 'Professional Certification', target_amount: 1500.00, target_date: new Date('2025-05-15'), description: 'Career advancement cert', priority: 'medium', category: 'education' }
    ];

    const userGoalsData = goalsData.map(goal => ({
      user_id: userMap[goal.email],
      goal_name: goal.goal_name,
      target_amount: goal.target_amount,
      current_savings: goal.current_savings || 0,
      target_date: goal.target_date,
      description: goal.description,
      priority: goal.priority,
      category: goal.category
    }));

    const validUserGoals = userGoalsData.filter(goal => goal.user_id);
    
    if (validUserGoals.length !== userGoalsData.length) {
      console.warn(`Warning: ${userGoalsData.length - validUserGoals.length} goal entries couldn't be matched to users`);
      const missingEmails = [...new Set(
        goalsData
          .filter(goal => !userMap[goal.email])
          .map(goal => goal.email)
      )];
      console.log('Missing user emails:', missingEmails);
    }

    const result = await UserGoal.insertMany(validUserGoals);
    console.log('User goals inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting user goals:', error);
  } finally {
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

insertUserGoals();