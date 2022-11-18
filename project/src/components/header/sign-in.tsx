import { Link } from 'react-router-dom';
import {AppRoute} from '../../const/app-route';

function SignIn(): JSX.Element {
  return (
    <li className="header__nav-item">
      <Link className="header__nav-link" title="To the login page" to={AppRoute.Login}>
        <span className="header__signout">Sign in</span>
      </Link>
    </li>
  );
}

export default SignIn;
