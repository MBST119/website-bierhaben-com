/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("listings");

  const record0 = new Record(collection);
    record0.set("title", "Vintage Holztisch");
    record0.set("description", "Sch\u00f6ner alter Holztisch, guter Zustand");
    const record0_categoryLookup = app.findFirstRecordByFilter("categories", "name='Möbel'");
    if (!record0_categoryLookup) { throw new Error("Lookup failed for category: no record in 'categories' matching \"name='Möbel'\""); }
    record0.set("category", record0_categoryLookup.id);
    record0.set("beerPrice", 50);
    record0.set("beerUnit", "Flasche");
    record0.set("condition", "Sehr gut");
    const record0_userIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer@demo.com'");
    if (!record0_userIdLookup) { throw new Error("Lookup failed for userId: no record in 'users' matching \"email='verkaeufer@demo.com'\""); }
    record0.set("userId", record0_userIdLookup.id);
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
    record1.set("title", "Fahrrad");
    record1.set("description", "Mountainbike, wenig gefahren");
    const record1_categoryLookup = app.findFirstRecordByFilter("categories", "name='Fahrzeuge'");
    if (!record1_categoryLookup) { throw new Error("Lookup failed for category: no record in 'categories' matching \"name='Fahrzeuge'\""); }
    record1.set("category", record1_categoryLookup.id);
    record1.set("beerPrice", 150);
    record1.set("beerUnit", "Kiste");
    record1.set("condition", "Sehr gut");
    const record1_userIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer@demo.com'");
    if (!record1_userIdLookup) { throw new Error("Lookup failed for userId: no record in 'users' matching \"email='verkaeufer@demo.com'\""); }
    record1.set("userId", record1_userIdLookup.id);
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
    record2.set("title", "Laptop");
    record2.set("description", "Dell Laptop, funktioniert einwandfrei");
    const record2_categoryLookup = app.findFirstRecordByFilter("categories", "name='Elektronik'");
    if (!record2_categoryLookup) { throw new Error("Lookup failed for category: no record in 'categories' matching \"name='Elektronik'\""); }
    record2.set("category", record2_categoryLookup.id);
    record2.set("beerPrice", 300);
    record2.set("beerUnit", "Doppler");
    record2.set("condition", "Sehr gut");
    const record2_userIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer@demo.com'");
    if (!record2_userIdLookup) { throw new Error("Lookup failed for userId: no record in 'users' matching \"email='verkaeufer@demo.com'\""); }
    record2.set("userId", record2_userIdLookup.id);
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
    record3.set("title", "Sofa");
    record3.set("description", "Gro\u00dfes graues Sofa, sehr bequem");
    const record3_categoryLookup = app.findFirstRecordByFilter("categories", "name='Möbel'");
    if (!record3_categoryLookup) { throw new Error("Lookup failed for category: no record in 'categories' matching \"name='Möbel'\""); }
    record3.set("category", record3_categoryLookup.id);
    record3.set("beerPrice", 200);
    record3.set("beerUnit", "Weinkiste");
    record3.set("condition", "Sehr gut");
    const record3_userIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer2@demo.com'");
    if (!record3_userIdLookup) { throw new Error("Lookup failed for userId: no record in 'users' matching \"email='verkaeufer2@demo.com'\""); }
    record3.set("userId", record3_userIdLookup.id);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("title", "Winterjacke");
    record4.set("description", "Warme Winterjacke, Gr\u00f6\u00dfe M");
    const record4_categoryLookup = app.findFirstRecordByFilter("categories", "name='Kleidung'");
    if (!record4_categoryLookup) { throw new Error("Lookup failed for category: no record in 'categories' matching \"name='Kleidung'\""); }
    record4.set("category", record4_categoryLookup.id);
    record4.set("beerPrice", 30);
    record4.set("beerUnit", "Flasche");
    record4.set("condition", "Sehr gut");
    const record4_userIdLookup = app.findFirstRecordByFilter("users", "email='verkaeufer2@demo.com'");
    if (!record4_userIdLookup) { throw new Error("Lookup failed for userId: no record in 'users' matching \"email='verkaeufer2@demo.com'\""); }
    record4.set("userId", record4_userIdLookup.id);
  try {
    app.save(record4);
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
