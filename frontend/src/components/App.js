import {Fragment, useState, useEffect } from 'react';
import './App.css';
import Header from './Header.js';
import Home from './Home.js';
import Login from './Login.js';
import AstMsg from './AstMsg.js';
import useWebSocket from 'react-use-websocket'
import {API_URL, WS_URL} from '../index.js';
import axios from 'axios';
import parseCookie from '../utils.js';

export default function App() {
    const [loading, setLoading] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [formUsername, setFormUsername] = useState();
    const [formPassword, setFormPassword] = useState();
    const [executors, setExecutors] = useState([]);
    const [error, setError] = useState();
    const [showAst, setShowAst] = useState(false);
    const [astMsg, setAstMsg] = useState('');
    const csrftoken = parseCookie('csrftoken')
    const [socketUrl, setSocketUrl] = useState(null);

    useEffect(() => {
        if(isLoggedIn) {
            fetch(API_URL + "/executors/", {headers: {'Content-Type:': 'application/json'}})
            .then(response => {
                if(response.ok) {
                    return response.json()
                } else if (response.status === 403) {
                    throw Error('Access denied')
                } else {
                    throw Error(`Something wrong: code ${response.status}`)
                }
            }).then(responseData => {
                setExecutors(responseData)
            })
            .catch(error => {
                console.log(error)
                if(error.message !== 'Access denied') setError('Error, see to console')
                setIsLoggedIn(false)
            })
        }
    }, [isLoggedIn])

    const submitHandler = e => {
        e.preventDefault();
        setLoading(true);
        fetch(
            API_URL + "/login",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    username: formUsername,
                    password: formPassword,
                })
            }
        )
        .then(response => {
            if(response.ok) {
                return response.json()
            } else {
                throw Error(`Something wrong: code ${response.status}`)
            }
        })
        .then(({key}) => {
            setIsLoggedIn(true)
            setError(null)
            setAstMsg('Success logged in')
            setShowAst(true)
            setSocketUrl(WS_URL)
        })
        .catch(error => {
            console.log(error)
            setAstMsg('NETWORK FATAL. Check console')
            setShowAst(true)
        })
        .finally(setLoading(false))
    }
    
    const resetState = () => {
        axios.get(API_URL + "/executors/").then(data => setExecutors(data.data))
    };
    
    useWebSocket(socketUrl, {
        onOpen: () => {
            console.log('WebSocket connection established.')
        },
        onMessage: (e) => {
            const msg = JSON.parse(e.data);
            if (msg['type'] === 'refresh') {
                setAstMsg('Refreshing list')
                setShowAst(true)
                resetState();
            }
        }
    });
    
    useEffect(() => {
        if(isLoggedIn) {
            setSocketUrl(WS_URL);
        } else {
            setSocketUrl(null);
        }
    }, [isLoggedIn]);
    
    return (
        <Fragment>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <AstMsg show={showAst} setShow={setShowAst} msg={astMsg} />
            { error? <p>{error}</p>: null }
            {isLoggedIn?
                error?
                    null
                :
                    <div>
                        <Home executors={executors} setExecutors={setExecutors} resetState={resetState} />
                    </div>
              :
                loading? 'Загрузка...' :
                <Login onSubmit={submitHandler} setFormUsername={setFormUsername} setFormPassword={setFormPassword} />
            }
        </Fragment>
    );
}
