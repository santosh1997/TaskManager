const taskScheduler = (() => {
  let control,
    serverContainer,
    taskContainer,
    actionContainer,
    addServerBtn,
    removeServerBtn,
    addTaskBtn,
    numberOfTasksInput,
    serversToBeRemovedTxt,
    serversToBeRemoved = 0;

  const addServer = () => {
    let server = DOMUtils.getContainer("ts-server");
    serverContainer.appendChild(server);
    assignTasks();
  };

  const addTasks = (numberOfTasks) => {
    for (let i = 0; i < numberOfTasks; i++) {
      let task = DOMUtils.getContainer("ts-task"),
        taskProgress = DOMUtils.getContainer("ts-task-progress"),
        taskWaiting = DOMUtils.getContainer("ts-task-waiting"),
        taskRemoveBtn = DOMUtils.getActionButton("remove-task");

      taskRemoveBtn.appendChild(DOMUtils.getRemoveIcon());
      task.appendChild(taskProgress);
      task.appendChild(taskWaiting);
      task.appendChild(taskRemoveBtn);
      taskContainer.appendChild(task);
      taskRemoveBtn.addEventListener("click", () => task.remove());
    }
    assignTasks();
  };

  const assignTasks = () => {
    let freeServers = serverContainer.querySelectorAll(
      ".ts-server:not(.ts-has-task)"
    );
    if (freeServers.length > 0) {
      for (let server of freeServers) {
        const unassignedTask = taskContainer.querySelector(".ts-task");
        if (unassignedTask) {
          unassignedTask.remove();
          server.appendChild(unassignedTask);
          server.classList.add("ts-has-task");

          setTimeout(() => {
            server.classList.remove("ts-has-task");
            unassignedTask.remove();
            removeServersToRemove(server);
            assignTasks();
          }, 20000);
        } else break;
      }
    }
  };

  const removeServersToRemove = (server) => {
    if (serversToBeRemoved > 0) {
      server.remove();
      serversToBeRemoved--;
    }
  };

  const initialize = (element) => {
    control = element;
    DOMUtils.setAttributes(control, { class: "ts-container" });
    initializeContainers();
    addServer();
  };

  const initializeContainers = () => {
    serverContainer = DOMUtils.getMainContainer("server");
    taskContainer = DOMUtils.getMainContainer("task");
    actionContainer = DOMUtils.getMainContainer("action");
    initializeServerActionContainer();
    initializeTaskActionContainer();
    attachContainers();
    attachEventListeners();
  };

  const initializeServerActionContainer = () => {
    const serverActionContainer = DOMUtils.getContainer(
      "ts-server-actions ts-actions-contianer"
    );

    serversToBeRemovedTxt = DOMUtils.getContainer("ts-servers-to-remove");
    addServerBtn = DOMUtils.getActionButton("add-server");
    removeServerBtn = DOMUtils.getActionButton("remove-server");
    serverActionContainer.appendChild(addServerBtn);
    serverActionContainer.appendChild(removeServerBtn);
    serverActionContainer.appendChild(serversToBeRemovedTxt);
    actionContainer.appendChild(serverActionContainer);
    updateServersToRemove();
  };

  const updateServersToRemove = () => {
    serversToBeRemovedTxt.innerHTML =
      "Servers to be removed : " + serversToBeRemoved;
  };

  const initializeTaskActionContainer = () => {
    const taskActionContainer = DOMUtils.getContainer(
      "ts-task-actions ts-actions-contianer"
    );
    addTaskBtn = DOMUtils.getActionButton("add-task");
    numberOfTasksInput = document.createElement("input");
    DOMUtils.setAttributes(numberOfTasksInput, {
      class: "ts-tasks-to-add-input",
      type: "number",
    });
    taskActionContainer.appendChild(numberOfTasksInput);
    taskActionContainer.appendChild(addTaskBtn);
    actionContainer.appendChild(taskActionContainer);
  };

  const attachContainers = () => {
    control.appendChild(serverContainer);
    control.appendChild(taskContainer);
    control.appendChild(actionContainer);
  };

  const addTaskBtnClick = () => {
    const numberOfTasks = parseInt(numberOfTasksInput.value);
    if (numberOfTasks && numberOfTasks > 0) addTasks(numberOfTasks);
  };

  const addServerBtnClick = () => {
    let servers = serverContainer.querySelectorAll(".ts-server");
    if (servers.length > 9) alert("Maximum of 10 servers can be added.");
    else addServer();
  };

  const removeServerBtnClick = () => {
    let freeServer = serverContainer.querySelector(
      ".ts-server:not(.ts-has-task)"
    );
    if (freeServer) freeServer.remove();
    else {
      let servers = serverContainer.querySelectorAll(".ts-server");
      if (servers.length > serversToBeRemoved) {
        serversToBeRemoved++;
        updateServersToRemove();
      } else alert("No servers exists.");
    }
  };

  const attachEventListeners = () => {
    addServerBtn.addEventListener("click", addServerBtnClick);
    removeServerBtn.addEventListener("click", removeServerBtnClick);
    addTaskBtn.addEventListener("click", addTaskBtnClick);
  };
  return { initialize: initialize };
})();
