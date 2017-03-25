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
        else {
            return ['', content];
        }
    },

    getModulePath (modulePart) {
        const reg = new RegExp(requireReg, 'g');
        const match =  reg.exec(modulePart);
        const modulePaths = [];
        modulePaths.push(match[1]);
        return modulePaths;
    },

    getVarData (modulePath) {
        return require(modulePath[0]);
    },

    transformToLessVars (varData) {
        const keys = Object.keys(varData);
        return keys.reduce( (result, key) => {
            result += `@${key}: ${varData[key]};\n`;
            return result;
        }, '');
    },

    mergeVarsToContent (content) {
        const [ moduleData, lessContent ] = this.divideContent(content);
        const modulePath = this.getModulePath(moduleData);
        const varData = this.getVarData(modulePath);
        const lessVars = this.transformToLessVars(varData);
        return lessVars + lessContent;
        
    }

};

module.exports = Loader;
