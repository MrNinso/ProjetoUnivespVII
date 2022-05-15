const cli = require('./cli')()

global.sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))

global.printStream = async (stream) => new Promise((resolve) => {
    stream.on('error', resolve)
    stream.on('end', resolve)
    stream.on('data', console.log)
})

global.import = async (req) => {
    if (process._import === undefined) {
        process._import = new Object(null)
        process._import[req] = require(req)
    } else if (process._import[req] === undefined) {
        process._import[req] = require(req)
    }

    return process._import[req]
}

const atuador = async (port) => new Promise((resolve, reject) => {
    const app = require('express')()

    app.all('*', async (req, res) => {
        console.log('O atuador recebeu uma request:')
        console.log(`${req.method} ${req.url}`)
        
        for (const header in req.headers) {
            console.log(`${header}: ${req.headers[header]}`)
        }
        
        console.log("")
        
        req.setEncoding('utf8')
        
        await printStream(req)

        return res.status(200).json({})
    })

    app.listen(port, async (err) => {
        if (err) {
            console.log(err)
            return reject(err)
        }
        console.log(`Atuador Iniciado na porta ${port}`)
    })

})

const sensor = async () => new Promise(async (resolve, reject) => {
    process.stdin.on('data', async (command) => {
        await cli.handle(command, resolve)
        process.stdout.write('> ')
    })

    await sleep(1000)
    console.log('Console carregado, para ver os comandos digite help')
    process.stdout.write('> ')
})

const run = async () => new Promise(async (resolve, reject) => Promise.race([
    atuador(3050),
    sensor()
]))

run()