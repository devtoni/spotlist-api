const sum = (a: number, b: number): number => a + b;

describe('Sum', () => { 
    it('should return 3', () => { 
        const numberA = 1;
        const numberB = 2;

        const result = sum(numberA, numberB);

        expect(result).toEqual(3);
    });
});