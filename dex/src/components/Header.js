import React from 'react'
import idx_logo from "../idx_logo.png";
import canto_logo from "../canto_logo.png";
import {Link} from "react-router-dom";

function Header(props) {

  const {address, isConnected, connect} = props;

  return (
    <header>
      <div className='leftH'>
        <Link to="/" className='link'>
          <img src={idx_logo} alt="idx_logo" className='logo'/>
        </Link>
        <Link to="/" className='link'>
          <div className='headerItem'>Factory</div>
        </Link>
        <Link to="/indexes" className='link'>
          <div className='headerItem'>Indexes</div>
        </Link>
        <Link to="/swap" className='link'>
          <div className='headerItem'>Swap</div>
        </Link>
      </div>

      <div className='rightH'>
        <div className='headerItem'>
          <img src={canto_logo} alt="canto_logo" className='canto' />
          Canto
        </div>
        <div className="connectButton" onClick={connect}>
          {isConnected ? (address.slice(0,4) +"..." +address.slice(38)) : "Connect"}
        </div>
      </div>

    </header>
  )
}

export default Header