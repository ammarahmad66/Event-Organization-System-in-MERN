import express from "express";
import Vendor from "../models/vendorModel.js";
import expressAsyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";
import { isAdmin, isAuth } from "../utils.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import { fileURLToPath } from "url"; // Add this line
import { dirname } from "path"; // Add this line

const __filename = fileURLToPath(import.meta.url); // Add this line
const __dirname = dirname(__filename); // A

const eventRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

eventRouter.put("/changeSuspenedStatus/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      event.suspended = req.body.suspended;
      const updatedEvent = await event.save();
      res.send({ message: "Event Updated", event: updatedEvent });
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
eventRouter.post(
  "/",
  upload.single("image"),
  expressAsyncHandler(async (req, res) => {
    try {
      const imageUrl = req.file
        ? `http://localhost:5000/public/uploads/${req.file.filename}`
        : req.body.image;

      const location = {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude),
        ],
      };

      const newEvent = new Event({
        title: req.body.name,
        vendorId: req.body.vendorId,
        slugs: req.body.slugs,
        category: req.body.category,
        image: imageUrl,
        price: req.body.price,
        stock: req.body.capacity,
        rating: 0,
        numberOfReviews: 0,
        description: req.body.description,
        opening: req.body.opening,
        closing: req.body.closing,
        location: location,
      });

      const event = await newEvent.save();
      const vendor = await Vendor.findById(req.body.vendorId);
      console.log(event._id, "printing id");
      vendor.event_id.push(event._id);
      await vendor.save();
      res.send({ message: "Event Added", event });
    } catch (err) {
      console.log(err);
    }
  })
);

eventRouter.get("/", async (req, res) => {
  const events = await Event.find();
  res.send(events);
});

// eventRouter.get(
//   "/:id",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const event = await Event.findOne({ id: req.params.id });
//       res.send(event);
//     } catch (err) {
//       console.log(err);
//     }
//   })
// );

// get event based upon slugs for the messaging platform
eventRouter.get(
  "/slugs/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const event = await Event.findOne({ slugs: req.params.id });
      res.send(event);
    } catch (err) {
      console.log(err);
    }
  })
);

// edit event for the vendor
eventRouter.put(
  "/:id/editEvent",
  upload.single("image"),
  expressAsyncHandler(async (req, res) => {
    const Editevent = await Event.findById(req.params.id);
    try {
      const imageUrl = req.file
        ? `http://localhost:5000/public/uploads/${req.file.filename}`
        : req.body.image;

      const location = {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude),
        ],
      };

      Editevent.title = req.body.name;
      Editevent.vendorId = req.body.vendorId;
      Editevent.slugs = req.body.slugs;
      Editevent.category = req.body.category;
      Editevent.image = imageUrl;
      Editevent.price = req.body.price;
      Editevent.stock = req.body.capacity;
      Editevent.rating = 0;
      Editevent.numberOfReviews = 0;
      Editevent.description = req.body.description;
      Editevent.opening = req.body.opening;
      Editevent.closing = req.body.closing;
      Editevent.location = location;

      const event = await Editevent.save();
      res.send({ message: "Event Edited" });
    } catch (err) {
      console.log(err);
    }
  })
);

eventRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (event) {
      event.title = req.body.name;
      event.vendorId = req.body.vendorId;
      event.slugs = req.body.slugs;
      event.category = req.body.category;
      event.image = req.body.image;
      event.price = req.body.price;
      event.stock = req.body.stock;
      event.description = req.body.description;
      await event.save();
      res.send({ message: "Event Updated" });
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  })
);

eventRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (event && event.bookings.length > 0) {
      await event.remove();
      res.send({ message: "Event Deleted" });
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  })
);

eventRouter.delete(
  "/:id/vendor/:vendorId",
  expressAsyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    const vendor = await Vendor.findById(req.params.vendorId);
    if (event) {
      if (event.bookings.length === 0) {
        await event.remove();
        console.log(req.params.id, "id of the event");
        vendor.event_id.pull(new ObjectId(req.params.id));
        console.log(vendor);
        await vendor.save();
        res.send({ message: "Event Deleted" });
      } else {
        res.status(404).send({ message: "Event has bookings" });
      }
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  })
);

eventRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (event) {
      if (event.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      event.reviews.push(review);
      event.numberOfReviews = event.reviews.length + 1;
      event.rating =
        event.reviews.reduce((a, c) => c.rating + a, 0) / event.reviews.length;
      const updatedEvent = await event.save();
      res.status(201).send({
        message: "Review Created",
        review: updatedEvent.reviews[updatedEvent.reviews.length - 1],
        numReviews: event.numberOfReviews,
        rating: event.rating,
      });
    } else {
      res.status(404).send({ message: "Event Not Found" });
    }
  })
);

const PAGE_SIZE = 3;

eventRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";
    console.log(searchQuery);
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            title: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const events = await Event.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countEvents = await Event.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      events,
      countEvents,
      page,
      pages: Math.ceil(countEvents / pageSize),
    });
  })
);

eventRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const events = await Event.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countEvents = await Event.countDocuments();
    res.send({
      events,
      countEvents,
      page,
      pages: Math.ceil(countEvents / pageSize),
    });
  })
);

eventRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Event.find().distinct("category");
    res.send(categories);
  })
);

eventRouter.get("/slugs/:slugs", async (req, res) => {
  const event = await Event.findOne({ slugs: req.params.slugs });
  if (event) {
    res.send(event);
  } else {
    res.status(404).send({ message: "Event Not Found" });
  }
});

eventRouter.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    res.send(event);
  } else {
    res.status(404).send({ message: "Event Not Found" });
  }
});

//vendorId
eventRouter.get("/vendor/:id", async (req, res) => {
  const event = await Event.find({ vendorId: req.params.id });
  if (event) {
    res.send(event);
  } else {
    res.status(404).send({ message: "Event Not Found" });
  }
});

// eventRouter.get("/vendor/bookings/:id", async (req, res) => {
//   const events = await Event.find({ vendorId: req.params.id });
//   let bookedEvents = [];
//   for (let event in events) {
//     console.log(event);
//     if (events[event].bookings.length > 0) {
//       bookedEvents.push(events[event]);
//     }
//   }
//   if (bookedEvents) {
//     res.send(bookedEvents);
//   } else {
//     res.status(404).send({ message: "Event Not Found" });
//   }
// });

// api to get the image of the event
eventRouter.get("/uploads/:imageName", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, `../public/uploads/${req.params.imageName}`)
  );
});

// Add date of booking to the bookings list in the event object
// eventRouter.put("/addBookingDate/:id", async (req, res) => {
//   const { date } = req.body;
//   console.log(date, req.params.id);
//   try {
//     const event = await Event.findOne({ _id: req.params.id }); // event to which booking will be added
//     if (event) {
//       console.log(event);
//       event.bookings.push(date);
//       event.save((err) => {
//         if (err) {
//           console.log(err);
//           res.send({ message: "Unable to save booking" });
//         }
//       });
//       res.send({ message: "Booking saved", event: event });
//     }
//   } catch (err) {
//     console.log(err);
//     res.send({ message: "Server Error" });
//   }
// });

// new bookings
eventRouter.put("/addBookingDate/:id", async (req, res) => {
  try {
    const { date } = req.body;
    const { time } = req.body;

    const event = await Event.findOne({ _id: req.params.id }); // event to which booking will be added

    if (event) {
      //const index = event.bookings.indexOf(date); // check if the date already exists in the bookings array
      const index = event.bookings.findIndex((item) => item.date === date);
      if (index !== -1) {
        event.bookings[index].date = date;
        event.bookings[index].time.push(time);
        event.save();
        console.log(event);
        res.send({ message: "Booking saved", event: event });
      } else {
        // it means that booking of that date does not exist yet so we create a new data

        event.bookings.push({ date: date, time: [time] });

        event.save();
        console.log(event);
        res.send({ message: "Booking saved test", event: event });
      }
    } else {
      res.send({ message: "Event not found" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Server Error" });
  }
});
// retrieve the dates stored in the event
eventRouter.get("/getBookingDates/:id", async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id });
    if (event) {
      res.send({ message: "Dates retrieved", dates: event.bookings });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Server Error" });
  }
});

// Add special Arrangements to the event
eventRouter.put("/addSpecialArrangements/:id", async (req, res) => {
  const { arrangements } = req.body;
  try {
    const event = await Event.findOne({ _id: req.params.id });
    if (event) {
      // event.specialArrangements[0].push(arrangements);
      for (let i = 0; i < arrangements.length; i++) {
        event.specialArrangements.push(arrangements[i]);
      }
      event.save();
      res.send({ message: "Arrangements added", event: event });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Server Error" });
  }
});

// get special arrangements
eventRouter.get("/getSpecialArrangements/:id", async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id });
    if (event) {
      res.send({
        message: "Arrangements retrieved",
        arrangements: event.specialArrangements,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Server Error" });
  }
});

// api to filter by location
eventRouter.get("/near/t/:longitude/:latitude/:miles", async (req, res) => {
  console.log("Hell0");
  // res.send({ message: "Hello" });
  try {
    const { latitude, longitude, miles } = req.params;

    console.log("Latitude:", latitude, "Longitude:", longitude, miles);
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    const events = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(miles) * 1609.34, // 10 miles in meters
        },
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching events" });
  }
});

export default eventRouter;
