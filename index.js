    // const keys = Object.keys(parsedContent);
    // return keys.reduce( (result, key) => {
    //     result += `@${key}: ${parsedContent[key]};\n`;
    //     return result;
    // }, '');

const Loader = function () {
};

Loader.prototype = {
    createModuleString (exportValue) {
        const module = this.version && this.version >= 2 ? `export default ${exportValue};` : `module.exports = ${exportValue};`;
        return module;
    },

    divideContent (content) {
        if (typeof content === 'string') {
            const reg = /require\s*\(['|"].+['|"]\)\s*;?/g;
            let match;
            let endIndex;
            while (match = reg.exec(content)) {
                endIndex = reg.lastIndex - 1;
            }
            if (typeof endIndex !== 'undefined') {
                return [
                    content.slice(0, endIndex),
                    content.slice(endIndex + 1)
                ];
            }
        }
    }
};

module.exports = Loader;
