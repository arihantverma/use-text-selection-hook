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
  <span style={{ background: 'grey' }}>
    <a href="https://google.com">Share On Twitter</a>
  </span>
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
  const [mousePos, setMousePos] = useState();
  const {
    text,
    position,
    setText,
    setPosition,
    defaultPosition,
    shouldDoSomethingAboutText,
    setShouldDoSomethingAboutText,
  } = useTextSelection(paragraphRef);
  const { shouldShowPopper, setShouldShowPopper } = useShowPopper();
  const [mPos, setmPos] = useState();

  const onOutsideGoingHandler = () => {
    console.log('outside click handler fired');
    setText('');
    setPosition(defaultPosition);
    setShouldShowPopper(false);
    setShouldDoSomethingAboutText(false);
  };

  useEffect(() => {
    const onmousemoveHandler = event => {
      var eventDoc, doc, body;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0);
      }

      setMousePos({
        mouseX: event.pageX,
        mouseY: event.pageY,
      });
    };
    document.addEventListener('onmousemove', onmousemoveHandler);

    return () =>
      document.removeEventListener('onmousemove', onmousemoveHandler);
  }, []);

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
                {text && (shouldShowPopper && shouldDoSomethingAboutText) ? (
                  <ShareToolTip />
                ) : null}
                <div ref={arrowProps.ref} style={arrowProps.style} />
              </div>
            );
          }}
        </Popper>

        <pre style={{ textAlign: 'left', width: '500px', margin: '0 auto' }}>
          {JSON.stringify(position, null, 2)}
        </pre>

        <h2>Mouse Position</h2>

        <pre style={{ textAlign: 'left', width: '500px', margin: '0 auto' }}>
          {JSON.stringify(mousePos, null, 2)}
        </pre>
      </Foco>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
