/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("33xivbw8las8ub0")

  collection.createRule = "@request.auth.id != \"\" && stream.settings:isset ~ '\"chat_enabled\": true'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("33xivbw8las8ub0")

  collection.createRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
})
