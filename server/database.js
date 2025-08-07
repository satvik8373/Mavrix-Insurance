const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const uri = process.env.MONGODB_URI;
      const dbName = process.env.DATABASE_NAME || 'insuretrack';

      if (!uri) {
        console.warn('MongoDB URI not configured. Using file-based storage.');
        return false;
      }

      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.isConnected = true;
      
      console.log(`Connected to MongoDB database: ${dbName}`);
      return true;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      console.warn('Falling back to file-based storage.');
      this.isConnected = false;
      return false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  getCollection(name) {
    if (!this.isConnected || !this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection(name);
  }

  // Insurance Data Operations
  async getInsuranceData() {
    if (!this.isConnected) return [];
    
    try {
      const collection = this.getCollection('insurance');
      const data = await collection.find({}).toArray();
      return data.map(item => ({
        id: item._id.toString(),
        vehicleNo: item.vehicleNo,
        vehicleType: item.vehicleType,
        name: item.name,
        mobileNo: item.mobileNo,
        email: item.email,
        expiryDate: item.expiryDate,
        createdAt: item.createdAt
      }));
    } catch (error) {
      console.error('Error fetching insurance data:', error);
      return [];
    }
  }

  async addInsuranceEntry(entry) {
    if (!this.isConnected) throw new Error('Database not connected');
    
    try {
      const collection = this.getCollection('insurance');
      const result = await collection.insertOne({
        vehicleNo: entry.vehicleNo,
        vehicleType: entry.vehicleType,
        name: entry.name,
        mobileNo: entry.mobileNo,
        email: entry.email,
        expiryDate: entry.expiryDate,
        createdAt: entry.createdAt || new Date().toISOString()
      });
      
      return {
        id: result.insertedId.toString(),
        ...entry
      };
    } catch (error) {
      console.error('Error adding insurance entry:', error);
      throw error;
    }
  }

  async updateInsuranceEntry(id, updates) {
    if (!this.isConnected) throw new Error('Database not connected');
    
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection('insurance');
      
      // Handle both string and ObjectId formats
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch (objectIdError) {
        // If ObjectId conversion fails, try as string
        console.log('ObjectId conversion failed, trying as string:', id);
        query = { _id: id };
      }
      
      const result = await collection.updateOne(query, { $set: updates });
      
      if (result.matchedCount === 0) {
        throw new Error('Entry not found');
      }
      
      console.log(`Successfully updated entry with id: ${id}`);
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating insurance entry:', error);
      throw error;
    }
  }

  async deleteInsuranceEntry(id) {
    if (!this.isConnected) throw new Error('Database not connected');
    
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection('insurance');
      
      // Handle both string and ObjectId formats
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch (objectIdError) {
        // If ObjectId conversion fails, try as string
        console.log('ObjectId conversion failed, trying as string:', id);
        query = { _id: id };
      }
      
      const result = await collection.deleteOne(query);
      
      if (result.deletedCount === 0) {
        throw new Error('Entry not found');
      }
      
      console.log(`Successfully deleted entry with id: ${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting insurance entry:', error);
      throw error;
    }
  }

  async bulkAddInsuranceData(entries) {
    if (!this.isConnected) throw new Error('Database not connected');
    
    try {
      const collection = this.getCollection('insurance');
      const documents = entries.map(entry => ({
        vehicleNo: entry.vehicleNo,
        vehicleType: entry.vehicleType,
        name: entry.name,
        mobileNo: entry.mobileNo,
        email: entry.email,
        expiryDate: entry.expiryDate,
        createdAt: entry.createdAt || new Date().toISOString()
      }));
      
      const result = await collection.insertMany(documents);
      
      return Object.keys(result.insertedIds).map(index => ({
        id: result.insertedIds[index].toString(),
        ...entries[index]
      }));
    } catch (error) {
      console.error('Error bulk adding insurance data:', error);
      throw error;
    }
  }

  // Email Logs Operations
  async getEmailLogs() {
    if (!this.isConnected) return [];
    
    try {
      const collection = this.getCollection('emailLogs');
      const logs = await collection.find({}).sort({ timestamp: -1 }).toArray();
      return logs.map(log => ({
        id: log._id.toString(),
        recipient: log.recipient,
        status: log.status,
        message: log.message,
        error: log.error,
        timestamp: log.timestamp
      }));
    } catch (error) {
      console.error('Error fetching email logs:', error);
      return [];
    }
  }

  async addEmailLog(log) {
    if (!this.isConnected) return;
    
    try {
      const collection = this.getCollection('emailLogs');
      await collection.insertOne({
        recipient: log.recipient,
        status: log.status,
        message: log.message,
        error: log.error,
        timestamp: log.timestamp || new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding email log:', error);
    }
  }
}

module.exports = new Database();