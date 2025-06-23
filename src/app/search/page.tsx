'use client'

import React, { useEffect, useState } from 'react'
import { useSearchQuery } from '@/state/api'
import { debounce } from 'lodash'
 
import Header from '@/components/Header'
import TaskCard from '@/components/TaskCard'  
import ProjectCard from '@/components/ProjectCard'
import UserCard from '@/components/UserCard'

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3, // 쿼리가 3자 미만이면 실행하지 않음
  });


  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500
  );


  // console.log(searchResults);


  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);



  
  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 rounded border p-3 shadow"
          onChange={handleSearch}
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred while fetching search results.</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <h2>Tasks</h2>
            )}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}


            {searchResults.project && searchResults.project?.length > 0 && (
              <h2>Projects</h2>
            )}
            {searchResults.project?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}


            {searchResults.users && searchResults.users?.length > 0 && (
              <h2>Users</h2>
            )}
            {searchResults.users?.map((user) => (
              <UserCard
               key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div> 
  )
}

export default Search
