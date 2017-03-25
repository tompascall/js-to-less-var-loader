    // const keys = Object.keys(parsedContent);
    // return keys.reduce( (result, key) => {
    //     result += `@${key}: ${parsedContent[key]};\n`;
    //     return result;
    // }, '');

const requireReg = /require\s*\(['|"](.+)['|"]\)\s*;?/g;

const Loader = function () {
};

Loader.prototype = {
    createModuleString (exportValue) {
        const module = this.version && this.version >= 2 ? `export default ${exportValue};` : `module.exports = ${exportValue};`;
        return module;
    },

    divideContent (content) {
        let match;
        let endIndex;
        const reg = new RegExp(requireReg, 'g');
        while (match = reg.exec(content)) {
            endIndex = reg.lastIndex - 1;
        }
        if (typeof endIndex !== 'undefined') {
            return [
                content.slice(0, endIndex),
                content.slice(endIndex + 1)
            ];
        }
    },

    getModule (modulePart) {
        const reg = new RegExp(requireReg, 'g');
        const match =  reg.exec(modulePart);
        return require(match[1]);
    }
};

module.exports = Loader;
