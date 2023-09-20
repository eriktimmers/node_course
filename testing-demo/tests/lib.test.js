const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () =>  {
    it('should return a positive number when input is positive ', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('should return a positive number when input is negative ', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });

    it('should return a positive number when input is negative ', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return greeting message', () => {
        const result = lib.greet('Anybody');
        expect(result).toMatch(/Anybody/);
        expect(result).toContain('Anybody');
    });
});

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const result = lib.getCurrencies();
        // Too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        // Too Specific
        expect(result[0]).toBe('USD');
        expect(result[1]).toBe('AUD');
        expect(result[2]).toBe('EUR');
        expect(result.length).toBe(3);

        // Proper Way
        expect(result).toContain('USD');
        expect(result).toContain('AUD');
        expect(result).toContain('EUR');

        // Ideal
        expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));
    });
})

describe('getProduct', () => {
    it('should return the product with the given id', () => {
        const result = lib.getProduct(1);
        //expect(result).toEqual({ id: 1, price: 10});
        expect(result).toMatchObject({ id: 1, price: 10});
        expect(result).toHaveProperty('id', 1);
    });
})

describe('reqisterUser', () => {
    it('should throw if username is falsy', () => {
        // falsy =
        // Null
        // undefined
        // NaN
        // ''
        // 0
        // false
        const args = [null, undefined, NaN, '', 0, false];
        args.forEach(a => {
            expect(() => { lib.registerUser(a) }).toThrow();
        })
    });

    it('should return an user object if valid username os passed', () => {
        const result = lib.registerUser('ValidUserName');
        expect(result).toMatchObject({ username: 'ValidUserName' });
        expect(result.id).toBeGreaterThan(0);
    });
})

describe('applyDiscount', () => {
    it('should apply 10% discount if customer has more than 10 points', () => {
        db.getCustomerSync = function(customerId) {
            console.log('Fake reading customer ...')
            return { id: customerId, points: 20 };
        };
        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

// describe('notifyDiscount', () => {
//     it('should send an email to the customer', () => {
//         const mockFunction = jest.fn();
//         // mockFunction.mockReturnValue(1);
//         // mockFunction.mockResolvedValue(1); -- for a promise
//         // mockFunction.mockRejectedValue(new Error('...'));
//         // const result = await mockFunction();
//
//         db.getCustomerSync = function(customerId) {
//             console.log('Fake reading customer ...')
//             return { email: 'a' };
//         };
//
//         let mailSent = false;
//         mail.send = function(email, message) {
//             mailSent = true;
//         }
//
//         lib.notifyCustomer({ customerId: 1 })
//
//         expect(mailSent).toBe(true);
//     });
// });

describe('notifyDiscount', () => {
    it('should send an email to the customer', () => {
        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
        mail.send = jest.fn();

        lib.notifyCustomer({ customerId: 1 })

        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);
    });
});
