import { useState } from 'react';
import Routes from '../configuration/routes/RouteList';
import getCookie from '../components/getCookie';
import { useNavigate } from 'react-router-dom';
import importColours from '../configuration/colours/getColours';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [saveLogin, setSaveLogin] = useState(false);
    const navigate = useNavigate();

    importColours('dark.css');

    const form_error = false;

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        const responseHead = await fetch('/api/csrf/', {
            method: 'HEAD',
        });

        console.log(responseHead);

        const body = new FormData();
        body.set('username', username);
        body.set('password', password);
        body.set('remember_me', saveLogin ? 'on' : 'off');

        const header = new Headers();

        const csrfCookie = getCookie('csrftoken');
        if (csrfCookie) {
            header.append('X-CSRFToken', csrfCookie);
            body.set('csrfmiddlewaretoken', csrfCookie);
        }

        const response = await fetch('http://localhost:8000/login/', {
            method: 'POST',
            body,
            credentials: 'include',
        });

        // TODO: replace with proper Api based handling?
        const signedIn = response.status === 200;

        if (signedIn) {
            navigate(Routes.Home);
        } else {
            navigate(Routes.Login);
        }
    };

    return (
        <>
            <div className="boxed-content login-page">
                <img alt="tube-archivist-logo" />
                <h1>Tube Archivist</h1>
                <h2>Your Self Hosted YouTube Media Server</h2>

                {form_error && <p className="danger-zone">Failed to login.</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        id="id_username"
                        placeholder="Username"
                        maxLength={150}
                        required={true}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        name="password"
                        id="id_password"
                        placeholder="Password"
                        required={true}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <br />
                    <p>
                        Remember me:{' '}
                        <input
                            type="checkbox"
                            name="remember_me"
                            id="id_remember_me"
                            checked={saveLogin}
                            onChange={() => {
                                setSaveLogin(!saveLogin);
                            }}
                        />
                    </p>
                    <input type="hidden" name="next" value={Routes.Home} />
                    <button type="submit">Login</button>
                </form>
                <p className="login-links">
                    <span>
                        <a
                            href="https://github.com/tubearchivist/tubearchivist"
                            target="_blank"
                        >
                            Github
                        </a>
                    </span>{' '}
                    <span>
                        <a
                            href="https://github.com/tubearchivist/tubearchivist#donate"
                            target="_blank"
                        >
                            Donate
                        </a>
                    </span>
                </p>
            </div>
            <div className="footer-colors">
                <div className="col-1"></div>
                <div className="col-2"></div>
                <div className="col-3"></div>
            </div>
        </>
    );
};

export default Login;
