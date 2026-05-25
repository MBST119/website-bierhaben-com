/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("messages");

  const record0 = new Record(collection);
    const record0_senderIdLookup = app.findFirstRecordByFilter("users", "email='kaeufer@demo.com'");
    if (!record0_senderIdLookup) { throw new Error("Lookup failed for senderId: no record in 'users' matching \"email='kaeufer@demo.com'\""); }
    record0.set("senderId", record0_senderIdLookup.id);
    const record0_recipientIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer@demo.com'");
    if (!record0_recipientIdLookup) { throw new Error("Lookup failed for recipientId: no record in 'users' matching \"email='verkaeufer@demo.com'\""); }
    record0.set("recipientId", record0_recipientIdLookup.id);
    const record0_listingIdLookup = app.findFirstRecordByFilter("listings", "title='Vintage Holztisch'");
    if (!record0_listingIdLookup) { throw new Error("Lookup failed for listingId: no record in 'listings' matching \"title='Vintage Holztisch'\""); }
    record0.set("listingId", record0_listingIdLookup.id);
    record0.set("messageText", "Hallo, ist der Tisch noch verf\u00fcgbar?");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    const record1_senderIdLookup = app.findFirstRecordByFilter("users", "email='kaeufer@demo.com'");
    if (!record1_senderIdLookup) { throw new Error("Lookup failed for senderId: no record in 'users' matching \"email='kaeufer@demo.com'\""); }
    record1.set("senderId", record1_senderIdLookup.id);
    const record1_recipientIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer@demo.com'");
    if (!record1_recipientIdLookup) { throw new Error("Lookup failed for recipientId: no record in 'users' matching \"email='verkaeufer@demo.com'\""); }
    record1.set("recipientId", record1_recipientIdLookup.id);
    const record1_listingIdLookup = app.findFirstRecordByFilter("listings", "title='Vintage Holztisch'");
    if (!record1_listingIdLookup) { throw new Error("Lookup failed for listingId: no record in 'listings' matching \"title='Vintage Holztisch'\""); }
    record1.set("listingId", record1_listingIdLookup.id);
    record1.set("messageText", "Ja, sehr interessiert!");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    const record2_senderIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer@demo.com'");
    if (!record2_senderIdLookup) { throw new Error("Lookup failed for senderId: no record in 'users' matching \"email='verkaeufer@demo.com'\""); }
    record2.set("senderId", record2_senderIdLookup.id);
    const record2_recipientIdLookup = app.findFirstRecordByFilter("users", "email='kaeufer@demo.com'");
    if (!record2_recipientIdLookup) { throw new Error("Lookup failed for recipientId: no record in 'users' matching \"email='kaeufer@demo.com'\""); }
    record2.set("recipientId", record2_recipientIdLookup.id);
    const record2_listingIdLookup = app.findFirstRecordByFilter("listings", "title='Vintage Holztisch'");
    if (!record2_listingIdLookup) { throw new Error("Lookup failed for listingId: no record in 'listings' matching \"title='Vintage Holztisch'\""); }
    record2.set("listingId", record2_listingIdLookup.id);
    record2.set("messageText", "Ja, der Tisch ist noch da!");
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    const record3_senderIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer@demo.com'");
    if (!record3_senderIdLookup) { throw new Error("Lookup failed for senderId: no record in 'users' matching \"email='verkaeufer@demo.com'\""); }
    record3.set("senderId", record3_senderIdLookup.id);
    const record3_recipientIdLookup = app.findFirstRecordByFilter("users", "email='kaeufer@demo.com'");
    if (!record3_recipientIdLookup) { throw new Error("Lookup failed for recipientId: no record in 'users' matching \"email='kaeufer@demo.com'\""); }
    record3.set("recipientId", record3_recipientIdLookup.id);
    const record3_listingIdLookup = app.findFirstRecordByFilter("listings", "title='Vintage Holztisch'");
    if (!record3_listingIdLookup) { throw new Error("Lookup failed for listingId: no record in 'listings' matching \"title='Vintage Holztisch'\""); }
    record3.set("listingId", record3_listingIdLookup.id);
    record3.set("messageText", "Wir k\u00f6nnen einen Termin machen");
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
