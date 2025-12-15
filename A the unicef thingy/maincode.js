
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("fixedcanvas");
const ctx2 = canvas2.getContext("2d");

let intervalspeed = 16; //usually 16
let playingact = 0;

let humanimg = new Image();
humanimg.src = 'img/general/human.png';
let babyhumanimg = new Image();
babyhumanimg.src = 'img/general/babyhuman.png';

let player = {
    size: 50,
    basespeed: 4,
    x: 0,
    y: 20,
    rotation: 0,
    preventmovement: false,
    lockrotation: NaN,
    target: [],
    draw() {
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-(this.x + this.size / 2), -(this.y + this.size / 2));
        ctx.drawImage(humanimg, this.x, this.y, this.size, this.size);
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(-this.rotation);
        ctx.translate(-(this.x + this.size / 2), -(this.y + this.size / 2));
    }
}

let npcs = {
    human: [],
    paths: {
        act1: {
        },
        act2: {
            tentwithint: {
                enter: [[46, 341], [412, 341], [430, 215]],
                exit: [[428, 381], [73, 381], [0, 285]],
            },
        },
    },
    draw() {
        let playwalkingaud = false;
        for(let forx = 0; forx<npcs.human.length; forx++){
            const npc = this.human[forx];
            function npccenter() {
                return [npc.x + npc.size / 2, npc.y + npc.size / 2];
            }
            if(Math.floor(Math.random() * (200 - 1 + 1)) + 1==1){
                let lookx = Math.floor(Math.random() * ((npc.lookcoords.length - 1) - 0 + 1)) + 0;
                let lookcoords = [
                    Math.floor(Math.random() * ((npc.lookcoords[lookx].x + npc.lookcoords[lookx].w) - npc.lookcoords[lookx].x + 1)) + npc.lookcoords[lookx].x,
                    Math.floor(Math.random() * ((npc.lookcoords[lookx].y + npc.lookcoords[lookx].h) - npc.lookcoords[lookx].y + 1)) + npc.lookcoords[lookx].y,
                ];
                npc.rotation = Math.atan2(npccenter()[1] - lookcoords[1], npccenter()[0] - lookcoords[0]) - 90 * Math.PI / 180;
            };
            if(npc.path.length!=0){
                let currentpath = [npc.path[0][0] + objects[misc.act2.interacting].x, npc.path[0][1] + objects[misc.act2.interacting].y];
                currentpath = [npc.path[0][0] + objects[misc.act2.interacting].x, npc.path[0][1] + objects[misc.act2.interacting].y];
                npc.rotation = Math.atan2(npc.y - currentpath[1], npc.x - currentpath[0]) - 90 * Math.PI / 180;
                npc.x -= npc.basespeed * 0.5 * Math.cos(npc.rotation + 90 * Math.PI / 180);
                npc.y -= npc.basespeed * 0.5 * Math.sin(npc.rotation + 90 * Math.PI / 180);
                playwalkingaud = true;
                if(npc.x + npc.basespeed>currentpath[0] && npc.x - npc.basespeed<currentpath[0] && npc.y + npc.basespeed>currentpath[1] && npc.y - npc.basespeed<currentpath[1]){
                    npc.x = currentpath[0];
                    npc.y = currentpath[1];
                    npc.path.shift();
                };
            };
            ctx.translate(npccenter()[0], npccenter()[1]);
            ctx.rotate(npc.rotation);
            ctx.translate(-npccenter()[0], -npccenter()[1]);
            ctx.drawImage(humanimg, npc.x, npc.y, npc.size, npc.size);
            if(npc.hasbaby && misc.act2.npccheckid==forx && misc.act2.muac.step!=-1){
                ctx.translate(npccenter()[0], npccenter()[1]);
                ctx.rotate(-npc.rotation);
                ctx.translate(-npccenter()[0], -npccenter()[1]);
                ctx.drawImage(babyhumanimg, player.x - 40, player.y + 5, 20, 20);
                continue;
            }else if(npc.hasbaby){
                ctx.drawImage(babyhumanimg, npc.x + npc.size - 20, npc.y - 5, 20, 20);
            };
            ctx.translate(npccenter()[0], npccenter()[1]);
            ctx.rotate(-npc.rotation);
            ctx.translate(-npccenter()[0], -npccenter()[1]);
        };

        if(!playwalkingaud){
            audio.playaud(audio.general.npcwalking, 'pause');
        }else if(audio.general.npcwalking.paused){
            audio.playaud(audio.general.npcwalking);
        };
    },
}

let misc = {  //NOTE: this code may be a bit messy as I was somewhat exhausted while writing
    act1: {
        backgroundimg: {
            solid: '#71a06e',
            scale: 31.545,
            imgx: -3378,
            imgy: -3305.58,
        },
        interacting: -1,
        knockingdelay: 0, //delay in frames
        wins: 0,
        scriptreadpos: 0,
        npcresponsestring: '',
        npctypedelay: 0,
        npcaction: '',
        preventplayertype: false,
        npctalking: false,
        houseToKnock: 0,
        houseknocked: 0,
        typed: 0,
        stutters: 0,
        totaltyped: 0,
        totalstutter: 0,
        combo: 0,
        longestcombo: 0,
        dialogues: {
            positive: [
                "Okay I'll donate.",
                "Yup here's my debit card.",
                "I have a debit card.",
                "Okay I will give you some money.",
                "Oh I see now, I will support this.",
                "Alright I will donate.",
                "Sure here you go.",
            ],
            negative: [
                "No thanks.",
                "Here, I might do it with the website sometime.",
                "Maybe later with the website.",
                "I'm good.",
                "Sorry, maybe later.",
                "No, sorry.",
                "Yea actually I think I already have a monthly debit payment set up.",
                "Okay if I recall, I'm sure I already set it up.",
            ],
            neutral: [
                "Maybe..",
                "Tell me more..",
                "Hmm..",
                "Okay..",
                "Uh no debit card..",
                "May you tell me more about this.",
                "Okay, interesting..",
            ],
            start: [
                "Okay..",
                "Okay, what is this?",
                "Okay, what's this about?",
                "Hmm..",
                "Interesting..",
            ],
            endpositive: "[fundraising was successful]",
            playscript: [
                "Hi, I am with the non profit charity UNICEF.",
                ['negative', 'start', 'start', 'start'],
                "Our charity, UNICEF, aims to give human rights such as clean water and food for those in Gaza that don't have access to this.",
                "We are wondering if you are able to generously provide a donation to us.",
                "This would greatly help us give to those in need.",
                "You can set up a monthly recurring debit card donation to help out the cause.",
                ['positive', 'negative', 'neutral', 'neutral'],
                "Okay, UNICEF aids to make human rights more accessible in poorer countries.",
                "We distribute life saving vaccinations to poor Ethiopians, built powered water access for kids forced with dirty water in Africa, and much more.",
                "Setting up a monthly debit card donation would be a great way to help out those in need of these crucial supplies.",
                ['positive', 'positive', 'negative', 'neutral'],
                "With UNICEF, one donation could help reduce the mortality of many children in poverty.",
                "Over months, that can add up to a great sum of children saved.",
                "We would recommend setting up a recurring donation if you have the ability to pitch in and help.",
                ['positive', 'positive', 'positive', 'negative'],
            ],
            stutters: [
                ' uhm ',
                ' uh ',
                ' uhh ',
                ' umm ',
                ' um '
            ],
        },
        keyboard(objectswithinteract) {
            function finalreturn() {
                let textcolor = '#ff8888ff';
                let text = 'failed';
                if(misc.act1.npcaction == 'positive'){
                    textcolor = '#6bad3fff';
                    text = 'success';
                    misc.act1.wins += 1;
                };
                objects[misc.act1.interacting].special.interacted = true;
                misc.act1.interacting = -1;
                misc.act1.scriptreadpos = 0;
                misc.act1.npcresponsestring = '';
                misc.act1.npctypedelay = 0;
                misc.act1.npcaction = '';
                misc.act1.preventplayertype = false;
                misc.act1.npctalking = false;
                misc.act1.houseknocked += 1;
                misc.act1.typed = 0;
                misc.act1.stutters = 0;
                scriptread.innerHTML = '';
                scripttoread.innerHTML = '';
                npcresponse.innerHTML = '';
                let array = {
                    id: objects.length,
                    name: 'text',
                    x: player.x,
                    y: player.y,
                    angle: 0,
                    rotatex: 0,
                    rotatey: 0,
                    color: textcolor,
                    fontstyle: '18px Arial',
                    textcontents: text,
                }
                objects.push(array);
                audio.playaud(audio.act1.doorclose);
                keysdown = [];
            }

            if(this.interacting==-1){
                this.knockingdelay = 375;
                if(Number(canvas.style.zoom)>0.75){
                    canvas.style.zoom = Number(canvas.style.zoom) - (Number(canvas.style.zoom) - 0.72) * 0.015 + '';
                }else if(this.houseToKnock==this.houseknocked && this.houseToKnock!=0 && playingact==1){
                    finishedact(playingact);
                };
                for(let forx = 0; forx<objectswithinteract.length; forx++){
                    let objwitcol = objectswithinteract[forx];
                    let navcurr = interactions.current[objwitcol.interactpath];
                    for(let forx2 = 0; forx2<navcurr.length; forx2++){
                        if(objwitcol.special.interacted || objwitcol.special.interacting){
                            continue;
                        };
                        if(collision('rectcirc', objwitcol.x, objwitcol.y, navcurr[forx2].x, navcurr[forx2].y, navcurr[forx2].w, navcurr[forx2].h, [objwitcol.angle], [objwitcol.rotatex], [objwitcol.rotatey], player.x, player.y, 0, 0, player.size, player.size, [player.rotation], [player.size / 2], [player.size / 2])){
                            document.getElementById('act1space').style.top = '85%';
                            if(keyclicked.indexOf(' ')>-1){
                                this.interacting = objwitcol.id;
                            };
                        };
                    };
                };
                return;
            };

            let scriptread = document.getElementById('playerscripttextread');
            let scripttoread = document.getElementById('playerscripttext');
            let npcresponse = document.getElementById('npcresponse');
            player.preventmovement = true;
            this.knockingdelay -= Math.floor(Math.random() * (2.5 - 0 + 1) + 0);
            if(Number(canvas.style.zoom)<1.8){
                canvas.style.zoom = Number(canvas.style.zoom) + (2.1 - Number(canvas.style.zoom)) * 0.015 + '';
            };
            if(this.knockingdelay>=0){
                scripttoread.innerHTML = this.dialogues.playscript[this.scriptreadpos];
                if(this.knockingdelay>370){
                    audio.playaud(audio.act1.knocking);
                }else if(this.knockingdelay<130 && this.knockingdelay>120){
                    audio.playaud(audio.act1.dooropen);
                };
                if(typeof objects[this.interacting].special.scripted=='string'){
                    this.npctalking = true;
                    this.npctypedelay = 0;
                    scriptread.innerHTML = '';
                    scripttoread.innerHTML = '';
                    npcresponse.innerHTML = '';
                    let npcmood = objects[this.interacting].special.scriptedaction;
                    let npcfinal = objects[this.interacting].special.scripted;
                    this.npcresponsestring = npcfinal;
                    this.npcaction = npcmood;
                    this.preventplayertype = false;
                };
                return;
            };

            document.getElementById('act1keyboardgame').removeAttribute('hidden');
            if(this.typed>15){
                this.preventplayertype = true;
                this.npctypedelay -= 1;
                if(this.npctypedelay>=0){
                    return;
                };
                audio.playaud(audio.act1.autotyping);
                scriptread.innerHTML += scripttoread.innerHTML.charAt(0);
                scripttoread.innerHTML = scripttoread.innerHTML.substring(1);
                this.npctypedelay = 3;
                if(scriptread.innerHTML.charAt(0)=='.'){
                    this.npctypedelay += 12;
                };
                if(keysdown.indexOf(' ')>-1){
                    this.npctypedelay = 0;
                };
            };

            if(this.stutters>7){
                this.typed = 0;
                this.stutters = 0;
                this.npctalking = true;
                this.npctypedelay = 10;
                scriptread.innerHTML = '';
                scripttoread.innerHTML = '';
                npcresponse.innerHTML = '';
                let npcmood = 'negative';
                let npcfinal = this.dialogues[npcmood][Math.floor(Math.random() * ((this.dialogues[npcmood + ''].length - 1) - 0 + 1) + 0)];
                if(this.scriptreadpos==0){
                    npcfinal = 'I think I will do okay without your services.';
                };
                this.npcresponsestring = npcfinal;
                this.npcaction = npcmood;
                this.preventplayertype = false;
            };

            if(scripttoread.innerHTML.length!=0){
                return;
            };
        
            if(npcresponse.innerHTML.length!=this.npcresponsestring.length && this.npctalking){
                this.npctypedelay -= 1;
                if(this.npctypedelay>=0){
                    return;
                };
                audio.playaud(audio.general.talking);
                npcresponse.innerHTML += this.npcresponsestring.charAt(npcresponse.innerHTML.length);
                this.npctypedelay = 4;
                if(npcresponse.innerHTML.charAt(npcresponse.innerHTML.length - 1)=='.'){
                    this.npctypedelay += 110;
                };
            }else if(typeof this.dialogues.playscript[this.scriptreadpos + 1]!=='string'){
                if(this.npcaction!='start' && this.npcaction!='neutral' && this.npcaction!=''){
                    finalreturn();
                    return;
                };
                this.typed = 0;
                this.stutters = 0;
                this.npctalking = true;
                this.npctypedelay = 10;
                this.scriptreadpos += 1;
                scriptread.innerHTML = '';
                scripttoread.innerHTML = '';
                npcresponse.innerHTML = '';
                let npcmood = this.dialogues.playscript[this.scriptreadpos][Math.floor(Math.random() * ((this.dialogues.playscript[this.scriptreadpos].length - 1) - 0 + 1) + 0)];
                let npcfinal = this.dialogues[npcmood][Math.floor(Math.random() * ((this.dialogues[npcmood + ''].length - 1) - 0 + 1) + 0)];
                this.npcresponsestring = npcfinal;
                this.npcaction = npcmood;
                this.preventplayertype = false;
            }else{
                if(this.npcaction!='start' && this.npcaction!='neutral' && this.npcaction!=''){
                    finalreturn();
                    return;
                };
                this.typed = 0;
                this.stutters = 0;
                this.npctalking = false;
                this.npctypedelay = 0;
                this.scriptreadpos += 1;
                this.preventplayertype = false;
                scripttoread.innerHTML = this.dialogues.playscript[this.scriptreadpos];
                scriptread.innerHTML = '';
            };
        },
        typekeyboard(key) {
            let scriptread = document.getElementById('playerscripttextread');
            let scripttoread = document.getElementById('playerscripttext');
            if(scripttoread.innerHTML.length==0 || this.preventplayertype || this.npctalking || selectedact!='act1' || document.getElementById('act1keyboardgame').getAttribute('hidden')!=null){
                return;
            };
            if(scripttoread.innerHTML.charAt(0).toLowerCase()==key.toLowerCase()){
                audio.playaud(audio.act1.typing);
                scriptread.innerHTML += scripttoread.innerHTML.charAt(0);
                scripttoread.innerHTML = scripttoread.innerHTML.substring(1);
                this.typed += 1;
                this.totaltyped += 1;
                this.combo += 1;
                if(this.combo>this.longestcombo){
                    this.longestcombo = this.combo;
                };
            }else if(key!='Shift' && key!=' '){
                scriptread.innerHTML += this.dialogues.stutters[Math.floor(Math.random() * ((this.dialogues.stutters.length - 1) - 0 + 1) + 0)];
                if(scripttoread.innerHTML.charAt(0)==' '){
                    scriptread.innerHTML = scriptread.innerHTML.slice(0, -1);
                };
                this.stutters += 1;
                this.totalstutter += 1;
                this.combo = 0;
            };
            document.getElementById('textcombo').innerHTML = this.combo;
            document.getElementById('textcombo').style.fontSize = this.combo + 'px';
        },
    },
    act2: { //30 px = 1 cm
        backgroundimg: {
            solid: '#d2b293',
            scale: 16.66,
            imgx: -3378,
            imgy: -3305.58,
        },
        muac: { //relative to infant arm
            x: 0,
            y: 0,
            tapex: 0,
            step: 0,
            //10cm, 300px, tape1 arrow to end
            //9.5cm, 285px, tape2 arrow to end      NOTE: INFANT-MOTHER MUAC IS FILLER, WILL NOT BE USED
        },
        arm: {
            widthorigin: 366,
            widthpx_noPI: 0, //without the Math.PI / 2
            widthcm: 0,
            widthmultiplier: NaN,
            widthmultiplierlimit: [0.75, 0.82, 0.95, 1.2], //limits of tape in game
            //[0] to [1] = red limits, [1] to [2] = yellow limit, [2] to [3] = green limits
        },
        resistanceMultiplier: 1,
        workernpccoords: [0, 0],
        muacinteracting: -1,
        muacequppied: -1,
        interacting: -1,
        interactingwithtape: false,
        processingprogress: 0,
        patientid: [],
        playerchoice: '',
        npccheckid: -1,
        correct: 0,
        incorrect: 0,
        totalcorrect: 0,
        totalincorrect: 0,
        totaltocheck: 20,
        time: {
            current: 0,
            fastest: NaN,
            slowest: NaN,
            total: [],
        },
        showtutorial: true,
        tutorialpause: true, //pause created by tutorial
        workertext: {
            resettext: false,
            currstring: 0,
            currarray: 'tutorial1',
            prevarray: '',
            textdelay: 0,
            strings: {
                tutorial1: ["Hello, you must be the new one.", "I will show you how to check for malnutrition in babies today."],
                tutorial2: ["It's simple.", "We will be using the Mid-Upper Arm Circumference measuring tape, or MUAC tape, for this.", "For now, grab the MUAC tape with blue outline. [left mouse button]"],
                tutorial2a: ["You got the wrong one.", "Grab the other one, I'll explain this tape later."],
                tutorial3: ["Okay, now we have to find a point on the baby to wrap the tape around.", "It has to be around the midpoint of the upper arm otherwise it won't be accurate.", "I have already measured and marked the midpoint with a blue pen for you.", "Try to center and wrap around my blue marking. [left mouse button to wrap] [right mouse button to undo wrap]"],
                tutorial4: ["Now we have to tighten the tape to read their arm's circumference.", "Move the tape and tighten it not too much but not loosely. [hold and drag left mouse button]"],
                tutorial5: ["Keep going.", "Do you feel the slight resistance?", "Keep going at it slowly."],
                tutorial6: ["Stop.", "Stop at that heavier resistance.", "It is good between that heavy resistance and lighter resistance.", "It should be obvious if you have tightened it too much.", "Do you feel confident on where you stopped moving?", "If not, move it out and put it back in carefully.", "If you're done you can tell me where the black arrows point towards. [do so with the white buttons below this text]"],
                tutorial6a: ["No don't do that yet."],
                tutorial7: ["Okay, I'll let you work on your own once you can get 3 correct."],
                tutorialloop1: ["Grab the MUAC tape with blue outline. [left mouse button]"],
                tutorialloop1a: ["Blue outline. [left mouse button]"],
                tutorialloop2: ["Center the tape on the blue mark. [left mouse button to wrap] [right mouse button to redo wrap]"],
                tutorialloop3: ["Tighten it at a reasonable pace. [hold and drag left mouse button]"],
                tutorialloop4: ["Slight resistance is good, keep going."],
                tutorialloop5: ["Stop and report your findings. [do so with the white buttons below this text]"],
                tutorialloop5a: ["We're not at that part yet."],
                tutorialloop6: ["Okay, let's see.."],
                tutorialloop7a: ["Correct."],
                tutorialloop7b: ["Wrong."],
                tutorialloop8: ["Alright I trust you to do this without my supervision."],
                npcjob: ["(speaking Palestinian Arabic to mother)"],
                patientarrival1: ["Another one has arrived."],
                patientarrival2: ["I have marked the midpoint for you."],
                patientarrival3: ["Next one is here."],
                patientarrival4: ["I marked it with a blue pen."],
                npcscripted1: ["Oh by the way, we won't be using the mother MUAC tape.", "That one only applies to infants under 6 months old.", "All of them here today are outside that range."],
                npcscripted2: ["If they are malnourished we get them in a food program.", "We also give them a food packet called Ready-to-Use Therapeutic Food or RUTF.", "It's made with many ingredients and is given as treatment for malnourishment.", "On the right beside me we have 3 boxes here of the red RUTF."],
                npcscripted3: ["Some of them have nutritional oedema.", "Basically, they are extremely malnourished.", "The MUAC tape may not work if they have oedema.", "Instead we do a different method to diagnose this."],
                npcscripted4: ["Today is a calm day.", "Presence of oedema here is not high today.", "I suspect rates of oedema will increase as winter approaches."],
                npcscripted5: ["I heard UNICEF is slowly running out of RUTF.", "Hope they get more funding."],
            },
            newarray(newarray) {
                this.prevarray = newarray==this.currarray ? this.prevarray : this.currarray;
                this.resettext = true;
                this.currstring = 0;
                this.currarray = newarray;
                this.textdelay = 0;
            },
        },
        npctypedelay: 0,
        convert_cm_px(x, selection) {
            let result = 0;
            if(selection=='cm'){
                result = x / 30;
            }else if(selection=='px'){
                result = x * 30;
            };
            return result;
        },
        calctime(time){
            let milliseconds = (Math.floor(time * 16 / 10) + '').slice(-2);
            let seconds = (Math.floor(time * 16 / 1000) % 60 + '').slice(-2);
            let minutes = (Math.floor(Math.floor(time * 16 / 1000) / 60) + '').slice(-2);
            if(milliseconds.length==1){
                milliseconds = '0' + milliseconds;
            };
            if(seconds.length==1){
                seconds = '0' + seconds;
            };
            if(minutes.length==1){
                minutes = '0' + minutes;
            };
            return {
                total: minutes + ':' + seconds + '.' + milliseconds,
                minutes: milliseconds,
                seconds: seconds,
                milliseconds: milliseconds,
            };
        },
        act2ctxfunc() {
            const worktxt = this.workertext;
            this.arm.widthpx_noPI = this.arm.widthorigin * this.arm.widthmultiplier;
            this.arm.widthcm = this.convert_cm_px(this.arm.widthpx_noPI, 'cm') / Math.PI / 2;
            let tablestartx = canvas2.width / 2 + 220;
    
            ctx2.fillStyle = 'rgb(237, 237, 237)';
            ctx2.beginPath();
            ctx2.roundRect(canvas2.width / 2 + 220, 0, canvas2.width / 2 - 220, canvas2.height, [50, 0, 0, 50]);
            ctx2.fill();

            let muac = [
                {
                    multiplier: 0,
                    x: 0,
                    y: 0,
                    width: textures.actstorage.muacfrnt.width,
                    height: textures.actstorage.muacfrnt.height,
                    img: 'muacfrnt',
                    imgback: 'muacback',
                    tape: {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                    },
                },
                { //filler for story, shouldn't be used by player
                    multiplier: 0,
                    x: 0,
                    y: 0,
                    width: textures.actstorage.muacfrnt2.width,
                    height: textures.actstorage.muacfrnt2.height,
                    img: 'muacfrnt2',
                    imgback: 'muacback2',
                    tape: {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                    },
                }
            ];

            let upperarm = {
                globalx: tablestartx + 50,
                globaly: 50,
                x: 655,
                y: 0,
                width: this.arm.widthpx_noPI,
                height: 1186 * this.arm.widthmultiplier,
            };

            let basemultiplier = (canvas2.height / 1.2 - upperarm.globaly) / (textures.actstorage.infantarm.height);
            
            upperarm.width *= basemultiplier;
            upperarm.height *= basemultiplier;
            upperarm.x *= basemultiplier * this.arm.widthmultiplier;
            upperarm.y *= basemultiplier * this.arm.widthmultiplier;

            for(let forx = 0; forx<muac.length; forx++){
                if(this.muacequppied==forx){
                    continue;
                };
                muac[forx].multiplier = basemultiplier * 2;
                muac[forx].width *= muac[forx].multiplier;
                muac[forx].height *= muac[forx].multiplier;
                muac[forx].x = canvas2.width - muac[forx].width;
                if(forx==0){
                    muac[0].y = canvas2.height - muac[0].height - 100;
                }else if(forx==1){
                    muac[1].y = canvas2.height - muac[1].height * 2 - 200;
                };
            };
            
            const currmuac = this.muacequppied;
            if(this.muac.step==2){
                muac[currmuac].multiplier = basemultiplier;
                muac[currmuac].width *= muac[currmuac].multiplier;
                muac[currmuac].height *= muac[currmuac].multiplier;
                muac[currmuac].x = upperarm.globalx + this.muac.x;
                muac[currmuac].y = upperarm.globaly + this.muac.y;
                muac[currmuac].tape.width = textures.actstorage[muac[currmuac].img + 'tape'].width * muac[currmuac].multiplier;
                muac[currmuac].tape.height = textures.actstorage[muac[currmuac].img + 'tape'].height * muac[currmuac].multiplier;
                muac[currmuac].tape.x = this.muac.tapex;
                muac[currmuac].tape.y = muac[currmuac].y + (muac[currmuac].height - muac[currmuac].tape.height) / 2;
                let tapeinaccuracy = ((muac[currmuac].y + muac[currmuac].height / 2) - (upperarm.globaly + upperarm.y + upperarm.height / 2)) * 0.3;
                if(muac[currmuac].tape.x>upperarm.globalx + upperarm.x - this.convert_cm_px(1.5, 'px') * basemultiplier + tapeinaccuracy){
                    this.resistanceMultiplier = 0.005;
                    if(worktxt.currarray=='tutorial5'){
                        worktxt.newarray('tutorial6');
                    }else if(worktxt.currarray=='tutorialloop4'){
                        worktxt.newarray('tutorialloop5');
                    };
                }else if(muac[currmuac].tape.x>upperarm.globalx + upperarm.x - this.convert_cm_px(4, 'px') * basemultiplier + tapeinaccuracy){
                    this.resistanceMultiplier = 0.05;
                    if(worktxt.currarray=='tutorial4'){
                        worktxt.newarray('tutorial5');
                    }else if(worktxt.currarray=='tutorialloop3'){
                        worktxt.newarray('tutorialloop4');
                    };
                }else if(muac[currmuac].tape.x<upperarm.globalx + upperarm.x - muac[currmuac].tape.width + this.convert_cm_px(5, 'px') + tapeinaccuracy){
                    this.resistanceMultiplier = 1;
                }else{
                    this.resistanceMultiplier = 0.7;
                };
                if(muac[currmuac].tape.x>upperarm.globalx + upperarm.x){
                    muac[currmuac].tape.x = upperarm.globalx + upperarm.x;
                };
            }else if(this.muac.step<2 && this.muacequppied!=-1){
                muac[currmuac].multiplier = basemultiplier;
                muac[currmuac].width *= muac[currmuac].multiplier;
                muac[currmuac].height *= muac[currmuac].multiplier;
                muac[currmuac].x = upperarm.globalx + upperarm.x + upperarm.width - muac[currmuac].width;
                muac[currmuac].y = mouse.y;
                muac[currmuac].tape.width = textures.actstorage[muac[currmuac].img + 'tape'].width * muac[currmuac].multiplier;
                muac[currmuac].tape.height = textures.actstorage[muac[currmuac].img + 'tape'].height * muac[currmuac].multiplier;
                if(mouse.y<upperarm.globaly + upperarm.y){
                    muac[currmuac].y = upperarm.globaly + upperarm.y;
                }else if(mouse.y>upperarm.globaly + upperarm.y + upperarm.height){
                    muac[currmuac].y = upperarm.globaly + upperarm.y + upperarm.height;
                }else if(mouse.lmb_click){
                    this.muac.step = 2;
                    this.muac.x = muac[currmuac].x - upperarm.globalx;
                    this.muac.y = muac[currmuac].y - upperarm.globaly;
                    this.muac.tapex = muac[currmuac].x - muac[currmuac].tape.width + this.convert_cm_px(5, 'px');
                    if(worktxt.currarray=='tutorial3'){
                        worktxt.newarray('tutorial4');
                    }else if(worktxt.currarray=='tutorialloop2'){
                        worktxt.newarray('tutorialloop3');
                    };
                };
                muac[currmuac].tape.x = muac[currmuac].x + muac[currmuac].width;
                muac[currmuac].tape.y = muac[currmuac].y + (muac[currmuac].height - muac[currmuac].tape.height) / 2;
            };
            ctx2.globalCompositeOperation = 'source-atop';
            ctx2.drawImage(textures.actstorage.infantbody, upperarm.globalx + upperarm.x - 1871 * basemultiplier, upperarm.globaly + upperarm.y - 902 * basemultiplier, textures.actstorage.infantbody.width * basemultiplier, textures.actstorage.infantbody.height * basemultiplier);
            ctx2.globalCompositeOperation = 'source-over';
            ctx2.drawImage(textures.actstorage.infantarm, upperarm.globalx, upperarm.globaly, textures.actstorage.infantarm.width * basemultiplier * this.arm.widthmultiplier, textures.actstorage.infantarm.height * basemultiplier * this.arm.widthmultiplier);

            ctx2.drawImage(textures.actstorage[muac[0].img], muac[0].x, muac[0].y, muac[0].width, muac[0].height);
            ctx2.drawImage(textures.actstorage[muac[0].img + 'tape'], this.convert_cm_px(this.arm.widthcm, 'px'), 0, textures.actstorage[muac[0].img + 'tape'].width - this.convert_cm_px(this.arm.widthcm, 'px'), textures.actstorage[muac[0].img + 'tape'].height, muac[0].tape.x, muac[0].tape.y, muac[0].tape.width - this.convert_cm_px(this.arm.widthcm, 'px'), muac[0].tape.height);
            ctx2.drawImage(textures.actstorage[muac[0].img + 'lay2'], muac[0].x, muac[0].y, muac[0].width, muac[0].height);

            ctx2.drawImage(textures.actstorage[muac[1].img], muac[1].x, muac[1].y, muac[1].width, muac[1].height);
            ctx2.drawImage(textures.actstorage[muac[1].img + 'tape'], this.convert_cm_px(this.arm.widthcm, 'px'), 0, textures.actstorage[muac[1].img + 'tape'].width - this.convert_cm_px(this.arm.widthcm, 'px'), textures.actstorage[muac[1].img + 'tape'].height, muac[1].tape.x, muac[1].tape.y, muac[1].tape.width - this.convert_cm_px(this.arm.widthcm, 'px'), muac[1].tape.height);
            ctx2.drawImage(textures.actstorage[muac[1].img + 'lay2'], muac[1].x, muac[1].y, muac[1].width, muac[1].height);

            if(!mouse.lmb_hold){
                this.interactingwithtape = false;
            };
            if(this.muac.step>1 && mouse.rmb_click){
                this.muac.step = 1;
            };
            if(this.muac.step>1 && (this.interactingwithtape || collision('rectcirc', muac[currmuac].tape.x, muac[currmuac].tape.y, 0, 0, muac[currmuac].tape.width - this.convert_cm_px(this.arm.widthcm, 'px'), muac[currmuac].tape.height, [0], [0], [0], mouse.x, mouse.y, 0, 0, 0, 0, [0], [0], [0]))){
                ctx2.fillStyle = 'rgba(0, 255, 0, 0.15)';
                ctx2.fillRect(muac[currmuac].tape.x, muac[currmuac].tape.y, muac[currmuac].tape.width - this.convert_cm_px(this.arm.widthcm, 'px'), muac[currmuac].tape.height);
                document.body.style.cursor = 'grab';
                let newtapex = this.muac.tapex + (mouse.x - mouse.prevx) * this.resistanceMultiplier;
                if(mouse.lmb_hold){
                    this.interactingwithtape = true;
                    this.muac.tapex = newtapex;
                    document.body.style.cursor = 'grabbing';
                };
                if(newtapex<upperarm.globalx + upperarm.x - muac[currmuac].tape.width + this.convert_cm_px(this.arm.widthcm, 'px')){
                    this.muac.tapex = upperarm.globalx + upperarm.x - muac[currmuac].tape.width + this.convert_cm_px(this.arm.widthcm, 'px');
                };
            };

            for(let forx = 0; forx<muac.length; forx++){
                if(!isNaN(this.arm.widthmultiplier) && this.muacequppied!=forx && collision('rectcirc', muac[forx].x, muac[forx].y, 0, 0, muac[forx].width, muac[forx].height, [0], [0], [0], mouse.x, mouse.y, 0, 0, 0, 0, [0], [0], [0])){
                    ctx2.fillStyle = 'rgba(0, 255, 0, 0.15)';
                    ctx2.fillRect(muac[forx].x, muac[forx].y, muac[forx].width, muac[forx].height);
                    document.body.style.cursor = 'pointer';
                    if(mouse.lmb_click){
                        this.muacequppied = forx;
                        this.muac.step = 1;
                        if((worktxt.currarray=='tutorial2' || worktxt.currarray=='tutorial2a') && this.muacequppied==0){
                            worktxt.newarray('tutorial3');
                        }else if(worktxt.currarray=='tutorial2' && this.muacequppied==1){
                            worktxt.newarray('tutorial2a');
                        };
                        if((worktxt.currarray=='tutorialloop1' || worktxt.currarray=='tutorialloop1a') && this.muacequppied==0){
                            worktxt.newarray('tutorialloop2');
                        }else if(worktxt.currarray=='tutorialloop1' && this.muacequppied==1){
                            worktxt.newarray('tutorialloop1a');
                        };
                    };
                };
            };

            if(this.muac.step==-2){
                let txtrstrg = textures.actstorage;
                ctx.drawImage(txtrstrg.progress0, this.workernpccoords[0] - 20, this.workernpccoords[1] - 20);
                ctx.drawImage(txtrstrg.progress1, this.workernpccoords[0] - 20, this.workernpccoords[1] - 20, txtrstrg.progress1.width * this.processingprogress, txtrstrg.progress1.height);
                ctx.drawImage(txtrstrg.progresstext, this.workernpccoords[0] - 20, this.workernpccoords[1] - 20);
            };
            
            let finaltimetext = this.calctime(this.time.current).total;
            ctx2.fillStyle = '#000000';
            ctx2.font = '50px Arial';
            ctx2.fillText(finaltimetext, canvas2.width - 50 - ctx2.measureText(finaltimetext).width, canvas2.height - 50);
            ctx2.font = '20px Arial';
            ctx2.fillText('quota: ' + (this.correct + this.incorrect) + '/' + this.totaltocheck, canvas2.width - 50 - ctx2.measureText(finaltimetext).width, canvas2.height - 20);
        },
        charjob(objectswithinteract) {
            const worktxt = this.workertext;
            if(this.interacting==-1){
                if(Number(canvas.style.zoom)>0.75){
                    canvas.style.zoom = Number(canvas.style.zoom) - (Number(canvas.style.zoom) - 0.72) * 0.015 + '';
                };
                for(let forx = 0; forx<objectswithinteract.length; forx++){
                    let objwitcol = objectswithinteract[forx];
                    let navcurr = interactions.current[objwitcol.interactpath];
                    for(let forx2 = 0; forx2<navcurr.length; forx2++){
                        if(collision('rectcirc', objwitcol.x, objwitcol.y, navcurr[forx2].x, navcurr[forx2].y, navcurr[forx2].w, navcurr[forx2].h, [objwitcol.angle], [objwitcol.rotatex], [objwitcol.rotatey], player.x, player.y, 0, 0, player.size, player.size, [player.rotation], [player.size / 2], [player.size / 2])){
                            document.getElementById('act2space').style.top = '85%';
                            if(keyclicked.indexOf(' ')>-1){
                                this.interacting = objwitcol.id;
                            };
                        };
                    };
                };
                return;
            };

            player.preventmovement = true;
            player.target = [objects[this.interacting].special.eventcoords[0] + objects[this.interacting].x, objects[this.interacting].special.eventcoords[1] + objects[this.interacting].y];
            if(Number(canvas.style.zoom)<2.1){
                canvas.style.zoom = Number(canvas.style.zoom) + (2.4 - Number(canvas.style.zoom)) * 0.015 + '';
                return;
            };

            document.getElementById('act2job').removeAttribute('hidden');
            player.lockrotation = 270 * Math.PI / 180;

            let globalcheck = {
                checking: false, //players job
                checkingid: -1,
                processing: false, //npcs job
                processingid: -1,
            };
            this.npccheckid = -1;
            for(let forx = 0; forx<this.patientid.length; forx++){
                if(npcs.human[this.patientid[forx]].special.checking){
                    globalcheck.checking = true;
                    globalcheck.checkingid = npcs.human[this.patientid[forx]].id;
                    this.npccheckid = globalcheck.checkingid = npcs.human[this.patientid[forx]].id;
                };
                if(npcs.human[this.patientid[forx]].special.processing){
                    globalcheck.processing = true;
                    globalcheck.processingid = npcs.human[this.patientid[forx]].id;
                };
            };
            if(globalcheck.checking && npcs.human[globalcheck.checkingid].path.length==0){
                this.time.current += 1;
            }else if(this.time.current!=0){
                if(isNaN(this.time.slowest) || this.time.current>this.time.slowest){
                    this.time.slowest = this.time.current;
                }else if(isNaN(this.time.fastest) || this.time.current<this.time.fastest){
                    this.time.fastest = this.time.current;
                };
                this.time.total.push(this.time.current);
                this.time.current = 0;
            };
            document.getElementById('act2choicewrapper').setAttribute('hidden', "");
            if(globalcheck.checking || globalcheck.processing){
                if((globalcheck.processing && npcs.human[globalcheck.processingid].special.processing) || this.playerchoice!=''){
                    if(globalcheck.processing && npcs.human[globalcheck.processingid].special.processing){
                        this.processingprogress += intervalspeed / 2500; //millisecond per frame / millisecond delay = delay for progress bar
                        if(worktxt.currarray!='npcjob'){
                            worktxt.newarray('npcjob');
                        };
                        if(this.processingprogress>=1){
                            if(this.playerchoice==npcs.human[globalcheck.processingid].special.correctchoice){
                                this.correct += 1;
                                this.totalcorrect += 1;
                                if(this.showtutorial && worktxt.prevarray=='tutorialloop6'){
                                    worktxt.newarray('tutorialloop7a');
                                };
                            }else{
                                this.incorrect += 1;
                                this.totalincorrect += 1;
                                if(this.showtutorial && worktxt.prevarray=='tutorialloop6'){
                                    worktxt.newarray('tutorialloop7b');
                                };
                            };
                            if(this.correct>=3 && this.showtutorial){
                                this.showtutorial = false;
                                worktxt.newarray('tutorialloop8');
                                this.correct = 0;
                                this.incorrect = 0;
                            }else if(worktxt.prevarray=='tutorial6'){
                                worktxt.newarray('tutorial7');
                                this.correct = 0;
                                this.incorrect = 0;
                            };
                            this.processingprogress = 1;
                            this.playerchoice = '',
                            npcs.human[globalcheck.processingid].special.processing = false;
                            npcs.human[globalcheck.processingid].path = [... npcs.paths.act2.tentwithint.exit];
                        };
                    }else{
                        let proceed = true;
                        if(this.showtutorial && worktxt.currarray=='tutorial6' && worktxt.currarray!='tutorialloop5'){
                            proceed = true;
                        }else if(this.showtutorial && worktxt.currarray!='tutorial6' && worktxt.currarray!='tutorialloop5'){
                            worktxt.newarray('tutorial6a');
                            proceed = false;
                        }else if(this.showtutorial && worktxt.currarray=='tutorialloop5' && worktxt.currarray!='tutorial6'){
                            worktxt.newarray('tutorialloop6');
                            proceed = true;
                        }else if(this.showtutorial && worktxt.currarray=='tutorialloop5' && worktxt.currarray!='tutorial6'){
                            worktxt.newarray('tutorialloop5a');
                            proceed = false;
                        };
                        if(proceed){
                            this.muacequppied = -1;
                            this.muac.step = -2;
                            this.arm.widthmultiplier = NaN;
                            this.processingprogress = 0
                            npcs.human[globalcheck.checkingid].special.checking = false;
                            npcs.human[globalcheck.checkingid].special.processing = true;
                        }else{
                            this.playerchoice = '';
                        };
                    };
                }else if(npcs.human[globalcheck.checkingid].path.length==0){
                    document.getElementById('act2choicewrapper').removeAttribute('hidden');
                    let npcinfantarm = npcs.human[globalcheck.checkingid].special.infantarm;
                    if(isNaN(this.arm.widthmultiplier)){
                        let limits = [this.arm.widthmultiplierlimit[npcinfantarm[0]], this.arm.widthmultiplierlimit[npcinfantarm[1]]];
                        this.arm.widthmultiplier = Math.floor(Math.random() * ((limits[1] * 100) - (limits[0] * 100) + 1) + (limits[0] * 100)) / 100; //converts decimals to integer and back
                        this.muac.step = 0;
                    };
                }else{
                    this.muac.step = -1;
                };
            }else if(this.correct + this.incorrect<this.totaltocheck && !this.tutorialpause){
                npcs.human.push({
                    size: 50,
                    basespeed: 4,
                    x: npcs.paths.act2.tentwithint.enter[0][0] + objects[this.interacting].x,
                    y: npcs.paths.act2.tentwithint.enter[0][1] + objects[this.interacting].y,
                    rotation: 0,
                    path: [... npcs.paths.act2.tentwithint.enter],
                    static: false,
                    hasbaby: true,
                    id: npcs.human.length,
                    lookcoords: [
                        {
                            x: objects[this.interacting].x + 493,
                            y: objects[this.interacting].y + 151,
                            w: 60,
                            h: 130,
                        },
                    ],
                    special: {
                        checking: true,
                        processing: false,
                        exiting: false,
                        infantarm: [2, 3], //links to this.arm.widthmultiplierlimit
                        correctchoice: 'green',
                    },
                });
                this.patientid.push(npcs.human.length - 1);
                if(this.correct + this.incorrect!=0){
                    let armtype = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
                    npcs.human[npcs.human.length - 1].special.infantarm = [armtype, armtype + 1];
                    if(armtype==0){
                        npcs.human[npcs.human.length - 1].special.correctchoice = 'red';
                    }else if(armtype==1){
                        npcs.human[npcs.human.length - 1].special.correctchoice = 'yellow';
                    }else{
                        npcs.human[npcs.human.length - 1].special.correctchoice = 'green';
                    };
                };
                let newnpcarray = ((this.correct + this.incorrect) + 2) / 4;
                if(!this.showtutorial && newnpcarray==Math.floor(newnpcarray)){
                    worktxt.newarray('npcscripted' + newnpcarray);
                    worktxt.textdelay = 0.5;
                }else if(!this.showtutorial){
                    worktxt.newarray('patientarrival' + Math.floor(Math.random() * (4 - 1 + 1) + 1));
                    worktxt.textdelay = 2;
                };
            }else if(this.totalcorrect + this.totalincorrect>this.totaltocheck){
                finishedact(playingact);
            };
            this.act2ctxfunc();
            
            const npcworkertext = document.getElementById('npcworkertext');
            if(worktxt.textdelay>0){
                worktxt.textdelay -= intervalspeed / 2000;
                return;
            };
            if(worktxt.resettext){
                worktxt.resettext = false;
                npcworkertext.innerHTML = '';
            }else if(npcworkertext.innerHTML.length<worktxt.strings[worktxt.currarray][worktxt.currstring].length){
                this.npctypedelay -= 1;
                if(this.npctypedelay>=0){
                    return;
                };
                audio.playaud(audio.general.talking);
                npcworkertext.innerHTML += worktxt.strings[worktxt.currarray][worktxt.currstring].charAt(npcworkertext.innerHTML.length);
                this.npctypedelay = 2;
            }else if(typeof worktxt.strings[worktxt.currarray][worktxt.currstring + 1]==='string'){
                if(worktxt.textdelay==-1){
                    worktxt.textdelay = 1;
                }else{
                    worktxt.resettext = true;
                    worktxt.currstring += 1;
                };
            }else{
                switch(worktxt.currarray){
                    case 'tutorial1':
                        this.tutorialpause = false;
                        worktxt.newarray('tutorial2');
                        worktxt.textdelay = 2;
                        break;
                    case 'tutorial6a':
                    case 'tutorialloop5a':
                        worktxt.newarray(worktxt.prevarray);
                        break;
                    case 'tutorial7':
                    case 'tutorialloop7a':
                    case 'tutorialloop7b':
                        worktxt.newarray('tutorialloop1');
                        worktxt.textdelay = 1;
                        break;
                };
            };
            if(worktxt.textdelay<=0){
                worktxt.textdelay = -1;
            };
        },
    },
};

let collisions = {
    act1: {
        global: [
            {
                name: 'actbordertop', //names are declared to make global collisions clearer
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                x: -500,
                y: 298,
                w: 12688,
                h: 500,
            },
            {
                name: 'actborderleft',
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                x: -500,
                y: -2060,
                w: 500,
                h: 4369,
            },
            {
                name: 'actborderbottom',
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                x: -500,
                y: 1858,
                w: 12688,
                h: 1000,
            },
            {
                name: 'actborderright',
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                x: 11695,
                y: -2060,
                w: 1000,
                h: 4369,
            },
        ],
        house1: [
            {
                x: 412,
                y: 739,
                w: 246,
                h: 741,
            },
            {
                x: 0,
                y: 665,
                w: 335,
                h: 1558,
            },
            {
                x: 0,
                y: 100,
                w: 412,
                h: 1558,
            },
        ],
        house2: [
            {
                x: 15,
                y: 539,
                w: 904,
                h: 615,
            },
            {
                x: 486,
                y: 369,
                w: 432,
                h: 169,
            },
            {
                x: 0,
                y: 100,
                w: 295,
                h: 1980,
            },
            {
                x: 562,
                y: 100,
                w: 438,
                h: 1980,
            },
        ],
        house3: [
            {
                x: 50,
                y: 403,
                w: 824,
                h: 771,
            },
            {
                x: 0,
                y: 100,
                w: 113,
                h: 1404,
            },
        ],
        house4: [
            {
                x: 63,
                y: 709,
                w: 898,
                h: 570,
            },
            {
                x: 0,
                y: 100,
                w: 351,
                h: 454,
            },
            {
                x: 603,
                y: 100,
                w: 397,
                h: 1369,
            },
        ],
        house5: [
            {
                x: 207,
                y: 497,
                w: 635,
                h: 303,
            },
            {
                x: 150,
                y: 799,
                w: 766,
                h: 671,
            },
            {
                x: 0,
                y: 100,
                w: 231,
                h: 1537,
            },
            {
                x: 848,
                y: 100,
                w: 152,
                h: 1537,
            },
        ],
    },
    act2: {
        global: [
            {
                name: 'actbordertop',
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                x: 1205,
                y: -176,
                w: 926,
                h: 220,
            },
            {
                name: 'actborderleft',
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                x: 596,
                y: -4,
                w: 215,
                h: 1372,
            },
            {
                name: 'actborderright',
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                x: 2155,
                y: 348,
                w: 321,
                h: 928,
            },
            {
                name: 'actborderright2',
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                x: 1659,
                y: 1712,
                w: 282,
                h: 819,
            },
            {
                name: 'actborder',
                angle: 45,
                rotatex: 0,
                rotatey: 0,
                x: -82,
                y: 380,
                w: 2457,
                h: 1000,
            },
        ],
        tent: [
            {
                x: 0,
                y: 66,
                w: 650,
                h: 384,
            },
            {
                x: 13,
                y: 0,
                w: 631,
                h: 66,
            },
            {
                x: 13,
                y: 450,
                w: 631,
                h: 72,
            },
        ],
        tentwithint: [
            {
                x: 13,
                y: 0,
                w: 631,
                h: 66,
            },
            {
                x: 13,
                y: 450,
                w: 631,
                h: 72,
            },
            {
                x: 71,
                y: 81,
                w: 422,
                h: 254,
            },
            {
                x: 0,
                y: 81,
                w: 15,
                h: 75,
            },
            {
                x: 0,
                y: 66,
                w: 650,
                h: 15,
            },
            {
                x: 635,
                y: 81,
                w: 15,
                h: 354,
            },
            {
                x: 0,
                y: 360,
                w: 15,
                h: 75,
            },
            {
                x: 0,
                y: 435,
                w: 650,
                h: 15,
            },
            {
                x: 493,
                y: 81,
                w: 60,
                h: 200,
            },
            {
                x: 493,
                y: 81,
                w: 142,
                h: 124,
            },
        ]
    },
    current: {
        global: [],
    },
};


let interactions = {
    act1: {
        global: [],
        house1: [
            {
                x: 513,
                y: 714,
                w: 55,
                h: 25,
            },
        ],
        house2: [
            {
                x: 431,
                y: 512,
                w: 55,
                h: 25,
            },
        ],
        house3: [
            {
                x: 572,
                y: 378,
                w: 55,
                h: 25,
            },
        ],
        house4: [
            {
                x: 427,
                y: 684,
                w: 55,
                h: 25,
            },
        ],
        house5: [
            {
                x: 423,
                y: 471,
                w: 55,
                h: 25,
            },
        ],
    },
    act2: {
        global: [],
        tentwithint: [
            {
                x: 553,
                y: 200,
                w: 82,
                h: 76,
            },
        ],
    },
    current: {
        global: [],
    },
};

let textures = {
    actstorage: {
        loaded: 0,
        amount: 0,
    },
    addimage(name, imgpath) {
        this.actstorage.amount += 1;
        this.actstorage[name] = new Image();
        this.actstorage[name].src = imgpath;

        this.actstorage[name].onload = function() {
            textures.actstorage.loaded += 1;
        };
    }
}

let audio = {
    act1: {
        ambience: new Audio('aud/act1/nature.mp3'),
        knocking: new Audio('aud/act1/knocking.mp3'),
        typing: new Audio('aud/act1/typing.wav'),
        autotyping: new Audio('aud/act1/typing2.wav'),
        dooropen: new Audio('aud/act1/dooropen.wav'),
        doorclose: new Audio('aud/act1/doorclose.wav'),
    },
    act2: {
        ambience: new Audio('aud/act2/bigtalking.mp3'),
        click: new Audio('aud/act2/click.wav'),
        release: new Audio('aud/act2/release.wav'),
    },
    general: {
        actwin: new Audio('aud/general/completedact.wav'),
        click: new Audio('aud/general/clicking.wav'),
        walking: new Audio('aud/general/walking.mp3'),
        npcwalking: new Audio('aud/general/walking.mp3'),
        talking: new Audio('aud/general/talking.wav'),
    },
    playaud(x, special) {
        if(typeof special=='undefined'){
            x.pause();
            x.currentTime = 0;
            x.play();
        }else if(special=='pause'){
            x.pause();
            x.currentTime = 0;
        }else if(special=='play'){
            x.play();
        };
    },
};
audio.general.walking.preservesPitch = false;
audio.general.npcwalking.preservesPitch = false;
audio.general.talking.volume = 0.8;
audio.act1.ambience.volume = 0.5;
audio.act1.ambience.loop = true;
audio.act2.ambience.loop = true;

let objects = [];

function drawobjects() {
    let thetexts = [];
    for(let forx = 0; forx<objects.length; forx++){
        if(objects[forx].name=='text'){
            thetexts.push(objects[forx]);
            continue;
        };
        if(typeof objects[forx].color=='string'){
            ctx.fillStyle = objects[forx].color;
            ctx.fillRect(objects[forx].x, objects[forx].y, objects[forx].image.width, objects[forx].image.height);
        };
        drawimgrotated(objects[forx].image, objects[forx].x, objects[forx].y, objects[forx].image.width, objects[forx].image.height, objects[forx].angle, objects[forx].rotatex, objects[forx].rotatey);
    };
    
    for(let forx = 0; forx<thetexts.length; forx++){
        ctx.fillStyle = thetexts[forx].color;
        ctx.font = thetexts[forx].fontstyle;
        if(playingact==1 && collision('rectrect', player.x - 500, player.y - canvas.height, 0, 0, 1000, canvas.height * 2, [0], [0], [0], thetexts[forx].x, thetexts[forx].y, 0, 0, ctx.measureText(thetexts[forx].textcontents).width, 0, [0], [0], [0])){
            ctx.fillText(thetexts[forx].textcontents, thetexts[forx].x, thetexts[forx].y);
        }else if(playingact==2 && collision('rectrect', player.x - 500, player.y - 500, 0, 0, 1000, 1000, [0], [0], [0], thetexts[forx].x, thetexts[forx].y, 0, 0, ctx.measureText(thetexts[forx].textcontents).width, 0, [0], [0], [0])){
            ctx.fillText(thetexts[forx].textcontents, thetexts[forx].x, thetexts[forx].y);
        };
    };
}

let mouse = {
    x: 0,
    y: 0,
    prevx: 0,
    prevy: 0,
    clickx: 0,
    clicky: 0,
    lmb_hold: false,
    lmb_click: false,
    lmb_clickup: false,
    rmb_hold: false,
    rmb_click: false,
    rmb_clickup: false,
};

onmousedown = function(mos) {
    mouse.clickx = mos.clientX;
    mouse.clicky = mos.clientY;
    if(mos.button==0){
        mouse.lmb_hold = true;
        mouse.lmb_click = true;
    }else if(mos.button==2){
        mouse.rmb_hold = true;
        mouse.rmb_click = true;
    };
}

onmouseup = function(mos) {
    if(mos.button==0){
        mouse.lmb_hold = false;
        mouse.lmb_clickup = true;
    }else if(mos.button==2){
        mouse.rmb_hold = false;
        mouse.rmb_clickup = true;
    };
}

onmousemove = function(mos){
    mouse.x = mos.clientX;
    mouse.y = mos.clientY;
}

let keysdown = [];
let keyclicked = [];

window.onblur = function() {
    keysdown = [];
};

onkeydown = function(x) {
    if(x.key=='w'){
        player.w = true;
    }else if(x.key=='a'){
        player.a = true;
    }else if(x.key=='s'){
        player.s = true;
    }else if(x.key=='d'){
        player.d = true;
    };
    keysdown.push(x.key);
    keyclicked.push(x.key);

    if(selectedact=='act1' && !misc.act1.preventplayertype){
        misc.act1.typekeyboard(x.key);
    };
}

onkeyup = function(x) {
    if(x.key=='w'){
        player.w = false;
    }else if(x.key=='a'){
        player.a = false;
    }else if(x.key=='s'){
        player.s = false;
    }else if(x.key=='d'){
        player.d = false;
    };
    while(true){
        if(keysdown.indexOf(x.key)>-1){
            keysdown.splice(keysdown.indexOf(x.key), 1);
        }else{
            break;
        };
    };
}

let selectedact = 'act1';
let actinfo = [
    {
        location: 'Calgary, Alberta',
        title: 'Act One - Determination',
        quote: `"...the positives massively outweigh the negatives."`,
        text: "Become a fundraiser for UNICEF by knocking door to door for donations to help children.",
        sourcesused: [
            {
                href: 'https://www.google.ca/maps/place/UNICEF+Canada+-+Calgary+Office/@51.067237,-114.1013492,205m/data=!3m2!1e3!4b1!4m6!3m5!1s0x53716f972575897f:0xa7e0c09dae72dc59!8m2!3d51.067236!4d-114.100592!16s%2Fg%2F1hc3c0g2w?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
                srcname: '[SATELLITE] UNICEF Canada - Calgary Office',
            },
            {
                href: 'https://www.unicef.ca/en/about-unicefs-fundraising-partners',
                srcname: 'About UNICEFS Fundraising Partners',
            },
            {
                href: 'https://www.unicef.ie/story/a-day-in-the-life-of-a-unicef-fundraiser/',
                srcname: 'A day in the life of a UNICEF fundraiser',
            },
            {
                href: 'https://www.unicef.org/romania/team-unicef-fundraisers',
                srcname: 'The team of UNICEF Fundraisers',
            },
            {
                href: 'https://www.youtube.com/watch?v=Q_hxhneal4U',
                srcname: '[VIDEO] A day in the life of the UNICEF fundraising team',
            },
        ],
    },
    {
        location: 'Deir Al Balah, Gaza Strip',
        title: 'Act Two - Perseverance',
        quote: `"It's sometimes easy to lose hope ... but when I see the UNICEF response, that's when I begin to feel hopeful again."`,
        text: "Work at a nutrition clinic supported by UNICEF to help efforts in reducing malnutrition.",
        sourcesused: [
            {
                href: 'https://www.unicefusa.org/what-unicef-does/childrens-health/nutrition/fight-childhood-malnutrition',
                srcname: 'Malnourished Children: How UNICEF Fights Child Hunger',
            },
            {
                href: 'https://www.unicefusa.org/stories/unicef-reaching-children-gaza-lifesaving-therapeutic-food',
                srcname: 'UNICEF Is Reaching Children in Gaza With Lifesaving The ...',
            },
            {
                href: 'https://www.unicef.org/supply/mid-upper-arm-circumference-muac-measuring-tapes',
                srcname: 'Mid-upper arm circumference (MUAC) measuring tapes',
            },
            {
                href: 'https://www.unicef.org/nutrition/RUTF',
                srcname: "A wonder 'food' for the world's children",
            },
            {
                href: 'https://www.unicef.org/stories/when-tent-isnt-just-tent',
                srcname: "When a tent isn't just a tent",
            },
            {
                href: 'https://www.google.com/maps/place/Gaza+Strip/@31.424688,34.3488213,47859m/data=!3m1!1e3!4m6!3m5!1s0x14fd844104b258a9:0xfddcb14b194be8e7!8m2!3d31.3546763!4d34.3088255!16zL20vMDM1N18?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D',
                srcname: '[SATELLITE] Deir al Balah',
            },
            {
                href: 'https://www.childwasting.org/media/2856/file/How%20to%20use%20the%20Mother-Infant%20MUAC%20Tape.pdf',
                srcname: 'How to use the Mother-Infant MUAC Tape',
            },
            {
                href: 'https://www.unicef.org/supply/documents/files-printing-child-muac-measuring-tapes-string-method',
                srcname: 'Files for printing child MUAC measuring tapes (string m ...',
            },
            {
                href: 'https://www.unicef.org/supply/media/24596/file/RUTF-Market-and-Supply-Update-2025.pdf',
                srcname: 'Ready-to-Use Therapeutic Food: Market and Supply Update',
            },
            {
                href: 'https://www.youtube.com/watch?v=3pQUtOsjjSY',
                srcname: '[VIDEO] Assessing Nutritional HealthPhone™ Status Using ...',
            },
        ],
    },
];

function transtoact(id) {
    document.getElementById(id).style.top = '-100%';
    document.getElementById('actscreen').style.top = '0%';
    audio.playaud(audio.general.click);
}

function transtotitle(id) {
    document.getElementById('title').style.top = '0%';
    document.getElementById(id).style.top = '100%';
    audio.playaud(audio.general.click);
}

function selectact(id) {
    let thisactinfo = actinfo[Number(id.slice(-1)) - 1];
    document.getElementById('act1').removeAttribute('disabled');
    document.getElementById('act2').removeAttribute('disabled');
    document.getElementById(id).setAttribute('disabled', '');
    document.getElementById('acttitle').innerHTML = thisactinfo.title + '<span id="actlocation">' + thisactinfo.location + '</span>';
    document.getElementById('actquote').innerHTML = thisactinfo.quote;
    document.getElementById('acttext').innerHTML = thisactinfo.text;
    document.getElementById('hyperlinkscredit').innerHTML = '';
    for(let forx = 0; forx<thisactinfo.sourcesused.length; forx++){
        document.getElementById('hyperlinkscredit').innerHTML += "<a class='creditlink' href=" + thisactinfo.sourcesused[forx].href + ">" + thisactinfo.sourcesused[forx].srcname + "</a> ";
    };
    selectedact = id;
    audio.playaud(audio.general.click);
}

function begingame(id) {
    playingact = Number(selectedact.slice(-1));
    document.body.style.backgroundColor = misc['act' + playingact].backgroundimg.solid;
    document.getElementById('wrapperact' + playingact).removeAttribute('hidden', "");
    document.getElementById(id).setAttribute('disabled', '');
    document.getElementById('actgamestart').style.top = '0%';
    setTimeout(() => {
        document.getElementById(id).removeAttribute('disabled');
        document.getElementById('titlescreen').setAttribute('hidden', '')
        document.getElementById('actgamestart').style.top = '-100%';
        initializeact();
    }, 750);
    audio.playaud(audio.general.click);
}

function finishedact(act) {
    document.getElementById('title').style.top = '-100%';
    document.getElementById('actgamestart').style.top = '0%';
    document.getElementById('actscreen').style.top = '100%';
    document.getElementById('finishedact' + act).style.top = '0%';
    const currentact = misc['act' + act];

    setTimeout(() => {
        keysdown = [];
        if(audio.general.actwin.paused){
            audio.playaud(audio.general.actwin);
        };
        if(audio['act' + playingact].ambience!=null && !audio['act' + playingact].ambience.paused){
            audio.playaud(audio['act' + playingact].ambience, 'pause');
        };
        if(!audio.general.walking.paused){
            audio.playaud(audio.general.walking, 'pause');
        };
        document.getElementById('actgamestart').style.top = '100%';
        document.getElementById('titlescreen').removeAttribute('hidden');
        document.getElementById('wrapperact' + playingact).setAttribute('hidden', "");
        selectact('act' + act);
        playingact = 0;
        switch (act) {
            case 1:
                document.getElementById("successfulknocks").innerHTML = currentact.wins + ' (' + Math.round(currentact.wins / 0.11) + '%)';
                document.getElementById("nonsuccessfulknocks").innerHTML = 11 - currentact.wins + ' (' + Math.round((11 - currentact.wins) / 0.11) + '%)';
                document.getElementById("totalknock").innerHTML = 11;
                document.getElementById("wordstyped").innerHTML = currentact.totaltyped;
                document.getElementById("wordsstuttered").innerHTML = currentact.totalstutter;
                document.getElementById("totalcombo").innerHTML = currentact.longestcombo;
                currentact.houseknocked = 0;
                currentact.houseToKnock = 0;
                currentact.totaltyped = 0;
                currentact.totalstutter = 0;
                break;
            case 2:
                let totaltime = 0;
                for(let forx = 0; forx<currentact.time.total.length; forx++){
                    totaltime += currentact.time.total[forx];
                };
                document.getElementById("muaccorrect").innerHTML = currentact.totalcorrect + ' (' + Math.round(currentact.totalcorrect / (currentact.totalcorrect + currentact.totalincorrect) * 100) + '%)';
                document.getElementById("muacincorrect").innerHTML = currentact.totalincorrect + ' (' + Math.round(currentact.totalincorrect / (currentact.totalcorrect + currentact.totalincorrect) * 100) + '%)';
                document.getElementById("muactotal").innerHTML = currentact.totalcorrect + currentact.totalincorrect;
                document.getElementById("muactimefast").innerHTML = currentact.calctime(currentact.time.fastest).total;
                document.getElementById("muactimeslow").innerHTML = currentact.calctime(currentact.time.slowest).total;
                document.getElementById("muactimeavg").innerHTML = currentact.calctime(totaltime / currentact.time.total.length).total;
                document.getElementById("muactimetotal").innerHTML = currentact.calctime(totaltime).total;
                currentact.muacinteracting = -1;
                currentact.muacequppied = -1;
                currentact.interacting = -1;
                currentact.interactingwithtape = false;
                currentact.processingprogress = 0;
                currentact.patientid = [];
                currentact.playerchoice = '';
                currentact.npccheckid = -1;
                currentact.correct = 0;
                currentact.totalcorrect = 0;
                currentact.incorrect = 0;
                currentact.totalincorrect = 0;
                currentact.time = {
                    current: 0,
                    fastest: 0,
                    slowest: 0,
                    total: [],
                };
                currentact.showtutorial = true;
                currentact.tutorialpause = true;
                break;
        };
    }, 750);
}

function act2choice(choice) {
    misc.act2.playerchoice = choice;
}

function adapttocanvzoom(thingy) { //change the screen pixels to canvas pixels
    return thingy / Number(canvas.style.zoom);
}

async function initializeact() {
    if(playingact==1){
        document.getElementById('backgroundimage').src = 'img/act1/background.png';
        document.getElementById('backgroundimage').style.height = misc.act1.backgroundimg.scale * document.getElementById('backgroundimage').style.naturalHeight;
        collisions.current = collisions.act1;
        interactions.current = interactions.act1;

        //collisions above, textures below

        objects = [];
        textures.actstorage = {
            loaded: 0,
            amount: 0,
        };
        textures.addimage('road', 'img/act1/road.png');
        textures.addimage('sidewalk', 'img/act1/sidewalk.png');
        textures.addimage('house1', 'img/act1/house/house1.png');
        textures.addimage('house2', 'img/act1/house/house2.png');
        textures.addimage('house3', 'img/act1/house/house3.png');
        textures.addimage('house4', 'img/act1/house/house4.png');
        textures.addimage('house5', 'img/act1/house/house5.png');

        while(textures.actstorage.amount!=textures.actstorage.loaded){
            await delaytime(250);
        };

        //textures above, objects below

        const actstore = textures.actstorage;
        let totalroad = 2;
        for(let forx = 0; forx<totalroad; forx++){
            let array = {
                id: objects.length,
                name: 'road',
                image: actstore.road,
                x: actstore.road.width * forx,
                y: 0,
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                interactable: false,
            };
            array.rotatex = array.image.width / 2;
            array.rotatey = array.image.height / 2;
            objects.push(array);
        };

        for(let forx = 0; forx<totalroad * 4; forx++){
            let array = {
                id: objects.length,
                name: 'sidewalk',
                image: actstore.sidewalk,
                x: actstore.sidewalk.width * Math.floor(forx / 2),
                y: -actstore.sidewalk.height,
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                interactable: false,
            };
            if(forx % 2==0){
                array.y = actstore.road.height;
            };
            array.rotatex = array.image.width / 2;
            array.rotatey = array.image.height / 2;
            objects.push(array);
        };

        let totalhouseamount = 2 * Math.floor(totalroad * actstore.road.width / actstore.house1.width);
        let housetype = 0;
        const housecolours = [
            '#c9d3df',
            '#7381a5',
            '#caada5',
            '#a69eb2',
            '#8c7489',
            '#c18585',
        ];
        for(let forx = 0; forx<totalhouseamount; forx++){
            housetype += 1;
            if(housetype>5){
                housetype = 1;
            };
            let array = {
                id: objects.length,
                name: 'house',
                image: actstore['house' + housetype],
                x: actstore.house1.width * Math.floor(forx / 2),
                y: actstore.sidewalk.height + actstore.road.height,
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                color: housecolours[Math.floor(Math.random() * ((housecolours.length - 1) - 0 + 1) + 0)],
                interactpath: 'house' + housetype,
                interactable: true,
                special: {
                    interacting: false,
                    interacted: false,
                    success: false,
                },
            };
            if(forx % 2==0){
                array.angle = 180;
                array.y = -(actstore.sidewalk.height + array.image.height);
            }else{
                if(misc.act1.houseToKnock==0){
                    array.special.scripted = ".. I'm.. I'm already a donor.";
                    array.special.scriptedaction = 'negative';
                };
                misc.act1.houseToKnock += 1;
            };
            array.rotatex = array.image.width / 2;
            array.rotatey = array.image.height / 2;
            objects.push(array);
        };
        
        let texts = [
            [134, 677, '33px Arial', "After three sessions of training, I feel ready."],
            [38, 985, '25px Arial', "Keys wasd and mouse."],
            [351, 781, '28px Arial', "I just have to knock door to door.."],
            [562, 970, '28px Arial', "..following the laid out path."],
            [195, 1550, '28px Arial', "Movement follows your mouse."],
            [225, 1580, '23px Arial', "Try aiming your mouse here and press the [w] key."],
            [245, 1630, '23px Arial', "It is a goal to knock every door."],
            [555, 1184, '23px Arial', "From here to the end of this street."],
            [1000, 772, '33px Arial', "I should use the walkway over stepping on grass as much as I can to be formal."],
            [1561, 1235, '25px Arial', "Maybe someone new will respond here that.."],
            [1561, 1265, '25px Arial', "..has a debit card for the monthly pay thing."],
            [1300, 1730, '15px Arial', "[type the letters with or without capitalization"],
            [1300, 1750, '15px Arial', "once you've said enough to remember the script"],
            [1300, 1770, '15px Arial', "you can skip with your [spacebar] key]"],
            [1544, 1592, '15px Arial', "From my sessions, I know I just have to repeat a script."],
            [1601, 1629, '15px Arial', "Although it can sometimes take a bit to recall my words.."],
            [3109, 1016, '28px Arial', "Originally, I was going to volunteer."],
            [3690, 1040, '28px Arial', "I took it when I saw there was fixed pay."],
            [4448, 785, '28px Arial', "Additional bonus when I'm successful too."],
            [5325, 734, '30px Arial', "Was educated in regular meetings."],
            [5557, 1091, '25px Arial', "Usually we have a UNICEF coat but none available today."],
            [5557, 1121, '25px Arial', "I think they're getting more tomorrow."],
            [9042, 659, '30px Arial', "I'm almost done."],
            [9082, 759, '30px Arial', " I can see the intersection from here."],
            [9862, 1174, '30px Arial', "I have to do all the houses before I can go."],
        ];
        for(let forx = 0; forx<texts.length; forx++){
            let array = {
                id: objects.length,
                name: 'text',
                x: texts[forx][0],
                y: texts[forx][1],
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                color: '#ffffffff',
                fontstyle: texts[forx][2],
                textcontents: texts[forx][3],
                interactable: false,
            }
            objects.push(array);
        };

        player.x = 50;
        player.y = actstore.road.height;
    }else if(playingact==2){
        document.getElementById('backgroundimage').src = 'img/act2/background.png';
        document.getElementById('backgroundimage').style.height = misc.act2.backgroundimg.scale * document.getElementById('backgroundimage').style.naturalHeight;
        collisions.current = collisions.act2;
        interactions.current = interactions.act2;

        //collisions above, textures below

        objects = [];
        textures.actstorage = {
            loaded: 0,
            amount: 0,
        };
        textures.addimage('muacfrnt', 'img/act2/muac/muacfront.png');
        textures.addimage('muacfrntlay2', 'img/act2/muac/muacfrontlayer2.png');
        textures.addimage('muacfrnttape', 'img/act2/muac/muactape.png');
        
        textures.addimage('muacfrnt2', 'img/act2/mothermuac/muacfront.png');
        textures.addimage('muacfrnt2lay2', 'img/act2/mothermuac/muacfrontlayer2.png');
        textures.addimage('muacfrnt2tape', 'img/act2/mothermuac/muacfronttape.png');
        textures.addimage('muacback2', 'img/act2/mothermuac/muacback.png');
        textures.addimage('muacback2lay2', 'img/act2/mothermuac/muacbacklayer2.png');
        textures.addimage('muacback2tape', 'img/act2/mothermuac/muacbacktape.png');

        textures.addimage('progress0', 'img/act2/progressbar/progress0.png');
        textures.addimage('progress1', 'img/act2/progressbar/progress1.png');
        textures.addimage('progresstext', 'img/act2/progressbar/progresstext.png');

        textures.addimage('infantbody', 'img/act2/infantbody.png')
        textures.addimage('infantarm', 'img/act2/infantarm.png')
        textures.addimage('muactutorial', 'img/act2/howtousemuacposter.png');
        textures.addimage('tentext', 'img/act2/tentexterior.png');
        textures.addimage('tentint', 'img/act2/tentinterior.png');
        textures.addimage('backgroundimg', 'img/act2/backgrounddetail.png');

        while(textures.actstorage.amount!=textures.actstorage.loaded){
            await delaytime(250);
        };

        //textures above, objects below

        const actstore = textures.actstorage;
        objects.push({
            id: objects.length,
            name: 'backgroundimg',
            image: actstore.backgroundimg,
            x: -650,
            y: -900,
            angle: 0,
            rotatex: actstore.backgroundimg.width / 2,
            rotatey: actstore.backgroundimg.height / 2,
            interactable: false,
        });

        let tents = [
            {
                x: 1579,
                y: 1193,
                angle: 0,
            },
            {
                x: 172,
                y: 464,
                angle: 20,
            },
            {
                x: 621,
                y: -244,
                angle: 10,
            },
            {
                x: 1914,
                y: 550,
                angle: 0,
            },
            {
                x: 1999,
                y: -10,
                angle: 5,
            },
            {
                x: 800,
                y: -442,
                angle: 95,
            },
        ];
        for(let forx = 0; forx<tents.length; forx++){
            let array = {
                id: objects.length,
                name: 'tent',
                image: actstore.tentext,
                x: tents[forx].x,
                y: tents[forx].y,
                angle: tents[forx].angle,
                rotatex: actstore.tentext.width,
                rotatey: actstore.tentext.height,
                interactpath: 'tent',
                interactable: false,
            };
            if(forx==0){
                array.interactable = true;
                array.image = actstore.tentint,
                array.interactpath = 'tentwithint';
                array.special = {
                    eventcoords: [563, 223],
                };
            };
            objects.push(array);
        };

        npcs.human = [];
        npcs.human.push({
            size: 50,
            basespeed: 4,
            x: tents[0].x + 555,
            y: tents[0].y + 154,
            rotation: 0,
            path: [],
            static: true,
            hasbaby: false,
            id: npcs.human.length,
            lookcoords: [
                { //look somewhere inside of box
                    x: tents[0].x + 521,
                    y: tents[0].y + 160,
                    w: 24,
                    h: 28,
                },
                {
                    x: tents[0].x + 521,
                    y: tents[0].y + 160,
                    w: 24,
                    h: 28,
                },
                {
                    x: tents[0].x + 521,
                    y: tents[0].y + 160,
                    w: 24,
                    h: 28,
                },
                {
                    x: tents[0].x + 519,
                    y: tents[0].y + 225,
                    w: 50,
                    h: 38,
                },
                {
                    x: tents[0].x + 432,
                    y: tents[0].y + 177,
                    w: 51,
                    h: 90,
                },
                {
                    x: tents[0].x + 498,
                    y: tents[0].y + 87,
                    w: 108,
                    h: 15,
                },
            ],
        });
        misc.act2.workernpccoords = [tents[0].x + 555, tents[0].y + 154];

        let outsideNpcList = [
            {
                x: 1944,
                y: 145,
                hasbaby: true,
            },
            {
                x: 1964,
                y: 204,
                hasbaby: false,
            },
            {
                x: 476,
                y: 980,
                hasbaby: false,
            },
            {
                x: 745,
                y: 1001,
                hasbaby: false,
            },
            {
                x: 1356,
                y: 599,
                hasbaby: true,
            },
            {
                x: 1376,
                y: 660,
                hasbaby: false,
            },
            {
                x: 1455,
                y: 603,
                hasbaby: false,
            },
            {
                x: 1815,
                y: 1037,
                hasbaby: false,
            },
            {
                x: 1653,
                y: 107,
                hasbaby: false,
            },
            {
                x: 1650,
                y: 228,
                hasbaby: false,
            },
            {
                x: 1597,
                y: 291,
                hasbaby: false,
            },
        ];
        for(let forx = 0; forx<outsideNpcList.length; forx++){
            let npcarray = {
                size: 50,
                basespeed: 4,
                x: outsideNpcList[forx].x,
                y: outsideNpcList[forx].y,
                rotation: 0,
                path: [],
                static: true,
                hasbaby: outsideNpcList[forx].hasbaby,
                id: npcs.human.length,
                lookcoords: [
                    {
                        x: outsideNpcList[forx].x - 50,
                        y: outsideNpcList[forx].y - 50,
                        w: 150,
                        h: 159,
                    },
                ],
            };
            npcs.human.push(npcarray);

            const npc = npcs.human[npcs.human.length - 1];
            const npccenter = [npc.x + npc.size / 2, npc.y + npc.size / 2];
            let lookx = Math.floor(Math.random() * ((npc.lookcoords.length - 1) - 0 + 1)) + 0;
            let lookcoords = [
                Math.floor(Math.random() * ((npc.lookcoords[lookx].x + npc.lookcoords[lookx].w) - npc.lookcoords[lookx].x + 1)) + npc.lookcoords[lookx].x,
                Math.floor(Math.random() * ((npc.lookcoords[lookx].y + npc.lookcoords[lookx].h) - npc.lookcoords[lookx].y + 1)) + npc.lookcoords[lookx].y,
            ];
            npc.rotation = Math.atan2(npccenter[1] - lookcoords[1], npccenter[0] - lookcoords[0]) - 90 * Math.PI / 180;
        };

        let totalchairs = {
            rows: 4,
            columns: 5,
        };
        for(let forx = 0; forx<totalchairs.rows; forx++){
            for(let forx2 = 0; forx2<totalchairs.columns; forx2++){
                if(Math.floor(Math.random() * (5 - 1 + 1)) + 1==1){
                    continue;
                };
                let npcarray = {
                    size: 50,
                    basespeed: 4,
                    x: tents[0].x + 75 + 91 * forx,
                    y: tents[0].y + 84 + 52 * forx2,
                    rotation: 0,
                    path: [],
                    static: true,
                    hasbaby: true,
                    id: npcs.human.length,
                    lookcoords: [
                        {
                            x: tents[0].x + 490,
                            y: tents[0].y + 92,
                            w: 133,
                            h: 199,
                        },
                    ],
                };
                npcs.human.push(npcarray);

                const npc = npcs.human[npcs.human.length - 1];
                const npccenter = [npc.x + npc.size / 2, npc.y + npc.size / 2];
                let lookx = Math.floor(Math.random() * ((npc.lookcoords.length - 1) - 0 + 1)) + 0;
                let lookcoords = [
                    Math.floor(Math.random() * ((npc.lookcoords[lookx].x + npc.lookcoords[lookx].w) - npc.lookcoords[lookx].x + 1)) + npc.lookcoords[lookx].x,
                    Math.floor(Math.random() * ((npc.lookcoords[lookx].y + npc.lookcoords[lookx].h) - npc.lookcoords[lookx].y + 1)) + npc.lookcoords[lookx].y,
                ];
                npc.rotation = Math.atan2(npccenter[1] - lookcoords[1], npccenter[0] - lookcoords[0]) - 90 * Math.PI / 180;
            };
        };

        let texts = [
            [1120, 416, '30px Arial', "Today is the first day of work here."],
            [1100, 450, '25px Arial', "I will get to see how malnutrition is diagnosed."],
            [1359, 760, '23px Arial', "Unfortunately I'm not very fluent in this language."],
            [1459, 780, '18px Arial', "I guess they will be majority talking."],
            [1091, 1292, '33px Arial', "I should enter this tent.."],
            [2277, 1383, '25px Arial', "<< ..and meet them here,"],
            [2327, 1413, '22px Arial', "behind the table."],
        ];
        for(let forx = 0; forx<texts.length; forx++){
            let array = {
                id: objects.length,
                name: 'text',
                x: texts[forx][0],
                y: texts[forx][1],
                angle: 0,
                rotatex: 0,
                rotatey: 0,
                color: '#ffffffff',
                fontstyle: texts[forx][2],
                textcontents: texts[forx][3],
                interactable: false,
            }
            objects.push(array);
        };

        player.x = 1350;
        player.y = 140;
    };
}

function delaytime(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}

function drawimgrotated(image, x, y, w, h, angle, rotatex, rotatey){
    //angle in degrees
    //rotatex and rotatey are relative to x and y

    ctx.translate(x + rotatex, y + rotatey);
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-(x + rotatex), -(y + rotatey));
    ctx.drawImage(image, x, y, w, h);
    ctx.translate(x + rotatex, y + rotatey);
    ctx.rotate(-angle * Math.PI / 180);
    ctx.translate(-(x + rotatex), -(y + rotatey));
};

function collision(collisiontype, parentx, parenty, x, y, width, height, angle, xrotate, yrotate, parentx2, parenty2, x2, y2, width2, height2, angle2, xrotate2, yrotate2) {
    //utilizes seperating axis theorem

    /* parameters for collision()
    parentx (or x if no child)
    parenty (or y if no child)
    childx
    childy
    angle (in degrees)
    rotatepointx - bus.collision['x' + x1] //is used to get the rotation as if the parent wasnt added (gets rotaton point for child)
    rotatepointy - bus.collision['y' + x1] */

    if(collisiontype=='rectrect'){ 
        //difference is point of rotation to point of rotation
        let matrix = [[0, 0], [width, 0], [width, height], [0, height]];
        let matrix2 = [[0, 0], [width2, 0], [width2, height2], [0, height2]];
        let finallength = angle.length;
        if(angle2.length>finallength){
            finallength = angle2.length;
        };
        for(let forarrayx = 0; finallength>forarrayx; forarrayx++){
            if(forarrayx<angle.length){
                xrotate[forarrayx] -= x;
                yrotate[forarrayx] -= y;
                if(forarrayx!=0){
                    let thex = xrotate[forarrayx] - xrotate[forarrayx - 1];
                    let they = yrotate[forarrayx] - yrotate[forarrayx - 1];
                    xrotate[forarrayx] = xrotate[forarrayx - 1] + thex * Math.cos(angle[forarrayx - 1] * Math.PI / 180) - they * Math.sin(angle[forarrayx - 1] * Math.PI / 180);
                    yrotate[forarrayx] = yrotate[forarrayx - 1] + they * Math.cos(angle[forarrayx - 1] * Math.PI / 180) + thex * Math.sin(angle[forarrayx - 1] * Math.PI / 180);
                };
                for(let forx = 0; matrix.length>forx; forx++){
                    matrix[forx][0] -= xrotate[forarrayx];
                    matrix[forx][1] -= yrotate[forarrayx];
                    let xx = matrix[forx][0] * Math.cos(angle[forarrayx] * Math.PI / 180) - matrix[forx][1] * Math.sin(angle[forarrayx] * Math.PI / 180) + xrotate[forarrayx];
                    let yy = matrix[forx][1] * Math.cos(angle[forarrayx] * Math.PI / 180) + matrix[forx][0] * Math.sin(angle[forarrayx] * Math.PI / 180) + yrotate[forarrayx];
                    matrix[forx][0] = xx;
                    matrix[forx][1] = yy;
                };
            };
            if(forarrayx<angle2.length){
                xrotate2[forarrayx] -= x2;
                yrotate2[forarrayx] -= y2;
                if(forarrayx!=0){
                    let thex = xrotate2[forarrayx] - xrotate2[forarrayx - 1];
                    let they = yrotate2[forarrayx] - yrotate2[forarrayx - 1];
                    xrotate2[forarrayx] = xrotate2[forarrayx - 1] + thex * Math.cos(angle2[forarrayx - 1] * Math.PI / 180) - they * Math.sin(angle2[forarrayx - 1] * Math.PI / 180);
                    yrotate2[forarrayx] = yrotate2[forarrayx - 1] + they * Math.cos(angle2[forarrayx - 1] * Math.PI / 180) + thex * Math.sin(angle2[forarrayx - 1] * Math.PI / 180);
                };
                for(let forx = 0; matrix2.length>forx; forx++){
                    matrix2[forx][0] -= xrotate2[forarrayx];
                    matrix2[forx][1] -= yrotate2[forarrayx];
                    let xx = matrix2[forx][0] * Math.cos(angle2[forarrayx] * Math.PI / 180) - matrix2[forx][1] * Math.sin(angle2[forarrayx] * Math.PI / 180) + xrotate2[forarrayx];
                    let yy = matrix2[forx][1] * Math.cos(angle2[forarrayx] * Math.PI / 180) + matrix2[forx][0] * Math.sin(angle2[forarrayx] * Math.PI / 180) + yrotate2[forarrayx];
                    matrix2[forx][0] = xx;
                    matrix2[forx][1] = yy;
                };
            };
        };

        let collide = 0;
        //initialization above
        //collision calc below
        let tempvar = [[['', ''], ['', '']], [['', ''], ['', '']]];
        let tempvar2 = [[['', ''], ['', '']], [['', ''], ['', '']]];
        //^^^ [small, large] [main x, main y] [matrix2 x, matrix2 y]
        let tempmatrix = [
            [matrix[0][0], matrix[0][1]],
            [matrix[1][0], matrix[1][1]],
            [matrix[2][0], matrix[2][1]],
            [matrix[3][0], matrix[3][1]]
        ];
        let tempmatrix2 = [
            [matrix2[0][0], matrix2[0][1]],
            [matrix2[1][0], matrix2[1][1]],
            [matrix2[2][0], matrix2[2][1]],
            [matrix2[3][0], matrix2[3][1]]
        ];
        let temprotepointx = [];
        let temprotepointy = [];
        let temprotepointx2 = [];
        let temprotepointy2 = []; //NEVER USE temprotepointx.length, use angle.length instead
        for(let forarrayx = 0; finallength>forarrayx; forarrayx++){
            temprotepointx[forarrayx] = xrotate[forarrayx] || null; //never use xrotate.length, because xrotate.length - 1 = null
            temprotepointy[forarrayx] = yrotate[forarrayx] || null;
            temprotepointx2[forarrayx] = xrotate2[forarrayx] || null;
            temprotepointy2[forarrayx] = yrotate2[forarrayx] || null;
        };

        for(let forarrayx = 0; angle.length>forarrayx; forarrayx++){
            if(forarrayx!=0){
                let thex = temprotepointx[forarrayx] - temprotepointx[forarrayx - 1];
                let they = temprotepointy[forarrayx] - temprotepointy[forarrayx - 1];
                temprotepointx[forarrayx] = temprotepointx[forarrayx - 1] + thex * Math.cos(-angle[forarrayx - 1] * Math.PI / 180) - they * Math.sin(-angle[forarrayx - 1] * Math.PI / 180);
                temprotepointy[forarrayx] = temprotepointy[forarrayx - 1] + they * Math.cos(-angle[forarrayx - 1] * Math.PI / 180) + thex * Math.sin(-angle[forarrayx - 1] * Math.PI / 180);
            };
            let differencex = (parentx2 + x2 + temprotepointx2[angle2.length - 1]) - (parentx + x + temprotepointx[forarrayx]);
            let differencey = (parenty2 + y2 + temprotepointy2[angle2.length - 1]) - (parenty + y + temprotepointy[forarrayx]);
            for(let forx = 0; matrix.length>forx; forx++){
                tempmatrix[forx][0] -= temprotepointx[forarrayx];
                tempmatrix[forx][1] -= temprotepointy[forarrayx];
                let xx = tempmatrix[forx][0] * Math.cos(-angle[forarrayx] * Math.PI / 180) - tempmatrix[forx][1] * Math.sin(-angle[forarrayx] * Math.PI / 180) + temprotepointx[forarrayx];
                let yy = tempmatrix[forx][1] * Math.cos(-angle[forarrayx] * Math.PI / 180) + tempmatrix[forx][0] * Math.sin(-angle[forarrayx] * Math.PI / 180) + temprotepointy[forarrayx];
                tempmatrix[forx][0] = xx;
                tempmatrix[forx][1] = yy;
                if(forarrayx==angle.length - 1){
                    if(tempvar[0][0][0]>tempmatrix[forx][0] || tempvar[0][0][0]===''){
                        tempvar[0][0][0] = tempmatrix[forx][0];
                        tempvar[0][0][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[1][0][0]<tempmatrix[forx][0] || tempvar[1][0][0]===''){
                        tempvar[1][0][0] = tempmatrix[forx][0];
                        tempvar[1][0][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[0][1][1]>tempmatrix[forx][1] || tempvar[0][1][1]===''){
                        tempvar[0][1][0] = tempmatrix[forx][0];
                        tempvar[0][1][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[1][1][1]<tempmatrix[forx][1] || tempvar[1][1][1]===''){
                        tempvar[1][1][0] = tempmatrix[forx][0];
                        tempvar[1][1][1] = tempmatrix[forx][1];
                    };
                };
            };
            for(let forx = 0; matrix2.length>forx; forx++){
                tempmatrix2[forx][0] -= temprotepointx2[angle2.length - 1];
                tempmatrix2[forx][1] -= temprotepointy2[angle2.length - 1];
                let xx = (tempmatrix2[forx][0] + differencex) * Math.cos(-angle[forarrayx] * Math.PI / 180) - (tempmatrix2[forx][1] + differencey) * Math.sin(-angle[forarrayx] * Math.PI / 180) - differencex + temprotepointx2[angle2.length - 1];
                let yy = (tempmatrix2[forx][1] + differencey) * Math.cos(-angle[forarrayx] * Math.PI / 180) + (tempmatrix2[forx][0] + differencex) * Math.sin(-angle[forarrayx] * Math.PI / 180) - differencey + temprotepointy2[angle2.length - 1];
                tempmatrix2[forx][0] = xx;
                tempmatrix2[forx][1] = yy;
                if(forarrayx==angle.length - 1){
                    if(tempvar2[0][0][0]>tempmatrix2[forx][0] || tempvar2[0][0][0]===''){
                        tempvar2[0][0][0] = tempmatrix2[forx][0];
                        tempvar2[0][0][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[1][0][0]<tempmatrix2[forx][0] || tempvar2[1][0][0]===''){
                        tempvar2[1][0][0] = tempmatrix2[forx][0];
                        tempvar2[1][0][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[0][1][1]>tempmatrix2[forx][1] || tempvar2[0][1][1]===''){
                        tempvar2[0][1][0] = tempmatrix2[forx][0];
                        tempvar2[0][1][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[1][1][1]<tempmatrix2[forx][1] || tempvar2[1][1][1]===''){
                        tempvar2[1][1][0] = tempmatrix2[forx][0];
                        tempvar2[1][1][1] = tempmatrix2[forx][1];
                    };
                };
            };
        };

        let collisionx = parentx + x + tempvar[0][0][0];
        let collisionXandWidth = parentx + x + tempvar[1][0][0];
        let collisiony = parenty + y + tempvar[0][1][1];
        let collisionYandHeight = parenty + y + tempvar[1][1][1];
        let collisionx2 = parentx2 + x2 + tempvar2[0][0][0];
        let collisionXandWidth2 = parentx2 + x2 + tempvar2[1][0][0];
        let collisiony2 = parenty2 + y2 + tempvar2[0][1][1];
        let collisionYandHeight2 = parenty2 + y2 + tempvar2[1][1][1];

        if(collisionXandWidth>collisionx2 && collisionx<collisionXandWidth2 && collisionYandHeight>collisiony2 && collisiony<collisionYandHeight2){
            collide++;
        };

        tempvar = [[['', ''], ['', '']], [['', ''], ['', '']]];
        tempvar2 = [[['', ''], ['', '']], [['', ''], ['', '']]];

        tempmatrix = [
            [matrix[0][0], matrix[0][1]],
            [matrix[1][0], matrix[1][1]],
            [matrix[2][0], matrix[2][1]],
            [matrix[3][0], matrix[3][1]]
        ];
        tempmatrix2 = [
            [matrix2[0][0], matrix2[0][1]],
            [matrix2[1][0], matrix2[1][1]],
            [matrix2[2][0], matrix2[2][1]],
            [matrix2[3][0], matrix2[3][1]]
        ];
        temprotepointx = [];
        temprotepointy = [];
        temprotepointx2 = [];
        temprotepointy2 = [];
        for(let forarrayx = 0; finallength>forarrayx; forarrayx++){
            temprotepointx[forarrayx] = xrotate[forarrayx] || null;
            temprotepointy[forarrayx] = yrotate[forarrayx] || null;
            temprotepointx2[forarrayx] = xrotate2[forarrayx] || null;
            temprotepointy2[forarrayx] = yrotate2[forarrayx] || null;
        };

        for(let forarrayx = 0; angle2.length>forarrayx; forarrayx++){
            if(forarrayx!=0){
                let thex = temprotepointx2[forarrayx] - temprotepointx2[forarrayx - 1];
                let they = temprotepointy2[forarrayx] - temprotepointy2[forarrayx - 1];
                temprotepointx2[forarrayx] = temprotepointx2[forarrayx - 1] + thex * Math.cos(-angle2[forarrayx - 1] * Math.PI / 180) - they * Math.sin(-angle2[forarrayx - 1] * Math.PI / 180);
                temprotepointy2[forarrayx] = temprotepointy2[forarrayx - 1] + they * Math.cos(-angle2[forarrayx - 1] * Math.PI / 180) + thex * Math.sin(-angle2[forarrayx - 1] * Math.PI / 180);
            };
            let differencex = (parentx + x + temprotepointx[angle.length - 1]) - (parentx2 + x2 + temprotepointx2[forarrayx]);
            let differencey = (parenty + y + temprotepointy[angle.length - 1]) - (parenty2 + y2 + temprotepointy2[forarrayx]);
            for(let forx = 0; matrix.length>forx; forx++){
                tempmatrix[forx][0] -= temprotepointx[angle.length - 1];
                tempmatrix[forx][1] -= temprotepointy[angle.length - 1];
                let xx = (tempmatrix[forx][0] + differencex) * Math.cos(-angle2[forarrayx] * Math.PI / 180) - (tempmatrix[forx][1] + differencey) * Math.sin(-angle2[forarrayx] * Math.PI / 180) - differencex + temprotepointx[angle.length - 1];
                let yy = (tempmatrix[forx][1] + differencey) * Math.cos(-angle2[forarrayx] * Math.PI / 180) + (tempmatrix[forx][0] + differencex) * Math.sin(-angle2[forarrayx] * Math.PI / 180) - differencey + temprotepointy[angle.length - 1];
                tempmatrix[forx][0] = xx;
                tempmatrix[forx][1] = yy;
                if(forarrayx==angle2.length - 1){
                    if(tempvar[0][0][0]>tempmatrix[forx][0] || tempvar[0][0][0]===''){
                        tempvar[0][0][0] = tempmatrix[forx][0];
                        tempvar[0][0][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[1][0][0]<tempmatrix[forx][0] || tempvar[1][0][0]===''){
                        tempvar[1][0][0] = tempmatrix[forx][0];
                        tempvar[1][0][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[0][1][1]>tempmatrix[forx][1] || tempvar[0][1][1]===''){
                        tempvar[0][1][0] = tempmatrix[forx][0];
                        tempvar[0][1][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[1][1][1]<tempmatrix[forx][1] || tempvar[1][1][1]===''){
                        tempvar[1][1][0] = tempmatrix[forx][0];
                        tempvar[1][1][1] = tempmatrix[forx][1];
                    };
                };
            };
            for(let forx = 0; matrix2.length>forx; forx++){
                tempmatrix2[forx][0] -= temprotepointx2[forarrayx];
                tempmatrix2[forx][1] -= temprotepointy2[forarrayx];
                let xx = tempmatrix2[forx][0] * Math.cos(-angle2[forarrayx] * Math.PI / 180) - tempmatrix2[forx][1] * Math.sin(-angle2[forarrayx] * Math.PI / 180) + temprotepointx2[forarrayx];
                let yy = tempmatrix2[forx][1] * Math.cos(-angle2[forarrayx] * Math.PI / 180) + tempmatrix2[forx][0] * Math.sin(-angle2[forarrayx] * Math.PI / 180) + temprotepointy2[forarrayx];
                tempmatrix2[forx][0] = xx;
                tempmatrix2[forx][1] = yy;
                if(forarrayx==angle2.length - 1){
                    if(tempvar2[0][0][0]>tempmatrix2[forx][0] || tempvar2[0][0][0]===''){
                        tempvar2[0][0][0] = tempmatrix2[forx][0];
                        tempvar2[0][0][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[1][0][0]<tempmatrix2[forx][0] || tempvar2[1][0][0]===''){
                        tempvar2[1][0][0] = tempmatrix2[forx][0];
                        tempvar2[1][0][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[0][1][1]>tempmatrix2[forx][1] || tempvar2[0][1][1]===''){
                        tempvar2[0][1][0] = tempmatrix2[forx][0];
                        tempvar2[0][1][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[1][1][1]<tempmatrix2[forx][1] || tempvar2[1][1][1]===''){
                        tempvar2[1][1][0] = tempmatrix2[forx][0];
                        tempvar2[1][1][1] = tempmatrix2[forx][1];
                    };
                };
            };
        };
        collisionx = parentx + x + tempvar[0][0][0];
        collisionXandWidth = parentx + x + tempvar[1][0][0];
        collisiony = parenty + y + tempvar[0][1][1];
        collisionYandHeight = parenty + y + tempvar[1][1][1];
        collisionx2 = parentx2 + x2 + tempvar2[0][0][0];
        collisionXandWidth2 = parentx2 + x2 + tempvar2[1][0][0];
        collisiony2 = parenty2 + y2 + tempvar2[0][1][1];
        collisionYandHeight2 = parenty2 + y2 + tempvar2[1][1][1];
        if(collisionXandWidth>collisionx2 && collisionx<collisionXandWidth2 && collisionYandHeight>collisiony2 && collisiony<collisionYandHeight2){
            collide++;
        };

        return collide==2 ? true : false;
    }else if(collisiontype=='rectcirc'){
        let radius2 = width2 / 2;
        x2 += radius2;
        y2 += radius2;
        let matrix = [[0, 0], [width, 0], [width, height], [0, height]];
        let matrix2 = [[0, 0]];
        let finallength = angle.length; //angle2.length will never be greater than angle.length
        for(let forarrayx = 0; angle.length>forarrayx; forarrayx++){
            xrotate[forarrayx] -= x;
            yrotate[forarrayx] -= y;
            if(forarrayx!=0){
                let thex = xrotate[forarrayx] - xrotate[forarrayx - 1];
                let they = yrotate[forarrayx] - yrotate[forarrayx - 1];
                xrotate[forarrayx] = xrotate[forarrayx - 1] + thex * Math.cos(angle[forarrayx - 1] * Math.PI / 180) - they * Math.sin(angle[forarrayx - 1] * Math.PI / 180);
                yrotate[forarrayx] = yrotate[forarrayx - 1] + they * Math.cos(angle[forarrayx - 1] * Math.PI / 180) + thex * Math.sin(angle[forarrayx - 1] * Math.PI / 180);
            };
            for(let forx = 0; matrix.length>forx; forx++){
                matrix[forx][0] -= xrotate[forarrayx];
                matrix[forx][1] -= yrotate[forarrayx];
                let xx = matrix[forx][0] * Math.cos(angle[forarrayx] * Math.PI / 180) - matrix[forx][1] * Math.sin(angle[forarrayx] * Math.PI / 180) + xrotate[forarrayx];
                let yy = matrix[forx][1] * Math.cos(angle[forarrayx] * Math.PI / 180) + matrix[forx][0] * Math.sin(angle[forarrayx] * Math.PI / 180) + yrotate[forarrayx];
                matrix[forx][0] = xx;
                matrix[forx][1] = yy;
            };
        };
        //initialization above
        //collision calc below
        let tempvar = [[['', ''], ['', '']], [['', ''], ['', '']]];
        let tempvar2 = [[['', ''], ['', '']], [['', ''], ['', '']]];
        let rotatedsquarematrix = [[0, 0], [0, 0], [0, 0], [0, 0]];
        //[small, large] [main x, main y] [matrix2 x, matrix2 y]
        let tempmatrix = [
            [matrix[0][0], matrix[0][1]],
            [matrix[1][0], matrix[1][1]],
            [matrix[2][0], matrix[2][1]],
            [matrix[3][0], matrix[3][1]]
        ];
        let tempmatrix2 = [
            [matrix2[0][0], matrix2[0][1]],
        ];
        let temprotepointx = [];
        let temprotepointy = [];
        for(let forarrayx = 0; finallength>forarrayx; forarrayx++){
            temprotepointx[forarrayx] = xrotate[forarrayx] || null; //never use xrotate.length, because xrotate.length - 1 = null
            temprotepointy[forarrayx] = yrotate[forarrayx] || null;
        };
        
        for(let forarrayx = 0; angle.length>forarrayx; forarrayx++){
            if(forarrayx!=0){
                let thex = temprotepointx[forarrayx] - temprotepointx[forarrayx - 1];
                let they = temprotepointy[forarrayx] - temprotepointy[forarrayx - 1];
                temprotepointx[forarrayx] = temprotepointx[forarrayx - 1] + thex * Math.cos(-angle[forarrayx - 1] * Math.PI / 180) - they * Math.sin(-angle[forarrayx - 1] * Math.PI / 180);
                temprotepointy[forarrayx] = temprotepointy[forarrayx - 1] + they * Math.cos(-angle[forarrayx - 1] * Math.PI / 180) + thex * Math.sin(-angle[forarrayx - 1] * Math.PI / 180);
            };
            let differencex = (parentx2 + x2 + xrotate2[angle2.length - 1]) - (parentx + x + temprotepointx[forarrayx]);
            let differencey = (parenty2 + y2 + yrotate2[angle2.length - 1]) - (parenty + y + temprotepointy[forarrayx]);
            for(let forx = 0; matrix.length>forx; forx++){
                tempmatrix[forx][0] -= temprotepointx[forarrayx];
                tempmatrix[forx][1] -= temprotepointy[forarrayx];
                let xx = tempmatrix[forx][0] * Math.cos(-angle[forarrayx] * Math.PI / 180) - tempmatrix[forx][1] * Math.sin(-angle[forarrayx] * Math.PI / 180) + temprotepointx[forarrayx];
                let yy = tempmatrix[forx][1] * Math.cos(-angle[forarrayx] * Math.PI / 180) + tempmatrix[forx][0] * Math.sin(-angle[forarrayx] * Math.PI / 180) + temprotepointy[forarrayx];
                tempmatrix[forx][0] = xx;
                tempmatrix[forx][1] = yy;
                rotatedsquarematrix[forx][0] = xx;
                rotatedsquarematrix[forx][1] = yy;
                if(forarrayx==angle.length - 1){
                    if(tempvar[0][0][0]>tempmatrix[forx][0] || tempvar[0][0][0]===''){
                        tempvar[0][0][0] = tempmatrix[forx][0];
                        tempvar[0][0][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[1][0][0]<tempmatrix[forx][0] || tempvar[1][0][0]===''){
                        tempvar[1][0][0] = tempmatrix[forx][0];
                        tempvar[1][0][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[0][1][1]>tempmatrix[forx][1] || tempvar[0][1][1]===''){
                        tempvar[0][1][0] = tempmatrix[forx][0];
                        tempvar[0][1][1] = tempmatrix[forx][1];
                    };
                    if(tempvar[1][1][1]<tempmatrix[forx][1] || tempvar[1][1][1]===''){
                        tempvar[1][1][0] = tempmatrix[forx][0];
                        tempvar[1][1][1] = tempmatrix[forx][1];
                    };
                };
            };
            for(let forx = 0; matrix2.length>forx; forx++){
                tempmatrix2[forx][0] -= xrotate2[angle2.length - 1];
                tempmatrix2[forx][1] -= yrotate2[angle2.length - 1];
                let xx = (tempmatrix2[forx][0] + differencex) * Math.cos(-angle[forarrayx] * Math.PI / 180) - (tempmatrix2[forx][1] + differencey) * Math.sin(-angle[forarrayx] * Math.PI / 180) - differencex + xrotate2[angle2.length - 1];
                let yy = (tempmatrix2[forx][1] + differencey) * Math.cos(-angle[forarrayx] * Math.PI / 180) + (tempmatrix2[forx][0] + differencex) * Math.sin(-angle[forarrayx] * Math.PI / 180) - differencey + yrotate2[angle2.length - 1];
                tempmatrix2[forx][0] = xx;
                tempmatrix2[forx][1] = yy;
                if(forarrayx==angle.length - 1){
                    if(tempvar2[0][0][0]>tempmatrix2[forx][0] || tempvar2[0][0][0]===''){
                        tempvar2[0][0][0] = tempmatrix2[forx][0];
                        tempvar2[0][0][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[1][0][0]<tempmatrix2[forx][0] || tempvar2[1][0][0]===''){
                        tempvar2[1][0][0] = tempmatrix2[forx][0];
                        tempvar2[1][0][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[0][1][1]>tempmatrix2[forx][1] || tempvar2[0][1][1]===''){
                        tempvar2[0][1][0] = tempmatrix2[forx][0];
                        tempvar2[0][1][1] = tempmatrix2[forx][1];
                    };
                    if(tempvar2[1][1][1]<tempmatrix2[forx][1] || tempvar2[1][1][1]===''){
                        tempvar2[1][1][0] = tempmatrix2[forx][0];
                        tempvar2[1][1][1] = tempmatrix2[forx][1];
                    };
                };
            };
        };
        
        let collisionx = parentx + x + tempvar[0][0][0];
        let collisionXandWidth = parentx + x + tempvar[1][0][0];
        let collisiony = parenty + y + tempvar[0][1][1];
        let collisionYandHeight = parenty + y + tempvar[1][1][1];
        let collisionx2 = parentx2 + x2 + tempvar2[0][0][0];
        let collisiony2 = parenty2 + y2 + tempvar2[0][1][1];
        let collide = false;
        if(Math.sqrt((parentx + x + rotatedsquarematrix[0][0] - collisionx2) ** 2 + (parenty + y + rotatedsquarematrix[0][1] - collisiony2) ** 2)<radius2){
            collide = true;
        }else if(Math.sqrt((parentx + x + rotatedsquarematrix[1][0] - collisionx2) ** 2 + (parenty + y + rotatedsquarematrix[1][1] - collisiony2) ** 2)<radius2){
            collide = true;
        }else if(Math.sqrt((parentx + x + rotatedsquarematrix[2][0] - collisionx2) ** 2 + (parenty + y + rotatedsquarematrix[2][1] - collisiony2) ** 2)<radius2){
            collide = true;
        }else if(Math.sqrt((parentx + x + rotatedsquarematrix[3][0] - collisionx2) ** 2 + (parenty + y + rotatedsquarematrix[3][1] - collisiony2) ** 2)<radius2){
            collide = true;
        };
        if((collisionXandWidth>collisionx2 - radius2 && collisionx<collisionx2 + radius2 && collisionYandHeight>collisiony2 && collisiony<collisiony2) || (collisionXandWidth>collisionx2 && collisionx<collisionx2 && collisionYandHeight>collisiony2 - radius2 && collisiony<collisiony2 + radius2)){
            collide = true;
        };
        return collide;
    }else if(collisiontype=='circcirc'){
        let radius = width / 2;
        let radius2 = width2 / 2;
        if(Math.sqrt(((parentx + x + radius) - (parentx2 + x2 + radius2)) ** 2 + ((parenty + y + radius) - (parenty2 + y2 + radius2)) ** 2)<radius + radius2){
            return true;
        };
    };
}

let transx = (mouse.x - window.innerWidth / 2) * (2.1 - canvas.style.zoom) + player.x + player.size / 2 - canvas.width / 2;
let transy = (mouse.y - window.innerHeight / 2) * (2.1 - canvas.style.zoom) + player.y + player.size / 2 - canvas.height / 2;

setInterval(() => {
    if(playingact==0){
        return;
    };
    document.getElementById('backgroundimage').style.left = misc['act' + playingact].backgroundimg.imgx - transx * 0.75 + 'px';
    document.getElementById('backgroundimage').style.top = misc['act' + playingact].backgroundimg.imgy - transy * 0.75  + 'px';
}, 200);

function draw() {
    ctx.reset();
    ctx.imageSmoothingEnabled = false;
    ctx2.reset();
    ctx2.imageSmoothingEnabled = false;
    if(playingact==0){
        return;
    };
    if(audio['act' + playingact].ambience!=null && audio['act' + playingact].ambience.paused){
        audio.playaud(audio['act' + playingact].ambience);
    };
    canvas.width = adapttocanvzoom(window.innerWidth);
    canvas.height = adapttocanvzoom(window.innerHeight);
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    let playercenter = [player.x + player.size / 2, player.y + player.size / 2];

    transx = (mouse.x - window.innerWidth / 2) * (2.1 - canvas.style.zoom) + playercenter[0] - canvas.width / 2; //distance between camera at 0, 0 and camera following mouse
    transy = (mouse.y - window.innerHeight / 2) * (2.1 - canvas.style.zoom) + playercenter[1] - canvas.height / 2;

    ctx.translate(-transx, -transy);

    let anglePlayerToMouse = Math.atan2(playercenter[1] - (adapttocanvzoom(mouse.y) + transy), playercenter[0] - (adapttocanvzoom(mouse.x) + transx));
    let playermoves = [ //[0][1] and [1][0] are filler for collision for loop
        [0, 0],
        [0, 0],
    ];
    //below prevents duplication of speed
    let used = {
        w: false,
        a: false,
        s: false,
        d: false,
    };

    for(let forx = 0; forx<keysdown.length; forx++){
        if((keysdown.indexOf('w')>-1 || keysdown.indexOf('W')>-1) && !used.w){
            used.w = true;
            playermoves[0][0] += -player.basespeed * Math.cos(anglePlayerToMouse);
            playermoves[1][1] += -player.basespeed * Math.sin(anglePlayerToMouse);
        }else if((keysdown.indexOf('a')>-1 || keysdown.indexOf('A')>-1) && !used.a){
            used.a = true;
            playermoves[0][0] += -player.basespeed * 0.75 * Math.sin(anglePlayerToMouse);
            playermoves[1][1] += player.basespeed * 0.75 * Math.cos(anglePlayerToMouse);
        }else if((keysdown.indexOf('s')>-1 || keysdown.indexOf('S')>-1) && !used.s){
            used.s = true;
            playermoves[0][0] += player.basespeed * 0.5 * Math.cos(anglePlayerToMouse);
            playermoves[1][1] += player.basespeed * 0.5 * Math.sin(anglePlayerToMouse);
        }else if((keysdown.indexOf('d')>-1 || keysdown.indexOf('D')>-1) && !used.d){
            used.d = true;
            playermoves[0][0] += player.basespeed * 0.75 * Math.sin(anglePlayerToMouse);
            playermoves[1][1] += -player.basespeed * 0.75 * Math.cos(anglePlayerToMouse);
        };
    };

    let objectswithinteract = [];
    let objectswithcollision = [];
    for(let forx = 0; forx<objects.length; forx++){
        if(typeof objects[forx].interactpath==='string'){
            objectswithcollision.push(objects[forx]);
        };
        if(objects[forx].interactable){
            objectswithinteract.push(objects[forx]);
        };
    };

    for(let forx = 0; forx<playermoves.length; forx++){
        for(let forx2 = 0; forx2<collisions.current.global.length; forx2++){ //global collisions
            let collcurrglo = collisions.current.global[forx2];
            if(collision('rectcirc', collcurrglo.x, collcurrglo.y, 0, 0, collcurrglo.w, collcurrglo.h, [collcurrglo.angle], [collcurrglo.rotatex], [collcurrglo.rotatey], player.x + playermoves[forx][0], player.y + playermoves[forx][1], 0, 0, player.size, player.size, [player.rotation], [player.size / 2], [player.size / 2])){
                playermoves[forx][forx] = 0;
            };
        };
        for(let forx2 = 0; forx2<objectswithcollision.length; forx2++){ //object collisions
            let objwitcol = objectswithcollision[forx2];
            let collcurr = collisions.current[objwitcol.interactpath];
            for(let forx3 = 0; forx3<collcurr.length; forx3++){
                if(collision('rectcirc', objwitcol.x, objwitcol.y, collcurr[forx3].x, collcurr[forx3].y, collcurr[forx3].w, collcurr[forx3].h, [objwitcol.angle], [objwitcol.rotatex], [objwitcol.rotatey], player.x + playermoves[forx][0], player.y + playermoves[forx][1], 0, 0, player.size, player.size, [player.rotation], [player.size / 2], [player.size / 2])){
                    playermoves[forx][forx] = 0;
                };
            };
        };
        for(let forx2 = 0; forx2<npcs.human.length; forx2++){ //human collisions
            let objwitcol = npcs.human[forx2];
            if(collision('circcirc', objwitcol.x, objwitcol.y, 0, 0, objwitcol.size, objwitcol.size, [objwitcol.rotation], [objwitcol.size / 2], [objwitcol.size / 2], player.x + playermoves[forx][0], player.y + playermoves[forx][1], 0, 0, player.size, player.size, [player.rotation], [player.size / 2], [player.size / 2])){
                playermoves[forx][forx] = 0;
                objwitcol.rotation = Math.atan2((objwitcol.y + objwitcol.size / 2) - playercenter[1], (objwitcol.x + objwitcol.size / 2) - playercenter[0]) - 90 * Math.PI / 180;
            };
        };
    };

    if(Number.isNaN(player.lockrotation)){
        player.rotation = anglePlayerToMouse - 90 * Math.PI / 180;
    }else{
        player.rotation = player.lockrotation;
    };
    let oldplayerpos = [player.x, player.y];
    if(!player.preventmovement){
        player.x += playermoves[0][0];
        player.y += playermoves[1][1];
    }else if(player.target.length!=0){
        if(player.x<player.target[0]){
            player.x += player.basespeed * 0.05;
        }else if(player.x>player.target[0]){
            player.x -= player.basespeed * 0.05;
        };
        if(player.y<player.target[1]){
            player.y += player.basespeed * 0.05;
        }else if(player.y>player.target[1]){
            player.y -= player.basespeed * 0.05;
        };
        if(Math.floor(player.x)==Math.floor(player.target[0]) && Math.floor(player.y)==Math.floor(player.target[1])){
            player.x = player.target[0];
            player.y = player.target[1];
            player.target = [];
        };
    };

    const distancebetweennewandold = Math.sqrt((oldplayerpos[0] - player.x) ** 2 + (oldplayerpos[1] - player.y) ** 2) / 4;
    if(distancebetweennewandold<0.5){
        audio.playaud(audio.general.walking, 'pause');
    }else{
        audio.general.walking.playbackRate = distancebetweennewandold>4 ? 4 : distancebetweennewandold;
        audio.playaud(audio.general.walking, 'play');
    };

    drawobjects();
    npcs.draw();
    player.draw();

    player.preventmovement = false;
    player.lockrotation = NaN;
    if(playingact==1){
        document.getElementById('act1space').style.top = '100%';
        document.getElementById('act1keyboardgame').setAttribute('hidden', "");
        misc.act1.keyboard(objectswithinteract); //for knocking on doors
    }else if(playingact==2){
        document.body.style.cursor = 'auto';
        document.getElementById('act2space').style.top = '100%';
        document.getElementById('act2job').setAttribute('hidden', "");
        misc.act2.charjob(objectswithinteract); //for the job game
    };

    mouse.lmb_click = false;
    mouse.lmb_clickup = false;
    mouse.rmb_click = false;
    mouse.rmb_clickup = false;
    keyclicked = [];
    mouse.prevx = mouse.x;
    mouse.prevy = mouse.y;
}

setInterval(() => {
    draw();
}, intervalspeed);