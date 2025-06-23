"use client"
import React, { useState } from 'react'
import ProjectHeader from '../ProjectHeader';
import BoardView from '../BoardView';
import ModalNewTask from '@/components/ModalNewTask';
import ListView from '../ListView';
import TimelineView from '../TimelineView';
import TableView from '../TableView';

type Props = 
{
  params : {id : string};
}

const Project = ({params} : Props) => {
  const [activeTab, setActiveTab] = useState("Board");
  const {id} = params;
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  
  return (
    <div>
      <ModalNewTask isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)}  />

      <ProjectHeader activeTab = {activeTab} setActiveTab = {setActiveTab}/> 
      {activeTab === "Board" && <BoardView id={params.id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />}
      {activeTab === "List" && <ListView id={params.id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />}
      {activeTab === "Timeline" && <TimelineView id={params.id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />}
      {activeTab === "Table" && <TableView id={params.id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />}
    </div>
  )
}

export default Project
