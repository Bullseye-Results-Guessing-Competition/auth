import  Utils  from './utils';

test('is {} defined', () => {
    expect(Utils.isDefined({})).toBe(true);
})

test('is [] defined', () => {
    expect(Utils.isDefined([])).toBe(true);
})

test('is a = undefined defined', () => {
    let a : number ;

    expect(Utils.isDefined(undefined)).toBe(false);
})

test('is a = null defined', () => {
    let a : number = null;
    expect(Utils.isDefined(null)).toBe(false);
})

test('is a = 3 defined', () => {
    let a : number = 3;
    expect(Utils.isDefined(a)).toBe(true);
})