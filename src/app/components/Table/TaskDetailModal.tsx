"use client";
import {
  X,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CircleCheck,
} from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

const TaskDetailModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updates, setUpdates] = useState<
    { text: string; time: string; likes: number; replies: string[] }[]
  >([]);
  const [showReplyBox, setShowReplyBox] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  // Text formatting handlers
  const handleFormat = (
    command: string,
    value: string | undefined = undefined
  ) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleLink = () => {
    if (!showLinkInput) {
      setShowLinkInput(true);
    } else if (linkUrl) {
      handleFormat("createLink", linkUrl);
      setShowLinkInput(false);
      setLinkUrl("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const currentNode = range.startContainer.parentElement;
        const checklistItem = currentNode?.closest(".checklist-item");

        if (checklistItem) {
          e.preventDefault();
          const newChecklistItem = createChecklistItem();
          checklistItem.after(newChecklistItem);

          // Move cursor to new item
          const newSpan = newChecklistItem.querySelector("span");
          if (newSpan) {
            const newRange = document.createRange();
            newRange.selectNodeContents(newSpan);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      }
    }
  };

  const createChecklistItem = (text = "New item") => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className =
      "custom-checkbox mr-2 h-4 w-4 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200";
    checkbox.onclick = (e) => {
      const target = e.target as HTMLInputElement;
      const span = target.nextSibling as HTMLSpanElement;
      if (span) {
        span.style.textDecoration = target.checked ? "line-through" : "none";
        span.style.color = target.checked ? "#9CA3AF" : "inherit";
      }
    };

    const span = document.createElement("span");
    span.textContent = text;
    span.className = "transition-all duration-200";

    const div = document.createElement("div");
    div.className =
      "checklist-item flex items-center my-1 group hover:bg-gray-50 p-1 rounded";
    div.appendChild(checkbox);
    div.appendChild(span);
    return div;
  };

  const handleChecklistItem = () => {
    const selection = window.getSelection();
    if (selection && editorRef.current) {
      const checklistItem = createChecklistItem(
        selection.toString() || "New item"
      );
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(checklistItem);

      // Move cursor after inserted item
      const newRange = document.createRange();
      newRange.setStartAfter(checklistItem);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  };

  const handleUpdateSubmit = () => {
    if (editorRef.current?.innerHTML) {
      const newUpdate = {
        text: editorRef.current.innerHTML,
        time: new Date().toLocaleTimeString(),
        likes: 0,
        replies: [],
      };
      setUpdates([...updates, newUpdate]);
      editorRef.current.innerHTML = "";
      setIsEditing(false);
    }
  };

  // Rest of the handlers remain the same
  const handleLike = (index: number) => {
    const newUpdates = [...updates];
    newUpdates[index].likes += 1;
    setUpdates(newUpdates);
  };

  const handleReply = (index: number) => {
    if (replyText.trim()) {
      const newUpdates = [...updates];
      newUpdates[index].replies.push(replyText);
      setUpdates(newUpdates);
      setReplyText("");
      setShowReplyBox(null);
    }
  };

  return (
    <>
      <style>
        {`
          input.custom-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border: 2px solid #d1d5db;
            border-radius: 9999px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
          }
          
          input.custom-checkbox:checked {
            background-color: #3b82f6;
            border-color: #3b82f6;
          }
          
          input.custom-checkbox:checked::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: translate(-50%, -60%) rotate(45deg);
          }
        `}
      </style>
      <div
        className={`fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center gap-8 p-4 border-b">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold">Task Details</h2>
          </div>

          {/* Modal Content */}
          <div className="flex-1 px-10 py-4 overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-4 border-b mb-4">
              <button className="px-4 py-2 text-blue-500 border-b-2 border-blue-500">
                Updates
              </button>
              <button className="px-4 py-2 text-gray-500">Files</button>
              <button className="px-4 py-2 text-gray-500">Activity Log</button>
            </div>
            {/* Conditional rendering based on editing state */}
            {!isEditing ? (
              <div
                className="border rounded-lg p-4 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <p className="text-gray-500">
                  Write an update and mention others with @
                </p>
                <div className="flex gap-2 mt-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    @ Mention
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">GIF</button>
                  <button className="p-2 hover:bg-gray-100 rounded">😊</button>
                </div>
              </div>
            ) : (
              // Rich Text Editor
              <div className="border rounded-lg p-4">
                <div className="flex flex-wrap gap-2 mb-4 border-b pb-2">
                  {/* Text Formatting */}
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Bold"
                    onClick={() => handleFormat("bold")}
                  >
                    <span className="font-bold">B</span>
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Italic"
                    onClick={() => handleFormat("italic")}
                  >
                    <span className="italic">I</span>
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Underline"
                    onClick={() => handleFormat("underline")}
                  >
                    <span className="underline">U</span>
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Strike"
                    onClick={() => handleFormat("strikeThrough")}
                  >
                    <span className="line-through">S</span>
                  </button>

                  {/* Text Color */}
                  <input
                    type="color"
                    onChange={(e) => handleFormat("foreColor", e.target.value)}
                    className="w-6 h-6 p-0 border-none cursor-pointer"
                    title="Text Color"
                  />

                  {/* Alignment */}
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleFormat("justifyLeft")}
                  >
                    <AlignLeft size={16} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleFormat("justifyCenter")}
                  >
                    <AlignCenter size={16} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleFormat("justifyRight")}
                  >
                    <AlignRight size={16} />
                  </button>

                  {/* List and Link */}
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={handleChecklistItem}
                  >
                    <CircleCheck size={16} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={handleLink}
                  >
                    <LinkIcon size={16} />
                  </button>
                </div>

                {showLinkInput && (
                  <div className="mb-2 flex gap-2">
                    <input
                      type="url"
                      placeholder="Enter URL"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    <button
                      onClick={handleLink}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Add Link
                    </button>
                  </div>
                )}

                <div
                  ref={editorRef}
                  contentEditable
                  onKeyDown={handleKeyDown}
                  className="min-h-[8rem] max-h-[20rem] overflow-y-auto p-2 border rounded focus:outline-none focus:border-blue-500"
                  data-placeholder="Write an update..."
                />

                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleUpdateSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
            {/* Updates/Comments Section */}
            <div className="mt-4 space-y-4">
              {updates.map((update, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Image
                      src="/profileImg.svg"
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">User Name</span>
                        <span className="text-gray-500 text-sm">
                          {update.time}
                        </span>
                      </div>
                      <div
                        className="mt-2"
                        dangerouslySetInnerHTML={{ __html: update.text }}
                      />

                      {/* Like and Reply buttons */}
                      <div className="flex gap-4 mt-2">
                        <button
                          className="text-gray-500 hover:text-blue-500"
                          onClick={() => handleLike(index)}
                        >
                          Like ({update.likes})
                        </button>
                        <button
                          className="text-gray-500 hover:text-blue-500"
                          onClick={() => setShowReplyBox(index)}
                        >
                          Reply
                        </button>
                      </div>

                      {/* Replies */}
                      {update.replies.length > 0 && (
                        <div className="ml-8 mt-2 space-y-2">
                          {update.replies.map((reply, replyIndex) => (
                            <div
                              key={replyIndex}
                              className="bg-gray-50 p-2 rounded"
                            >
                              <p>{reply}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Box */}
                      {showReplyBox === index && (
                        <div className="mt-2">
                          <textarea
                            placeholder="Write a reply..."
                            className="w-full p-2 border rounded resize-none"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleReply(index)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailModal;
