import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';
import { If } from 'react-if'

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: [],
      volume: 0,
    }
  }
  componentDidMount() {
    let payload = this.props.payload;
    let tyres = payload.tyres;
    tyres.forEach(el => {
      el.diameter = (el.width * (el.aspect_ratio/100)*2) + (el.rim_diameter * 25.4);
      el.weight = el.weight;
      el.remaing = el.number;
    })
    var result = startCalculate(payload.container, tyres);
    var volume = result.volume.tyres/result.volume.container*100;
    this.setState({
      layers: result.layers,
      volume: volume,
    })
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card animated fadeInUp">
            <div className="card-body">
              <h2 className="card-title">Loading sequence</h2>
              <div className="row" style={{marginTop:20}}>
                <div className="col-sm-6">
                </div>
                <div className="col-sm-6">
                  <h4 style={{float:'right'}}>{this.state.volume.toFixed(0)}% Volume of space utilzed</h4>
                </div>
                <div id="table-result">
                  {this.printLayers()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  printLayers() {
    return this.state.layers.map((layer, key)=> {
      return(
        <div className="layer" key={key}>
          <div className="layer-header">{"Layer " + (key+1)}</div>
          {this.printLayer(layer.reverse())}
        </div>
      )
    })
  }
  printLayer(layer) {
    return layer.map((row, key) => {
      return(
        <div key={key} className="layer-rows">
          {this.printRow(row)}
        </div>
      )
    });
  }
  printRow(row) {
    return row.map((tyre, key) => {
      var width = tyre.size.x/this.props.payload.container.width*100+'%';
      return(
        <div className={tyre.type==0?"layer-row":"layer-row layer-cross"} key={key} style={{background:tyre.color,width:width}}>
          {tyre.model.toUpperCase()}
        </div>
      )
    })
  }
  getMaxTyres(layer) {
    var len = 0;
    layer.forEach(row => {
      if(row.length > len) {
        len = row.length;
      }
    });
    return len;
  }
}

export default Result;
