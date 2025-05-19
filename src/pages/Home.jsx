import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router";
import firebaseConfig from "./firebase.config"; // Assuming Firebase is initialized here
import Skeleton from "./Skeleton";
import { TfiFaceSad } from "react-icons/tfi";
import { ImHappy } from "react-icons/im";

const Home = () => {
  const now = new Date();
  const db = getDatabase();
  const [input, setInput] = useState("");
  const [updateInput, setUpdateInput] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [task, setTask] = useState([]);
  const [isInputValid, setIsInputValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const value = e.target.value;
    const formatted = value.charAt(0).toUpperCase() + value.slice(1);
    setInput(formatted);
    setIsInputValid(true);
  };

  const handleUpdateInput = (e) => {
    const value = e.target.value;
    const formatted = value.charAt(0).toUpperCase() + value.slice(1);
    setUpdateInput(formatted);
  };

  const handleAddBtn = () => {
    if (input.trim()) {
      const newTask = {
        name: input,
        done: false,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        date: now.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        }),
      };

      set(push(ref(db, "todolist/")), newTask)
        .then(() => {
          toast.success("Task Added Successfully!");
          setInput("");
        })
        .catch((err) => {
          toast.error("Failed to add task.");
          console.error(err);
        });
    } else {
      toast.error("The Task Is Blank");
      setIsInputValid(false);
    }
  };

  const handleEditTask = (id, name) => {
    setEditTaskId(id);
    setUpdateInput(name);
  };

  const handleDeleteTask = (id) => {
    remove(ref(db, "todolist/" + id))
      .then(() => toast.success("Task deleted"))
      .catch(() => toast.error("Failed to delete task"));
  };

  const handleCheckboxToggle = (id, currentstatus) => {
    const updatetask = task.find((t) => t.id === id);
    if (updatetask) {
      const taskref = ref(db, `todolist/${id}`);
      set(taskref, {
        ...updatetask,
        done: !currentstatus,
      })
        .then(() => {
          toast.success("Task status updated!");
        })
        .catch((error) => {
          toast.error("Failed to update task status.");
          console.error(error);
        });
    }
  };

  const handleUpdateTask = (id) => {
    if (!updateInput.trim()) {
      toast.error("Updated task cannot be empty");
      return;
    }

    update(ref(db, "todolist/" + id), {
      name: updateInput,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      date: now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
    })
      .then(() => {
        toast.success("Task Updated");
        setEditTaskId(null);
        setUpdateInput("");
      })
      .catch((err) => {
        toast.error("Failed to update task");
        console.error(err);
      });
  };

  const FetchData = () => {
    const todolistRef = ref(db, "todolist/");
    onValue(todolistRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key });
      });
      setTask(arr);
      setLoading(false);
    });
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="text-center bg-white rounded-xl p-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Add Your Task</h2>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-6">
          <input
            value={input}
            onChange={handleInput}
            className={`${
              isInputValid ? "border-blue-500" : "border-red-400"
            } border-2 rounded-xl px-6 py-3 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300`}
            placeholder="New Task..."
            type="text"
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            onClick={handleAddBtn}
          >
            ➕ Add Task
          </button>
        </div>

        <div className="mt-8">
          <div className="flex justify-center">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              {task.length === 0 ? (
                <>
                  <TfiFaceSad className="text-lg text-gray-400" /> No Task Found
                </>
              ) : (
                <>
                  <ImHappy className="text-lg text-green-500" /> Tasks Are Here
                </>
              )}
            </h2>
          </div>

          {loading ? (
            <Skeleton />
          ) : (
            <ul className="mt-4 space-y-4">
              {task.map((item, i) => (
                <li
                  key={item.id}
                  className={`flex justify-between items-center border rounded-xl p-4 shadow-sm transition-all hover:shadow-lg 
                    ${
                      item.done
                        ? "bg-gray-100 text-gray-500 line-through"
                        : "bg-white"
                    }`}
                >
                  <div className="flex items-center gap-4 w-full">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleCheckboxToggle(item.id, item.done)}
                      className={`appearance-none w-5 h-5 rounded-full border-4 cursor-pointer transition-all duration-300 ease-in-out ${
                        item.done
                          ? "bg-green-500 border-green-300"
                          : "bg-white border-red-500"
                      } hover:border-yellow-400`}
                    />

                    <div className="w-full">
                      <div className="flex justify-between items-center">
                        {editTaskId === item.id ? (
                          <input
                            value={updateInput}
                            onChange={handleUpdateInput}
                            placeholder="Update task..."
                            type="text"
                            className="rounded-lg border border-gray-300 p-2 w-full"
                          />
                        ) : (
                          <h3 className="text-lg font-medium">
                            {i + 1}. {item.name}
                          </h3>
                        )}
                        <div className="text-sm text-gray-400">
                          <p>{item.time}</p>
                          <p>{item.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {editTaskId === item.id ? (
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        onClick={() => handleUpdateTask(item.id)}
                        className="bg-green-400 text-white px-3 py-2 rounded-xl text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setEditTaskId(null);
                          setUpdateInput("");
                        }}
                        className="bg-red-500 text-white px-3 py-2 rounded-xl text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-xl"
                        onClick={() => handleEditTask(item.id, item.name)}
                      >
                        <CiEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-xl"
                        onClick={() => handleDeleteTask(item.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
