var columns = require('../../lib/columns');



exports['IntegerColumn constructor'] = function(test) {
    test.expect(6);
    var ctor = columns['integer'];

    test.strictEqual((new ctor()).getDefaultValue(), null);
    test.strictEqual((new ctor({})).getDefaultValue(), null);
    test.strictEqual((new ctor({defaultValue: null})).getDefaultValue(), null);
    test.strictEqual((new ctor({defaultValue: 0})).getDefaultValue(), 0);
    test.strictEqual((new ctor({defaultValue: 1})).getDefaultValue(), 1);
    test.strictEqual((new ctor({defaultValue: 1.1})).getDefaultValue(), 1);

    test.done();
}


exports['IntegerColumn serializeValue values'] = function(test){
    test.expect(8);
    var column = new columns['integer']({});

    test.strictEqual(123, column.serializeValue(123));
    test.strictEqual(0, column.serializeValue(0));
    test.strictEqual(null, column.serializeValue(NaN));
    test.strictEqual(null, column.serializeValue(Infinity));
    test.strictEqual(null, column.serializeValue(-Infinity));
    test.strictEqual(1, column.serializeValue('1'));
    test.strictEqual(1, column.serializeValue(1.1));
    test.strictEqual(1, column.serializeValue('1.1'));

    test.done();
};

