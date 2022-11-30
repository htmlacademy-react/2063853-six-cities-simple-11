import { memo } from 'react';
import { useState, useEffect, MouseEvent} from 'react';
import { SORT_OPTIONS } from '../../const/sort-type';
import { useAppDispatch } from '../../hooks';
import { changeSort } from '../../store/offers-process/offers-process';

import type { SortEnum } from '../../const/@types';

type SortOptionsProps = {
  selectedSortOption: SortEnum;
}

function SortOptions({selectedSortOption}: SortOptionsProps): JSX.Element {

  const [isOpened, setIsOpened] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if(isOpened) {
      document.addEventListener('keydown', handleEventKeydown);
    }

    return () => document.removeEventListener('keydown', handleEventKeydown);
  }, [isOpened]);

  const handleEventKeydown = (event: KeyboardEvent) => {
    if(event.key.startsWith('Esc')) {
      event.preventDefault();

      setIsOpened(false);
    }
  };

  const handleSpanClick = () => {
    setIsOpened(!isOpened);
  };

  const handleSortOptionClick = (event: MouseEvent<HTMLUListElement>) => {
    const selectedOption = event.target as HTMLLIElement;
    dispatch(changeSort(selectedOption.textContent as SortEnum));

    //setIsOpened(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">
      Sort by
      </span> {' '}
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleSpanClick}
      >
        {selectedSortOption}
        <svg className="places__sorting-arrow" width={7} height={4}>
          <use xlinkHref="#icon-arrow-select" />
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${isOpened ? 'places__options--opened' : ''}`}
        onClick={handleSortOptionClick}
      >

        {SORT_OPTIONS.map((option, index)=> {
          const keyValue = `${option}-${index}`;

          return (
            <li
              key={keyValue}
              className={`places__option ${option === selectedSortOption ? 'places__option--active' : ''}`}
              tabIndex={0}

            >
              {option}
            </li>);
        })}
      </ul>
    </form>
  );
}
//TODO закрытие по клику вне меню
export default memo(SortOptions);