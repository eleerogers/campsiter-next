import React, { PropsWithChildren } from 'react';
import ReactRating from './imports/reactRating'
import StarEmpty from 'react-bootstrap-icons/dist/icons/star';
import StarFill from 'react-bootstrap-icons/dist/icons/star-fill';


interface Props {
  currRating: number,
  handleChange?: (rating: number) => void,
  readonly: boolean,
  className: string,
  divClassName: string,
  numRatings?: number
}

interface RatingProps {
  fractions: number,
  initialRating: number,
  onChange: ((rating: number) => void) | undefined,
  emptySymbol: JSX.Element,
  fullSymbol: JSX.Element,
  readonly: boolean
}
const Rating = ReactRating as unknown as React.FC<PropsWithChildren<RatingProps>>

function StarRating({
    currRating,
    handleChange,
    readonly,
    className,
    divClassName,
    numRatings
  }: Props): JSX.Element {
  return (
    <div className={`flex flex-wrap align-end ${divClassName}`}>
      <Rating
        fractions={1}
        initialRating={currRating}
        onChange={handleChange}
        emptySymbol={<StarEmpty className={className} />}
        fullSymbol={<StarFill className={className} />}
        readonly={readonly}
      />
      { numRatings && <div className="ml-1"><i> (total reviews: {numRatings})</i></div> }
    </div>
  )
}

export default StarRating;
