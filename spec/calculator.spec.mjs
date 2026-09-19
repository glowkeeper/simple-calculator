/* eslint-disable no-undef */
import { calculate } from '../src/utils/calculate.mjs';

describe('calculate', () => {
    describe('basic arithmetic', () => {
        const examples = [
            ['3 + 4 + 6', 13],
            ['15 - 4 - 2', 9],
            ['50 / 5 / 2', 5],
            ['3 * 3 * 3', 27],
            ['3.5 + 2.25', 5.75],
            ['42', 42]
        ];

        for (const [expression, expected] of examples) {
            it(`evaluates ${expression}`, () => {
                expect(calculate(expression)).toBe(expected);
            });
        }
    });

    describe('precedence and associativity', () => {
        it('applies multiplication before addition', () => {
            expect(calculate('3 + 4 * 5')).toBe(23);
        });

        it('honours parentheses', () => {
            expect(calculate('(3 + 4) * 5')).toBe(35);
        });

        it('supports nested parentheses', () => {
            expect(calculate('2 * (3 + (4 * 5))')).toBe(46);
        });

        it('evaluates subtraction from left to right', () => {
            expect(calculate('20 - 5 - 3')).toBe(12);
        });

        it('evaluates exponentiation from right to left', () => {
            expect(calculate('2 ^ 3 ^ 2')).toBe(512);
        });

        it('ignores whitespace', () => {
            expect(calculate(' 2\t* ( 3 + 4 ) ')).toBe(14);
        });
    });

    describe('non-results', () => {
        it('returns null for an empty expression', () => {
            expect(calculate('')).toBeNull();
        });

        it('returns null for a whitespace-only expression', () => {
            expect(calculate('   ')).toBeNull();
        });

        it('returns null for division by zero', () => {
            expect(calculate('1 / 0')).toBeNull();
        });

        it('returns null when the result overflows', () => {
            expect(calculate('10 ^ 1000')).toBeNull();
        });

        const malformedExpressions = [
            '2 +',
            '2 + 3)',
            '(2 + 3',
            '2..3 + 1',
            '2abc + 3',
            '2 + * 3',
            '()',
            '2 3'
        ];

        for (const expression of malformedExpressions) {
            it(`returns null for malformed expression: ${expression}`, () => {
                expect(calculate(expression)).toBeNull();
            });
        }

        it('returns null for non-string input', () => {
            expect(calculate(null)).toBeNull();
        });
    });
});
