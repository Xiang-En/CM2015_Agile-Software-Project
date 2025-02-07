////////////////////Cuong//////////////////////////////// Cuong coded the whole file
let day = [];
let month = [];
let minute = [];
let hour = [];
let total = [day, month, hour,minute];
let master = [31,12,24,60];
let iter =[1,1,1,15];
let initial = [1,1,0,0];
for(let i = 0; i < total.length; i++){
    for(let j = initial[i]; j<=master[i]; j= j + iter[i]){
        let val;
        if(j <= 9){
            val = eval("0"+j);
        }else{
            val = j.toString();
        }
        total[i].push(val);
    }
}
// for(let i=1;i<=31;i++){
//   let val;
//   if(i <= 9){
//     val = eval("0"+i);
//   }else{
//     val = i.toString();
//   }
//   day.push(val);
// }
// for(let i=1;i<=12;i++){
//   let val;
//   if(i <= 9){
//     val = eval("0"+i);
//   }else{
//     val = i.toString();
//   }
//   month.push(val);
// }

export default total;