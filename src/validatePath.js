
function validatePath(path, includes, excludes) {
    const includeFounded = includes.filter(regExp => regExp.test(path));
    if(includeFounded.length){
        const excludeFounded = excludes.filter(regExp => !(regExp && regExp.test(path)));
        if(excludeFounded.length){
            return true;
        }
        return false
    }
    return false
}

module.exports = validatePath;