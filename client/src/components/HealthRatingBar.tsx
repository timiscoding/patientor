import React from "react";
import { Rating, Popup } from "semantic-ui-react";

type BarProps = {
  rating: number;
};

const HEALTHBAR_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition",
];

const HealthRatingBar = ({ rating }: BarProps) => {
  return (
    <div className="health-bar">
      <Popup
        content={HEALTHBAR_TEXTS[rating]}
        size="mini"
        inverted
        basic
        trigger={
          <Rating icon="heart" disabled rating={4 - rating} maxRating={4} />
        }
      />
    </div>
  );
};

export default HealthRatingBar;
