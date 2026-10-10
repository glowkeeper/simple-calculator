import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { App } from './App';

let container;
let root;

const button = (value) =>
  [...container.querySelectorAll('input[type="button"]')]
    .find((element) => element.value === value);

const click = (...values) => {
  values.forEach((value) => {
    act(() => {
      button(value).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    });
  });
};

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(<App />);
  });
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

test('enters an expression and displays its result', () => {
  click('2', '+', '3');
  expect(container.querySelector('#display').value).toBe('2 + 3');

  click('=');
  expect(container.querySelector('#display').value).toBe('5');
});

test('wraps the current expression in parentheses', () => {
  click('2', '+', '3', '()');
  expect(container.querySelector('#display').value).toBe('(2 + 3)');
});

test('backspace removes the final character', () => {
  click('1', '2', '⌫');
  expect(container.querySelector('#display').value).toBe('1');
});

test('all clear resets both an expression and a previous answer', () => {
  click('4', '*', '5', '=');
  expect(container.querySelector('#display').value).toBe('20');

  click('AC');
  expect(container.querySelector('#display').value).toBe('');
});

test('displays a zero result', () => {
  click('1', '-', '1', '=');
  expect(container.querySelector('#display').value).toBe('0');
});

test('displays an error for an incomplete expression', () => {
  click('2', '+', '=');
  expect(container.querySelector('#display').value).toBe('Error');
});

test('provides accessible names for the display and symbol controls', () => {
  expect(container.querySelector('#display').getAttribute('aria-label'))
    .toBe('Calculator display');
  expect(button('()').getAttribute('aria-label')).toBe('Wrap in parentheses');
  expect(button('⌫').getAttribute('aria-label')).toBe('Backspace');
});

describe('accessibility state', () => {
  test('announces display changes politely', () => {
    expect(container.querySelector('#display').getAttribute('aria-live'))
      .toBe('polite');
  });
});

describe('tape and workings', () => {
  const tapeEntries = () => [...container.querySelectorAll('.tape-entry')];

  test('shows an explanation until something has been calculated', () => {
    expect(container.querySelector('.workings').textContent).toContain('shunting yard');
    expect(container.querySelector('.tape').textContent).toContain('will be printed here');
  });

  test('shows the working and tape entry once a sum is calculated', () => {
    click('2', '+', '3', '=');
    expect(container.querySelector('.workings').textContent).toContain('Reverse Polish notation');
    expect(tapeEntries().length).toBe(1);
    expect(tapeEntries()[0].textContent).toContain('2 + 3');
    expect(tapeEntries()[0].textContent).toContain('= 5');
  });

  test('does not record or explain a malformed sum', () => {
    click('2', '+', '=');
    expect(container.querySelector('#display').value).toBe('Error');
    expect(tapeEntries().length).toBe(0);
    expect(container.querySelector('.working')).toBeNull();
  });

  test('keeps the newest entry first and can clear the tape', () => {
    click('1', '+', '1', '=', '2', '*', '3', '=');
    expect(tapeEntries()[0].textContent).toContain('2 × 3');

    act(() => {
      [...container.querySelectorAll('.link-button')].find((b) => b.textContent === 'Clear')
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(tapeEntries().length).toBe(0);
  });

  test('recalling a tape entry shows its answer and working again', () => {
    click('1', '+', '1', '=', '2', '*', '3', '=');
    act(() => {
      tapeEntries()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(container.querySelector('#display').value).toBe('2');
    expect(container.querySelector('.result').textContent).toContain('2');
  });

  test('AC clears the working but keeps the tape', () => {
    click('2', '+', '3', '=', 'AC');
    expect(container.querySelector('.working')).toBeNull();
    expect(tapeEntries().length).toBe(1);
  });
});
