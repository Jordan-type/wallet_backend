

const formartNumber =  (val, decimals)  => {
    val = parseFloat(val);
    if (!decimals) {
        decimals = 2;
    }
    return val.toFixed(decimals);
}



export default { formartNumber }
