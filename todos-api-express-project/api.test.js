import { describe, it, expect } from "bun:test";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { Todo, Attachment } from "./schema.js";

// So we can write ObjectId instead of mongoose.Types.ObjectId
const { ObjectId } = mongoose.Types;
const ID_42 = new ObjectId(42);

// Basic CRUD operations for Todos
describe("Todos API", () => {
  // Could also name this test "GET /todos"
  it("should fetch all todos", async () => {
    // As we're trying to fetch resources here, we'll just
    // create them directly in our DB for our API to serve.
    // Every new test truncates the database so this should
    // always yield the same results.
    await Todo.insertMany([{ title: "First Todo" }, { title: "Second Todo" }]);

    // Actual API request
    const response = await fetch("http://localhost:3000/todos");
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBe(2);
    expect(json[0].title).toBe("First Todo");
  });

  // Could also name this test "POST to /todos"
  it("should create a new todo", async () => {
    const response = await fetch("http://localhost:3000/todos", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ title: "New Todo" }),
    });
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.title).toBe("New Todo");
  });

  it("should update a todo", async () => {
    await Todo.insertMany([
      { title: "First Todo" },
      { _id: ID_42, title: "Second Todo" }, // should find this
      { title: "Third Todo" },
    ]);

    const response = await fetch(`http://localhost:3000/todos/${ID_42}`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({ title: "Updated Todo" }),
    });
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.title).toBe("Updated Todo");
  });

  it("should delete a todo", async () => {
    await Todo.insertMany([
      { title: "First Todo" },
      { _id: ID_42, title: "Second Todo" }, // should find this
      { title: "Third Todo" },
    ]);

    const response = await fetch(`http://localhost:3000/todos/${ID_42}`, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    expect(response.status).toBe(200);
    expect(await Todo.countDocuments()).toBe(2);
  });

  it("should fetch a specific todo by ID", async () => {
    await Todo.insertMany([
      { title: "First Todo" },
      { _id: ID_42, title: "Second Todo" }, // should find this
      { title: "Third Todo" },
    ]);

    const response = await fetch(`http://localhost:3000/todos/${ID_42}`);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.title).toBe("Second Todo");
  });
});

// Attachment tests
describe("Attachments API", () => {
  it("should upload an attachment", async () => {
    await Todo.insertMany([
      { title: "First Todo" },
      { _id: ID_42, title: "Second Todo" }, // should find this
      { title: "Third Todo" },
    ]);

    const todoId = ID_42;
    const filePath = "./test-attachment.txt";
    const filename = path.basename(filePath);
    const formData = new FormData();
    const options = {
      contentType: "text/plain",
      name: "file",
      filename,
    };
    formData.append("file", Bun.file(filePath), filename, options);

    const response = await fetch(
      `http://localhost:3000/todos/${todoId}/attachments`,
      {
        method: "POST",
        body: formData,
      },
    );
    expect(response.status).toBe(201);
  });

  it("should fetch all attachments for a todo", async () => {
    const otherTodoId = new ObjectId(43);

    await Todo.insertMany([
      { _id: otherTodoId, title: "First Todo" },
      { _id: ID_42, title: "Second Todo" },
      { title: "Third Todo" },
    ]);

    await Attachment.insertMany([
      {
        todoId: ID_42,
        name: "test1.txt",
        size: 1,
        storagePath: "/does_not_exist",
      }, // should find this
      {
        todoId: ID_42,
        name: "test2.txt",
        size: 2,
        storagePath: "/does_not_exist",
      }, // should find this
      {
        todoId: otherTodoId,
        name: "test3.txt",
        size: 3,
        storagePath: "/does_not_exist",
      }, // should not find this
    ]);

    const todoId = ID_42;
    const response = await fetch(
      `http://localhost:3000/todos/${todoId}/attachments`,
    );

    expect(response.status).toBe(200);
    const json = await response.json();

    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBe(2);
  });

  it("should fetch a specific attachment by ID", async () => {
    const attachmentId = new ObjectId(43);

    await Todo.insertMany([{ _id: ID_42, title: "A Todo" }]);

    await Attachment.insertMany([
      {
        todoId: ID_42,
        name: "test1.txt",
        size: 1,
        storagePath: "/does_not_exist",
      },
      {
        _id: attachmentId,
        todoId: ID_42,
        name: "test2.txt",
        size: 2,
        storagePath: "/does_not_exist",
      }, // should find this
      {
        todoId: ID_42,
        name: "test3.txt",
        size: 3,
        storagePath: "/does_not_exist",
      },
    ]);

    const todoId = ID_42;
    const response = await fetch(
      `http://localhost:3000/todos/${todoId}/attachments/${attachmentId}`,
    );
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json._id).toBe(attachmentId.toString());
  });

  it("should delete an attachment", async () => {
    const attachmentId = new ObjectId(43);

    await Todo.insertMany([{ _id: ID_42, title: "A Todo" }]);

    await Attachment.insertMany([
      {
        todoId: ID_42,
        name: "test1.txt",
        size: 1,
        storagePath: "/does_not_exist",
      },
      {
        _id: attachmentId,
        todoId: ID_42,
        name: "test2.txt",
        size: 2,
        storagePath: "/does_not_exist",
      }, // should find this
      {
        todoId: ID_42,
        name: "test3.txt",
        size: 3,
        storagePath: "/does_not_exist",
      },
    ]);

    const todoId = ID_42;
    const response = await fetch(
      `http://localhost:3000/todos/${todoId}/attachments/${attachmentId}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      },
    );
    expect(response.status).toBe(204);
    expect(await Attachment.countDocuments()).toBe(2);
    expect(await Todo.countDocuments()).toBe(1);
  });
});
