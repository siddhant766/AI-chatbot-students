/* ==========================================================================
   EDU AI - Premium Interactive Workspace Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const sidebarPlanner = document.getElementById('sidebar-planner');
  const sidebarMath = document.getElementById('sidebar-math');
  const sidebarScience = document.getElementById('sidebar-science');
  const sidebarHistoryItems = [sidebarPlanner, sidebarMath, sidebarScience];

  const navDashboard = document.getElementById('nav-dashboard');
  const navLabs = document.getElementById('nav-labs');
  const navSupport = document.getElementById('nav-support');
  const navTabs = [navDashboard, navLabs, navSupport];

  const helperPane = document.getElementById('helper-pane');
  const chatbotPane = document.getElementById('chatbot-pane');
  const chatbotIframe = document.getElementById('chatbot-iframe');

  const panelStudyPlanner = document.getElementById('panel-study-planner');
  const panelMathHelp = document.getElementById('panel-math-help');
  const panelScienceNotes = document.getElementById('panel-science-notes');
  const helperPanels = [panelStudyPlanner, panelMathHelp, panelScienceNotes];

  const labsView = document.getElementById('labs-view');
  const supportView = document.getElementById('support-view');
  const mainViews = [labsView, supportView]; // dashboard workspace is the default wrapper

  const newChatBtn = document.querySelector('.new-chat');

  // --- View Control Engine ---
  
  function deactivateHistory() {
    sidebarHistoryItems.forEach(item => item.classList.remove('active'));
  }

  function deactivateNav() {
    navTabs.forEach(tab => tab.classList.remove('active'));
  }

  function hideAllViews() {
    mainViews.forEach(view => view.classList.remove('active'));
    chatbotPane.style.display = 'none';
    helperPane.classList.remove('active');
    helperPanels.forEach(panel => panel.classList.remove('active'));
  }

  function showDashboard() {
    hideAllViews();
    deactivateNav();
    navDashboard.classList.add('active');
    chatbotPane.style.display = 'flex';

    // If a helper panel is selected, restore split pane view
    let activeSidebar = null;
    if (sidebarPlanner.classList.contains('active')) activeSidebar = panelStudyPlanner;
    if (sidebarMath.classList.contains('active')) activeSidebar = panelMathHelp;
    if (sidebarScience.classList.contains('active')) activeSidebar = panelScienceNotes;

    if (activeSidebar) {
      helperPane.classList.add('active');
      activeSidebar.classList.add('active');
    }
  }

  // Sidebar History Clicks -> Switch Helper Panel (Split Layout)
  sidebarHistoryItems.forEach((sidebarItem, index) => {
    sidebarItem.addEventListener('click', () => {
      deactivateHistory();
      sidebarItem.classList.add('active');
      
      // Ensure Dashboard Nav is active
      hideAllViews();
      deactivateNav();
      navDashboard.classList.add('active');

      // Open split pane
      chatbotPane.style.display = 'flex';
      helperPane.classList.add('active');
      helperPanels[index].classList.add('active');
      
      // trigger slide-in visual reflow
      window.dispatchEvent(new Event('resize'));
    });
  });

  // Nav Tabs Toggling
  navDashboard.addEventListener('click', () => {
    showDashboard();
  });

  navLabs.addEventListener('click', () => {
    hideAllViews();
    deactivateNav();
    navLabs.classList.add('active');
    labsView.classList.add('active');
  });

  navSupport.addEventListener('click', () => {
    hideAllViews();
    deactivateNav();
    navSupport.classList.add('active');
    supportView.classList.add('active');
  });

  // + New Chat Button -> Refresh IFrame and reset views
  newChatBtn.addEventListener('click', () => {
    // Reload iframe src
    const currentSrc = chatbotIframe.src;
    chatbotIframe.src = '';
    setTimeout(() => {
      chatbotIframe.src = currentSrc;
    }, 100);

    // Reset workspace to full dashboard view (no helpers)
    deactivateHistory();
    showDashboard();

    // Trigger visual cue
    newChatBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      newChatBtn.style.transform = '';
    }, 150);
  });


  // ==========================================================================
  // Module 1: 📝 Study Planner (Checklist & Pomodoro)
  // ==========================================================================

  // --- Pomodoro Timer ---
  let pomodoroInterval = null;
  let pomodoroMinutes = 25;
  let pomodoroSeconds = 0;
  let isTimerRunning = false;

  const minutesDisplay = document.getElementById('timer-minutes');
  const secondsDisplay = document.getElementById('timer-seconds');
  const timerStartBtn = document.getElementById('timer-start');
  const timerPauseBtn = document.getElementById('timer-pause');
  const timerResetBtn = document.getElementById('timer-reset');
  const timerStatusDisplay = document.getElementById('timer-status');

  function updateTimerUI() {
    minutesDisplay.textContent = String(pomodoroMinutes).padStart(2, '0');
    secondsDisplay.textContent = String(pomodoroSeconds).padStart(2, '0');
  }

  function startPomodoro() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerStatusDisplay.textContent = "🔥 Staying Focused...";
    timerStatusDisplay.style.color = "#ff9a3d";

    pomodoroInterval = setInterval(() => {
      if (pomodoroSeconds === 0) {
        if (pomodoroMinutes === 0) {
          // Timer finished
          clearInterval(pomodoroInterval);
          isTimerRunning = false;
          pomodoroMinutes = 25;
          pomodoroSeconds = 0;
          timerStatusDisplay.textContent = "🎉 Session finished! Take a break.";
          timerStatusDisplay.style.color = "#10b981";
          updateTimerUI();
          return;
        }
        pomodoroMinutes--;
        pomodoroSeconds = 59;
      } else {
        pomodoroSeconds--;
      }
      updateTimerUI();
    }, 1000);
  }

  function pausePomodoro() {
    if (!isTimerRunning) return;
    clearInterval(pomodoroInterval);
    isTimerRunning = false;
    timerStatusDisplay.textContent = "⏸️ Focus Paused.";
    timerStatusDisplay.style.color = "#9ca3af";
  }

  function resetPomodoro() {
    clearInterval(pomodoroInterval);
    isTimerRunning = false;
    pomodoroMinutes = 25;
    pomodoroSeconds = 0;
    timerStatusDisplay.textContent = "Ready to study? Let's focus!";
    timerStatusDisplay.style.color = "var(--accent-color)";
    updateTimerUI();
  }

  timerStartBtn.addEventListener('click', startPomodoro);
  timerPauseBtn.addEventListener('click', pausePomodoro);
  timerResetBtn.addEventListener('click', resetPomodoro);

  // --- Tasks Checklist ---
  const taskInput = document.getElementById('new-task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskListContainer = document.getElementById('task-list');

  let tasks = JSON.parse(localStorage.getItem('edu_ai_tasks')) || [
    { text: 'Set study priorities with chatbot', completed: false },
    { text: 'Read through calculus formula cheat sheet', completed: false }
  ];

  function saveTasks() {
    localStorage.setItem('edu_ai_tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskListContainer.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'task-item';

      const label = document.createElement('label');
      label.className = `task-checkbox-label ${task.completed ? 'completed' : ''}`;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTask(index));

      const spanText = document.createElement('span');
      spanText.textContent = task.text;

      label.appendChild(checkbox);
      label.appendChild(spanText);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete-task';
      deleteBtn.innerHTML = '✕';
      deleteBtn.addEventListener('click', () => deleteTask(index));

      li.appendChild(label);
      li.appendChild(deleteBtn);
      taskListContainer.appendChild(li);
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }

  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Initial renders for Module 1
  updateTimerUI();
  renderTasks();


  // ==========================================================================
  // Module 2: 📐 Math Help (Scientific Calculator)
  // ==========================================================================
  
  const calcScreen = document.getElementById('calc-screen');
  const calcButtons = document.querySelectorAll('.calc-btn');
  let calcExpression = '';

  calcButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.textContent;

      if (btn.classList.contains('btn-clear')) {
        calcExpression = '';
        calcScreen.textContent = '0';
      } else if (btn.classList.contains('btn-del')) {
        calcExpression = calcExpression.slice(0, -1);
        calcScreen.textContent = calcExpression || '0';
      } else if (btn.classList.contains('btn-equal')) {
        try {
          // Format basic mathematical operations for evaluation
          let parsedExp = calcExpression
            .replace(/π/g, 'Math.PI')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(');

          // auto close parenthesis if open
          const openParenthesesCount = (parsedExp.match(/\(/g) || []).length;
          const closeParenthesesCount = (parsedExp.match(/\)/g) || []).length;
          if (openParenthesesCount > closeParenthesesCount) {
            parsedExp += ')'.repeat(openParenthesesCount - closeParenthesesCount);
          }

          // Evaluate the formatted expression securely using standard JS
          const result = Function(`"use strict"; return (${parsedExp})`)();
          
          if (isNaN(result) || !isFinite(result)) {
            calcScreen.textContent = 'Error';
          } else {
            // Round decimal results to prevent overflow formatting
            calcScreen.textContent = Number(result.toFixed(6));
            calcExpression = String(calcScreen.textContent);
          }
        } catch (e) {
          calcScreen.textContent = 'Error';
        }
      } else {
        // Handle trig function clicks automatically appending brackets
        let appendVal = action;
        if (action === 'sin' || action === 'cos' || action === 'tan') {
          appendVal = action + '(';
        }

        if (calcScreen.textContent === '0' || calcScreen.textContent === 'Error') {
          calcExpression = appendVal;
        } else {
          calcExpression += appendVal;
        }
        calcScreen.textContent = calcExpression;
      }
    });
  });


  // ==========================================================================
  // Module 3: 🔬 Science Notes Notebook
  // ==========================================================================

  const noteTextarea = document.getElementById('note-textarea');
  const saveNoteBtn = document.getElementById('save-note-btn');
  const clearNoteBtn = document.getElementById('clear-note-btn');
  const noteStatus = document.getElementById('note-status');

  // Load notes
  noteTextarea.value = localStorage.getItem('edu_ai_science_notes') || '';

  // Auto-save on input keystrokes
  let autoSaveTimeout = null;
  noteTextarea.addEventListener('input', () => {
    noteStatus.textContent = "Writing...";
    noteStatus.style.opacity = '1';
    
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      localStorage.setItem('edu_ai_science_notes', noteTextarea.value);
      noteStatus.textContent = "Auto-saved state is up to date.";
    }, 1000);
  });

  saveNoteBtn.addEventListener('click', () => {
    localStorage.setItem('edu_ai_science_notes', noteTextarea.value);
    noteStatus.textContent = "✓ Notes saved manually!";
    noteStatus.style.opacity = '1';
    setTimeout(() => {
      noteStatus.textContent = "Auto-saved state is up to date.";
    }, 2000);
  });

  clearNoteBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear your current note workspace?")) {
      noteTextarea.value = '';
      localStorage.removeItem('edu_ai_science_notes');
      noteStatus.textContent = "Workspace cleared.";
      setTimeout(() => {
        noteStatus.textContent = "Auto-saved state is up to date.";
      }, 2000);
    }
  });


  // ==========================================================================
  // Module 4: 💻 Labs Workspace (Code Sandbox & Element Explorer)
  // ==========================================================================

  // --- Code Sandbox Runner ---
  const codeEditor = document.getElementById('code-editor');
  const compileBtn = document.getElementById('compile-btn');
  const sandboxIframe = document.getElementById('sandbox-iframe');

  function compileSandboxCode() {
    const htmlCode = codeEditor.value;
    const iframeDoc = sandboxIframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlCode);
    iframeDoc.close();
  }

  compileBtn.addEventListener('click', compileSandboxCode);
  // Run initial compile
  compileSandboxCode();

  // --- Chemistry Element Explorer ---
  const elemBoxes = document.querySelectorAll('.elem-box');
  const elemProfileContainer = document.getElementById('elem-profile');

  elemBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const name = box.getAttribute('data-name');
      const symbol = box.getAttribute('data-symbol');
      const number = box.getAttribute('data-no');
      const weight = box.getAttribute('data-weight');
      const category = box.getAttribute('data-category');

      elemProfileContainer.innerHTML = `
        <div class="profile-container">
          <div class="profile-title">
            <span class="profile-symbol">${symbol}</span>
            <span class="profile-element-name">${name}</span>
          </div>
          <div class="profile-detail">
            <span>Atomic Number:</span>
            <strong>${number}</strong>
          </div>
          <div class="profile-detail">
            <span>Standard Atomic Mass:</span>
            <strong>${weight} u</strong>
          </div>
          <div class="profile-detail">
            <span>Chemical Classification:</span>
            <strong>${category}</strong>
          </div>
        </div>
      `;

      // Visual trigger highlight on elements grid
      elemBoxes.forEach(b => b.style.boxShadow = '');
      box.style.boxShadow = `0 0 16px var(--accent-glow)`;
    });
  });


  // ==========================================================================
  // Module 5: 💬 Support Desk (FAQ Accordions & Email Tickets)
  // ==========================================================================

  // --- FAQ Accordions ---
  const faqQuestions = document.querySelectorAll('.faq-question-btn');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all other accordion items
      document.querySelectorAll('.faq-accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // --- Support Form Submission Simulation ---
  const supportForm = document.getElementById('support-form');
  const supportNameInput = document.getElementById('sup-name');
  const supportEmailInput = document.getElementById('sup-email');
  const supportSubjectInput = document.getElementById('sup-subject');
  const supportMessageInput = document.getElementById('sup-message');
  const supportSubmitBtn = document.getElementById('btn-submit-support');
  const supportAlert = document.getElementById('support-success-alert');

  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verify fields
    if (!supportNameInput.value || !supportEmailInput.value || !supportSubjectInput.value || !supportMessageInput.value) {
      return;
    }

    // Trigger submission animation
    supportSubmitBtn.textContent = 'Submitting Ticket...';
    supportSubmitBtn.disabled = true;
    supportSubmitBtn.style.opacity = '0.7';

    setTimeout(() => {
      const ticketId = Math.floor(1000 + Math.random() * 9000);
      supportAlert.className = 'support-alert success';
      supportAlert.innerHTML = `✓ Ticket submitted successfully! Ticket ID: <strong>EDU-${ticketId}</strong>. Our academic team will respond in 24 hours.`;
      
      // Clear inputs
      supportForm.reset();

      // Restore button state
      supportSubmitBtn.textContent = 'Submit Academic Ticket';
      supportSubmitBtn.disabled = false;
      supportSubmitBtn.style.opacity = '';
    }, 1500);
  });

});
