import Loader from '../index';

describe('js-to-less-vars-loader', () => {
    const loader = new Loader();

    describe('module', () => {
        it('exports a function', () => {
           expect(typeof Loader).toEqual('function'); 
        });

        it('is a contructor which containes createModuleString function as method', () => {
            expect(typeof loader.createModuleString).toEqual('function');
        });
    });
    
    describe('createModuleString', () => {
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
        const content = "require('colors.js');\n" +
            ".someClass { color: #fff;}"; 
        it('divides the require (if it exists) from the content', () => {
            expect(loader.divideContent(content)[0]).toEqual("require('colors.js')");
            expect(loader.divideContent(content)[1]).toEqual("\n.someClass { color: #fff;}");
        });
    });

    describe('transformContent', () => {
        it('description', () => {
            
        });
    });
});
