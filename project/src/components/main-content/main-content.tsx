import { useState } from 'react';

import OffersListCity from '../offers-list-city/offers-list-city';
import CitiesList from '../cities-list/cities-list';
import LoadingScreen from '../../pages/loading-screen/loading-screen';
import Map from '../map/map';
import SortOptions from '../sort/sort-options';
import OffersListEmpty from '../offers-list-empty/offers-list-empty';
import { sortPriceHightToLow, sortPriceLowToHight, sortRatingHightToLow, sortDefault } from '../../utiles/sort-compare';

import { SortType } from '../../const/sort-type';
import type {City, Offer} from '../../@types/offer-types';
import type { SortEnum } from '../../const/@types';
import { useAppSelector } from '../../hooks';
import { getCity, getSort } from '../../store/offers-process/offers-process-selectors';
import { getAllOffers, getOffersLoadingStatus } from '../../store/offers-data/offers-data-selectors';

type MainContentProps = {
  cities: City[];
};

function getSortCompare(sortOption: SortEnum) {
  switch(sortOption) {
    case SortType.PriseLowToHight:
      return sortPriceLowToHight;
    case SortType.PriceLowToHight:
      return sortPriceHightToLow;
    case SortType.TopRatedFirst:
      return sortRatingHightToLow;
    case SortType.Popular:
      return sortDefault;

    default:
      return sortDefault;
  }
}

function MainContent({cities}: MainContentProps): JSX.Element {
  const selectedCity = useAppSelector(getCity);
  const selectedSortOption = useAppSelector(getSort);
  const isOffersDataLoading = useAppSelector(getOffersLoadingStatus);

  function findOffersByCityName(offer: Offer) {
    return offer.city.name === selectedCity.name;
  }
  const allOffers = useAppSelector(getAllOffers);

  const offers = allOffers.filter(findOffersByCityName).sort(getSortCompare(selectedSortOption));
  const offersCount = offers.length;

  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);

  const onOfferCardHover = (offerId: number | undefined) => {
    const currentOffer = offers.find((offer) => offer.id === offerId) ?? null;

    setActiveOffer(currentOffer);
  };

  return(
    (isOffersDataLoading) ? <LoadingScreen/> :
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList
              cities={cities}
              selectedCity={selectedCity}
            />
          </section>
        </div>
        <div className="cities">
          {!offersCount ?
            <OffersListEmpty/> :
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found"> {offersCount} places to stay in {selectedCity.name}</b>
                <SortOptions/>
                <OffersListCity
                  onOfferHover={onOfferCardHover}
                  offers={offers}
                />
              </section>
              <div className="cities__right-section">
                <Map
                  city={selectedCity}
                  offers={offers}
                  currentOffer={activeOffer}
                  isCityMap
                />
              </div>
            </div>}
        </div>
      </main>
  );
}

export default MainContent;
export type { MainContentProps as MainScreenProps };
