import { Priority, Status, useCreateTaskMutation, useGetProjectsQuery } from "@/state/api";
import { formatISO } from "date-fns";
import React, { useState } from "react";
import Modal from "../Modal";


type Props = {
  isOpen: boolean;
  onClose: () => void;
};


const ModalNewTask = ({ isOpen, onClose }: Props) => {
  const [createTask] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("1");
  const [authorUserId, setAuthorUserId] = useState("2");
  const [assignedUserId, setAssignedUserId] = useState("3");

  const {data : Projects} = useGetProjectsQuery();

  const handleSubmit = async () => {
    if(!title) return;


    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });


    const formattedEndDate = formatISO(new Date(dueDate), {
      representation: "complete",
    }); 

    await createTask({
      title,
      description,
      status,
      priority,
      tags,
      startDate: formattedStartDate,
      dueDate: formattedEndDate,
      projectId: parseInt(projectId), // 프로젝트 ID를 숫자로 변환
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
    });
    onClose();
  };

  console.log(status);

  const isFormValid = () => {
    return title;
  };


  const selectStyles = "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";


  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:ouline-none";


  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="sm-gap-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(Status[e.target.value as keyof typeof Status])}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) => setPriority(Priority[e.target.value as keyof typeof Priority])}
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>  
        </div>
        <input type="text" className={inputStyles}  placeholder="Tags" value={tags} onChange={(e) => setTags(e.target.value)} />


        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input type="date" className={inputStyles} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" className={inputStyles} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid()  ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() }
        >
          {/* {isLoading ? "Creating..." : "Create Project"} */} 
          Create Task
        </button>
      </form>
    </Modal>
  );
};


export default ModalNewTask;




