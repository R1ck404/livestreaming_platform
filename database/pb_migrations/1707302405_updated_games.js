/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("l5he0dh7myntp6a")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n4ilcxtw",
    "name": "field",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 9,
      "values": [
        "Shooter",
        "Open World",
        "Survival",
        "Strategy",
        "Battle Royale",
        "Action",
        "Survival",
        "Adventure",
        "MMO"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("l5he0dh7myntp6a")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n4ilcxtw",
    "name": "field",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 9,
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
})
