"use client";
import Link from "next/link";
import { FaRegCalendarAlt, FaRegBell, FaCog } from "react-icons/fa";
import { CirclePlus } from "lucide-react";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
}

interface ProjectResponse {
  project_id: number;  
  project_name: string;
}

const API_BASE_URL =
  "https://2944-2409-40f2-1038-7409-9951-9ff7-4bc2-4f60.ngrok-free.app";

const Sidebar = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [showInput, setShowInput] = useState(false);

  const getAuthToken = () => {
    const token = localStorage.getItem("auth_token");
    console.log("Retrieved token:", token ? "Token exists" : "No token found");
    return token;
  };

  const fetchProjects = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        console.error("No auth token found");
        return;
      }

      fetch(`${API_BASE_URL}/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log("Response status:", response.status);
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(
                `HTTP error! status: ${response.status}, body: ${text}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Received projects:", data);
          if (Array.isArray(data)) {
            const mappedProjects = data.map((project: ProjectResponse) => ({
              id: project.project_id.toString(),
              name: project.project_name,
            }));
            setProjects(mappedProjects);
          }
        })
        .catch((error) => {
          console.error("Error fetching projects:", error.message);
        });
    } catch (error) {
      console.error("Error in fetchProjects:", error);
    }
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) return;

    const token = getAuthToken();
    if (!token) {
      console.error("No auth token found");
      return;
    }

    fetch(`${API_BASE_URL}/projects/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        project_name: projectName,
      }),
    })
      .then((response) => {
        console.log("Create response status:", response.status);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(
              `HTTP error! status: ${response.status}, body: ${text}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Project created:", data);
        setProjectName(""); // Clear input
        setShowInput(false); // Hide input
        fetchProjects(); // Refresh the projects list
      })
      .catch((error) => {
        console.error("Error creating project:", error.message);
      });
  };

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="w-64 z-50 h-full border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto dark:bg-gray-800">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">Logo</span>
        </div>
      </div>

      {/* Projects Section */}
      <div className="p-4 flex-grow">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-4">
          PROJECTS
        </h2>

        <nav className="space-y-2 dark:text-[#c0c3cd]">
          {/* Dynamic projects from API */}
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
            >
              <CirclePlus className="mr-3" size={18} />
              <span>{project.name}</span>
            </Link>
          ))}
        </nav>

        {showInput ? (
          <div className="mt-2 flex flex-col gap-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateProject();
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateProject}
                className="flex-1 px-2 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowInput(false);
                  setProjectName("");
                }}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center border border-purple-400 dark:border-purple-500 text-foreground hover:bg-secondary px-2 py-1 mt-1 rounded-lg transition-colors"
          >
            <CirclePlus size={16} className="mr-2" />
            <span>Add Item</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-6 flex flex-col space-y-3">
        <button className="w-full flex justify-center border border-purple-400 dark:border-purple-500 items-center text-foreground hover:bg-secondary px-2 py-1 rounded-lg transition-colors">
          <FaRegCalendarAlt size={16} className="mr-2" />
          <span>Add Calendar</span>
        </button>

        <button className="w-full flex justify-center border border-purple-400 dark:border-purple-500 items-center text-foreground hover:bg-secondary px-2 py-1 rounded-lg transition-colors">
          <CirclePlus size={18} className="mr-2" />
          <span>Add Projects</span>
        </button>
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4">
          SETTINGS
        </h2>
        <nav className="space-y-2">
          <Link
            href="/notifications"
            className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
          >
            <FaRegBell className="mr-3" />
            <span>Notification</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
          >
            <FaCog className="mr-3" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
