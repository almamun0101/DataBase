import React, { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import firebaseConfig from "./firebase.config";

const Home = () => {
  const db = getDatabase();
  const [input, setInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [taskdone, setTaskDone] = useState(false);

  const handleInput = (e) => {
    setInput(e.target.value);
    setIsInputValid(true);
  };

  const handleAddBtn = () => {
    if (input) {
      set(ref(db, 'todolist/'),{
        name : input

      })
      .the
      console.log("Data Send")
    } else {
      toast.error("The Task Is Blank ");
      setIsInputValid(false);
    }
  };

  const handleEditTask = () => {
    console.log("click edit")
  };

  const handleDeleteTask = () => {
    console.log("click delete");
  };

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
            There Is Your All Tasks :-
          </h2>
          <div className="text-left mt-2 ">
            <ul>
              <li
                className={`${
                  taskdone && "line-through"
                } hover:border hover:border-black border border-b-black border-transparent py-2 px-3 rounded-lg flex items-center justify-between my-3`}
              >
                <p className={taskdone ? "line-through" : ""}>1. Homework</p>
                <div className="flex gap-6 items-center">
                  <button className="hover:text-2xl" onClick={handleEditTask}>
                    <CiEdit />
                  </button>
                  <button className="hover:text-2xl" onClick={handleDeleteTask}>
                    <MdDelete />
                  </button>
                </div>
              </li>
              <li className="hover:border hover:border-black border border-b-black border-transparent py-2 px-3 rounded-lg flex items-center justify-between my-3">
                1. Home Work
                <div className="flex gap-6 items-center">
                  <button className="hover:text-2xl" onClick={handleDeleteTask}>
                    <CiEdit />
                  </button>
                  <button className="hover:text-2xl" onClick={handleDeleteTask}>
                    <MdDelete />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
