import React from "react";
import { Rating, Popup, RatingProps } from "semantic-ui-react";

type BarProps = {
  rating: number;
  size?: RatingProps["size"];
};

const HEALTHBAR_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition",
];

const HealthRatingBar = ({ rating }: BarProps) => {
  return (
    <Popup
      content={HEALTHBAR_TEXTS[rating]}
      size="mini"
      inverted
      basic
      trigger={
        <Rating
          icon="heart"
          size="mini"
          disabled
          rating={4 - rating}
          maxRating={4}
        />
      }
    />
  );
};

export default HealthRatingBar;
