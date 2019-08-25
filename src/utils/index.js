export function getmaxAndminObj(row, max, min) {
    let n = row.rowIndex,
        mx = max.rowIndex,
        mi = min.rowIndex;
    if (n > mx) {
        return {
            min: mi,
            max: n
        };
    } else if (n < mx && n > mi) {
        return {
            min: mi,
            max: n
        };
    } else if (n < mi) {
        return {
            min: n,
            max: mx
        };
    } else if (n == mi || n == mx) {
        return {
            min: mi,
            max: mx
        };
    }
};
export function GetLocTabOpt(name) {
    return JSON.parse(localStorage.getItem(name)) || [];
};
export function SetLocTabOpt(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
};

export function cacheTableOpt(type, colName, value, name) {
    let locOpt = GetLocTabOpt(name),
        hasOpt = locOpt.find(col => col.name == colName);
    if (!hasOpt) {
        let newOpt = {
            name: colName,
        };
        newOpt[type] = value;
        locOpt.push(newOpt);
        SetLocTabOpt(name, locOpt);
        return;
    }
    hasOpt[type] = value;
    SetLocTabOpt(name, locOpt);
}


export function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export function mergeOptions(defaults, config) {
    const options = {};
    let key;
    for (key in defaults) {
        options[key] = defaults[key];
    }
    for (key in config) {
        // if (hasOwn(config, key)) {
        const value = config[key];
        if (typeof value !== 'undefined') {
            options[key] = value;
        }
        // }
    }
    return options;
}

export function merge(obj1, obj2) { // 深度合并对象
    for (var key in obj2) {
        obj1[key] = obj1[key] && isObject(obj1[key]) ?
            merge(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    }
    return obj1;
}


export function isHasValue(v) {
    let withe = ['boolean', 'number', 'function']
    if (withe.includes(typeof v)) return true;
    if (Array.isArray(v) && v.length === 0) return false;
    if (Object.prototype.toString.call(v) === "[Object Object]" && Object.keys(v).length === 0) return false;
    if (!v) return false;
    return true;
}

// types 
export function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isHtmlElement(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
}

export const isFunction = (functionToCheck) => {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

export const isUndefined = (val) => {
    return val === void 0;
};

export const isDefined = (val) => {
    return val !== undefined && val !== null;
};

export function deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}