//json資料容器
let mainData={}
let youPlayer;
let mesgPack=[]
let YID=""
let myPlayer
let myChart 
//#region 讀取圖片資源管理
const loadImgManager = ()=>{
    return new Promise(resovle=>{
    const assetsList = [
        'timer.svg',
        'stand.svg',
        'sit.svg',
        "checked.svg"
    ]
    let ct = 0
    const loadImgAssets = url =>{
        const img = new Image()
        img.src= url
        img.onload = ()=>{
            //onsole.log(`image ${assetsList[ct]} load complete`)
            ct++
            if(ct<assetsList.length){   
                loadImgAssets(`${imgPath}${assetsList[ct]}`)
            }else{
                console.log('load all img complete')
                resovle(true)
            }
        }
    }
    loadImgAssets(`./img/${assetsList[ct]}`)
    })
}
//#endregion

//#region 離開遊戲回到APP
const backToApp = ()=>{
    console.log(deepLink)
    document.querySelector(".app.portrait").style.display = "none"
    document.querySelector(".toDeepLink").style.display = "flex"

    window.open(deepLink, "_self")
}
//#endregion 離開遊戲回到APP

//#region IPAD debug用
let debuggerMesh = {}
const setDebugger = (label, value) =>{
    //let _mesg = {...debuggerMesh}
    debuggerMesh[label] = value
    let txt = ""
    for(let _val in debuggerMesh){
        txt +=`${_val}:${debuggerMesh[_val]} <br/>`
    }
    document.querySelector("#debug").innerHTML = txt
}
//#endregion

//#region 防止double tap 

window.onload = () => {
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}
//#endregion

//#region 取得狀態資料 
const getResultData = () => {
    const formData = new FormData()
    formData.append("saveData", resultPath)
    return new Promise((result, reject)=>{
        if(!resultPath){
            result(`savePath 尚未設定 : ${resultPath}`)
        }
        fetch(resultPath, {
            method: 'GET',
            //method: 'POST',
            //body:formData
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(res => {
            if (res) {
                result(res)
            } else {
                alert("取得資料失敗")
            }
        })
    })
}
//#endregion

//#region 讀取json設定檔
const loadData = () => {
    return new Promise(resolve=>{
        fetch("./js/data.json", {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(res => {
            if (res) {
                return res
            } else {
                alert("取得資料失敗")
            }
        }).then(res => {
            resolve(res)
        }).catch(error => {
            console.error('json 取得失敗:', error)
        });
    })
}
//#endregion

//#region 頁面控制
const closeAll = () => {
    const pages = document.querySelectorAll(".page")
    pages.forEach(page => {
        page.style.display = "none"
    })
}

const openPage = pageID =>{
    closeAll()
    document.querySelector(pageID).style.display = "flex"
}
//#endregion

//#region 進入結束步驟後送出資料
const sendData = () => {
    const formData = new FormData()
    //console.log(myPlayer.videoId)
    //formData.append("saveData", myPlayer.videoId)
    return new Promise((resovle, reject)=>{
        if(!savePath){
            resovle(`savePath 尚未設定 : ${savePath}`)
        }
        fetch(savePath, {
            method: 'GET',
            //method: 'POST',
            //body:formData
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(res => {
            if (res) {
                resovle(res)
            } else {
                alert("取得資料失敗")
            }
        })
    })
}
//#endregion

document.addEventListener('DOMContentLoaded', () => {
    //#region 偵測頁面方向
    const detectOrientation =  () => {
        setTimeout(() => {
            //console.log( window.orientation )
            if(window.orientation == 90  || window.orientation == -90 ){
                document.querySelector(".app.landscape").style.display = 'flex'
                document.querySelector(".app.portrait").style.display = 'none'
            }else{
                document.querySelector(".app.landscape").style.display = 'none'
                document.querySelector(".app.portrait").style.display = 'flex'
            }
            setDebugger( "window.orientation", window.orientation)
        }, 500);
    }
    window.addEventListener('resize', detectOrientation)
    detectOrientation()
    //#endregion

    myPlayer = new MyPlayer()
    myPlayer.doEnd =()=>{
        document.querySelector(".openPanel").style.display= 'inline'  
        sendData().then(res=>{
            console.log(res)
            if(res.result == "ok"){
                openPage('#end')
            }
        })
    }

    if (document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled) {
    
        // which element will be fullscreen
        var iframe = document.querySelector('#youPlayer');
        // Do fullscreen
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();console.log(1)
        } else if (iframe.webkitRequestFullscreen) {
          iframe.webkitRequestFullscreen();console.log(2)
        } else if (iframe.mozRequestFullScreen) {
          iframe.mozRequestFullScreen();console.log(3)
        } else if (iframe.msRequestFullscreen) {
          iframe.msRequestFullscreen();console.log(4)
        }
      }

    const setMovList = data =>{
        const listBox = document.querySelector('#QResult .playList')
        while(listBox.lastChild){
            listBox.removeChild(listBox.lastChild)
        }
        data.list.map(item=>{
            const btn  = document.createElement('button')
            btn.innerHTML = item.title
            listBox.appendChild(btn)
            if(item.watched == 1){
                btn.classList.add("watched")
            }
            btn.addEventListener("click", ()=>{
                //setMovePlayer(item)
                myPlayer.setMov(item.videoId) 
                document.querySelectorAll(`.movType .stand, .movType .sit`).forEach(ct=>{
                    if(ct.classList.contains(item.type)){
                        ct.style.display = "flex"
                    }else{
                        ct.style.display = "none"
                    }
                })
                YID = item.videoId
                openPage(".movType")
            })
        })
    }

    document.querySelector(".readyToPlay").addEventListener('click', ()=>{

        openPage("#count")
        document.querySelector("#count").style.display= 'flex'                
        document.querySelector(".openPanel").style.display= 'none'                
        setTimeout(()=>{
            myPlayer.replay()
            setTimeout(()=>{
                openPage("#player")
            }, 200)
        }, 5400)
    })


    //#region 設置結束頁面按鈕
    document.querySelector("#end button.backToMenu").addEventListener('click', ()=>{
        document.querySelector(".loading").classList.remove('off')
        init()
        openPage("#QResult")
    })

    document.querySelector("#end button.reStart").addEventListener('click', ()=>{
        openPage("#count")
        document.querySelector("#count").style.display= 'flex'                
        setTimeout(()=>{
            myPlayer.replay()
            setTimeout(()=>{
                openPage("#player")
            }, 200)
        }, 5400)
    })

    document.querySelector("#end button.quit").addEventListener('click', ()=>{
        backToApp()
    })
    //#endregion 設置結束頁面按鈕

    const QPopup = () => {
        const panel = document.querySelector(".QuitPanel")
        const quit = panel.querySelector(".quit")
        const keepGoing = panel.querySelector(".keepGoing")

        document.querySelector(".appBar .openPanel").addEventListener("click",()=>{
            let exitType= 0
            document.querySelectorAll(`.app.portrait .page[class^="qm"]`).forEach(page=>{
                if(page.style.display=="flex"){
                    exitType = 1
                }
            })
            if(exitType == 1){
                panel.style.display = "flex"
            }else{
                backToApp()
            }    
        })

        quit.addEventListener("click",()=>{
            backToApp()
        })

        keepGoing.addEventListener("click",()=>{
            panel.style.display = "none"
        })
    }

    const QResult = data => {
        console.log(data)
        const template1 =  document.querySelector(".QResult")
        const playList =  template1.querySelector("#QResult .playList")
        const hintPanel =  template1.querySelector("#QResult .hintPanel")
        const hintPanelOpenBtn =  template1.querySelector("#QResult .openHint")
        const hintPanelCloseBtn =  template1.querySelector("#QResult .hintPanel .close")
        
        template1.querySelector(".lastDate").innerHTML = data.lastDate
        template1.querySelector(".currentDate").innerHTML = data.currentDate
        template1.querySelector(".currentAge").innerHTML = data.currentAge

        if( data.lastAge){
            template1.querySelector(".lastTxt").style.display = "block"
            template1.querySelector(".lastAge").innerHTML = data.lastAge
        }

        hintPanelOpenBtn.addEventListener("click",()=>{
            hintPanel.style.display = "flex"
           
        })

        hintPanelCloseBtn.addEventListener("click",()=>{
            hintPanel.style.display = "none"
        })
        /*
        playList.querySelectorAll("button").forEach((pBtn,index)=>{
            pBtn.addEventListener("click",()=>{
                alert("playlist-"+index)
            })
        })*/
        const cData = {
            labels: [
                '知覺動作','專注力','執行力','記憶力','語言力'
            ],
            datasets: [{
                label: 'My First Dataset',
                data: data.currentStatus,
                fill: true,
                backgroundColor: 'rgba(34, 172, 178, 0.5)',
                //borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            },
            {
                label: 'My First Dataset',
                data: data.lastStatus,
                fill: true,
                backgroundColor: 'rgba(182, 183, 183, 0.5)',
                //borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
        };
        const config = {
            type: 'radar',
            data: cData,           
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        beginAtZero: true,
                        pointLabels: {
                        color: "#5C6BC0",
                        font: {
                            size: 18,
                        }
                        }
                    },
                },
                layout: {
                    padding: {
                        left: 15,
                        right: 15
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            },
        };
        if(myChart){
            myChart.config = config
        }else{
            myChart = new Chart(template1.querySelector("#chart"), config);
        }
    }

    //init
    closeAll()

    const init = ()=>{
        loadImgManager().then(res=>{
            if(res) {
                return getResultData()
            } 
        }).then(res=>{ 
            QResult(res)
            return  loadData()
        }).then(res=>{
            setMovList(res)
            QPopup()
            document.querySelector(".loading").classList.add('off')
            document.querySelector('#QResult').style.display = "flex" 
        })
    }
    
    init()
    //loadDataWithoutJson()
    //document.querySelector(`#${currentPage}`).style.display = "flex"
   
    
})

class MyPlayer{
    YTPlayer={}
    timeCount = 0
    countAction=(time)=>{}//計時器的行為
    doEnd = ()=>{}//結束後行為
    interval = null
    endSw = false
    constructor(){
        console.log('init MyPlayer')
        setTimeout(() => {
            this.YTPlayer = new YT.Player('youPlayer', {
                /*playerVars: {
                    'controls': 0,
                    'modestbranding':1,
                    'autoplay':1,
                    'showinfo':0
                },*/
                //videoId: 'sbFsUWL_QFM',
                events: {
                    'onReady':  e=>{
                        //console.log(e)  
                        this.YTPlayer.playVideo();                  
                        //e.target.loadVideoById('DmWoaB7fM5U')
                    },
                    'onStateChange': e=>{
                        setDebugger("MyPlayer", JSON.stringify(e.data))
                        if(e.data == 1) {
                            //this.interval = setInterval(this.intervalAction, 1000); 
                        }
                        //if(e.data == 0 || e.data == 2) clearInterval(this.interval)
                        if(e.data == 0){
                            this.doEnd()

                        }
                    }
                }
            });
          
        }, 1000);
    }
    
    intervalAction =()=>{
        this.timeCount++
        this.countAction()
    }

    setMov = id =>{
        this.timeCount = 0
        this.YTPlayer.cueVideoById({
            'videoId': id,
            'startSeconds': 0,
            'suggestedQuality': 'large'
        })
        this.YTPlayer.pauseVideo();
        this.YTPlayer.mute();
    }
    play = () =>{
        this.YTPlayer.unMute();
        this.YTPlayer.playVideo();
    }
    replay = () =>{
        this.YTPlayer.unMute();
        this.YTPlayer.seekTo(0);
        this.YTPlayer.playVideo();
        
    }
    mute = () =>{
        this.YTPlayer.mute();
    }
    unMute = () =>{
        this.YTPlayer.unMute();
    }
    pause=()=>{
        this.timeCount = 0
        this.YTPlayer.pauseVideo();
    }
}
