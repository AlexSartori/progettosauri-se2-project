const conc = require('../endpoints/users').create_user

test('concat test', () => {
    expect(conc('a','b')).toBe('ab');
});

test('concat null', () => {
    expect(conc(null,null)).toBe(0);
});