/* eslint-disable no-undef */
import { calculate } from '../src/utils/calculate.mjs';

describe('addition', function() {
    it('correctly adds', function() {
        const answer = calculate("3 + 4 + 6");
        expect(answer).toEqual(13);
    })
})

describe('subtraction', function() {
    it('correctly subtracts', function() {
        const answer = calculate("15 - 4 - 2");
        expect(answer).toEqual(9);
    })
})

describe('division', function() {
    it('correctly divides', function() {
        const answer = calculate("50 / 5 / 2");
        expect(answer).toEqual(5);
    })
})

describe('multiplication', function() {
    it('correctly multiplies', function() {
        const answer = calculate("3 * 3 * 3");
        expect(answer).toEqual(27);
    })
})

describe('power', function() {
    it('correctly calculates the power', function() {
        const answer = calculate("10 ^ 2 ^ 2");
        expect(answer).toEqual(10000);
    })
})

describe('precedence', function() {
    it('correctly accounts for operator precedence', function() {
        const answer = calculate("3 + 4 * 5");
        expect(answer).toEqual(23);
    })
})

describe('bracketed precedence', function() {
    it('correctly accounts for bracketed operator precedence', function() {
        const answer = calculate("(3 + 4) * 5");
        expect(answer).toEqual(35);
    })
})