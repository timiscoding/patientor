import React from "react";
import { Pagination, Responsive, PaginationProps } from "semantic-ui-react";

const Pager = (props: PaginationProps) => {
  return (
    <>
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Pagination
          {...props}
          boundaryRange={1}
          siblingRange={0}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
        />
      </Responsive>
      <Responsive minWidth={Responsive.onlyMobile.maxWidth}>
        <Pagination {...props} />
      </Responsive>
    </>
  );
};

export default Pager;
