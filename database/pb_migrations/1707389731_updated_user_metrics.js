/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a9r4k4ntcxp1qfz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s96kbd5p",
    "name": "user",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a9r4k4ntcxp1qfz")

  // remove
  collection.schema.removeField("s96kbd5p")

  return dao.saveCollection(collection)
})
