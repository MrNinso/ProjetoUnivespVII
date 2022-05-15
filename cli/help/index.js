module.exports = async (args) => {
    const fs = await import('fs')

    args = args[0] ? `${args.join('/')}/` : ''

    fs.readdirSync(`./cli/${args}`)
        .filter(f => !f.includes('.'))
        .forEach((command) => require(`../${args}${command}/help`)())
}