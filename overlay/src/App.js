import logo from './logo.svg';
import './App.css';

function App() {
    componentWillMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            console.log(message);
        };
    }

    return (
    <div className="App">
    </div>
  );
}

export default App;
