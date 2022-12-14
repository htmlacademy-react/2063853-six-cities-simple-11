import {Helmet} from 'react-helmet-async';

import MainContent from '../../components/main-content/main-content';
import Header from '../../components/header/header';
import type { MainScreenProps } from '../../components/main-content/main-content';

function MainScreen({cities}: MainScreenProps): JSX.Element {
  return (
    <div className="page page--gray page--main">
      <Helmet>
        <title>Six cities. Main page</title>
      </Helmet>
      <Header />
      <MainContent cities={cities}/>
    </div>
  );
}

export default MainScreen;
