module.exports = {
    entry : './src/main.ts',
    output : {
        filename:'bundle.js'
    },
    resolve:{
        extensions : ['.ts']
    },
    module:{
        loaders : [
            {
                test : /\.ts$/,loader:'ts-loader'
            }
        ]
    }
}