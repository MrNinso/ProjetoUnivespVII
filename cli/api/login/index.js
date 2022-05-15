module.exports = async (args) => {
    if (process._apiConfig === undefined) {
        process._apiConfig = new Object(null)
    }

    for(let a = args.shift(); a !== undefined; a = args.shift()) {
        switch (a) {
            case '--login':
                process._apiConfig['login'] = args.shift()
            break
            case '--password':
                process._apiConfig['password'] = args.shift()
            break
            
        }
    }
}