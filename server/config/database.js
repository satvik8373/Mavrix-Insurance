const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await this.client.connect();
      this.db = this.client.db(process.env.DATABASE_NAME);
      this.isConnected = true;
      
      console.log('✅ Connected to MongoDB successfully');
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
      return false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  getCollection(collectionName) {
    if (!this.isConnected || !this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection(collectionName);
  }

  // Insurance data operations
  async getInsuranceData() {
    try {
      const collection = this.getCollection('insurance');
      return await collection.find({}).toArray();
    } catch (error) {
      console.error('Error getting insurance data:', error);
      return [];
    }
  }

  async addInsuranceEntry(entry) {
    try {
      const collection = this.getCollection('insurance');
      const result = await collection.insertOne(entry);
      return { ...entry, _id: result.insertedId };
    } catch (error) {
      console.error('Error adding insurance entry:', error);
      throw error;
    }
  }

  async updateInsuranceEntry(id, updates) {
    try {
      const collection = this.getCollection('insurance');
      
      // Try multiple approaches to find the entry
      let existingEntry = null;
      let searchId = null;
      
      // First try with ObjectId conversion
      try {
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;
        existingEntry = await collection.findOne({ _id: objectId });
        if (existingEntry) {
          searchId = objectId;
        }
      } catch (error) {
        // ObjectId conversion failed, will try string ID
      }
      
      // If not found with ObjectId, try with string ID
      if (!existingEntry) {
        existingEntry = await collection.findOne({ _id: id });
        if (existingEntry) {
          searchId = id;
        }
      }
      
      if (!existingEntry) {
        throw new Error('Entry not found');
      }
      
      // Update the entry using the ID that worked for finding it
      const updateData = { ...updates, updatedAt: new Date().toISOString() };
      const result = await collection.updateOne(
        { _id: searchId },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        throw new Error('Entry not found');
      }
      
      // Return the updated entry
      const updatedEntry = await collection.findOne({ _id: searchId });
      return updatedEntry;
    } catch (error) {
      console.error('Error updating insurance entry:', error);
      throw error;
    }
  }

  async deleteInsuranceEntry(id) {
    try {
      const collection = this.getCollection('insurance');
      
      // Try multiple approaches to find and delete the entry
      let result = null;
      
      // First try with ObjectId conversion
      try {
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;
        result = await collection.deleteOne({ _id: objectId });
        if (result.deletedCount > 0) {
          return true;
        }
      } catch (error) {
        // ObjectId conversion failed, will try string ID
      }
      
      // If not found with ObjectId, try with string ID
      result = await collection.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        return true;
      }
      
      throw new Error('Entry not found');
    } catch (error) {
      console.error('Error deleting insurance entry:', error);
      throw error;
    }
  }

  async bulkAddInsuranceData(entries) {
    try {
      const collection = this.getCollection('insurance');
      const result = await collection.insertMany(entries);
      return result.insertedIds;
    } catch (error) {
      console.error('Error bulk adding insurance data:', error);
      throw error;
    }
  }

  // Email logs operations
  async getEmailLogs() {
    try {
      const collection = this.getCollection('emailLogs');
      return await collection.find({}).sort({ timestamp: -1 }).toArray();
    } catch (error) {
      console.error('Error getting email logs:', error);
      return [];
    }
  }

  async addEmailLog(log) {
    try {
      const collection = this.getCollection('emailLogs');
      const result = await collection.insertOne(log);
      return { ...log, _id: result.insertedId };
    } catch (error) {
      console.error('Error adding email log:', error);
      throw error;
    }
  }

  async deleteEmailLog(id) {
    try {
      const collection = this.getCollection('emailLogs');
      await collection.deleteOne({ _id: id });
      return true;
    } catch (error) {
      console.error('Error deleting email log:', error);
      throw error;
    }
  }

  // User operations
  async getUsers() {
    try {
      const collection = this.getCollection('users');
      return await collection.find({}).toArray();
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async addUser(user) {
    try {
      const collection = this.getCollection('users');
      const result = await collection.insertOne(user);
      return { ...user, _id: result.insertedId };
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async findUserByUsername(username) {
    try {
      const collection = this.getCollection('users');
      return await collection.findOne({ 
        $or: [
          { username: { $regex: new RegExp(`^${username}$`, 'i') } },
          { email: { $regex: new RegExp(`^${username}$`, 'i') } }
        ]
      });
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  async updateUser(id, updates) {
    try {
      const collection = this.getCollection('users');
      const result = await collection.findOneAndUpdate(
        { _id: id },
        { $set: { ...updates, updatedAt: new Date().toISOString() } },
        { returnDocument: 'after' }
      );
      return result.value;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

module.exports = new Database();
