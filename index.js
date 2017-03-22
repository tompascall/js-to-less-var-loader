function createVariables (content) {
    if (this && typeof this.cacheable === 'function') {
        this.cacheable();
    }

    let parsedContent;
    try {
        parsedContent = JSON.parse(content);
        if ({}.toString.call(parsedContent) !== '[object Object]') {
            throw Error();
        }
    }
    catch (e) {
        throw Error('You have to make loader eat a JSON object for getting LESS variables');
    }

    const keys = Object.keys(parsedContent);
    return keys.reduce( (result, key) => {
        result += `@${key}: ${parsedContent[key]};\n`;
        return result;
    }, '');
}

module.exports = function (content) {
    return createVariables(content);
};
