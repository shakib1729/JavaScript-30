let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds){
	// clear any existing timers
	 clearInterval(countdown);

	const now = Date.now(); //  in ms
	const then = now + seconds*1000; // 'then' is in milliseconds

   displayTimeLeft(seconds);
   displayEndTime(then);

	countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now())/1000); // we are taking the 'then' time and subtracting it with current time
		//check if we should stop it
		if(secondsLeft < 0 ){       
			clearInterval(countdown);   // if secondsLeft becomes less than 0 , then stop the setInterval()
			return;
		}

		//display it
		displayTimeLeft(secondsLeft);
	},1000);
}

function displayTimeLeft(seconds){
	const minutes = Math.floor(seconds/60);
	const remainderSeconds = seconds % 60;
	const display = `${minutes}:${remainderSeconds < 10 ? '0': ''}${remainderSeconds}`; // we put it in a variable because we want to use this more than once
    timerDisplay.textContent = display;
    document.title = display; // to update the 'title' (name of the page in tabs)
}

function displayEndTime(timeStamp){
	const end = new Date(timeStamp);
	const hour = end.getHours();  // in 24 hour format
	const minutes = end.getMinutes();
	endTime.textContent = `Be Back At ${hour > 12 ? hour -12: hour}:${minutes < 10 ? '0': ''}${minutes}`;

}

function startTimer(){
	const seconds = parseInt(this.dataset.time); //OR e.target.dataset.time
	timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e){
	e.preventDefault();
	const mins = this.minutes.value;
	timer(mins*60);
	this.reset();
} )