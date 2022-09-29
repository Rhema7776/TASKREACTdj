import { useEffect, useState } from "react";
import "./App.css";
import { getCookie, buildList } from "./scrape.js";

function TaskList(props) {
  return (
    <div class="list-wrapper">
      {props.tasks.map((task, i) => {
        return (
          <div key={i} className="task-wrapper flexwrapper">
            <div style={{ flex: 7 }}>
              <span>{task.title}</span>
            </div>

            <div style={{ flex: 1 }}>
              <button class="btn btn-sm btn-outline-info edit">Edit</button>
            </div>
            <div style={{ flex: 1 }}>
              <button class="btn btn-sm btn-outline-dark delete">Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  const [activeItem, setActiveItem] = useState(null);
  const [csrftoken] = useState(getCookie("csrftoken"));

  const getData = () => {
    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((res) => res.json())
      .then((data) => {
        // console.log("Data:", data);
        setTasks(data);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form Submitted");
    var url = "http://127.0.0.1:8000/api/task-create/";
    if (activeItem != null) {
      var url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`;
    }
    var title = document.getElementById("title").value;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ title: title }),
    }).then(function (response) {
      // buildList();
      response.json().then((data) => setTasks([...tasks, data]));
      document.getElementById("form").reset();
    });
  }

  return (
    <div>
      <div id="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={handleSubmit}>
              <div class="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    id="title"
                    class="form-control"
                    type="text"
                    name="title"
                    placeholder="Add task"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input id="submit" class="btn" type="submit" />
                </div>
              </div>
            </form>
          </div>

          {
            /* <div class="list-wrapper">
              {tasks.map((task, i)=>{
              return <div key={i} className="task-wrapper flexwrapper">
                
                <div style={{flex:7}}>
                  <span>{task.title}</span>
                </div>
                
                <div style={{flex:1}}>
                  <button class="btn btn-sm btn-outline-info edit">Edit</button>
                </div>
                <div style={{flex:1}}>
                  <button class="btn btn-sm btn-outline-dark delete">Delete</button>
                </div>
               </div>
              })}
          </div> */
            <TaskList tasks={tasks} />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
