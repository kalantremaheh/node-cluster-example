const express = require('express');
const app = express();
const cluster = require('cluster');
const os = require('os');
const  bodyParser = require('body-parser');

const PORT = 4005;


let cpuLength = os.cpus().length

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// console.log('--iscpu lenth--',cpuLength)
app.get('/',function(req,res){
    for(let i=0;i<1e8;i++){
        // cluster.fork();
    }
    res.send(`cluster ${process.pid}` );
    cluster.worker.kill();
})


app.post('/',function(req,res){ 
    res.send(`Hi from post ${req.body.name}` );
})

if(cluster.isMaster){
    for(let i=0;i< cpuLength;i++){
        cluster.fork();
    }
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`Worker die ${worker.process.pid}`);
        cluster.fork();
    })

}else{
    app.listen(PORT,()=>{
        console.log(`${process.pid} Server running on PORT ${PORT}`);
    })
}

