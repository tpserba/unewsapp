const express = require('express');
const app = express();
const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
});  