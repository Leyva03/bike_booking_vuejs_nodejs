import express from 'express';
import path from 'path';
import cors from 'cors';
import { setUncaughtExceptionCaptureCallback } from 'process';

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

const bookBikeModule = function(){

  let resolveF = [null,null,null,null,null]
  let rejectF = [null,null,null,null,null]

 

  //optional
  let buildTimeOut = (bikeId) => {
    return {
      state: 0, //0: off  1: on
      startTimeOut: function(){
        //TODO
        this.state = 1
        setTimeout(()=>{
          resolveF[bikeId - 1]('booked')
          this.state = 0
        }, 5000)
      }
    }
  }

  //optional
  let bikesTimeouts = [buildTimeOut(1), buildTimeOut(2), buildTimeOut(3), buildTimeOut(4), buildTimeOut(5)]

  //TODO
  const __bookBike = function(bikeId, slotId) {
    return new Promise((resolve, reject) => {
      //a = resolve
      //a('booked')
      if (bikeId == slotId) {
        rejectF[bikeId - 1]('rejected')
      }

      if (bikesTimeouts[bikeId - 1].state == 0) { 
        bikesTimeouts[bikeId - 1].startTimeOut()  // si no hay timeout en ese slot lo inicias
        // guardas resolve reject en el actual
      } else{
        rejectF[bikeId - 1]('rejected') // reject el de antes
        // guardas resolve reject en el nuevo
      }
      resolveF[bikeId - 1] = resolve  
      rejectF[bikeId - 1] = reject
    })
  }
  //TODO
  return{
    bookBike: __bookBike,
  }
}()

app.get('/book', function(req, res) {
    if (typeof bookBikeModule != "undefined") {
      //req.query.bikeId
      //req.query.slotId
      //res.write('booked');
      //res.write('rejected');
      //hint: promise.then((value)=>{}).catch((err)=>{}).finally(()=>res.end())
      bookBikeModule.bookBike(req.query.bikeId, req.query.slotId)
      .then(()=>res.write("booked"))
      .catch(()=>res.write("rejected"))
      .finally(()=>res.end())
      
    } else {
        // hardcoded response for when bookBike function is not implemented
        const randomBoolean = Math.random() < 0.5;
        setTimeout(()=>{
          res.write(randomBoolean ? 'booked' : 'rejected');
          res.end();
        }, 1000)
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));