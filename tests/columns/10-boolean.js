var columns = require('../../lib/columns');



exports['BooleanColumn constructor'] = function(test) {
    test.expect(5);
    var ctor = columns['boolean'];

    test.strictEqual(null, (new ctor()).defaultValue);
    test.strictEqual(null, (new ctor({})).defaultValue);
    test.strictEqual(null, (new ctor({defaultValue: null})).defaultValue);
    test.strictEqual(true, (new ctor({defaultValue: true})).defaultValue);
    test.strictEqual(false, (new ctor({defaultValue: false})).defaultValue);

    test.done();
}


exports['BooleanColumn default false'] = function(test){
    test.expect(3);
    var column = new columns['boolean']({defaultValue: false});

    test.strictEqual(false, column.serializeValue());
    test.strictEqual(false, column.serializeValue(null));
    test.strictEqual(false, column.serializeValue(undefined));

    test.done();
};



exports['BooleanColumn default null'] = function(test){
    test.expect(3);
    var column = new columns['boolean']({defaultValue: null});

    test.strictEqual(null, column.serializeValue());
    test.strictEqual(null, column.serializeValue(null));
    test.strictEqual(null, column.serializeValue(undefined));

    test.done();
};



exports['BooleanColumn default undefined -> null'] = function(test){
    test.expect(3);
    var column = new columns['boolean']({});

    test.strictEqual(null, column.serializeValue());
    test.strictEqual(null, column.serializeValue(null));
    test.strictEqual(null, column.serializeValue(undefined));

    test.done();
};



exports['BooleanColumn serializeValue to true'] = function(test){
    test.expect(9);
    var column = new columns['boolean']({});

    test.strictEqual(true, column.serializeValue(true));
    test.strictEqual(true, column.serializeValue(1));
    test.strictEqual(true, column.serializeValue('Yes'));
    test.strictEqual(true, column.serializeValue('yeS'));
    test.strictEqual(true, column.serializeValue('On'));
    test.strictEqual(true, column.serializeValue('oN'));
    test.strictEqual(true, column.serializeValue('1'));
    test.strictEqual(true, column.serializeValue('truE'));
    test.strictEqual(true, column.serializeValue('\1'));

    test.done();
};



exports['BooleanColumn serializeValue to false'] = function(test){
    test.expect(8);
    var column = new columns['boolean']({});

    test.strictEqual(false, column.serializeValue(false));
    test.strictEqual(false, column.serializeValue(0));
    test.strictEqual(false, column.serializeValue('No'));
    test.strictEqual(false, column.serializeValue('nO'));
    test.strictEqual(false, column.serializeValue('Off'));
    test.strictEqual(false, column.serializeValue('oFF'));
    test.strictEqual(false, column.serializeValue('0'));
    test.strictEqual(false, column.serializeValue('falsE'));

    test.done();
};



exports['BooleanColumn serializeValue to default'] = function(test){
    test.expect(6);
    var column = new columns['boolean']({defaultValue: true});

    test.strictEqual(true, column.serializeValue());
    test.strictEqual(true, column.serializeValue(null));
    test.strictEqual(true, column.serializeValue(undefined));

    column = new columns['boolean']({defaultValue: false});

    test.strictEqual(false, column.serializeValue());
    test.strictEqual(false, column.serializeValue(null));
    test.strictEqual(false, column.serializeValue(undefined));

    test.done();
};



