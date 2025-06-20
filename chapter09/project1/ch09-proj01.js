const symbolPlay = '⯈';
const symbolPause = '❚ ❚';
const files = ['Nature-8399','River-655','Waterfall-941','Wave-2737'];

document.addEventListener('DOMContentLoaded', () => {

 
  const video          = document.getElementById('vidPlayer');
  const playBtn        = document.getElementById('play');
  const stopBtn        = document.getElementById('stop');
  const volumeSlider   = document.getElementById('volume');
  const progress       = document.getElementById('progress');
  const progressFilled = document.getElementById('progressFilled');
  const skipBtns       = document.querySelectorAll('[data-skip]');
  const aside          = document.querySelector('aside');

  
  files.forEach(name => {
    const img = document.createElement('img');
    img.src           = `/chapter09/project1/images/${name}.jpg`;   
    img.alt           = name;
    img.dataset.video = `/chapter09/project1/videos/${name}.mp4`;
    img.className     = 'thumb';
    aside.appendChild(img);
  });

 
  function togglePlay() {
    video.paused ? video.play() : video.pause();
  }
  function updatePlayIcon() {
    playBtn.textContent = video.paused ? symbolPlay : symbolPause;
  }

  
  function handleStop() {
    video.pause();
    video.currentTime = 0;
  }

 
  function handleSkip() {
    video.currentTime += parseFloat(this.dataset.skip);
  }

  
  function handleVolume() {
    video.volume = this.value;
  }

  
  function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressFilled.style.flexBasis = `${percent}%`;
  }
  function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
  }

 
  function handleThumbClick(e) {
    const img = e.target.closest('img.thumb');
    if (!img) return;

    
    aside.querySelectorAll('img.thumb').forEach(t => t.classList.remove('active'));
    img.classList.add('active');

    
    video.pause();
    video.src = img.dataset.video;
    video.load();
    video.play();
  }


  playBtn.addEventListener('click', togglePlay);
  video .addEventListener('play',  updatePlayIcon);
  video .addEventListener('pause', updatePlayIcon);

  stopBtn.addEventListener('click', handleStop);

  skipBtns.forEach(btn => btn.addEventListener('click', handleSkip));

  volumeSlider.addEventListener('input', handleVolume);

  video.addEventListener('timeupdate', handleProgress);

 
  let mousedown = false;
  progress.addEventListener('click', scrub);
  progress.addEventListener('mousemove', e => mousedown && scrub(e));
  progress.addEventListener('mousedown', () => mousedown = true);
  progress.addEventListener('mouseup',   () => mousedown = false);

  
  aside.addEventListener('click', handleThumbClick);

 
  aside.querySelector('img.thumb')?.classList.add('active');
});