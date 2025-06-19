// routes/salesRoutes.js
import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
  getSalesByName,
  getSalesByMarketedFrom,
  upload,
  uploadSaleImage,
  deleteImage,
  updateDownloadStatus,
  getSalesByCertificateId,
} from "../controllers/salesTaskController.js";
import authMiddleware from "../middleware/authMiddlware.js";

const router = express.Router();

router.post("/add", authMiddleware, createSale);
router.get("/", authMiddleware, getAllSales);

router.get("/name/:name", authMiddleware, getSalesByName);
router.get(
  "/marketed-from/:marketed_from",
  authMiddleware,
  getSalesByMarketedFrom
);

router.get("/:id", authMiddleware, getSaleById);
router.put("/:id", authMiddleware, updateSale);
router.delete("/:id", authMiddleware, deleteSale);
router.post(
  "/upload-image",
  upload.single("image"),
  authMiddleware,
  uploadSaleImage
);
router.delete("/delete-image/:id", authMiddleware, deleteImage);
router.patch("/salestask/:id/download", authMiddleware, updateDownloadStatus);
router.get("/certificate/:type/:id", authMiddleware, getSalesByCertificateId);

export default router;
