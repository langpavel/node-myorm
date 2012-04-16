var columns = require('../../lib/columns');



exports['DateColumn constructor'] = function(test) {
    test.expect(6);
    var ctor = columns['date'];

    test.strictEqual(null, (new ctor()).defaultValue);
    test.strictEqual(null, (new ctor({})).defaultValue);
    test.strictEqual(null, (new ctor({defaultValue: null})).defaultValue);
    test.strictEqual(null, (new ctor({defaultValue: ''})).defaultValue);
    test.strictEqual('function', typeof (new ctor({defaultValue: 'now'})).defaultValue);
    test.strictEqual('function', typeof (new ctor({defaultValue: 'current_timestamp'})).defaultValue);

    test.done();
}



exports['DateColumn native serializeValue values'] = function(test){
    test.expect(3);
    var column = new columns['date']({});

    test.strictEqual(null, column.serializeValue(null));
    test.strictEqual(0, column.serializeValue(new Date(0)).getTime());
    test.strictEqual(1333963440000, column.serializeValue(new Date(1333963440000)).getTime());

    test.done();
};



exports['DateColumn native deserializeValue values'] = function(test){
    test.expect(3);
    var column = new columns['date']({});

    test.strictEqual(null, column.deserializeValue(null));
    test.strictEqual(0, column.deserializeValue(new Date(0)).getTime());
    test.strictEqual(1333963440000, column.deserializeValue(new Date(1333963440000)).getTime());

    test.done();
};



exports['DateColumn UNIX timestamp serializeValue values'] = function(test){
    test.expect(3);
    var column = new columns['date']({dateTransformation: 'UNIX'});

    test.strictEqual(null, column.serializeValue(null));
    test.strictEqual(0, column.serializeValue(new Date(0)));
    test.strictEqual(1333963440, column.serializeValue(new Date(1333963440000)));

    test.done();
};



exports['DateColumn UNIX timestamp deserializeValue values'] = function(test){
    test.expect(3);
    var column = new columns['date']({dateTransformation: 'UNIX'});

    test.strictEqual(null, column.deserializeValue(null));
    test.strictEqual(0, column.deserializeValue(0).getTime());
    test.strictEqual(1333963440000, column.deserializeValue(1333963440).getTime());

    test.done();
};



exports['DateColumn UNIX timestamp * 1000 serializeValue values'] = function(test){
    test.expect(3);
    var column = new columns['date']({dateTransformation: 'UNIX1000'});

    test.strictEqual(null, column.serializeValue(null));
    test.strictEqual(0, column.serializeValue(new Date(0)));
    test.strictEqual(1333963440000, column.serializeValue(new Date(1333963440000)));

    test.done();
};



exports['DateColumn UNIX timestamp * 1000 deserializeValue values'] = function(test){
    test.expect(3);
    var column = new columns['date']({dateTransformation: 'UNIX1000'});

    test.strictEqual(null, column.deserializeValue(null));
    test.strictEqual(0, column.deserializeValue(0).getTime());
    test.strictEqual(1333963440000, column.deserializeValue(1333963440000).getTime());

    test.done();
};
