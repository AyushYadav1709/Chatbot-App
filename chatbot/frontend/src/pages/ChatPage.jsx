import { useEffect, useState } from "react";
import ProjectsSidebar from "../components/ProjectSidebar";
import Chat from "../components/Chat";
import SelectedProject from "../components/SelectedProject";
import { useRouteLoaderData } from "react-router-dom";

export default function ChatPage() {
  const [projectState, setProjectState] = useState({
    selectedProjectId: undefined,
    projects: [],
  });

  const token = useRouteLoaderData("root");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/all-chats", {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        });
        if (!response.ok) {
          throw new Error("There was an error while fetching chats.");
        }
        const resData = await response.json();
        const chats = resData.chats;
        setProjectState((prevState) => ({
          ...prevState,
          projects: chats,
        }));
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  function handleStartAddProject() {
    setProjectState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  function handleSelectProject(id) {
    setProjectState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: id,
      };
    });
  }

  function handleNewChat(id, question) {
    setProjectState((prevState) => {
      return {
        selectedProjectId: id,
        projects: [{ _id: id, title: question }, ...prevState.projects],
      };
    });
  }

  const selectedProject = projectState.projects.find(
    (project) => project._id === projectState.selectedProjectId
  );

  let content = <SelectedProject project={selectedProject} />;

  if (projectState.selectedProjectId === undefined) {
    content = <Chat onNewChat={handleNewChat} />;
  }

  return (
    <>
      {token ? (
        <main className="h-screen flex gap-8">
          <ProjectsSidebar
            onStartAddProject={handleStartAddProject}
            projects={projectState.projects}
            onSelectProject={handleSelectProject}
            selectedProjectId={selectedProject && selectedProject._id}
          />
          {content}
        </main>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-stone-500 text-3xl font-bold">
            Please Login to Start Chatting
          </p>
        </div>
      )}
    </>
  );
}
