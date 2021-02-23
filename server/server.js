const customExpress = require('./config/customExpress')
const dbTables = require('./infrastructure/tables')
const dbConnection = require('./infrastructure/connection')

let app

module.exports = {
    init: () => {

        dbConnection.then((res) => {
            dbTables.connection(res)

            dbTables.dropTables()
            dbTables.createTables()
            
    
            app = customExpress()
            app.listen(3000, () => {
                console.log('Server Running')
            })

        })
    }
}
