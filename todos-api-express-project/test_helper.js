import { beforeEach, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";

// Setup MongoDB Memory Server
let mongoServer;

// Before the suite starts, connect to our MongoDB server
beforeAll(async () => {
  const uri = "mongodb://127.0.0.1:27017/todos_test"
  await mongoose.connect(uri);
});

// Before each test, ensure we start with a fresh, empty database
beforeEach(async () => {
  await mongoose.connection.db.collection('todos').deleteMany({});
  await mongoose.connection.db.collection('attachments').deleteMany({});
});

// After the suite ends, stop the MongoDB server
afterAll(async () => {
  await mongoose.connection.close();
});
