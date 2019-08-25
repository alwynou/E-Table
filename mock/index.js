const Mock = require('mockjs')

Mock.setup({
    timeout: "100-500"
})



Mock.mock('/api/login', 'post', (option) => {
    let {
        username,
        password
    } = JSON.parse(option.body)
    return (username === 'admin' && password === 'admin')
})


function getRows(size) {
    let rows = []
    for (let i = 1; i <= size; i++) {
        rows.push(Mock.mock({
            "id": "@id",
            "name": "@cname",
            "city": "@city",
            "email": "@email",
            "address": "@county(true)",
            "datetime": "@datetime()",
            "tel": /^1[385][1-9]\d{8}/,
            "companyName": "@pick(['xx科技', 'xx实业', 'xx技术', 'xx信息', 'xx地产'])",
            "bool": "@Boolean",
            "sex|1": [1, 0],
        }))
    }
    return rows
}


Mock.mock('/api/Getlist', 'post', function (options) {
    let body = JSON.parse(options.body)
    let rows = getRows(body.pageSize || 50)
    let size = Mock.mock({
        "number|5-10": 100
      })
    return {
        code: 200,
        rows: rows,
        total: rows.length * 2,
        pageIndex: body.pageIndex,
        pageSize: body.pageSize,
        userdata:[{city:12},{datetime:20}],
        msg: 'success'
    }
})

let defaultF = Mock.mock({
        "data|0-20": ["@id"],
    }),
    fsex = Mock.mock({
        "data": [0, 1],
    }),
    fname = Mock.mock({
        "data|0-10": ["@cname"],
    }),
    fcity = Mock.mock({
        "data|10": ["@city"]
    }),
    faddress = Mock.mock({
        "data|10": ["@county(true)"]
    }),
    ftel = Mock.mock({
        "data|15": [/^1[385][1-9]\d{8}/]
    }),
    femail = Mock.mock({
        "data|14": ["@email"]
    }),
    fdatetime = Mock.mock({
        "data|10-15": ["@datetime()"]
    }),
    fcompanyName = Mock.mock({
        "data": ['xx科技', 'xx实业', 'xx技术', 'xx信息', 'xx地产']
    }),
    fbool = Mock.mock({
        "data": [false, true]
    })


Mock.mock('/api/filter', 'post', function (options) {
    let body = JSON.parse(options.body),
        data;
    switch (body.column) {
        case 'sex':
            data = fsex;
            break;
        case 'name':
            data = fname;
            break;
        case 'city':
            data = fcity;
            break;
        case 'bool':
            data = fbool;
            break;
        case 'address':
            data = faddress;
            break;
        case 'tel':
            data = ftel;
            break;
        case 'email':
            data = femail;
            break;
        case 'companyName':
            data = fcompanyName;
            break;
        case 'datetime':
            data = fdatetime;
            break;
        default:
            data = defaultF;
    }

    return data
})