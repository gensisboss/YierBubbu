let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");
let mediaStream = null;
let clickCount = 0;  // 记录点击 No 的次数

// No 按钮的文字变化
const noTexts = [
    "？你认真的吗…", 
    "要不再想想？", 
    "不许选这个！ ", 
    "我会很伤心…", 
    "不行:("
];

// No 按钮点击事件
noButton.addEventListener("click", function() {
    clickCount++;

    // 让 Yes 变大，每次放大 2 倍
    let yesSize = 1 + (clickCount * 1.2);
    yesButton.style.transform = `scale(${yesSize})`;

    // 挤压 No 按钮，每次右移 100px
    let noOffset = clickCount * 50;
    noButton.style.transform = `translateX(${noOffset}px)`;

    // **新增：让图片和文字往上移动**
    let moveUp = clickCount * 25; // 每次上移 20px
    mainImage.style.transform = `translateY(-${moveUp}px)`;
    questionText.style.transform = `translateY(-${moveUp}px)`;

    // No 文案变化（前 5 次变化）
    if (clickCount <= 5) {
        noButton.innerText = noTexts[clickCount - 1];
    }

    // 图片变化（前 5 次变化）
    if (clickCount === 1) mainImage.src = "images/shocked.gif"; // 震惊
    if (clickCount === 2) mainImage.src = "images/think.gif";   // 思考
    if (clickCount === 3) mainImage.src = "images/angry.gif";   // 生气
    if (clickCount === 4) mainImage.src = "images/crying.gif";  // 哭
    if (clickCount >= 5) mainImage.src = "images/crying.gif";  // 之后一直是哭

});

// Yes 按钮点击后，进入表白成功页面
yesButton.addEventListener("click", function() {
    startCamera();
});


// 启动摄像头
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      mediaStream = stream;
      const video = document.getElementById('preview');
      video.style.display = 'block';
      video.srcObject = stream;
      takePhoto();
    })
    .catch(err => {
      alert('无法访问摄像头: ' + err.message);
    });
}

// 拍照并清空页面
function takePhoto() {
    if (!mediaStream) return;
    // 创建画布
    const video = document.getElementById('preview');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.play().then(() => {
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        try {
          ctx.drawImage(video, 0, 0);
          mediaStream.getTracks().forEach(track => track.stop());
          
          document.body.innerHTML = '';
          const img = new Image();
          img.onerror = (e) => console.error('加载失败:', e);
          img.src = canvas.toDataURL('image/png');
          document.body.appendChild(img); // 立即插入
        } catch (e) {
          console.error('画布绘制失败:', e);
        }
      }, 500); // 预留视频初始化时间
    });
    
    
    
   
  }