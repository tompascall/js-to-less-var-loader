import path from 'path';
const loader = require('../index').default;
import { operator } from '../index';

describe('js-to-less-vars-loader', () => {

    describe('module', () => {
        const context = {
            context: path.resolve()
        };

        it('exports a function', () => {
            expect(typeof loader).toEqual('function');
        });

        it('calls operator.mergeVarsToContent with content and loader context', () => {
            spyOn(operator, 'mergeVarsToContent');
            loader.call(context, 'asdf');
            expect(operator.mergeVarsToContent).toHaveBeenCalledWith('asdf', context);

        });

        it('calls createModuleString with the result of mergeVarsToContent and loader context', () => {
            spyOn(operator, 'createModuleString');
            const content = 'require("./mocks/colors.js")\n' + '.someClass {\ncolor: @nice;\n}';
            const merged = operator.mergeVarsToContent(content, context);
            loader.call(context, content);
            expect(operator.createModuleString).toHaveBeenCalledWith(merged, context);
        });
    });

    describe('divide', () => {
        const content = "require('colors.js');\n" +
            ".someClass { color: #fff;}";
        it('divides the require (if it exists) from the content', () => {
            expect(operator.divideContent(content)[0]).toEqual("require('colors.js')");
            expect(operator.divideContent(content)[1]).toEqual("\n.someClass { color: #fff;}");
        });

        it('gives back content if there is no require in content', () => {
            const content = ".someClass { color: #fff;}";
            expect(operator.divideContent(content)[0]).toEqual("");
            expect(operator.divideContent(content)[1]).toEqual(content);
        });
    });

    describe('getModulePath', () => {
        it('extracts module path into an array', () => {
           expect(operator.getModulePath('require("./mocks/colors.js")')).toEqual(["./mocks/colors.js"]);
        });
    });

    describe('getVarData', () => {
        it('gets variable data by modulePath with context', () => {
            const context = { context: path.resolve()};
            const varData = operator.getVarData(['./mocks/colors.js'], context);
            expect(varData).toEqual({ white: '#fff', black: '#000'});
        });
    });

    describe('transformToLessVars', () => {
        it('takes a hash object and transforms it to less variables', () => {
            const colors = require('../mocks/colors.js');
            expect(operator.transformToLessVars(colors)).toEqual('@white: #fff;\n@black: #000;\n');
        });
    });

    describe('mergeVarsToContent', () => {
        const context = {
            context: path.resolve()
        };

        it('inserst vars to less content', () => {
            const content = "require('./mocks/colors.js');\n" +
                ".someClass { color: #fff;}";
            const [ moduleData, lessContent ] = operator.divideContent(content);
            const modulePath = operator.getModulePath(moduleData);
            const varData = operator.getVarData(modulePath, context);
            const lessVars = operator.transformToLessVars(varData);

            expect(operator.mergeVarsToContent(content, context)).toEqual(lessVars + lessContent);
        });
    });
});
