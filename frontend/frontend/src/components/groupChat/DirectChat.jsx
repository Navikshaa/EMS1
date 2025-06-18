// src/pages/DirectChat.jsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useSocket } from "../../context/SocketContext";
import { FiSend, FiPaperclip, FiEdit, FiTrash } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { format, isSameDay } from "date-fns";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "👏", "🔥"];

const DirectChat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const socket = useSocket();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editMsgId, setEditMsgId] = useState(null);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    const fetchChatData = async () => {
      const token = localStorage.getItem("token");
      const chatRes = await axios.get(
        `http://localhost:3000/api/direct-chats/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (chatRes.data.success) setChat(chatRes.data.chat);

      const msgRes = await axios.get(
        `http://localhost:3000/api/direct-messages/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (msgRes.data.success) setMessages(msgRes.data.messages);
    };

    fetchChatData();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join-chat", id);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ userId }) => {
      if (userId !== user._id) setIsTyping(true);
    });

    socket.on("stopTyping", ({ userId }) => {
      if (userId !== user._id) setIsTyping(false);
    });

    return () => {
      socket.emit("leave-chat", id);
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getFileURL = (filePath) =>
    `http://localhost:3000/${filePath?.replace(/^public[\\/]/, "").replace(/\\/g, "/")}`;

  const handleSend = async () => {
    if (!message.trim() && !file) return;
    socket.emit("stopTyping", { chatId: id, userId: user._id });

    const token = localStorage.getItem("token");

    if (editMsgId) {
      try {
        const res = await axios.put(
          `http://localhost:3000/api/direct-messages/${editMsgId}`,
          { message },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) =>
          prev.map((msg) => (msg._id === editMsgId ? res.data.message : msg))
        );
        setEditMsgId(null);
        setMessage("");
        setSelectedMsgId(null);
      } catch (err) {
        console.error("Edit error:", err);
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("chatId", id);
      formData.append("message", message);
      if (file) formData.append("file", file);

      const res = await axios.post("http://localhost:3000/api/direct-messages", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        socket.emit("send-message", res.data.message);
        setMessages((prev) => [...prev, res.data.message]);
        setMessage("");
        setFile(null);
      }
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { chatId: id, userId: user._id });
  };

  const handleDelete = async (messageId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/direct-messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleReact = async (messageId, emoji) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `http://localhost:3000/api/direct-messages/react/${messageId}`,
        { emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? res.data.message : msg))
      );
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  let lastMessageDate = null;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 py-2 shadow flex flex-col items-start gap-1">
        <div className="flex items-center gap-3">
          <img
            src={chat?.recipient?.profileImage || "https://via.placeholder.com/100"}
            alt="Recipient"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold">{chat?.recipient?.name}</h2>
        </div>
        {isTyping && <div className="text-sm text-gray-500 ml-14">typing...</div>}
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => {
          const isSender = (msg?.sender?._id || msg?.sender) === user._id;
          const isSelected = selectedMsgId === msg._id;
          const messageDate = new Date(msg.createdAt);
          const showDateSeparator = !lastMessageDate || !isSameDay(messageDate, lastMessageDate);
          lastMessageDate = messageDate;

          return (
            <React.Fragment key={msg._id}>
              {showDateSeparator && (
                <div className="text-center text-gray-500 text-sm mb-2">
                  {format(messageDate, "eeee, MMM d")}
                </div>
              )}

              <div className={`mb-8 flex ${isSender ? "justify-end" : "justify-start"} relative group`}>
                

                {/* Message bubble */}
                <div
                  onClick={() => setSelectedMsgId(isSelected ? null : msg._id)}
                  className="relative max-w-xs bg-white rounded-xl p-3 shadow cursor-pointer"
                >
                  <div className="text-sm text-gray-800 break-words">{msg.message}</div>

                  {msg.file && (
                    <div className="mt-2">
                      {msg.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={getFileURL(msg.file)} alt="file" className="rounded max-h-48" />
                      ) : (
                        <a
                          href={getFileURL(msg.file)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          📎 {msg.file.split("/").pop()}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Message status tick */}
                  {isSender && (
                    <div className="absolute bottom-1 right-2 text-xs text-gray-500">
                      {msg.isRead ? (
                        <span className="text-blue-500">✔✔</span>
                      ) : msg.isDelivered ? (
                        <span>✔✔</span>
                      ) : (
                        <span>✔</span>
                      )}
                    </div>
                  )}

                  {/* Action/Reactions on click */}
                  {isSelected && (
                    <div
                      className={`absolute ${
                        isSender ? "left-0 -translate-x-full" : "top-full mt-1"
                      } flex gap-2 items-center z-10`}
                    >
                      {!isSender &&
                        EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReact(msg._id, emoji);
                            }}
                            className="text-xl hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      {isSender && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditMsgId(msg._id);
                              setMessage(msg.message);
                              setShowEmojiPicker(false);
                              setFile(null);
                            }}
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(msg._id);
                            }}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <FiTrash />
                          </button>
                          {EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReact(msg._id, emoji);
                              }}
                              className="text-xl hover:scale-125 transition-transform"
                            >
                              {emoji}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
                {/* Reactions outside top-right */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div
                    className={`absolute -bottom-5 ${
                      isSender ? "right-0" : "left-0"
                    } bg-white rounded-full px-2 py-0.5 text-sm shadow-md flex gap-1`}
                  >
                    {msg.reactions.map((reaction) => (
                      <span key={reaction._id}>{reaction.emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
        <div ref={scrollRef}></div>
      </div>

      {/* File preview */}
      {file && (
        <div className="px-4 pb-2 relative">
          {file.type.startsWith("image/") ? (
            <img src={URL.createObjectURL(file)} alt="preview" className="w-32 h-auto rounded" />
          ) : (
            <div className="text-sm text-gray-700 bg-gray-200 px-3 py-1 rounded inline-block">
              📎 {file.name}
            </div>
          )}
          <button
            onClick={() => setFile(null)}
            className="absolute top-0 right-4 text-red-500 hover:text-red-700 text-xl"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-t relative">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full pl-10 pr-20 py-2 border rounded-full focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
              else handleTyping();
            }}
          />
          <label htmlFor="file" className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
            <FiPaperclip />
          </label>
          <input id="file" type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-50">
              <EmojiPicker onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} />
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
    </div>
  );
};

export default DirectChat;
