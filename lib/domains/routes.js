var express = require("express");
router = express.Router();
var controller = require("./controller.js");
router.get("/", controller.get.domains);
router.post("/", controller.post.domain);
router.get("/:id", controller.get.domain);
router.post("/:id/key", controller.post.domainKey);
router.put("/:domainId/key/:id", controller.put.key);
//router.put("/", controller.put.industries);
//router.delete("/:id", controller.delete.industry);

module.exports = router;
