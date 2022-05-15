module.exports = async (args) => {
    const axios = import('axios')

    if (process._apiConfig === undefined) {
        process._apiConfig = new Object(null)
    }

    const cmds = []

    for(let a = args.shift(); a !== undefined; a = args.shift()) {
        switch (a) {
            case '--url':
                process._apiConfig['url'] = args.shift()
            break
            case '--token-admin':
                process._apiConfig['token-admin'] = args.shift()
            break
            case '--token-sensor':
                process._apiConfig['token-sensor'] = args.shift()
            break
            case 'print':
                cmds.push(() => {
                        for(const config in process._apiConfig) {
                            console.log(`${config}: ${process._apiConfig[config]}`)
                        }
                    }
                )
            break
            case 'login':
                cmds.push(async () => {
                    return axios({
                        method: 'post',
                        url: `${process._apiConfig['url']}/login`,
                        data: {
                            login: process._apiConfig['login'],
                            password: process._apiConfig['password'],
                        }
                    }).then(
                        (r) => {
                            // TODO ::
                        },
                        (err) => {
                            // TODO ::
                        }
                    )
                })
            break
        }
    }

    cmds.forEach(async (f) => {
        await f()
    })
}