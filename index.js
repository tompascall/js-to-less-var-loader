function createVariables (content) {
    if (this && typeof this.cacheable === 'function') {
        this.cacheable();
    }
    if ({}.toString.call(content) !== '[object Object]') {
        throw Error('You have to make loader eat a simple hash object for getting LESS variables');
    }
    const keys = Object.keys(content);
    return keys.reduce( (result, key) => {
        result += `@${key}: ${content[key]};\n`;
        return result;
    }, '');
}

module.exports = function (content) {
    return createVariables(content);
};
