import loader from '../index';

describe('js-to-less-vars-loader', () => {
    it('throws error if content is not an object', () => {
        expect(loader).toThrow();
    });

    it('transforms a hash into less variable strings', () => {
        const colors = {
            'git.primary': '#1ab394',
            'git.warning': '#f8ac59'
        }

       expect(loader(colors)).toBe("@git.primary: #1ab394;\n@git.warning: #f8ac59;\n");
   }); 
});
