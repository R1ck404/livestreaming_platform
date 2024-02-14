/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paxwdq75ihb8u2w")

  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("paxwdq75ihb8u2w")

  collection.viewRule = "follower.id = @request.auth.id"

  return dao.saveCollection(collection)
})
