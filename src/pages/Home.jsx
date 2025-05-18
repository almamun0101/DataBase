import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
} from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router";
import firebaseConfig from "./firebase.config";
import Skeleton from "./Skeleton";
import { TfiFaceSad } from "react-icons/tfi";
import { ImHappy } from "react-icons/im";

const Home = () => {
  const now = new Date();
  const db = getDatabase();
  const [input, setInput] = useState("");
  const [task, setTask] = useState([]);
  const [isInputValid, setIsInputValid] = useState(true);
  const [taskdone, setTaskDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const value = e.target.value;
    const formated = value.charAt(0).toUpperCase() + value.slice(1);
    setInput(formated);
    console.log(input);
    setIsInputValid(true);
  };

  const handleAddBtn = () => {
    if (input) {
      set(push(ref(db, "todolist/")), {
        name: input,
        done: taskdone,
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
          toast.success("Task Added Successfully!");
          setInput("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("The Task Is Blank");
      setIsInputValid(false);
    }
  };

  const handleEditTask = (id) => {
    navigate("/edit");
  };

  const handleDeleteTask = (id) => {
    remove(ref(db, "todolist/" + id));
  };

  const handleLiClick = (id) => {
    console.log(id);
  };

  const FetchData = () => {
    const todolist = ref(db, "todolist/");
    onValue(todolist, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key, status: item.done });
      });
      setTask(arr);
    });
    setLoading(false);
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="text-center">
        <Toaster />
        <h2 className="text-xl font-bold mt-5">Add Your Task</h2>

        <div className="flex mx-auto gap-2 items-center mt-5 justify-center">
          <input
            value={input}
            onChange={handleInput}
            className={`${
              isInputValid ? "border-green-500" : "border-red-400"
            } focus:outline-none border-2 rounded-2xl p-2 px-10`}
            placeholder="New Task..."
            type="text"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-2xl transition"
            onClick={handleAddBtn}
          >
            Add
          </button>
        </div>

        <div className="mt-5 mx-auto w-120">
          <h2 className="text-left text-lg font-medium">
            {task.length === 0 ? (
              <div className="flex items-center gap-5">
                <h2>No Task Found</h2>
                <TfiFaceSad />
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <h2>Tasks Are Here :-</h2>
                <ImHappy />
              </div>
            )}
          </h2>

          {loading ? (
            <Skeleton />
          ) : (
            <div className="text-left mt-2">
              <ul>
                {task.map((item, i) => (
                  <li
                    key={item.id}
                    onClick={() => handleLiClick(item.id)}
                    className={`${
                      taskdone && "line-through"
                    } hover:border hover:border-black border border-b-black border-transparent py-2 px-3 rounded-lg flex items-center justify-between my-3`}
                  >
                    <div className="w-2/3">
                      <h2
                        className={`${
                          item.done ? "line-through" : ""
                        }text-lg font-medium`}
                      >
                        {`${i + 1} .  ${item.name}`}
                      </h2>
                      <div className="flex justify-between">
                        <p>{item.time}</p>
                        <p>{item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-center">
                      <button
                        className="hover:text-2xl"
                        onClick={() => handleEditTask(item.id)}
                      >
                        <CiEdit />
                      </button>
                      <button
                        className="hover:text-2xl"
                        onClick={() => handleDeleteTask(item.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
