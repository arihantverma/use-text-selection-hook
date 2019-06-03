import React, { useRef, forwardRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Popper } from 'react-popper';
import Foco from 'react-foco';

import SelectedTextPopper from './SelectedTextPopper';
import useTextSelection from './hooks/useTextSelection';
import useShowPopper from './hooks/useShowPopper';

import './styles.css';

class VirtualReference {
  constructor(position) {
    this.position = position;
  }
  getBoundingClientRect() {
    return this.position;
  }

  get clientWidth() {
    return this.getBoundingClientRect().width;
  }

  get clientHeight() {
    return this.getBoundingClientRect().height;
  }
}

// const SuperSpan = ({ children }) => <span>{children}</span>;

const Paragraph = forwardRef((props, ref) => (
  <section ref={ref}>
    <h1>Hey KENT!</h1>
    <h2>Start Selecting This Tasty 🍉</h2>
  </section>
));

const ShareToolTip = () => (
  <span style={{ background: 'grey' }}>Share On Twitter</span>
);
// <div id="pop" role="tooltip">
//   <i className="fa fa-bold"></i>
//   <i className="fa fa-italic"></i>
//   <i className="fa fa-link"></i>
//   <i>Share On Twitter</i>
//   <div className="x-arrow"></div>
// </div>

function App() {
  const paragraphRef = useRef();
  const [popperRef, setPopperRef] = useState();
  const {
    text,
    position,
    setText,
    setPosition,
    defaultPosition,
  } = useTextSelection(paragraphRef, popperRef);
  const { shouldShowPopper, setShouldShowPopper } = useShowPopper();
  const [mPos, setmPos] = useState();

  const onOutsideGoingHandler = () => {
    setText('');
    setPosition(defaultPosition);
    setShouldShowPopper(false);
  };

  const virtualReferenceElement = new VirtualReference(position);

  return (
    <div className="App">
      <Paragraph ref={paragraphRef} />

      <Foco
        onClickOutside={onOutsideGoingHandler}
        onTouchStart={onOutsideGoingHandler}
        onMouseDown={onOutsideGoingHandler}
      >
        <Popper referenceElement={virtualReferenceElement} placement="top">
          {({ ref, style, placement, arrowProps }) => {
            setPopperRef(ref.current);
            return (
              <div ref={ref} style={style} data-placement={placement}>
                {text && shouldShowPopper ? <ShareToolTip /> : null}
                <div ref={arrowProps.ref} style={arrowProps.style} />
              </div>
            );
          }}
        </Popper>
      </Foco>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
