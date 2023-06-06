const container = document.querySelector(".container"),
 mainVideo = container.querySelector("video"),
 progressBar = container.querySelector(".progress-bar"),
 videoTimeline = container.querySelector(".video-timeline"),
 videoDuration = container.querySelector(".video-duration"),
 currentVidTime = container.querySelector(".current-time"),
 volumeBtn  = container.querySelector(".volume i"),
 volumeSlider  = container.querySelector(".left input"),
 skipForward = container.querySelector(".skip-forward i"),
 skipBackward = container.querySelector(".skip-backward i"),
 speedBtn = container.querySelector(".playback-speed span"),
 speedOptions= container.querySelector(".speed-options"),
 picInPicBtn= container.querySelector(".pic-in-pic span")
 fullScreenBtn= container.querySelector(".fullscreen i"),
 playPauseBtn = container.querySelector(".play-pause i");


const formatTime = time => {
   //getting time in sec, minute, and hour
   let seconds = Math.floor(time % 60),
   minutes =  Math.floor(time / 60) % 60,
   hours =  Math.floor(time / 3600);

   //adding 0 at the beginning if the particular value is less than 10
   seconds = seconds < 10 ? `0${seconds}` : seconds;
   minutes = minutes < 10 ? `0${minutes}` : minutes;
   hours = hours < 10 ? `0${hours}` : hours;

   if (hours == 0){
      return `${minutes}:${seconds}`;
   }
   return `${hours}:${minutes}:${seconds}`;
}
   mainVideo.addEventListener("timeupdate", e =>{
      let {currentTime, duration} = e.target;   //getting current time and duration of the video
      let percent = (currentTime /duration) * 100; //getting percent
      progressBar.style.width = `${percent}%`;  //passing percent as progress bar
      currentVidTime.innerText = formatTime(currentTime);
   });

   mainVideo.addEventListener("loadeddata", e =>{
      videoDuration.innerText = formatTime(e.target.duration); //passing video duration as videoDuration innertext
   });

   const draggeableProgressBar = e =>{
      let timelineWidth = videoTimeline.clientWidth; //getting video timeline width
      progressBar.style.width =  `${e.offsetX}px`; //passing offsetX value as progress bar width
      mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;  //updating video currentTime
   }

   videoTimeline.addEventListener("mousedown", () =>{
      videoTimeline.addEventListener("mousemove", draggeableProgressBar);
   });

   document.addEventListener("mouseup", () =>{ //removing mousemove listener on mouseup event
      videoTimeline.removeEventListener("mousemove", draggeableProgressBar);
   });

   videoTimeline.addEventListener("click", e => {
      let timelineWidth = videoTimeline.clientWidth; //getting video timeline width
      mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;  //updating video current Time
      //offset is the position of the mouse on the timeline
      
   });

   videoTimeline.addEventListener("mousemove", e => {
      const progressTime = videoTimeline.querySelector("span");
      let offsetX = e.offsetX;  //getting mouseX position
      progressTime.style.left = `${offsetX}px`;  //passing offsetX value as progressTime left value 
      let timelineWidth = videoTimeline.clientWidth; //getting video timeline width
      let percent = (e.offsetX / timelineWidth) * mainVideo.duration;  //getting percent
      progressTime.innertext = formatTime(percent);
   });

   volumeBtn.addEventListener("click", () => {
      if (!volumeBtn.classList.contains("fa-volume-high")) { //if volume icon isnt volume high
         mainVideo.volume = 0.5;     //make the video volume a value of 0.5
         volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
      }else {
         mainVideo.volume = 0.0;     //make the video volume a value of 0.0
         volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
      }
      volumeSlider.value = mainVideo.volume;    //update slider value according to video volume
   });
   volumeSlider.addEventListener("input", e =>{
      mainVideo.volume = e.target.value     //passing slider value as video volume
      if (e.target.value == 0){     //if slider value is 0,change volume icon to mute
         volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
      }else{
         volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
      }
   });
   speedBtn.addEventListener("click", e =>{
      speedOptions.classList.toggle("show");  //create a class to toggle show
   });

   document.addEventListener("click", e =>{
      if(e.target.tagName !== SPAN || e.target.className !== "material-symbols-outlined"){
         speedOptions.classList.remove("show");
      } 
   });

   speedOptions.querySelectorAll("li").forEach(option => {
      option.addEventListener("click", () =>{      //adding click event on all speed options
         mainVideo.playbackRate = option.dataset.speed;  //passing  option dataset value as video play back value
         speedOptions.querySelector(".active").classList.remove("active");   //remove the active class
         option.classList.add("active");  //adding active class to the selected option
      });
   });

   picInPicBtn.addEventListener("click", () =>{
      mainVideo.requestPictureInPicture();   //changing video mode to picture in picture
   });

   fullScreenBtn.addEventListener("click", () =>{
      container.classList.toggle("fullscreen"); //toggle fullscreen mode
      if(document.fullscreenElement){
         fullScreenBtn.classList.replace("fa-compress", "fa-expand");
         return document.exitFullscreen();   //exit from fullscreen mode and return
      }
      fullScreenBtn.classList.replace("fa-expand", "fa-compress");
      container.requestFullscreen();   //go to fullscreen mode
   });

   skipForward.addEventListener("click", () =>{
      mainVideo.currentTime += 5;  //adding 5 secs to the current video time 
   });
   skipBackward.addEventListener("click", () =>{
      mainVideo.currentTime -= 5;  //subtract 5 secs from the current video time
   });

   playPauseBtn.addEventListener('click', () => {
    //if the video is paused, play the video,else pause it
      mainVideo.paused ? mainVideo.play() : mainVideo.pause();
   });
   mainVideo.addEventListener("play", () =>{
      playPauseBtn.classList.replace("fa-play", "fa-pause"); //change the icon to pause if the video is playing
   });

   mainVideo.addEventListener("pause", () =>{
      playPauseBtn.classList.replace("fa-pause", "fa-play");  //change the video to play if its paused
   });
