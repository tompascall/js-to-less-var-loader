import loader from '../index';

describe('js-to-less-vars-loader', () => {
    it('throws error if content is not a json object', () => {
        expect(loader).toThrow();
        let caller = () => {
            loader({asdf : 'asdf'});
        };
        expect(caller).toThrow();
    });

    it('transforms a hash into less variable strings', () => {
        const colors = {
            git_primary: "#1ab394",
            git_warning: "#f8ac59"
        }

       expect(loader(JSON.stringify(colors))).toBe("@git_primary: #1ab394;\n@git_warning: #f8ac59;\n");
   }); 
});
