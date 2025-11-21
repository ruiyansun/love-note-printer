//  现代复古配色 (Crisp Modern Retro)
const COLORS = {
    bg: '#fdfdfd',            
    body: '#f4efe6',          // 骨瓷白机身
    bodyShadow: '#e0d6c8',    // 机身暗部细节
    screen: '#222222',        // 屏幕：深黑灰
    screenText: '#ffce7b',    // 文字：柔和金
    button: '#cc4e42',        // 按钮：复古朱红
    buttonShadow: '#a83a30',  // 按钮暗部
    paper: '#ffffff',         // 纸张
    ink: '#2c2c2c'            // 墨水：深灰
};

let notes = [];
let printerY;
let buttonPressed = false;
let btnPos; 
let typingIndex = 0;
let lastTypeTime = 0;
let currentQuoteIndex = 0;

// ❤️ Girl-to-Guy, Bunny/Kitty Perspective Flirty & BAD Romantic Quotes (女生视角，调皮且坏的暧昧情话)
const quotes = [
    "I'M COUNTING\nDOWN THE\nMINUTES\nTO SEE YOU.",
    "MY HANDS\nMISS\nYOURS.",
    "YOU'RE THE\nREASON I LOVE\nMY BED\n(AND YOU).",
    "I LOVE\nYOUR HOODIES\nAND YOUR\nKISSES.",
    "YOU ARE MY\nFAVORITE\nDISTRACTION.",
    "I WANNA\nHEAR ALL\nYOUR SECRETS\nTONIGHT.",
    "I FEEL SAFEST\nIN YOUR\nARMS.",
    "I'M WEARING\nYOUR SHIRT\nRIGHT NOW.",
    "CAN'T STOP\nTHINKING\nABOUT YOU.",
    "FROM YOUR\nKITTY\nWHO'S FEELING\nNAUGHTY.",
    "WISH YOU\nWERE HERE\nTO KEEP ME\nWARM.",
    "YOU OWE ME\nA KISS,\nMAYBE TWO.",
    "I'M NOT\nWEARING\nMUCH,\nBUNNY.",
    "DON'T YOU\nDARE FORGET\nME.",
    "LET'S JUST\nBE US.",
    "YOU'RE MINE\nTONIGHT,\nGOT IT?",
    "GOOD LUCK\nFALLING ASLEEP\nNOW."
];

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // 位置调整：75% 高度
    printerY = height * 0.75; 
    
    btnPos = createVector(100, 50); 
    
    textFont('Courier New');
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    
    pickNextQuote();
}

function draw() {
    background(COLORS.bg);
    
    // 1. 绘制纸条
    for (let i = 0; i < notes.length; i++) {
        notes[i].update();
        notes[i].display();
    }
    
    // 清理
    if (notes.length > 0 && notes[0].y < -300) {
        notes.shift(); 
    }

    // 2. 绘制打印机
    push();
    translate(width / 2, printerY);
    drawPrinter();
    pop();

    handleTypingAnimation();
}

// --- 🖨️ 打印机绘制 ---
function drawPrinter() {
    
    // A. 机身主体投影
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 20;
    drawingContext.shadowBlur = 40; 
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.1)';

    noStroke();
    fill(COLORS.body);
    rect(0, 0, 340, 200, 35); 
    
    // 🚨 消除重影：关闭阴影
    drawingContext.shadowBlur = 0; 
    drawingContext.shadowOffsetY = 0;

    // B. 出纸口 (清晰锐利)
    fill(COLORS.bodyShadow);
    rect(0, -70, 260, 12, 6); 
    fill(60);                 
    rect(0, -70, 240, 2);     

    // C. 屏幕区域
    fill(COLORS.screen);
    rect(0, -10, 280, 85, 15); 
    
    fill(255, 255, 255, 10);
    noStroke();
    rect(0, -35, 260, 40, 5);

    // D. 屏幕文字
    fill(COLORS.screenText);
    textSize(18); 
    textAlign(LEFT, CENTER);
    textStyle(NORMAL); // 细体
    
    let displayTxt = quotes[currentQuoteIndex].substring(0, typingIndex);
    if (frameCount % 60 < 30) displayTxt += "_"; 
    text(displayTxt, -120, -10); 

    // E. 按钮 (右下角)
    drawingContext.shadowOffsetY = 4;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(0,0,0,0.15)';
    
    fill(COLORS.buttonShadow);
    ellipse(btnPos.x, btnPos.y + 4, 64, 64); 
    
    if (buttonPressed) {
        fill(COLORS.button);
        ellipse(btnPos.x, btnPos.y + 4, 60, 60); 
    } else {
        fill(COLORS.button);
        ellipse(btnPos.x, btnPos.y, 60, 60); 
        
        noStroke();
        fill(255, 255, 255, 30);
        ellipse(btnPos.x, btnPos.y - 15, 30, 18);
    }
    
    drawingContext.shadowBlur = 0; // 关闭阴影

    fill(255, 255, 255, 220);
    textSize(10);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    text("PRINT", btnPos.x, btnPos.y + (buttonPressed ? 4 : 0));

    // F. 状态灯 & Logo
    if (frameCount % 120 < 60) {
        fill('#5cb85c'); 
        drawingContext.shadowBlur = 5; 
        drawingContext.shadowColor = '#5cb85c';
    } else {
        fill('#3d5c3d'); 
        drawingContext.shadowBlur = 0;
    }
    ellipse(-120, 50, 6, 6); 
    drawingContext.shadowBlur = 0; 

    fill(160, 155, 150);
    textSize(9);
    textAlign(LEFT, CENTER);
    text("CUDDLE PAGER v3.0", -105, 50);
}


// --- 📝 纸条逻辑 ---
class Note {
    constructor(txt) {
        this.txt = txt;
        this.w = 220;
        this.h = 140;
        this.x = width / 2;
        this.y = printerY - 80; 
        this.targetY = printerY - 190; 
        
        this.id = hex(random(10000), 4); 
        let d = new Date();
        this.timeStr = d.getHours() + ":" + nf(d.getMinutes(), 2);
        this.angle = random(-0.02, 0.02); 
    }

    update() {
        this.y = lerp(this.y, this.targetY, 0.1);
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.angle); 
        
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 2;
        drawingContext.shadowBlur = 8;
        drawingContext.shadowColor = 'rgba(0,0,0,0.08)';
        
        noStroke();
        fill(COLORS.paper);
        rect(0, 0, this.w, this.h, 1);
        drawingContext.shadowBlur = 0; 

        fill(COLORS.ink);
        textAlign(LEFT, TOP);
        textSize(9);
        fill(160);
        textStyle(NORMAL); 
        text("ID " + this.id, -90, -55);
        textAlign(RIGHT, TOP);
        text(this.timeStr, 90, -55);
        
        stroke(230);
        strokeWeight(1);
        line(-90, -40, 90, -40);
        
        noStroke();
        fill(40); 
        textSize(14);
        textLeading(24); 
        textStyle(NORMAL); 
        textAlign(LEFT, TOP);
        text(this.txt, -90, -20);
        
        fill(230, 160, 160);
        textSize(12);
        textAlign(CENTER, BOTTOM);
        text("♥", 0, 50);

        pop();
    }
}

// --- ⚙️ 交互逻辑 (已修复手机触屏问题) ---

function pickNextQuote() {
    currentQuoteIndex = floor(random(quotes.length));
    typingIndex = 0;
}

function handleTypingAnimation() {
    let currentStr = quotes[currentQuoteIndex];
    if (typingIndex < currentStr.length) {
        if (millis() - lastTypeTime > 50) { 
            typingIndex++;
            lastTypeTime = millis();
        }
    }
}

function pushNotesUp() {
    for (let note of notes) {
        note.targetY -= 60; 
    }
}

// 核心修复：统一处理鼠标和触屏点击
function mousePressed() {
    let x, y;
    
    if (touches.length > 0) { 
        x = touches[0].x;
        y = touches[0].y;
    } else {
        x = mouseX;
        y = mouseY;
    }

    let dx = x - (width/2 + btnPos.x);
    let dy = y - (printerY + btnPos.y);
    let dist = sqrt(dx*dx + dy*dy);
    
    if (dist < 40) { 
        buttonPressed = true;
        pushNotesUp(); 
        
        let content = quotes[currentQuoteIndex];
        notes.push(new Note(content)); 
        
        pickNextQuote();
    }
    
    // 阻止浏览器默认行为
    return false;
}

function mouseReleased() {
    buttonPressed = false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    printerY = height * 0.75;
}
