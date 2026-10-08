const app = require('./app');
const { env } = require('./config');
const db = require('./db'); // Init DB

const PORT = env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
