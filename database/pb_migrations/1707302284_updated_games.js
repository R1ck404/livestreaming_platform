/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("l5he0dh7myntp6a")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n4ilcxtw",
    "name": "field",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "Shooter",
        "Open World",
        "mmo",
        "Survival",
        "Strategy",
        "Battle Royale",
        "Action",
        "Survival",
        "Adventure"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("l5he0dh7myntp6a")

  // remove
  collection.schema.removeField("n4ilcxtw")

  return dao.saveCollection(collection)
})
