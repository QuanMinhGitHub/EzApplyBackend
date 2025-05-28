import config from './config/index.js';
import app from './app.js';
import sequelize from './database/database.js';

(async function main() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connected');

        app.listen(config.port, () => { console.log(`Server listening on port ${config.port}`) });

    } catch (error) {
        console.log('Error at the starting point:', error);
        process.exit(1);
    }
})();