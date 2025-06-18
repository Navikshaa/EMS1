import mongoose from "mongoose";
import Sales from "../models/SaleTask.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = "public/uploads/image";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `customer_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Upload image and update DB with public URL
const uploadSaleImage = async (req, res) => {
  try {
    const saleId = req.body.id;
    if (!saleId)
      return res.status(400).json({ message: "Sale ID is required" });
    if (!req.file)
      return res.status(400).json({ message: "Image file is required" });

    const filename = req.file.filename;
    const publicImageUrl = `http://localhost:3000/uploads/image/${filename}`;

    const updatedSale = await Sales.findByIdAndUpdate(
      saleId,
      { upload_image: publicImageUrl },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      image_url: publicImageUrl,
      sale: updatedSale,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new sales entry
const createSale = async (req, res) => {
  try {
    const saleData = {
      ...req.body,
      status: req.body.status || "pending", // fallback if not provided
    };

    const newSale = new Sales(saleData);
    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: "Error creating sale", error });
  }
};

// Get all sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

// Get sales by name
const getSalesByName = async (req, res) => {
  try {
    const { name } = req.params;
    const sales = await Sales.find({
      name: { $regex: new RegExp(name, "i") },
    });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales by name", error });
  }
};

// Get a single sale by ID
const getSaleById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid sale ID" });
  }

  try {
    const sale = await Sales.findById(id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale", error });
  }
};

// Update a sale
const updateSale = async (req, res) => {
  try {
    const updatedSale = await Sales.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        overwrite: false,
      }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: "Error updating sale", error });
  }
};

// Delete a sale
const deleteSale = async (req, res) => {
  try {
    const deletedSale = await Sales.findByIdAndDelete(req.params.id);
    if (!deletedSale)
      return res.status(404).json({ message: "Sale not found" });
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting sale", error });
  }
};

// Get sales by marketed_from
const getSalesByMarketedFrom = async (req, res) => {
  try {
    const { marketed_from } = req.params;
    const sales = await Sales.find({
      marketed_from: { $regex: new RegExp(marketed_from, "i") },
    });

    res.status(200).json(sales);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sales by marketed_from", error });
  }
};

// DeleteImage
const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Sales.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.upload_image) {
      const filePath = path.join("public", task.upload_image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    task.upload_image = null;
    await task.save();

    res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DOwnload Icons update
const updateDownloadStatus = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // "certificate", "internship", "offer", "done"

  if (!["certificate", "internship", "offer", "done"].includes(type)) {
    return res.status(400).json({ error: "Invalid download type" });
  }

  try {
    const sale = await Sales.findById(id);
    if (!sale) {
      return res.status(404).json({ error: "Sales record not found" });
    }

    // Set the specific download flag to true
    sale.downloads[type] = true;
    sale.updatedAt = new Date();
    await sale.save();

    return res.status(200).json({ message: `${type} download marked`, sale });
  } catch (error) {
    console.error("Download status update error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/// Get sales by training or internship certificate ID
const getSalesByCertificateId = async (req, res) => {
  try {
    const { id, type } = req.params;

    if (!["training", "internship"].includes(type)) {
      return res.status(400).json({ message: "Invalid certificate type. Must be 'training' or 'internship'." });
    }

    const queryKey = type === "training" ? "training_certificate_id" : "internship_certificate_id";

    const sales = await Sales.find({ [queryKey]: id });

    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: `No sales found for this ${type} certificate ID` });
    }

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching sales by ${req.params.type} certificate ID`,
      error,
    });
  }
};



export {
  createSale,
  deleteSale,
  getSaleById,
  updateSale,
  getAllSales,
  getSalesByName,
  getSalesByMarketedFrom,
  uploadSaleImage,
  deleteImage,
  upload,
  updateDownloadStatus,
  getSalesByCertificateId,
};
