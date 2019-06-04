import { useEffect, useState } from 'react';

const defaultPosition = {
  width: 10,
  height: 10,
  right: 0,
  bottom: 0,
  left: 0,
  top: 0,
  x: 9999,
  y: 9999,
};
// see how to make this person more smart
// for example checking for siblings ( no point in going further)
function isItselfOrContains(node, container) {
  while (node) {
    if (node === container) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

// based on https://stackoverflow.com/questions/8339857/how-to-know-if-selected-text-is-inside-a-specific-div
function elContainsTextSelection(textSelectionObj, el) {
  const ts = textSelectionObj;
  if (!ts.rangeCount > 0) return;

  for (let i = 0; i < ts.rangeCount; i++) {
    if (!isItselfOrContains(ts.getRangeAt(i).commonAncestorContainer, el))
      return;
  }

  return true;
}

/**
 * 🐨. If someone doesn't want to limit the selection to
 * a particular element (no ref is provided) prevent necessitating ref
 * and don't run elContainsTextSelection
 */
function useTextSelection(ref) {
  const [text, setText] = useState('');
  const [position, setPosition] = useState(defaultPosition);
  const [shouldDoSomethingAboutText, setShouldDoSomethingAboutText] = useState(
    false,
  );

  const resetStates = () => {
    setText('');
    setPosition(defaultPosition);
    setShouldDoSomethingAboutText(false);
  };

  useEffect(() => {
    const el = ref && ref.current;

    if (!el instanceof HTMLElement) {
      resetStates();
      return;
    } // do we need this at all ?
    if (!window.getSelection) {
      resetStates();
      return;
    }

    function selectionHandler(e) {
      const textSelectionObj = window.getSelection();
      const totalText = textSelectionObj.toString();

      requestAnimationFrame(() => {
        // added this check, because an error similar to this — https://stackoverflow.com/questions/22935320/uncaught-indexsizeerror-failed-to-execute-getrangeat-on-selection-0-is-not was coming
        if (textSelectionObj.rangeCount > 0) {
          setPosition(textSelectionObj.getRangeAt(0).getBoundingClientRect());
        }
      });
      if (!totalText) {
        resetStates();
        return;
      } // selected text is an empty string

      const containedTextSelection = elContainsTextSelection(
        textSelectionObj,
        el,
      );

      setShouldDoSomethingAboutText(containedTextSelection);

      if (!containedTextSelection) {
        resetStates();
        return;
      }

      // 🐨 calculation to find total text
      const refinedText = totalText; // replace this line to do 🐨

      setText(refinedText);
    }

    // no onSelectionChange event provided by react
    // https://github.com/facebook/react/issues/5785
    // https://github.com/facebook/react/pull/10746,
    document.addEventListener('selectionchange', selectionHandler);

    return () => el.removeEventListener('selectionchange', selectionHandler);
  }, [ref]);

  return {
    text,
    position,
    setText,
    setPosition,
    defaultPosition,
    shouldDoSomethingAboutText,
    setShouldDoSomethingAboutText,
  };
}

export default useTextSelection;
