import React from "react";
import { Rating } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  reviews: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "5px",
  },
  review: {
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #ddd",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  reviewName: {
    margin: 0,
    fontSize: "18px",
  },
  reviewComment: {
    margin: 0,
  },
});

const Reviews = ({ reviews }) => {
  const classes = useStyles();

  return (
    <div className={classes.reviews}>
      {reviews.map((review, index) => (
        <div className={classes.review} key={index}>
          <div className={classes.reviewHeader}>
            <h3 className={classes.reviewName}>{review.name}</h3>
            <Rating value={review.rating} readOnly />
          </div>
          <p className={classes.reviewComment}>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
