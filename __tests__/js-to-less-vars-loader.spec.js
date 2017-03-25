import Loader from '../index';

describe('js-to-less-vars-loader', () => {

    describe('module', () => {
        it('exports a function', () => {
            const loader = new Loader();
            expect(typeof Loader).toEqual('function');
        });

        it('is a contructor which containes createModuleString function as method', () => {
            const loader = new Loader();
            expect(typeof loader.createModuleString).toEqual('function');
        });

        it('calls loader.mergeVarsToContent with content', () => {
            spyOn(Loader.prototype, 'mergeVarsToContent');
            new Loader('asdf');
            expect(Loader.prototype.mergeVarsToContent).toHaveBeenCalledWith('asdf');

        });

        it('calls createModuleString with the result of mergeVarsToContent', () => {
            spyOn(Loader.prototype, 'createModuleString');
            const content = 'require("./mocks/colors.js")\n' + '.someClass {\ncolor: @nice;\n}';
            const merged = Loader.prototype.mergeVarsToContent(content);
            new Loader(content);
            console.log(merged);
            expect(Loader.prototype.createModuleString).toHaveBeenCalledWith(merged);
        });
    });

    describe('createModuleString', () => {
        const loader = new Loader();
        it('gives back a string with param', () => {
            expect(loader.createModuleString('fakeValue').indexOf('fakeValue')).not.toEqual(-1);
        });

        it('returns different kind of module string based on context.version', () => {
            const context = { version: 1};
            const value = 'fakeValue';
            expect(loader.createModuleString.call(context, value)).toEqual(`module.exports = ${value};`);
            context.version = 2;
            expect(loader.createModuleString.call(context, value)).toEqual(`export default ${value};`);
        });
    });

    describe('divide', () => {
        const loader = new Loader();
        const content = "require('colors.js');\n" +
            ".someClass { color: #fff;}";
        it('divides the require (if it exists) from the content', () => {
            expect(loader.divideContent(content)[0]).toEqual("require('colors.js')");
            expect(loader.divideContent(content)[1]).toEqual("\n.someClass { color: #fff;}");
        });

        it('gives back content if there is no require in content', () => {
            const content = ".someClass { color: #fff;}";
            expect(loader.divideContent(content)[0]).toEqual("");
            expect(loader.divideContent(content)[1]).toEqual(content);
        });
    });

    describe('getModulePath', () => {
        const loader = new Loader();
        it('extracts module path into an array', () => {
           expect(loader.getModulePath('require("./mocks/colors.js")')).toEqual(["./mocks/colors.js"]);
        });
    });

    describe('getVarData', () => {
        const loader = new Loader();
        it('gets variable data by modulePath', () => {
            const varData = loader.getVarData(['./mocks/colors.js']);
            expect(varData).toEqual({ white: '#fff', black: '#000'});
        });
    });

    describe('transformToLessVars', () => {
        const loader = new Loader();
        it('takes a hash object and transforms it to less variables', () => {
            const colors = require('../mocks/colors.js');
            expect(loader.transformToLessVars(colors)).toEqual('@white: #fff;\n@black: #000;\n');
        });
    });

    describe('mergeVarsToContent', () => {
        const loader = new Loader();
        it('inserst vars to less content', () => {
            const content = "require('./mocks/colors.js');\n" +
                ".someClass { color: #fff;}";
            const [ moduleData, lessContent ] = loader.divideContent(content);
            const modulePath = loader.getModulePath(moduleData);
            const varData = loader.getVarData(modulePath);
            const lessVars = loader.transformToLessVars(varData);

            expect(loader.mergeVarsToContent(content)).toEqual(lessVars + lessContent);
        });
    });
});
