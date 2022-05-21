const router = require("express").Router();
const tags = require("./../controller/tags");
const news = require("./../controller/news");

router.get("/tags", tags.get);
router.post("/tags", tags.post);
router.get("/tags/:id", tags.getOne);
router.put("/tags/:id", tags.update);
router.delete("/tags/:id", tags.delete);

router.get("/news", news.get);
router.post("/news", news.post);
router.get("/news/:id", news.getOne);
router.put("/news/:id", news.update);
router.delete("/news/:id", news.delete);

module.exports = router;
