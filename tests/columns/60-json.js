var columns = require('../../lib/columns');



exports['JSONColumn constructor'] = function(test) {
    test.expect(5);
    var ctor = columns['json'];

    test.strictEqual(null, (new ctor()).defaultValue);
    test.strictEqual(null, (new ctor({})).defaultValue);
    test.strictEqual(null, (new ctor({defaultValue: null})).defaultValue);
    test.strictEqual('', (new ctor({defaultValue: ''})).defaultValue);
    test.strictEqual('test', (new ctor({defaultValue: 'test'})).defaultValue);

    test.done();
}

var complex_object = {
    f1: 1,
    f2: 2.2,
    f3: null,
    //f4: undefined, // this breaks test - JSON does not know undefined
    f5: 'value 5',
    f6: null,
    f7: true,
    f8: false,
    f9: { a: 'aaa', b: 'bbb', 'true': true, 'false': false },
    'ugly key name': ''
};



exports['JSONColumn serializeValue values'] = function(test){
    test.expect(9);
    var column = new columns['json']({});

    test.strictEqual(column.serializeValue(null), null);
    test.strictEqual(column.serializeValue(0), JSON.stringify(0));
    test.strictEqual(column.serializeValue(123), JSON.stringify(123));
    test.strictEqual(column.serializeValue(1.1), JSON.stringify(1.1));
    test.strictEqual(column.serializeValue(true), JSON.stringify(true));
    test.strictEqual(column.serializeValue(false), JSON.stringify(false));
    test.strictEqual(column.serializeValue('1.1'), JSON.stringify('1.1'));
    test.strictEqual(column.serializeValue('value'), JSON.stringify('value'));
    test.strictEqual(column.serializeValue(complex_object), JSON.stringify(complex_object));

    test.done();
};



exports['JSONColumn deserializeValue values'] = function(test){
    test.expect(10);
    var column = new columns['json']({});

    test.strictEqual(column.deserializeValue(null), null);
    test.strictEqual(column.deserializeValue('null'), null);
    test.strictEqual(column.deserializeValue('0'), 0);
    test.strictEqual(column.deserializeValue('123'), 123);
    test.strictEqual(column.deserializeValue('1.1'), 1.1);
    test.strictEqual(column.deserializeValue('true'), true);
    test.strictEqual(column.deserializeValue('false'), false);
    test.strictEqual(column.deserializeValue('"1.1"'), '1.1');
    test.strictEqual(column.deserializeValue('"value"'), 'value');
    test.deepEqual(column.deserializeValue(JSON.stringify(complex_object)), complex_object);

    test.done();
};



exports['JSONColumn defaultValue'] = function(test){
    test.expect(3);
    var column = new columns['json']({defaultValue: complex_object});

    test.deepEqual(column.serializeValue(null), complex_object);
    test.deepEqual(column.deserializeValue(null), complex_object);
    test.deepEqual(column.deserializeValue('null'), null);

    test.done();
};
