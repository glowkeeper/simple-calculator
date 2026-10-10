import React from 'react';

import { pretty } from '../utils/format.mjs';

const Chips = ({ items, empty = "empty" }) => (
  items.length
    ? items.map((item, index) => <span className="chip" key={index}>{pretty(item)}</span>)
    : <span className="chip chip-empty">{empty}</span>
);

export const Workings = ({ working }) => (
  <section className="panel workings" aria-labelledby="workings-heading">
    <div className="panel-heading">
      <h2 id="workings-heading">Under the hood</h2>
    </div>

    {!working ? (
      <div className="empty">
        <p>
          Enter a sum and press <strong>=</strong> to see how it is worked out.
        </p>
        <p>
          The calculator turns your infix expression into reverse Polish notation with
          Dijkstra&apos;s shunting yard algorithm, using a <em>queue</em> for the output and a{' '}
          <em>stack</em> for operators. A second stack then evaluates the result. Both are
          hand-built linked lists.
        </p>
      </div>
    ) : (
      <div className="working" aria-live="polite">
        <h3>1. Tokens</h3>
        <div className="chips"><Chips items={working.tokens} /></div>

        <h3>2. Shunting yard</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Output queue</th>
                <th scope="col">Operator stack</th>
                <th scope="col">What happened</th>
              </tr>
            </thead>
            <tbody>
              {working.parsing.map((step, index) => (
                <tr key={index}>
                  <th scope="row">{step.token === null ? 'end' : pretty(step.token)}</th>
                  <td><Chips items={step.output} /></td>
                  <td><Chips items={step.stack} /></td>
                  <td>{pretty(step.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3. Reverse Polish notation</h3>
        <div className="chips"><Chips items={working.rpn} /></div>

        <h3>4. Evaluation</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Stack</th>
                <th scope="col">What happened</th>
              </tr>
            </thead>
            <tbody>
              {working.evaluation.map((step, index) => (
                <tr key={index}>
                  <th scope="row">{pretty(step.token)}</th>
                  <td><Chips items={step.stack} /></td>
                  <td>{pretty(step.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="result">Answer: <strong>{pretty(working.answer)}</strong></p>
      </div>
    )}
  </section>
);
