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

const Home = () => {
  const db = getDatabase();
  const [input, setInput] = useState("");
  const [task, setTask] = useState([]);
  const [isInputValid, setIsInputValid] = useState(true);
  const [taskdone, setTaskDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setInput(e.target.value);
    setIsInputValid(true);
  };

  const handleAddBtn = () => {
    if (input) {
      set(push(ref(db, "todolist/")), {
        name: input,
        done: taskdone,
      })
        .then(() => {
          toast.success("Task Added Successfully!");
          setInput("");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("The Task Is Blank ");
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

  function FetchData() {
    const todolist = ref(db, "todolist/");
    onValue(todolist, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key, status: item.done });
      });
      setTask(arr);
    });
    setLoading(false);
  }

  //Raed Data
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
            className={`
              ${
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

        <div className="mt-5 mx-auto w-90">
          <h2 className="text-left text-lg font-medium">
            {/* {task.map((i)=>{(i<0)?"Tak":"No task"})} */}
          </h2>
          {loading ? (
            
<div role="status" class="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
    <div class="flex items-center justify-between">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
        <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
    </div>
    <span class="sr-only">Loading...</span>
</div>
``
          ) : (
            <div className="text-left mt-2 ">
              <ul>
                {task.map((item, i, id) => (
                  <li
                    className={`${
                      taskdone && "line-through"
                    } hover:border hover:border-black border border-b-black border-transparent py-2 px-3 rounded-lg flex items-center justify-between my-3`}
                    onClick={() => {
                      handleLiClick(item.id);
                    }}
                    key={item.id}
                  >
                    <p className={`${item.done ? "line-through" : ""}`}>{`${
                      i + 1
                    } .  ${item.name} `}</p>
                    <div className="flex gap-6 items-center">
                      <button
                        className="hover:text-2xl"
                        onClick={() => {
                          handleEditTask(item.id);
                        }}
                      >
                        <CiEdit />
                      </button>
                      <button
                        className="hover:text-2xl"
                        onClick={() => {
                          handleDeleteTask(item.id);
                        }}
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
