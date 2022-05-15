module.exports = async (args) => {
    const fs = await import('fs')

    if (args[0] === undefined) {
        return require('../help/index')(['api'])
    }

    const cmd = fs.readdirSync(__dirname)
        .filter(f => !f.includes('.'))
    .find(f => f === args.shift())

    return await require(`./${cmd}/index`)(args)
}