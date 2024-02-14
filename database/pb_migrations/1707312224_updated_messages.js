/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("33xivbw8las8ub0")

  collection.name = "stream_messages"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("33xivbw8las8ub0")

  collection.name = "messages"

  return dao.saveCollection(collection)
})
