// =====================================================
// Student Portfolio - Oluwakemi Elizabeth Bakare
// COS 106 Term Project
// One script used by every page. Each part first checks
// that its elements exist on the current page.
// =====================================================


// ---------- 1. Mobile menu (all pages) ----------
var menuBtn = document.getElementById("menu-btn");
var navLinks = document.getElementById("nav-links");

if (menuBtn) {
  menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}


// ---------- 2. Audio player (home page) ----------
var audio = document.getElementById("my-audio");
var playBtn = document.getElementById("play-btn");
var progressBar = document.getElementById("progress-bar");
var progressFill = document.getElementById("progress-fill");
var currentTime = document.getElementById("current-time");
var totalTime = document.getElementById("total-time");

// turns seconds (e.g. 75) into text (e.g. "1:15")
function formatTime(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = Math.floor(seconds % 60);
  if (secs < 10) {
    secs = "0" + secs;
  }
  return mins + ":" + secs;
}

if (audio) {
  // play or pause when the button is clicked
  playBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = "&#10074;&#10074;";
    } else {
      audio.pause();
      playBtn.innerHTML = "&#9654;";
    }
  });

  // show the total length once the audio is loaded
  function showTotal() {
    if (audio.duration && isFinite(audio.duration)) {
      totalTime.textContent = formatTime(audio.duration);
    }
  }
  audio.addEventListener("loadedmetadata", showTotal);
  audio.addEventListener("durationchange", showTotal);
  audio.addEventListener("timeupdate", showTotal);
  showTotal();

  // move the progress bar while the audio plays
  audio.addEventListener("timeupdate", function () {
    var percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    currentTime.textContent = formatTime(audio.currentTime);
  });

  // go back to the start when the audio ends
  audio.addEventListener("ended", function () {
    playBtn.innerHTML = "&#9654;";
    progressFill.style.width = "0%";
    currentTime.textContent = "0:00";
  });

  // click on the bar to jump to that part of the audio
  progressBar.addEventListener("click", function (event) {
    var clickPosition = event.offsetX / progressBar.clientWidth;
    audio.currentTime = clickPosition * audio.duration;
  });
}


// ---------- 3. Project details buttons (projects page) ----------
var detailButtons = document.querySelectorAll(".details-btn");

for (var i = 0; i < detailButtons.length; i++) {
  detailButtons[i].addEventListener("click", function () {
    var box = document.getElementById(this.getAttribute("data-target"));
    box.classList.toggle("show");

    if (box.classList.contains("show")) {
      this.textContent = "Hide Details";
    } else {
      this.textContent = "Project Details";
    }
  });
}


// ---------- 4. Academic planner (planner page) ----------
var taskForm = document.getElementById("task-form");

if (taskForm) {
  var taskTitle = document.getElementById("task-title");
  var taskDate = document.getElementById("task-date");
  var taskError = document.getElementById("task-error");
  var taskList = document.getElementById("task-list");

  // the array that holds all tasks
  var tasks = [];

  // load saved tasks (so they stay after refreshing the page)
  var saved = localStorage.getItem("kemiTasks");
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    // two starter tasks so the planner is not empty the first time
    tasks = [
      { id: 1, title: "Complete COS 106 term project", date: "", done: false },
      { id: 2, title: "Submit hosted link and GitHub link", date: "", done: false }
    ];
  }

  function saveTasks() {
    localStorage.setItem("kemiTasks", JSON.stringify(tasks));
  }

  // draws the whole list on the page
  function showTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      taskList.innerHTML = '<li class="empty-message">No tasks yet. Add your first task above.</li>';
    }

    for (var i = 0; i < tasks.length; i++) {
      var task = tasks[i];

      var li = document.createElement("li");
      li.className = "task";
      if (task.done) {
        li.className = "task done";
      }

      var dateText = "No due date";
      if (task.date !== "") {
        dateText = "Due: " + task.date;
      }

      li.innerHTML =
        '<input type="checkbox" onchange="toggleTask(' + task.id + ')"' + (task.done ? " checked" : "") + ">" +
        '<div class="task-text"><strong></strong><small>' + dateText + "</small></div>" +
        '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Delete</button>';

      // textContent is used so that typed text can never break the page
      li.querySelector("strong").textContent = task.title;

      taskList.appendChild(li);
    }

    updateCounts();
  }

  // updates the Total / Pending / Completed boxes
  function updateCounts() {
    var done = 0;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].done) {
        done++;
      }
    }
    document.getElementById("count-total").textContent = tasks.length;
    document.getElementById("count-done").textContent = done;
    document.getElementById("count-pending").textContent = tasks.length - done;
  }

  // add a new task
  function addTask(event) {
    event.preventDefault();

    var title = taskTitle.value.trim();
    if (title === "") {
      taskError.textContent = "Please type a task before adding it.";
      return;
    }
    taskError.textContent = "";

    var newTask = {
      id: Date.now(),
      title: title,
      date: taskDate.value,
      done: false
    };

    tasks.push(newTask);
    saveTasks();
    showTasks();

    taskTitle.value = "";
    taskDate.value = "";
  }

  // mark a task as completed (or not completed)
  function toggleTask(id) {
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].done = !tasks[i].done;
      }
    }
    saveTasks();
    showTasks();
  }

  // delete a task
  function deleteTask(id) {
    var remaining = [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id !== id) {
        remaining.push(tasks[i]);
      }
    }
    tasks = remaining;
    saveTasks();
    showTasks();
  }

  taskForm.addEventListener("submit", addTask);
  showTasks();
}


// ---------- 5. Contact form validation (contact page) ----------
var contactForm = document.getElementById("contact-form");

if (contactForm) {

  // shows an error under a field
  function showError(fieldId, text) {
    document.getElementById(fieldId + "-error").textContent = text;
    document.getElementById(fieldId).classList.add("invalid");
  }

  // clears the error of a field
  function clearError(fieldId) {
    document.getElementById(fieldId + "-error").textContent = "";
    document.getElementById(fieldId).classList.remove("invalid");
  }

  // returns true if the email looks like name@site.com
  function isValidEmail(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  // returns true if the phone has digits only
  function isOnlyDigits(phone) {
    var pattern = /^[0-9]+$/;
    return pattern.test(phone);
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var message = document.getElementById("message").value.trim();
    var success = document.getElementById("success-message");
    var formIsValid = true;

    success.style.display = "none";

    // name
    if (name === "") {
      showError("name", "Please enter your name.");
      formIsValid = false;
    } else {
      clearError("name");
    }

    // email
    if (email === "") {
      showError("email", "Please enter your email address.");
      formIsValid = false;
    } else if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email, e.g. name@example.com.");
      formIsValid = false;
    } else {
      clearError("email");
    }

    // phone
    if (phone === "") {
      showError("phone", "Please enter your phone number.");
      formIsValid = false;
    } else if (!isOnlyDigits(phone)) {
      showError("phone", "Phone number must contain digits only (0-9).");
      formIsValid = false;
    } else {
      clearError("phone");
    }

    // message
    if (message === "") {
      showError("message", "Please type your message.");
      formIsValid = false;
    } else {
      clearError("message");
    }

    // everything is fine
    if (formIsValid) {
      success.textContent = "Thank you, " + name + "! Your message has been sent. I will reply soon.";
      success.style.display = "block";
      contactForm.reset();
    }
  });
}
