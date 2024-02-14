/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a9r4k4ntcxp1qfz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "usvqhjbh",
    "name": "stream_tags",
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
  const collection = dao.findCollectionByNameOrId("a9r4k4ntcxp1qfz")

  // remove
  collection.schema.removeField("usvqhjbh")

  return dao.saveCollection(collection)
})
