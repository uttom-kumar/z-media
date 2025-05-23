import React from 'react';
import loading_icon from '../../public/images/loading_icon.svg'

const LoadingSkeleton = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center z-[99999999]"
      style={{background:"rgba(0,0,0,0.5)"}}>
        <img className="w-[80px] h-[80px]" src={loading_icon} alt=""/>
      </div>
    </div>
  );
};

export default LoadingSkeleton;