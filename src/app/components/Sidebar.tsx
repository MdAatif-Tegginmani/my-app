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
  success: boolean;
  data: Array<{
    created_at: string;
    project: {
      project_id: number;
      project_name: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
    project_id: number;
    updated_at: string;
    user_id: number;
  }>;
}

const API_BASE_URL =
  "https://b264-2409-40f2-204e-968a-c5bf-78b4-53ee-9fb7.ngrok-free.app";

const Sidebar = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [showInput, setShowInput] = useState(false);

  const getAuthToken = () => {
    // Try to get the token from localStorage
    let token = localStorage.getItem("auth_token");

    // If no token in localStorage, check URL parameters for token
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get("token");

      // If token found in URL, save it
      if (token) {
        localStorage.setItem("auth_token", token);
        // Clean up URL after saving token
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }

    console.log("Retrieved token:", token ? "Token exists" : "No token found");
    return token;
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/auth/login";
  };

  const fetchProjects = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        console.error("No auth token found");
        handleUnauthorized();
        return;
      }

      console.log("Fetching from:", `${API_BASE_URL}/projects`);

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text);
        return;
      }

      let responseData: ProjectResponse;
      try {
        responseData = await response.json();
        console.log("Received projects data:", responseData);
      } catch (parseError) {
        console.error("Error parsing response JSON:", parseError);
        return;
      }

      if (!responseData || typeof responseData !== "object") {
        console.error("Invalid response data format:", responseData);
        return;
      }

      if (responseData.success && Array.isArray(responseData.data)) {
        const mappedProjects = responseData.data
          .filter((item) => item.project && typeof item.project === "object")
          .map((item) => ({
            id: item.project.project_id.toString(),
            name: item.project.project_name,
          }));
        console.log("Mapped projects:", mappedProjects);
        setProjects(mappedProjects);
      } else {
        console.error("Response data is not in expected format:", responseData);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error(
          "Network error - Please check your connection and API endpoint"
        );
      }
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No auth token found");
        handleUnauthorized();
        return;
      }

      console.log("Creating project at:", `${API_BASE_URL}/projects/create`);

      const response = await fetch(`${API_BASE_URL}/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_name: projectName,
        }),
      });

      console.log("Create response status:", response.status);

      if (response.status === 401) {
        handleUnauthorized();
        throw new Error("Unauthorized - Please log in again");
      }

      if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text);
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${text}`
        );
      }

      const responseData = await response.json();
      console.log("Project created - Full response:", responseData);

      // After creating the project, fetch the updated list
      await fetchProjects();

      setProjectName(""); // Clear input
      setShowInput(false); // Hide input
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error(
          "Network error - Please check your connection and API endpoint"
        );
      }
    }
  };

  // Check for token when component mounts
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchProjects();
    }
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
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center text-foreground p-2 rounded-lg "
              >
                {/* <CirclePlus className="mr-3" size={18} /> */}
                <span className="">{project.name}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 p-2">
              No projects available
            </div>
          )}
        </nav>

        {showInput ? (
          <div className="mt-2 flex flex-col gap-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateProject();
                }
              }}
              autoFocus
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
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 "
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center border border-purple-400 dark:border-purple-500 text-foreground hover:bg-secondary px-2 py-1 mt-1 rounded-lg transition-colors w-full justify-center"
          >
            <CirclePlus size={16} className="mr-2" />
            <span>Add Project</span>
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
