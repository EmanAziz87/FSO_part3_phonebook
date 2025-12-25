const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password and new entry as cli arguments')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://azizeman467:${password}@cluster0.xqn6w5o.mongodb.net/phoneBookApp?appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url, {family: 4})

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const PhoneNumber = mongoose.model('PhoneNumber', phoneBookSchema)

if (process.argv.length === 3) {
    PhoneNumber.find({}).then(result => {
        result.forEach(phoneNumber => console.log(phoneNumber))
        mongoose.connection.close()
    })
}

const newPhoneNumber = new PhoneNumber({
    name: process.argv[3],
    number: process.argv[4]
})

newPhoneNumber.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
})