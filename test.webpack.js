var context = require.context('./src/tests/', true, /-test\.js$/);
context.keys().forEach(context);
