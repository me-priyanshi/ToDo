let body = document.querySelector("body");
let modebtn = document.getElementById("mode");
let storedtasks = localStorage.getItem("task-list");
let alltasks = storedtasks ? JSON.parse(storedtasks) : [];

// ---------- LOAD TASKS FROM LOCAL STORAGE ---------- \\
if (storedtasks) {
  showTask(null, null, "storage");
}

// ---------- MODE CHANGE HANDLING ---------- \\
modebtn.addEventListener("click", () => {
  if (body.getAttribute("data-bs-theme") === "dark") {
    body.setAttribute("data-bs-theme", "light");
    modebtn.innerHTML = "<i class='bi bi-sun-fill'></i>";
  } else {
    body.setAttribute("data-bs-theme", "dark");
    modebtn.innerHTML = "<i class='bi bi-moon-fill'></i>";
  }
});

// ---------- ADD BTN HANDLING ---------- \\
let addbtn = document.getElementById("add");
addbtn.addEventListener("click", () => {
  let taskip = document.getElementById("task").value;
  let mode = body.getAttribute("data-bs-theme");
  if (taskip === "") {
    Swal.fire({
      theme: mode,
      title: "No task",
      text: "Please enter a task!",
      icon: "warning",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    createTask(taskip);
    // console.log(taskip);
    document.getElementById("task").value = "";
  }
});

// ---------- ADD TASK EVEN IF ENTER IS PRESSED ---------- \\
let taskip = document.getElementById("task");
taskip.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addbtn.click();
  }
});

// ---------- ADD TASK IN ARRAY ---------- \\
function createTask(taskip) {
  let taskid = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  let newtask = { id: taskid, value: taskip };
  alltasks.push(newtask);
  localStorage.setItem("task-list", JSON.stringify(alltasks));
  showTask(taskid, taskip);
}

// ---------- DISPLAYING TASK IN PAGE ---------- \\
function showTask(taskid, taskip, src = "user") {
  if (src === "user") {
    soloTaskMaker(taskid, taskip);
    return;
  } else {
    for (let i = 0; i < alltasks.length; i++) {
      soloTaskMaker(alltasks[i].id, alltasks[i].value);
    }
  }
}

function soloTaskMaker(taskid, taskip) {
  //alltasks.find((t) => t.value === taskip).id;
  // console.log("Task ID:", taskid);
  let items = document.getElementById("listitems");
  let taskdiv = document.createElement("div");
  taskdiv.className = "container d-flex align-items-center";
  taskdiv.id = `solotask-${taskid}`;
  let taskspan = document.createElement("span");
  taskspan.className = "p-2 m-1 taskvalue";
  taskspan.id = taskid;
  taskspan.contentEditable = "false";
  taskspan.innerText = taskip;
  let editbtn = document.createElement("button");
  editbtn.className = "btn btn-info m-2 p-1";
  editbtn.id = `editbtn-${taskid}`;
  editbtn.innerText = "Edit";
  let str = 1;
  editbtn.onclick = () => editFunc(taskid);
  let delbtn = document.createElement("i");
  delbtn.className = "bi bi-trash h3 mt-2 p-3 delbtn";
  delbtn.style.cursor = "pointer";
  delbtn.id = `delbtn-${taskid}`;
  delbtn.onclick = () => deleteTask(taskid);
  taskdiv.appendChild(taskspan);
  taskdiv.appendChild(editbtn);
  taskdiv.appendChild(delbtn);
  items.appendChild(taskdiv);
}

// ---------- CLEAR ALL TASKS BUTTON HANDLING ---------- \\
function clearAllTasks() {
  let mode = body.getAttribute("data-bs-theme");
  Swal.fire({
    theme: mode,
    title: "Are you sure?",
    text: "This will remove all tasks from your list!",
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    // confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        theme: mode === "dark" ? "dark" : "light",
        title: "All Tasks Cleared!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        backdrop:
          mode === "dark"
            ? `
            url("nyan-cat.gif")
            left top
            no-repeat`
            : `
            rgba(84, 84, 92, 0.4)
            url("nyan-cat.gif")
            left top
            no-repeat
        `,
      });
      localStorage.clear();
      document.getElementById("listitems").innerHTML = "";
      alltasks = [];
    }
  });
}

// ---------- KNOW WHICH TASKS'S EDIT BTN CLICKED ---------- \\
// function isEditable(taskid) {
//     editFunc();
// //   var allTaskDivs = document
// //     .getElementById("listitems")
// //     .querySelectorAll(".solotask");
// //   for (let i = 0; i < allTaskDivs.length; i++) {
// //     let tempId = allTaskDivs[i].querySelector("span").id;
// //     if (tempId == taskid) {
// //       editFunc(allTaskDivs[i]);
// //       break;
// //     }
// //   }
// }

function deleteTask(taskid) {
  let task = document.getElementById(`solotask-${taskid}`);
  task.remove();
  alltasks = alltasks.filter((t) => t.id != taskid);
  localStorage.setItem("task-list", JSON.stringify(alltasks));
}

// ---------- ACTUAL EDIT FUNCTIONALITY & UPDATING LOCALSTORAGE---------- \\
function editFunc(taskid) {
  let taskDiv = document.getElementById(`solotask-${taskid}`);
  let content = taskDiv.querySelector("span");
  let button = taskDiv.querySelector("button");

  if (button.innerText === "Edit") {
    button.innerText = "Save";
    content.setAttribute("contenteditable", "true");
    content.focus();

    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(content);
    range.collapse(false); // false = collapse to end
    selection.removeAllRanges();
    selection.addRange(range);
    
  } else {
    button.innerText = "Edit";
    content.setAttribute("contenteditable", "false");
    // Update the task in alltasks array and localStorage
    let updatedValue = content.innerText;
    let taskIndex = alltasks.findIndex((t) => t.id == content.id);
    if (taskIndex !== -1) {
      alltasks[taskIndex].value = updatedValue;
      localStorage.setItem("task-list", JSON.stringify(alltasks));
    }
  }
}

// function myFunc(str){
//         alert(str);
// }
