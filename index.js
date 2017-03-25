const path = require('path');

const requireReg = /require\s*\(['|"](.+)['|"]\)\s*;?/g;

const operator = {
    createModuleString (exportValue) {
        return exportValue;
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

    getVarData (modulePath, webpackContext) {
        return require(path.join(webpackContext.context, modulePath[0]));
    },

    transformToLessVars (varData) {
        const keys = Object.keys(varData);
        return keys.reduce( (result, key) => {
            result += `@${key}: ${varData[key]};\n`;
            return result;
        }, '');
    },

    mergeVarsToContent (content, webpackContext) {
        const [ moduleData, lessContent ] = this.divideContent(content);
        if (moduleData) {
            const modulePath = this.getModulePath(moduleData);
            const varData = this.getVarData(modulePath, webpackContext);
            const lessVars = this.transformToLessVars(varData);
            return lessVars + lessContent;
        }
        else return content;   
    }
};

exports.operator = operator;

const loader = function (content) {
    const webpackContext = this;
    const merged = operator.mergeVarsToContent(content, webpackContext);
    return operator.createModuleString(merged, webpackContext);
};

exports.default = loader;
