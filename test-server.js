const express = require('express');
const app = express();
app.use(express.static('/workspaces/dveryaninov'));
app.listen(3005, () => console.log('Listening on 3005'));
