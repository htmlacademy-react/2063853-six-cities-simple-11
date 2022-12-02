import { ChangeEvent, FormEvent, useCallback, useState, memo } from 'react';
import StarPicker from './star-picker';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getReviewSendingError, getReviewSendingStatus } from '../../store/offer-property-data/offer-property-data-selectors';
import { sendReviewAction } from '../../store/api-actions';

import { MIN_REVIEW_LENGTH, validateReviewForm} from '../../utiles/validation';
import { RATING_TITLES, InitialReviewState} from '../../const/review';

import { ReviewData } from '../../store/@types';

type ReviewFormProps = {
  offerId: number;
};

function ReviewsForm({offerId}: ReviewFormProps): JSX.Element {
  const [formData, setFormData] = useState<ReviewData>({
    id: offerId,
    ...InitialReviewState
  }
  );
  //стоит ли разбивать на два отдельных стейта, чтобы избежать перерисовки? или это незначительно?

  const dispatch = useAppDispatch();

  const isReviewSending = useAppSelector(getReviewSendingStatus);
  const isReviewSendingError = useAppSelector(getReviewSendingError);

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      comment: event.target.value
    });
  };

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      rating: +event.target.value
    });
  }, [formData]);

  const resetForm = () => {
    if(!isReviewSendingError) {
      setFormData({
        id: offerId,
        ...InitialReviewState
      } as ReviewData);
    }};

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if(validateReviewForm(formData)) {
      dispatch(sendReviewAction(formData));

      resetForm();
    }
  };

  return(
    <form
      className="reviews__form form"
      action="#"
      method="post"
      onSubmit={handleFormSubmit}
    >
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">

        {RATING_TITLES.map(({rating, title}) => (
          <StarPicker
            rating={rating}
            title={title}
            key={`${rating}-${title}`}
            onInputChange={handleInputChange}
            isDisabled={isReviewSending}
            isChecked={+rating === formData.rating}
          />
        )
        )}

      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formData.comment}
        onChange = {handleTextAreaChange}
        disabled={isReviewSending}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span>{' '}
            and describe your stay with at least{' '}
          <b className="reviews__text-amount">{MIN_REVIEW_LENGTH} characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isReviewSending}
        >
          {isReviewSending ? 'Sending...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default memo(ReviewsForm);
