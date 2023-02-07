const morgan = require('morgan');                                                                                                                                                   
const cluster = require('cluster')                                                                                                                                                  
const config = require('./config');                                                                                                                                                 
const routes = require('./routes');                                                                                                                                                 
const { Worker } = require("worker_threads");                                                                                                                                       
const app = express();                                                                                                                                                              
app.use(helmet());                                                                                                                                                                  
app.use(bodyParser.urlencoded({ extended: true }));                                                                                                                                 
app.use(bodyParser.json({ extended: true }));                                                                                                                                       
app.use(morgan('tiny'));                                                                                                                                                            
                                                                                                                                                                                    
app.use('/', routes);                                                                                                                                                               
if (cluster.isMaster) {                                                                                                                                                             
    console.log(`Master ${process.pid} is running`)                                                                                                                                 
    // ...... worker ......                                                                                                                                                         
    for (let i = 0; i < process.env.FORK_NUMBER; i++) {                                                                                                                             
        cluster.fork()                                                                                                                                                              
    }                                                                                                                                                                               
    cluster.on('exit', (worker, code, signal) => {                                                                                                                                  
        console.log(`worker ${worker.process.pid} died`)                                                                                                                            
    })                                                                                                                                                                              
} else {                                                                                                                                                                            
    app.listen(config.server.port,()=> {})                                                                                                                                          
    console.log(`Worker ${process.pid} started`)                                                                                                                                    
}                                                                                                                                                                                   
module.exports = app;
