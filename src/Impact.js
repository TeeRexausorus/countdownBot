import React from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "./styles.css";
import impact from './break.png';

const client = new W3CWebSocket('ws://127.0.0.1:8080');
const dimensions = [1920, 1080];
class Impact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {impacts: []};
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const TO_RADIANS = Math.PI/180;
    console.log('update');
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const img = this.refs.image;

    for (const impactsKey in this.state.impacts){
      const rotInRad = this.state.impacts[impactsKey].rotation * TO_RADIANS;
      const posX = this.state.impacts[impactsKey].X;
      const posY = this.state.impacts[impactsKey].Y + 560 > 1080 ? this.state.impacts[impactsKey].Y - ((1080 - 560) / 2) : this.state.impacts[impactsKey].Y;
      console.log(`${posX} ${posY}`);
      const x = (posX);
      const y = (posY);
      const width = img.width;
      const height = img.height;

      ctx.translate(x, y);
      ctx.rotate(rotInRad);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.rotate(-rotInRad);
      ctx.translate(-x, -y);
    }
  }

  componentWillMount() {
    let pathname = this.props.history.location.pathname.substring(1);

    client.onopen = () => {
      console.log('WebSocket Client Connected');
      client.send(`{"name": "${pathname}"}`);
    };
    client.onmessage = (message) => {
      const { data } = message;
      const parsedData = JSON.parse(data);
      const { impacts } = this.state;
      impacts.push(parsedData);
      this.setState({impacts: impacts});
      console.log(this.state.impacts);
    };
  }

  render() {
    return (
      <div>
        <canvas ref="canvas" width={dimensions[0]} height={dimensions[1]} />
        <img ref="image" src={impact} width='800' height='560' className="hidden"/>
      </div>
    );
  }
}
export default Impact;
