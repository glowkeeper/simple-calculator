import React from 'react';

export const About = () => (
  <section className="about" aria-labelledby="about-heading">
    <h2 id="about-heading">How it works</h2>
    <p>
      A calculator is a good excuse to build the classic data structures by hand. Nothing here
      uses <code>eval</code> or a maths library.
    </p>
    <dl>
      <div>
        <dt>Linked list stack</dt>
        <dd>Holds operators while parsing, and operands while evaluating.</dd>
      </div>
      <div>
        <dt>Doubly linked list queue</dt>
        <dd>Collects the output of the parser, in order, ready for evaluation.</dd>
      </div>
      <div>
        <dt>Shunting yard</dt>
        <dd>Respects operator precedence, associativity and brackets.</dd>
      </div>
    </dl>
    <p className="built-with">
      Built with{' '}
      <a href="https://react.dev/">React</a>, <a href="https://vite.dev/">Vite</a> and{' '}
      <a href="https://jasmine.github.io/">Jasmine</a>.
    </p>
  </section>
);
