import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip'

export default function TemplateEditor({ text, setText }) {
  const [highlightedText, setHighlightedText] = useState('');
  const [highlightedList, setHighlightedList] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    highlightText(text);
  }, [text]);

  const handleInputChange = (e) => {
    const newText = e.target.innerText;
    setText(newText);
    onChange(newText);
  };

  const highlightText = (text) => {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;
    let highlighted = text.replace(regex, (match, p1) => {
      matches.push(p1);
      return `<span class="highlight">${match}</span>`;
    });
    setHighlightedText(highlighted);
    setHighlightedList(matches);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(editorRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;

      return {
        start: start,
        end: start + range.toString().length
      };
    }
    return null;
  };

  const restoreSelection = (savedSel) => {
    const charIndex = { start: 0, end: 0 };
    const nodeStack = [editorRef.current];
    let node, foundStart = false, stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        const nextCharIndex = charIndex.start + node.length;
        if (!foundStart && savedSel.start >= charIndex.start && savedSel.start <= nextCharIndex) {
          const range = document.createRange();
          range.setStart(node, savedSel.start - charIndex.start);
          if (savedSel.end <= nextCharIndex) {
            range.setEnd(node, savedSel.end - charIndex.start);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            stop = true;
          }
          foundStart = true;
        }
        charIndex.start = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }
  };

  useEffect(() => {
    const savedSel = saveSelection();
    if (editorRef.current) {
      editorRef.current.innerHTML = highlightedText;
    }
    if (savedSel) {
      restoreSelection(savedSel);
    }
  }, [highlightedText]);

  return (
    <div>
        <div className="rounded-tr-lg rounded-tl-lg flex-row flex p-1 bg-gray-800 border-t border-l border-r border-gray-500">
            <div className="ml-2 mt-1 mb-1" data-tooltip-id="tooltip" data-tooltip-content="Provide Parameters Within {}(curly braces)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </div>
            <Tooltip id="tooltip" />

            <div className="text-gray-500 ml-1.5 font-mono text-sm mt-">TemplateText</div>



        </div>
      <div
        ref={editorRef}
        contentEditable
        className="border-gray-500 border-l border-t border-r p-2 focus:outline-none"
        style={{ whiteSpace: 'pre-wrap', width: '600px', overflowX: 'auto' }}
        onInput={handleInputChange}
      ></div>
      <div className="border-gray-500 flex-row flex p-2 font-mono text-sm bg-gray-900 border p-2 rounded-br-lg rounded-bl-lg focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" data-tooltip-id="parameters" data-tooltip-content="Parameters" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.745 3A23.933 23.933 0 0 0 3 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402l2.402 7.206a.75.75 0 0 0 1.104.401l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09" />
        </svg>
        <Tooltip id="parameters" />

        :
        {" "+highlightedList.join(', ')}
      </div>
      <style jsx>{`
        .highlight {
          background-color: green;
          color: white;
        }
      `}</style>
    </div>
  );
}