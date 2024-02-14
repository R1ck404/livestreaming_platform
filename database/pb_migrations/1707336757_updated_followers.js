/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paxwdq75ihb8u2w")

  collection.listRule = "follower.id = @request.auth.id"
  collection.viewRule = "follower.id = @request.auth.id"
  collection.createRule = "@request.auth.id != \"\""
  collection.updateRule = "follower.id = @request.auth.id"
  collection.deleteRule = "follower.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paxwdq75ihb8u2w")

  collection.listRule = "id = @request.auth.id"
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
