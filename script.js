let voices=[];
let selectedVoice=null;
let words=[];
let index=0;

function goName(){
  screen_login.classList.add("hidden");
  screen_name.classList.remove("hidden");
}

function welcomeUser(){
  let name=username.value;
  if(!name) return;

  let u=new SpeechSynthesisUtterance("أهلًا وسهلًا بك يا "+name);
  u.lang="ar-SA";
  speechSynthesis.speak(u);

  screen_name.classList.add("hidden");
  screen_voice.classList.remove("hidden");

  loadVoices();
}

function loadVoices(){
  voices=speechSynthesis.getVoices().filter(v=>v.lang.includes("ar"));
  voiceSelect.innerHTML="";
  voices.forEach((v,i)=>{
    let o=document.createElement("option");
    o.value=i;
    o.text=v.name;
    voiceSelect.appendChild(o);
  });
}

function confirmVoice(){
  selectedVoice=voices[voiceSelect.value];
  screen_voice.classList.add("hidden");
  screen_menu.classList.remove("hidden");
  loadStories();
}

async function loadStories(){
  let res=await fetch("stories/index.json");
  let data=await res.json();
  for(let k in data){
    let b=document.createElement("button");
    b.textContent=data[k].title;
    b.onclick=()=>openStory(data[k].file);
    storiesList.appendChild(b);
  }
}

async function openStory(file){
  let res=await fetch("stories/"+file);
  let data=await res.json();

  storyTitle.textContent=data.title;
  words=data.text.split(" ");
  storyText.innerHTML=words.map(w=>`<span>${w}</span>`).join(" ");

  screen_menu.classList.add("hidden");
  screen_story.classList.remove("hidden");
}

function readStory(){
  let spans=document.querySelectorAll("#storyText span");
  index=0;

  let u=new SpeechSynthesisUtterance(words.join(" "));
  u.lang="ar-SA";
  u.voice=selectedVoice;
  u.rate=0.85;

  u.onboundary=e=>{
    if(e.name==="word"){
      spans.forEach(s=>s.classList.remove("active"));
      if(spans[index]) spans[index].classList.add("active");
      index++;
    }
  };

  speechSynthesis.speak(u);
}
