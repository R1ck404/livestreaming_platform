/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i7lzbss7m6u84sv")

  // remove
  collection.schema.removeField("poujkpeg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z850bzxp",
    "name": "tags",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i7lzbss7m6u84sv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "poujkpeg",
    "name": "tags",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "pattern": "^([^,]+)(,[^,]+)*$"
    }
  }))

  // remove
  collection.schema.removeField("z850bzxp")

  return dao.saveCollection(collection)
})
