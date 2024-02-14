/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "a9r4k4ntcxp1qfz",
    "created": "2024-02-08 10:54:17.165Z",
    "updated": "2024-02-08 10:54:17.165Z",
    "name": "user_metrics",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6x8i9aaf",
        "name": "interaction_type",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "view",
            "like",
            "share",
            "follow",
            "chat"
          ]
        }
      },
      {
        "system": false,
        "id": "ilretext",
        "name": "streamer",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "i7lzbss7m6u84sv",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("a9r4k4ntcxp1qfz");

  return dao.deleteCollection(collection);
})
