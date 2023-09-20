const lib = require('../exercise1');

describe('fizzBuzz', () =>  {
    it('should throw an exception when not a number', () => {
        const args = [null, undefined, '', 'anyString', false, {}];
        args.forEach(a => {
            expect(() => { lib.fizzBuzz(a) }).toThrow();
        })
    });

    it('should return FizzBuzz when only divisible by 3', () => {
        const result = lib.fizzBuzz(3);
        expect(result).toBe('Fizz');
    });

    it('should return Fizz when only divisible by 5', () => {
        const result = lib.fizzBuzz(5);
        expect(result).toBe('Buzz');
    });

    it('should return FizzBuzz when divisible by 5 and by 3', () => {
        const result = lib.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });

    it('should return input when divisible neither by 5 and by 3', () => {
        const result = lib.fizzBuzz(1);
        expect(result).toBe(1);
    });

});