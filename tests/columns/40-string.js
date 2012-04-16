var columns = require('../../lib/columns');



exports['StringColumn constructor'] = function(test) {
    test.expect(5);
    var ctor = columns['string'];

    test.strictEqual((new ctor()).getDefaultValue(), null);
    test.strictEqual((new ctor({})).getDefaultValue(), null);
    test.strictEqual((new ctor({defaultValue: null})).getDefaultValue(), null);
    test.strictEqual((new ctor({defaultValue: ''})).getDefaultValue(), '');
    test.strictEqual((new ctor({defaultValue: 'test'})).getDefaultValue(), 'test');

    test.done();
}


exports['StringColumn#serializeValue'] = function(test){
    test.expect(9);
    var column = new columns['string']({});

    test.strictEqual(null, column.serializeValue(null));
    test.strictEqual('123', column.serializeValue(123));
    test.strictEqual('0', column.serializeValue(0));
    test.strictEqual('true', column.serializeValue(true));
    test.strictEqual('false', column.serializeValue(false));
    test.strictEqual('1', column.serializeValue(1));
    test.strictEqual('1.1', column.serializeValue(1.1));
    test.strictEqual('1.1', column.serializeValue('1.1'));
    test.strictEqual('value', column.serializeValue({toString: function() { return 'value'; } }));

    test.done();
};
