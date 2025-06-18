import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/authContext";
import EmojiPicker from "emoji-picker-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSend, FiPaperclip } from "react-icons/fi";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "👏", "🔥"];

const bubbleVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } },
};

const sendBtnVariants = {
  rest: { scale: 1, boxShadow: "0 2px 8px #a5b4fc33" },
  hover: { scale: 1.08, boxShadow: "0 4px 24px #818cf833" },
  tap: { scale: 0.96 },
};

const ChatRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const socket = useSocket();

  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [forwardModalMsg, setForwardModalMsg] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const scrollRef = useRef();

  useEffect(() => {
    const fetchChat = async () => {
      const token = localStorage.getItem("token");

      try {
        // ✅ 1. Get Group Details
        const groupRes = await axios.get(
          `http://localhost:3000/api/group/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (groupRes.data.success) {
          setGroup(groupRes.data.group);
        }
      } catch (err) {
        if (err.response?.status === 403) {
          alert("❌ You are not a member of this group.");
          return; // Don't proceed further
        }
        console.error("Group fetch failed:", err);
        return;
      }

      try {
        // ✅ 2. Get Group Messages
        const msgRes = await axios.get(
          `http://localhost:3000/api/messages/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (msgRes.data.success) {
          const msgsWithReactions = msgRes.data.messages.map((msg) => ({
            ...msg,
            reactions: msg.reactions || [],
          }));
          setMessages(msgsWithReactions);
        }
      } catch (err) {
        console.error("Message fetch failed:", err);
      }

      try {
        // ✅ 3. Get all groups (for forwarding)
        const groupsRes = await axios.get(
          "http://localhost:3000/api/group/my-groups",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (groupsRes.data.success) {
          setGroups(groupsRes.data.groups);
        }
      } catch (err) {
        console.error("Group list fetch failed", err);
      }

      try {
        // ✅ 4. If Admin, Fetch all employees for Add Member modal
        if (user?.role === "admin") {
          const empRes = await axios.get("http://localhost:3000/api/employee", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (empRes.data.employees) {
            setAllEmployees(empRes.data.employees);
          }
        }
      } catch (err) {
        console.error("Employee fetch failed", err);
      }
    };

    fetchChat();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join-group", id);
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("receive-reaction", ({ messageId, emoji, userId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg._id === messageId) {
            // Avoid duplicate reactions
            const alreadyReacted = msg.reactions?.some(
              (r) => r.user === userId && r.emoji === emoji
            );
            if (alreadyReacted) return msg;

            return {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, user: userId }],
            };
          }
          return msg;
        })
      );
    });

    return () => {
      socket.emit("leave-group", id);
      socket.off("receive-message");
      socket.off("receive-reaction");
    };
  }, [socket, id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getFileURL = (filePath) => {
    if (!filePath) return "https://via.placeholder.com/100";
    const cleanedPath = filePath
      .replace(/^public[\\/]/, "")
      .replace(/\\/g, "/");
    return `http://localhost:3000/${cleanedPath}`;
  };

  const handleSend = async () => {
    if (!message.trim() && !file) return;

    try {
      const formData = new FormData();
      formData.append("groupId", id);
      formData.append("message", message);
      if (file) formData.append("file", file);

      const res = await axios.post(
        "http://localhost:3000/api/messages",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        socket.emit("send-message", res.data.message);
        setMessages((prev) => [...prev, res.data.message]);
      }

      setMessage("");
      setFile(null);
    } catch (err) {
      console.error("Send error", err);
    }
  };

  const handleEdit = (msg) => {
    setEditingMsgId(msg._id);
    setEditedText(msg.message);
  };

  const saveEditedMessage = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/messages/${editingMsgId}`,
        { message: editedText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === editingMsgId ? { ...msg, message: editedText } : msg
          )
        );
        setEditingMsgId(null);
        setEditedText("");
      }
    } catch (err) {
      console.error("Edit error", err);
    }
  };

  const handleAddMembers = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/group/${group._id}/add-members`,
        { members: selectedMembers },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setGroup(res.data.group); // update group with new members
        setShowAddMemberModal(false);
        setSelectedMembers([]);
      }
    } catch (err) {
      console.error("Failed to add members", err);
    }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/messages/${msgId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleForward = async (targetGroupId, msg) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/messages/forward",
        {
          messageId: msg._id,
          toGroupId: targetGroupId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        socket.emit("send-message", res.data.message);
        setForwardModalMsg(null);
      }
    } catch (err) {
      console.error("Forward error", err);
    }
  };

  const handleReaction = async (msgId, emoji) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `http://localhost:3000/api/messages/react/${msgId}`,
        { emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === msgId ? res.data.message : msg))
        );
        setShowReactionPicker(null);
      }
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-blue-100">
      {/* Header */}
      <div className="bg-white flex items-center justify-between px-4 py-2 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={
              group?.group_dp
                ? getFileURL(group.group_dp)
                : "https://via.placeholder.com/100"
            }
            className="w-10 h-10 rounded-full object-cover"
            alt="group"
          />
          <h2 className="text-lg font-semibold">{group?.group_name}</h2>
        </div>
        <div className="relative">
          <BsThreeDotsVertical
            className="text-xl cursor-pointer"
            onClick={() => setShowMembers(!showMembers)}
          />
          {showMembers && (
            <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded z-50 p-3 space-y-2">
              <h4 className="font-semibold text-sm mb-1">Group Members</h4>
              <ul className="text-sm text-gray-800 space-y-1 max-h-40 overflow-y-auto">
                {group?.members?.map((m) => (
                  <li key={m._id}>👤 {m.name}</li>
                ))}
              </ul>

              {group?.createdBy && (
                <p className="text-xs text-gray-600 mt-2">
                  Created by: <strong>{group.createdBy.name}</strong>
                </p>
              )}

              {user?.role === "admin" && (
                <button
                  className="w-full mt-2 bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700"
                  onClick={() => setShowAddMemberModal(true)}
                >
                  ➕ Add Members
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => {
          const isOwn = msg.sender._id === user._id;
          const canEdit = isOwn || user.role === "admin";

          return (
            <div
              key={msg._id}
              className={`mb-3 flex ${
                isOwn ? "justify-end" : "justify-start"
              } relative`}
              onClick={() =>
                setActiveMessageId(msg._id === activeMessageId ? null : msg._id)
              }
            >
              <div className="max-w-xs bg-white rounded-xl p-3 shadow relative">
                {/* Sender Name (only for non-own messages) */}
                {!isOwn && (
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    {msg.sender?.name || "Unknown"}
                  </p>
                )}

                {/* Message content (edit or normal view) */}
                {editingMsgId === msg._id ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="border px-2 py-1 rounded text-sm"
                    />
                    <div className="flex gap-2 text-xs text-right">
                      <button
                        onClick={saveEditedMessage}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMsgId(null)}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-800 break-words">
                    {msg.message}
                  </div>
                )}

                {/* File Attachments */}
                {msg.file && (
                  <div className="mt-2">
                    {msg.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={getFileURL(msg.file)}
                        alt="attachment"
                        className="rounded max-h-48"
                      />
                    ) : (
                      <a
                        href={getFileURL(msg.file)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        📎 Download file
                      </a>
                    )}
                  </div>
                )}

                {/* Timestamp & Status */}
                <div className="text-xs text-right text-gray-500 mt-1 flex items-center gap-1">
                  {formatTime(msg.createdAt)}
                  {isOwn && (
                    <>
                      {msg.isRead ? (
                        <span className="text-blue-500">✔✔</span>
                      ) : msg.isDelivered ? (
                        <span>✔✔</span>
                      ) : (
                        <span>✔</span>
                      )}
                    </>
                  )}
                </div>
                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="text-xs mt-2 flex flex-wrap gap-1">
                    {msg.reactions.map((r, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 px-1.5 py-0.5 rounded-full"
                      >
                        {r.emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {activeMessageId === msg._id && (
                <div
                  className={`absolute -top-6 ${
                    isOwn ? "right-0" : "left-0"
                  } bg-white rounded-md px-2 py-1 text-xs shadow-md flex gap-2 z-10`}
                >
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleEdit(msg)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowReactionPicker(msg._id)}
                    className="text-pink-600 hover:underline"
                  >
                    😊
                  </button>
                </div>
              )}

              {/* Emoji picker */}
              {showReactionPicker === msg._id && (
                <div
                  className="absolute -top-10 left-0 z-50 bg-white shadow-md rounded-md px-2 py-1 flex gap-1
                  transition-opacity duration-300 ease-in-out opacity-100 scale-100 animate-fadeIn"
                >
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(msg._id, emoji)}
                      className="text-xl hover:scale-110 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div ref={scrollRef}></div>
      </div>

      {/* Forward Modal */}
      {forwardModalMsg && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-80">
            <h3 className="font-semibold text-lg mb-2">Forward to Group</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {groups
                .filter((g) => g._id !== id)
                .map((g) => (
                  <li
                    key={g._id}
                    onClick={() => handleForward(g._id, forwardModalMsg)}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    📤 {g.group_name}
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setForwardModalMsg(null)}
              className="mt-4 text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="px-4 pb-2 relative">
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-32 h-auto rounded"
            />
          ) : (
            <div className="text-sm text-gray-700 bg-gray-200 px-3 py-1 rounded inline-block">
              📎 {file.name}
            </div>
          )}
          <button
            onClick={() => setFile(null)}
            className="absolute top-0 right-4 text-red-500 hover:text-red-700 text-xl"
            title="Remove File"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-t relative">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full pl-10 pr-20 py-2 border rounded-full focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <label
            htmlFor="file"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            <FiPaperclip />
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-50">
              <EmojiPicker
                onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
              />
            </div>
          )}
        </div>
        <button
          onClick={handleSend}
          className="text-white bg-blue-600 rounded-full p-2 hover:bg-blue-700"
        >
          <FiSend className="text-lg" />
        </button>
      </div>

      {/* Add Members Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-96 max-h-[80vh] p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Add Members</h3>

            <div className="space-y-2">
              {allEmployees
                .filter(
                  (emp) => !group.members.some((m) => m._id === emp.userId._id)
                )
                .map((emp) => (
                  <div
                    key={emp.userId._id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`http://localhost:3000/${emp.userId.avatar?.replace(
                          "public/",
                          ""
                        )}`}
                        alt={emp.userId.name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <span>{emp.userId.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      value={emp.userId._id}
                      checked={selectedMembers.includes(emp.userId._id)}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedMembers((prev) =>
                          prev.includes(id)
                            ? prev.filter((x) => x !== id)
                            : [...prev, id]
                        );
                      }}
                    />
                  </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="text-gray-600 hover:underline"
                onClick={() => setShowAddMemberModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                onClick={handleAddMembers}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
