
let canvas=document.getElementById("can");
let ctx=canvas.getContext("2d");
let data;
let img=new Image();
let imgData;
img.src="dog.jpg";

let arrTmp=[];
let original=[];    

let draw_color = "black";
let draw_width = "2";
let is_drawing=false;
let restore_array=[];
let Uindex=-1;
let Rindex=-1;
let redo_array=[];

let copic=false;

window.onload=function(){
    canvas.height=img.height;
    canvas.width=img.width;
    ctx.drawImage(img,0,0)
    imgData = ctx.getImageData(0, 0, img.width, img.height); 
    data = imgData.data;

    let tmp=[];
    original=spremeniVOriginal(data);
    arrTmp=spremeniVOriginal(data);


    document.getElementById("risalo").addEventListener("click",risi);
    document.getElementById("original").addEventListener("click",function(){
    
        console.log(original);
        for(let i=0;i<data.length;i++)
        {
            data[i]=original[i];
            arrTmp[i]=original[i];
        }
        ctx.putImageData(imgData,0,0);
    });

    document.getElementById("SubmitCustom").addEventListener("click",function(){
        tmp=CustomFilter();
        tmp=naredi1D(tmp);
        console.log(tmp);
    for(let i=0;i<data.length;i++)
    {
        data[i]=tmp[i];
        arrTmp[i]=tmp[i];
    }
    ctx.putImageData(imgData,0,0);
    });

    document.getElementById("sobel").addEventListener("click",function(){
        tmp=Sobel();
        tmp=naredi1D(tmp);
        console.log(tmp);
    for(let i=0;i<data.length;i++)
    {
        data[i]=tmp[i];
        arrTmp[i]=tmp[i];
    }
    ctx.putImageData(imgData,0,0);
    });

    document.getElementById("boxBlur").onclick=function(){
        tmp=boxBlur();
        tmp=naredi1D(tmp);
        for(let i=0;i<data.length;i++)
        {
            data[i]=tmp[i];
            arrTmp[i]=tmp[i];
        }
        ctx.putImageData(imgData,0,0);
    }

    document.getElementById("gaussian").onclick=function(){
        tmp=GaussianBlur();
        tmp=naredi1D(tmp);
        for(let i=0;i<data.length;i++)
        {
            data[i]=tmp[i];
            arrTmp[i]=tmp[i];
        }
        ctx.putImageData(imgData,0,0);
    }

    document.getElementById("laplace").onclick=function(){
        tmp=Laplace();
        tmp=naredi1D(tmp);
        for(let i=0;i<data.length;i++)
        {
            data[i]=tmp[i];
            arrTmp[i]=tmp[i];
        }
        ctx.putImageData(imgData,0,0);
    }

    document.getElementById("sivinjska").onclick=function(){
        tmp=sivinjskaSlika();
        for(let i=0;i<data.length;i++)
        {
            data[i]=tmp[i];
            arrTmp[i]=tmp[i];
        }
        ctx.putImageData(imgData,0,0);
    }
    
    document.getElementById("tresholding").onclick=function(){
        tmp=tresHolding();
        for(let i=0;i<data.length;i++)
        {
            data[i]=tmp[i];
            arrTmp[i]=tmp[i];
        }
        ctx.putImageData(imgData,0,0);
    }
   
    ctx.putImageData(imgData,0,0);
}


function risi(){
    if(copic==false){
        document.getElementById("lastnostiCopica").style.display="block";
        document.getElementById("clear").addEventListener("click",clear_canvas);
        canvas.addEventListener("mousedown",start,false);
        canvas.addEventListener("mousemove",draw,false);

        canvas.addEventListener("mouseup",stop,false);
        canvas.addEventListener("mouseout",stop,false);

        document.getElementById("undo").addEventListener("click",undo_last);
        document.getElementById("redo").addEventListener("click",redo);
        document.getElementById("risalo").style.backgroundColor="yellow";
        copic=true;
    }
    else{
        document.getElementById("lastnostiCopica").style.display="none";
        canvas.removeEventListener("mousedown",start,false);
        canvas.removeEventListener("mousemove",draw,false);

        canvas.removeEventListener("mouseup",stop,false);
        canvas.removeEventListener("mouseout",stop,false);

        document.getElementById("undo").removeEventListener("click",undo_last);
        document.getElementById("redo").removeEventListener("click",redo);
        document.getElementById("risalo").style.backgroundColor="#818181";
        copic=false;
    }
}
        

    function start(event){
        is_drawing=true;
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        event.preventDefault();
    }

    function draw(event){
        if(is_drawing){
            ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
            ctx.strokeStyle = draw_color;
            ctx.lineWidth = draw_width;
            ctx.lineCap = "round";
            ctx.lineJoin= "round";
            ctx.stroke();
        }
    }

    function stop(event){
        let arr=[];
        if(is_drawing){
            ctx.stroke();
            ctx.closePath();
            is_drawing=false;
        }
        event.preventDefault();
        if(event.type!= 'mouseout'){
            restore_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
            Uindex +=1;
        }
        arr=ctx.getImageData(0,0,canvas.width,canvas.height).data
    for(let i=0;i<data.length;i++)
        {
            data[i]=arr[i];
            arrTmp[i]=arr[i];
        }
    }

    function clear_canvas(){
        for(let i=0;i<data.length;i++)
        {
            data[i]=original[i];
            arrTmp[i]=original[i];
        }
        redo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
        ctx.putImageData(imgData,0,0);
        
        
    }

    function undo_last(){
        if(Uindex<=0){
            console.log("REDO: "+redo_array);
            console.log("UNDO: "+restore_array);
            clear_canvas();
        }
        else{
        Uindex -=1;
        Rindex+=1;
        redo_array.push(restore_array[restore_array.length-1]);
        restore_array.pop();
        ctx.putImageData(restore_array[Uindex],0,0);
        console.log("REDO: "+redo_array);
        console.log("UNDO: "+restore_array);
        }
    }

    function redo(){
        if(redo_array.length>0){
        restore_array.push(redo_array[redo_array.length-1]);
        Uindex+=1;
        ctx.putImageData(redo_array[Rindex],0,0);
        redo_array.pop();
        Rindex-=1;
        console.log("REDO: "+redo_array);
        console.log("UNDO: "+restore_array);
        }
    }

function spremeniVOriginal(arr){
    let newArr=[];
    for(let i=0;i<data.length;i++){
        newArr[i]=arr[i];
    }
    return newArr;

}

function naredi3D(arr){
    let newArr=[];
    
  
    let i=1;
    for(let j=0;j<img.height;j++){
        let row=[];
        for(i=0;i<img.width;i++){
            let pixel=[];
            for(let st=0;st<4;st++)
            {
                pixel.push(arr[j*img.width*4+i*4+st]);
                
            }
            row.push(pixel);
        }

            newArr.push(row);
    }
    return newArr;
}


function naredi1D(arr){
    let newArr=[];
    for(let x=0;x<img.height;x++){
        for(let y=0;y<img.width;y++){
            for(let st=0;st<4;st++)
                newArr.push(arr[x][y][st]);
        }
    }
    return newArr;
}


function boxBlur()
{
    let arr = naredi3D(data);
    let arr1 = naredi3D(data);
    let filter=[
        [1,1,1],
        [1,1,1],
        [1,1,1]
    ];
    let vs;
    for(let x=1;x<img.height-1;x++){
        for(let y=1;y<(img.width-1);y++){
            for(let st=0;st<3;st++)
            {
                vs=0;
                
                for(let i=0;i<3;i++)
                {
                    for(let j=0;j<3;j++)
                    {
                        vs+=arr[x-1+i][y-1+j][st]*filter[i][j];
                    }
                }

            arr1[x][y][st]=vs/9;
            }
        }
    }
    
    return arr1;
}

function Sobel(){
    let arr = naredi3D(data);
    let arr1 = naredi3D(data);
    let filter=[
        [1,0,-1],
        [2,0,-2],
        [1,0,-1]
    ];
    let vs;
    for(let x=1;x<img.height-1;x++){
        for(let y=1;y<(img.width-1);y++){
            for(let st=0;st<3;st++)
            {
                vs=0;
                
                for(let i=0;i<3;i++)
                {
                    for(let j=0;j<3;j++)
                    {
                        vs+=arr[x-1+i][y-1+j][st]*filter[i][j];
                    }
                }

            arr1[x][y][st]=vs;
            }
        }
    }
    
    return arr1;
}

function GaussianBlur(){
    let arr = naredi3D(data);
    let arr1 = naredi3D(data);
    let filter=[
        [1,2,1],
        [2,4,2],
        [1,2,1]
    ];
    let vs;
    for(let x=1;x<img.height-1;x++){
        for(let y=1;y<(img.width-1);y++){
            for(let st=0;st<3;st++)
            {
                vs=0;
                
                for(let i=0;i<3;i++)
                {
                    for(let j=0;j<3;j++)
                    {
                        vs+=arr[x-1+i][y-1+j][st]*filter[i][j];
                    }
                }

            arr1[x][y][st]=vs/16;
            }
        }
    }
    
    return arr1;
}

function Laplace(){
    let arr = naredi3D(data);
    let arr1 = naredi3D(data);
    let filter=[
        [-1,-1,-1],
        [-1,8,-1],
        [-1,-1,-1]
    ];
    let vs;
    for(let x=1;x<img.height-1;x++){
        for(let y=1;y<(img.width-1);y++){
            for(let st=0;st<3;st++)
            {
                vs=0;
                
                for(let i=0;i<3;i++)
                {
                    for(let j=0;j<3;j++)
                    {
                        vs+=arr[x-1+i][y-1+j][st]*filter[i][j];
                    }
                }

            arr1[x][y][st]=vs;
            }
        }
    }
    
    return arr1;
}

function sivinjskaSlika(){
    let arr=data;
    for(i=0;i<data.length;i+=4)
        {
            let avg=(data[i]+data[i+1]+data[i+2])/3.0;
            arr[i]=avg;
            arr[i+1]=avg;
            arr[i+2]=avg;
        }
        return arr;
}

function tresHolding(){
    let arr=data;
    let limit=100;
    for(i=0;i<data.length;i+=4)
        {
            let avg=(data[i]+data[i+1]+data[i+2])/3.0;
            
            if(avg<limit)
            {
            arr[i]=0;
            arr[i+1]=0;
            arr[i+2]=0;
            }

            else    {
            arr[i]=255;
            arr[i+1]=255;
            arr[i+2]=255;
            }
        }
        return arr;
}

function odstraniPosamezneKanale()
{
    let arr=data;
    let x= document.getElementById("inputOPK").value;
    x=parseInt(x);
    for(i=0;i<data.length;i+=4)
    {
        arr[i+x]=0;
    }
    return arr;
    
}

function poudarjanjePosameznegaKanala()
{
    let arr=spremeniVOriginal(data);
    let valueBarva= document.getElementById("inputPPK").value;
    
    valueBarva=parseInt(valueBarva);
    let rangeValue=document.getElementById("inputPPKrange").value;
    rangeValue=parseInt(rangeValue);
    
    for(i=0;i<data.length;i+=4)
    {
        arr[i+valueBarva]=arrTmp[i+valueBarva]+255*(rangeValue/100);
    }
    console.log(arr[0]);
    return arr;
}



function spremeniBGSelectOPK(){
    let selectOPK=document.getElementById("inputOPK");
    if(selectOPK.value==0)
    {
        selectOPK.style.backgroundColor="red";
    }
    if(selectOPK.value==1)
    {
        selectOPK.style.backgroundColor="green";
    }
    if(selectOPK.value==2)
    {
        selectOPK.style.backgroundColor="blue";
    }
    tmp=odstraniPosamezneKanale();
    for(let i=0;i<data.length;i++)
    {
        data[i]=tmp[i];
        arrTmp[i]=tmp[i];
    }
    ctx.putImageData(imgData,0,0);
}

function spremeniBGSelectPPK(){
    let selectPPK=document.getElementById("inputPPK");
    if(selectPPK.value==0)
    {
        selectPPK.style.backgroundColor="red";
    }
    if(selectPPK.value==1)
    {
        selectPPK.style.backgroundColor="green";
    }
    if(selectPPK.value==2)
    {
        selectPPK.style.backgroundColor="blue";
    }
    tmp=poudarjanjePosameznegaKanala();
    
    for(let i=0;i<data.length;i++)
    {
        data[i]=tmp[i];
        arrTmp[i]=tmp[i];
        
    }
    ctx.putImageData(imgData,0,0);
}



function SpreminjanjeSvetlostiSlike()
{
    let arr=spremeniVOriginal(data);
    console.log(arrTmp);
    let x= document.getElementById("inputSSSrange").value;
    x=parseInt(x);
    for(i=0;i<data.length;i+=4){
        arr[i]=arrTmp[i]+255*(x/100);
        arr[i+1]=arrTmp[i+1]+255*(x/100);
        arr[i+2]=arrTmp[i+2]+255*(x/100);
        }
        
    return arr;
}   

function SpremeniSvetlost(){
    tmp=SpreminjanjeSvetlostiSlike();
    for(let i=0;i<data.length;i++)
    {
        data[i]=tmp[i];
        arrTmp[i]=tmp[i];
    }
    ctx.putImageData(imgData,0,0);

}



function CustomFilter(){
    let arr = naredi3D(data);
    let arr1 = naredi3D(data);
    let f1=document.getElementById("f1").value;
    let f2=document.getElementById("f2").value;
    let f3=document.getElementById("f3").value;
    let f4=document.getElementById("f4").value;
    let f5=document.getElementById("f5").value;
    let f6=document.getElementById("f6").value;
    let f7=document.getElementById("f7").value;
    let f8=document.getElementById("f8").value;
    let f9=document.getElementById("f9").value;
    let filter=[
        [f1,f2,f3],
        [f4,f5,f6],
        [f7,f8,f9]
    ];
    let vs;
    for(let x=1;x<img.height-1;x++){
        for(let y=1;y<(img.width-1);y++){
            for(let st=0;st<3;st++)
            {
                vs=0;
                
                for(let i=0;i<3;i++)
                {
                    for(let j=0;j<3;j++)
                    {
                        vs+=arr[x-1+i][y-1+j][st]*filter[i][j];
                    }
                }

            arr1[x][y][st]=vs;
            }
        }
    }
    
    return arr1;
}




