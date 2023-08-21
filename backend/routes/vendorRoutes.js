import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import Vendor from "../models/vendorModel.js";
import { generateToken } from "../utils.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { dirname } from "path";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
const vendorRouter = express.Router();

// api to get All Vendors
vendorRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const vendors = await Vendor.find({});
    if (vendors) {
      res.send(vendors);
    } else {
      res.send({ message: "No vendors found" });
    }
  })
);

//get vendor based on the ID
vendorRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const vendors = await Vendor.findById(req.params.id);
    if (vendors) {
      res.send(vendors);
    } else {
      res.send({ message: "No vendors found" });
    }
  })
);

// Api to add a new vendor
vendorRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const existingVendor = await Vendor.findOne({ email: req.body.email });
    if (existingVendor) {
      res.send({ message: "Email already exists" });
    } else {
      const newVendor = new Vendor({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
        address: req.body.address,
        businessName: req.body.businessName,
        CNIC: req.body.CNIC,
        status: "rejected",
      });
      console.log(newVendor);
      const vendor = await newVendor.save();
      res.send({
        _id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        phone: newVendor.phone,
        address: newVendor.address,
        businessName: newVendor.businessName,
        CNIC: newVendor.CNIC,
        token: generateToken(newVendor),
        status: "pending",
      });
    }
  })
);

// api to delete a vendor
vendorRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) {
      const deleteVendor = await vendor.remove();
      res.send({ message: "Vendor Deleted" });
    } else {
      res.status(404).send({ message: "Vendor Not Found" });
    }
  })
);

// api to handle the signIn for the vendor
vendorRouter.post(
  "/signIn",
  expressAsyncHandler(async (req, res) => {
    const credentials = req.body; // req here contains email and password

    const vendor = await Vendor.findOne({ email: credentials.email });

    if (vendor) {
      if (credentials.password.length >= 8) {
        if (bcrypt.compareSync(credentials.password, vendor.password)) {
          res.send({
            _id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address,
            businessName: vendor.businessName,
            CNIC: vendor.CNIC,
            status: vendor.status,
            token: generateToken(vendor),
          });
        }
      }
    }
    res.send({ message: "Invalid email or password" });
  })
);

vendorRouter.get("/pending/t", async (req, res) => {
  try {
    const pendingVendors = await Vendor.find({ status: "pending" });
    res.status(200).json(pendingVendors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending vendors." });
  }
});

vendorRouter.get("/:id/url", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) {
      res.status(200).json({ url: vendor.documentPath });
    } else {
      res.status(404).json({ message: "Vendor not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor." });
  }
});

vendorRouter.put("/:id/changestatus", async (req, res) => {
  try {
    console.log("yoo");
    const vendor = await Vendor.findById(req.params.id);
    console.log(vendor);
    if (vendor) {
      vendor.status = req.body.status;
      await vendor.save();
      res.status(200).json({ message: "Vendor status updated successfully." });
    } else {
      res.status(404).json({ message: "Vendor not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating vendor status." });
  }
});

/// api for vendor verification
vendorRouter.put("/verify/t", upload.single("document"), async (req, res) => {
  try {
    const { businessName, bankName, accountNumber, routingNumber } = req.body;
    const documentPath = req.file.path;
    const documentUrl = req.file
      ? `http://localhost:5000/public/uploads/${req.file.filename}`
      : req.body.image;
    const vendor = await Vendor.findOne({ _id: req.body.vendorId });

    if (vendor) {
      vendor.businessName = businessName;
      vendor.bankName = bankName;
      vendor.accountNumber = accountNumber;
      vendor.routingNumber = routingNumber;
      vendor.documentPath = documentUrl;
      vendor.status = "pending";
      await vendor.save();

      if (!res.headersSent) {
        res.status(201).send({
          message: "Vendor verification details submitted successfully.",
          vendor,
        });
      }
    } else {
      if (!res.headersSent) {
        res.status(404).send({ message: "Vendor not found" });
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).send({ message: error.message });
    }
  }
});

export default vendorRouter;
