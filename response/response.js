'use-strict'

exports.fulfield = function (values, res){
    const data = {
        status: 200,
        data : values,
    }
    res.json(data)
    res.end()
}

exports.ok = function (values, res){
    const data = {
        status: 200,
        values: values,
    };
    res.json(data);
    res.end();
}