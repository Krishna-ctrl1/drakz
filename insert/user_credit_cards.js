const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection with explicit database name
const dbURI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/DRAKZ';
mongoose.connect(dbURI, {})
  .then(() => console.log('Connected to DRAKZ database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Reference existing User model structure
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

// Create User model with existing collection name
const User = mongoose.model('User', userSchema, 'users');

// User Credit Cards Schema
const userCreditCardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  card_number: {
    type: String,
    required: true
  },
  cardholder_name: {
    type: String,
    required: true
  },
  valid_from: {
    type: Date,
    required: true
  },
  valid_thru: {
    type: Date,
    required: true
  },
  bank_name: {
    type: String
  },
  card_type: {
    type: String,
    enum: ['credit', 'debit'],
    default: 'credit',
    required: true
  },
  card_network: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create User Credit Cards Model - specify the collection name explicitly
const UserCreditCard = mongoose.model('UserCreditCard', userCreditCardSchema, 'user_credit_cards');

// Insertion Function
const insertUserCreditCards = async () => {
  try {
    // First, get all users to reference their ObjectIds
    const users = await User.find().select('_id email name');
    
    if (users.length === 0) {
      console.error('No users found in the DRAKZ database');
      return;
    }

    console.log(`Found ${users.length} users in the database`);

    // Create mapping of email to user _id and name
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = {
        id: user._id,
        name: user.name
      };
    });

    // Credit card data mapped by user email
    const creditCardsData = [
      // User 1 - XD Phantom
      { 
        email: 'xdphantom1202@gmail.com', 
        cards: [
          {
            card_number: '4111 1111 1111 1111',
            valid_from: new Date('2022-01-01'),
            valid_thru: new Date('2027-12-31'),
            bank_name: 'HDFC Bank',
            card_type: 'credit',
            card_network: 'VISA'
          },
          {
            card_number: '5500 0000 0000 0004',
            valid_from: new Date('2023-03-15'),
            valid_thru: new Date('2028-03-14'),
            bank_name: 'ICICI Bank',
            card_type: 'credit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3400 0000 0000 009',
            valid_from: new Date('2021-11-01'),
            valid_thru: new Date('2026-10-31'),
            bank_name: 'American Express',
            card_type: 'debit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 2 - Ragamaie Nagineni
      {
        email: 'ragamaie.n23@iiits.in',
        cards: [
          {
            card_number: '4222 2222 2222 2222',
            valid_from: new Date('2021-02-01'),
            valid_thru: new Date('2026-01-31'),
            bank_name: 'SBI Bank',
            card_type: 'credit',
            card_network: 'VISA'
          },
          {
            card_number: '5333 3333 3333 3333',
            valid_from: new Date('2022-06-15'),
            valid_thru: new Date('2027-06-14'),
            bank_name: 'Axis Bank',
            card_type: 'debit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3444 4444 4444 444',
            valid_from: new Date('2023-01-01'),
            valid_thru: new Date('2028-12-31'),
            bank_name: 'American Express',
            card_type: 'credit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 3 - Abhinay Malle
      {
        email: 'abhinay.m23@iiits.in',
        cards: [
          {
            card_number: '4333 3333 3333 3333',
            valid_from: new Date('2020-03-01'),
            valid_thru: new Date('2025-02-28'),
            bank_name: 'PNB Bank',
            card_type: 'debit',
            card_network: 'VISA'
          },
          {
            card_number: '5444 4444 4444 4444',
            valid_from: new Date('2022-09-01'),
            valid_thru: new Date('2027-08-31'),
            bank_name: 'HDFC Bank',
            card_type: 'credit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3555 5555 5555 555',
            valid_from: new Date('2021-05-15'),
            valid_thru: new Date('2026-05-14'),
            bank_name: 'American Express',
            card_type: 'credit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 4 - Arjun Patel
      {
        email: 'arjun.patel@gmail.com',
        cards: [
          {
            card_number: '4555 5555 5555 5555',
            valid_from: new Date('2022-04-01'),
            valid_thru: new Date('2027-03-31'),
            bank_name: 'Wells Fargo',
            card_type: 'credit',
            card_network: 'VISA'
          },
          {
            card_number: '5666 6666 6666 6666',
            valid_from: new Date('2023-01-15'),
            valid_thru: new Date('2028-01-14'),
            bank_name: 'Chase Bank',
            card_type: 'credit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3777 7777 7777 777',
            valid_from: new Date('2021-08-01'),
            valid_thru: new Date('2026-07-31'),
            bank_name: 'Discover',
            card_type: 'debit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 5 - Priya Sharma
      {
        email: 'priya.sharma@yahoo.com',
        cards: [
          {
            card_number: '4888 8888 8888 8888',
            valid_from: new Date('2022-02-15'),
            valid_thru: new Date('2027-02-14'),
            bank_name: 'Bank of America',
            card_type: 'credit',
            card_network: 'VISA'
          },
          {
            card_number: '5999 9999 9999 9999',
            valid_from: new Date('2023-05-01'),
            valid_thru: new Date('2028-04-30'),
            bank_name: 'Capital One',
            card_type: 'debit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3000 0000 0000 000',
            valid_from: new Date('2021-12-01'),
            valid_thru: new Date('2026-11-30'),
            bank_name: 'American Express',
            card_type: 'credit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 6 - Rohan Khanna
      {
        email: 'rohan.khanna@outlook.com',
        cards: [
          {
            card_number: '4111 2222 3333 4444',
            valid_from: new Date('2022-07-15'),
            valid_thru: new Date('2027-07-14'),
            bank_name: 'Citibank',
            card_type: 'debit',
            card_network: 'VISA'
          },
          {
            card_number: '5444 5555 6666 7777',
            valid_from: new Date('2023-02-01'),
            valid_thru: new Date('2028-01-31'),
            bank_name: 'US Bank',
            card_type: 'credit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3888 9999 0000 1111',
            valid_from: new Date('2021-10-01'),
            valid_thru: new Date('2026-09-30'),
            bank_name: 'Discover',
            card_type: 'credit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 7 - Sneha Reddy
      {
        email: 'sneha.reddy@hotmail.com',
        cards: [
          {
            card_number: '4222 3333 4444 5555',
            valid_from: new Date('2022-05-01'),
            valid_thru: new Date('2027-04-30'),
            bank_name: 'TD Bank',
            card_type: 'credit',
            card_network: 'VISA'
          },
          {
            card_number: '5666 7777 8888 9999',
            valid_from: new Date('2023-03-15'),
            valid_thru: new Date('2028-03-14'),
            bank_name: 'Barclays',
            card_type: 'credit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3222 3333 4444 555',
            valid_from: new Date('2021-09-01'),
            valid_thru: new Date('2026-08-31'),
            bank_name: 'American Express',
            card_type: 'debit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 8 - Vikram Singh
      {
        email: 'vikram.singh@gmail.com',
        cards: [
          {
            card_number: '4333 4444 5555 6666',
            valid_from: new Date('2022-08-15'),
            valid_thru: new Date('2027-08-14'),
            bank_name: 'Santander',
            card_type: 'credit',
            card_network: 'VISA'
          },
          {
            card_number: '5777 8888 9999 0000',
            valid_from: new Date('2023-04-01'),
            valid_thru: new Date('2028-03-31'),
            bank_name: 'HSBC',
            card_type: 'debit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3444 5555 6666 777',
            valid_from: new Date('2021-11-15'),
            valid_thru: new Date('2026-11-14'),
            bank_name: 'Discover',
            card_type: 'credit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 9 - Neha Gupta
      {
        email: 'neha.gupta@yahoo.com',
        cards: [
          {
            card_number: '4444 5555 6666 7777',
            valid_from: new Date('2022-06-01'),
            valid_thru: new Date('2027-05-31'),
            bank_name: 'Citizens Bank',
            card_type: 'debit',
            card_network: 'VISA'
          },
          {
            card_number: '5888 9999 0000 1111',
            valid_from: new Date('2023-02-15'),
            valid_thru: new Date('2028-02-14'),
            bank_name: 'PNC Bank',
            card_type: 'credit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3555 6666 7777 888',
            valid_from: new Date('2021-12-15'),
            valid_thru: new Date('2026-12-14'),
            bank_name: 'American Express',
            card_type: 'credit',
            card_network: 'AMEX'
          }
        ]
      },
      
      // User 10 - Arun Kumar
      {
        email: 'arun.kumar@outlook.com',
        cards: [
          {
            card_number: '4555 6666 7777 8888',
            valid_from: new Date('2022-09-15'),
            valid_thru: new Date('2027-09-14'),
            bank_name: 'KeyBank',
            card_type: 'credit',
            card_network: 'VISA'
          },
          {
            card_number: '5999 0000 1111 2222',
            valid_from: new Date('2023-05-15'),
            valid_thru: new Date('2028-05-14'),
            bank_name: 'Ally Bank',
            card_type: 'credit',
            card_network: 'MasterCard'
          },
          {
            card_number: '3666 7777 8888 999',
            valid_from: new Date('2021-07-01'),
            valid_thru: new Date('2026-06-30'),
            bank_name: 'Discover',
            card_type: 'debit',
            card_network: 'AMEX'
          }
        ]
      }
    ];

    // Prepare user credit cards data with ObjectIds
    const creditCardsToInsert = [];
    
    creditCardsData.forEach(userData => {
      if (!userMap[userData.email]) {
        console.warn(`User with email ${userData.email} not found in database`);
        return;
      }
      
      const userId = userMap[userData.email].id;
      const cardholderName = userMap[userData.email].name;
      
      userData.cards.forEach(card => {
        creditCardsToInsert.push({
          user_id: userId,
          cardholder_name: cardholderName,
          card_number: card.card_number,
          valid_from: card.valid_from,
          valid_thru: card.valid_thru,
          bank_name: card.bank_name,
          card_type: card.card_type,
          card_network: card.card_network
        });
      });
    });

    // Insert user credit cards
    const result = await UserCreditCard.insertMany(creditCardsToInsert);
    console.log('User credit cards inserted successfully:', result.length);
  } catch (error) {
    console.error('Error inserting user credit cards:', error);
  } finally {
    // Close the connection after operation completes
    mongoose.connection.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
};

// Run the insertion
insertUserCreditCards();