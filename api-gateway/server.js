const app = require('./src/app');
const {InitializeRPC}= require('./src/rabbitMQ/rpc');
const port = process.env.PORT || 4001;

( async ()=>{
   await InitializeRPC();
   console.log("RPC Initialized ")
})();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});