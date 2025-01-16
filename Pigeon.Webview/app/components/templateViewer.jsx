import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip'

export default function TemplateViewer({ title, body }) {
  const [highlightedText, setHighlightedText] = useState('');
  const [highlightedList, setHighlightedList] = useState([]);

  useEffect(() => {
    highlightText(body);
  }, [body]);

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

  return (
    <div>
      <div className="rounded-tr-lg rounded-tl-lg flex-row flex p-1 bg-gray-800 border-t border-l border-r border-gray-500">
        <div className="ml-2 mt-1 mb-1" data-tooltip-id="tooltip" data-tooltip-content="Provide Parameters Within {}(curly braces)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </div>
        <Tooltip id="tooltip" />
        <div className="text-gray-500 ml-1.5 font-mono text-sm mt-">TemplateText (Read-Only)</div>
        <div className="text-gray-500 ml-1.5 font-mono text-sm ml-10 font-semibold">{title}</div>
      </div>
      <div
        className="border-gray-500 border-l border-t border-r p-2 focus:outline-none"
        style={{ whiteSpace: 'pre-wrap', width: '600px', overflowX: 'auto' }}
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      ></div>
      <div className="border-gray-500 flex-row flex p-2 font-mono text-sm bg-gray-900 border p-2 rounded-br-lg rounded-bl-lg focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" data-tooltip-id="parameters" data-tooltip-content="Parameters" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.745 3A23.933 23.933 0 0 0 3 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402l2.402 7.206a.75.75 0 0 0 1.104.401l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09" />
        </svg>
        <Tooltip id="parameters" />
        :
        {" " + highlightedList.join(', ')}
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