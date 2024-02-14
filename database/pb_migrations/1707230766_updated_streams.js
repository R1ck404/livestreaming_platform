/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i7lzbss7m6u84sv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "aevaydvz",
    "name": "is_live",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i7lzbss7m6u84sv")

  // remove
  collection.schema.removeField("aevaydvz")

  return dao.saveCollection(collection)
})
