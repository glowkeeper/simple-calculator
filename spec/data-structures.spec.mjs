/* eslint-disable no-undef */
import { queue } from '../src/utils/queue.mjs';
import { stack } from '../src/utils/stack.mjs';

describe('queue', () => {
    it('preserves first-in, first-out order', () => {
        const subject = queue();
        subject.enQueue('first');
        subject.enQueue('second');

        expect(subject.front()).toBe('first');
        expect(subject.back()).toBe('second');
        expect(subject.deQueue()).toBe('first');
        expect(subject.getSize()).toBe(1);
        expect(subject.toArray()).toEqual(['second']);
    });

    it('handles empty queue operations safely', () => {
        const subject = queue();

        expect(subject.deQueue()).toBeNull();
        expect(subject.front()).toBeNull();
        expect(subject.back()).toBeNull();
        expect(subject.getSize()).toBe(0);
    });

    it('resets both ends after removing the final item', () => {
        const subject = queue();
        subject.enQueue('only');

        expect(subject.deQueue()).toBe('only');
        expect(subject.front()).toBeNull();
        expect(subject.back()).toBeNull();
        expect(subject.getSize()).toBe(0);
    });
});

describe('stack', () => {
    it('preserves last-in, first-out order', () => {
        const subject = stack();
        subject.push('first');
        subject.push('second');

        expect(subject.top()).toBe('second');
        expect(subject.pop()).toBe('second');
        expect(subject.getSize()).toBe(1);
        expect(subject.toArray()).toEqual(['first']);
    });

    it('returns null when peeking at an empty stack', () => {
        expect(stack().top()).toBeNull();
    });

    it('handles popping an empty stack safely', () => {
        const subject = stack();

        expect(subject.pop()).toBeNull();
        expect(subject.getSize()).toBe(0);
    });
});
