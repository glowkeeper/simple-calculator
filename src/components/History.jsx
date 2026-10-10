import React from 'react';

import { pretty } from '../utils/format.mjs';

export const History = ({ entries, onRecall, onClear }) => (
  <section className="panel tape" aria-labelledby="tape-heading">
    <div className="panel-heading">
      <h2 id="tape-heading">Tape</h2>
      {entries.length > 0 && (
        <button type="button" className="link-button" onClick={onClear}>Clear</button>
      )}
    </div>
    {entries.length === 0 ? (
      <p className="empty">Your calculations will be printed here.</p>
    ) : (
      <ol className="tape-list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className="tape-entry"
              title="Show the working again"
              onClick={() => onRecall(entry)}
            >
              <span className="tape-expression">{pretty(entry.expression)}</span>
              <span className="tape-answer">= {pretty(entry.answer)}</span>
            </button>
          </li>
        ))}
      </ol>
    )}
  </section>
);
