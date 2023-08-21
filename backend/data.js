import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Ammar",
      email: "ammar@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "Ahmed",
      email: "ahmed@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
  ],
  events: [
    {
      title: "Auditorium",
      author: "Colleen Hoover",
      slugs: "it-ends-with-us",
      category: "novel",
      image: "/images/b1.jpg",
      price: 10,
      stock: 12,
      rating: 0,
      numberOfReviews: 0,
      description:
        "Event an auditorium with a capacity of 1000 people and has the finest arrangements",
    },
    {
      title: "Wedding Event",
      author: "Nicholas Sparks",
      slugs: "the-wedding",
      category: "novel",
      image: "/images/b2.jpg",
      price: 13,
      stock: 10,
      rating: 0,
      numberOfReviews: 0,
      description:
        " Our Premium Venues. At Crestwood, we provide the perfect setting for your wedding, corporate retreat, or private event. We can host events in a variety of ... ",
    },
    {
      title: "Poop Party",
      author: "John Green",
      slugs: "turtles-all-the-way-down",
      category: "Pool Party",
      image: "/images/b3.jpg",
      price: 9,
      stock: 22,
      rating: 0,
      numberOfReviews: 0,
      description:
        "Perfect place to event for if you want a Poop party arranged in the midst of Summer heat",
    },
    {
      title: "Farm House",
      author: "Colleen Hoover",
      slugs: "Farm House",
      category: "Farm House",
      image: "/images/b4.jpg",
      price: 10,
      stock: 0,
      rating: 0,
      numberOfReviews: 0,
      description: "Event a farm house.",
    },
  ],
};

export default data;
