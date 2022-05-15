module.exports = () => {
    const cli = new Object(null)

    cli._espaco = Buffer.from(" ")
    cli._aspas = Buffer.from('"')
    cli._enter = Buffer.from('\n')

    cli._split = (command) => {
        const data = []
        let dataAspas = []
        let isAspas = false
        let j = 0

        for (let i = 0; i < command.length; i++) {
            switch (command[i]) {
                case cli._espaco[0]:
                    if (isAspas) {
                        dataAspas.push(command.subarray(j, i).toString('utf8'))
                        j = i + 1
                        break
                    }

                    data.push(command.subarray(j, i).toString('utf8'))
                    j = i + 1
                break
                
                case cli._aspas[0]:
                    if (isAspas) {
                       isAspas = false
                       dataAspas.push(command.subarray(j, i).toString('utf8'))
                       data.push(dataAspas.join(' '))
                       dataAspas = []
                       j = i + 1

                       break
                    }
                    j = i + 1
                    isAspas = true
                break

                case cli._enter[0]:
                    if (isAspas) {
                        dataAspas.push(command.subarray(j, i).toString('utf8'))
                        data.push(dataAspas.join(' '))
                        break
                    }

                    data.push(command.subarray(j, i).toString('utf8'))
                break
            }
        }

        return data.filter(v => v !== '')
    }

    cli.handle = async (comando, resolve) => {
        const args = cli._split(comando)
        const a = args.shift()
        
        let c = undefined

        try {
            c = require(`./${a}/index`)
        } catch (err) {}

        if (c === undefined) {
            return console.log(`Comando: ${a} não existe`)
        }
        await c(args, resolve)
    }

    return cli
}