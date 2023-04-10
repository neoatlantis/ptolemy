let funcs = {};


function register (name, func){
    if(funcs[name] !== undefined) throw Error();
    funcs[name] = func;
    return this;
}

function call (name){
    if(funcs[name] !== undefined) throw Error();
    return funcs[name].apply(this, [...arguments].slice(1));
}

export { register, call };