import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useRouteLoaderData } from "react-router-dom";

export default function SelectedProject({ project }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const token = useRouteLoaderData("root");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch(
          `http://localhost:3000/fetch-chat/${project._id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("There was an error while fetching task");
        }
        const resData = await response.json();
        setMessages(resData.chats);
      } catch (err) {
        console.log(err);
      }
    }
    fetchChats();
  }, [project._id]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setMessages([{ user: inputValue }, ...messages]);
      setInputValue("");
      const chatHistory = messages
        .map((message) => `${message.user}\n${message.ai}`)
        .join(" ");

      const response = await fetch(
        `http://localhost:3000/chatting/${project._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            question: inputValue,
            chat_history: chatHistory,
          }),
        }
      );

      const responseData = await response.json();

      setMessages((prevMessages) => [
        {
          user: inputValue,
          ai: responseData.ai,
        },
        ...prevMessages.slice(1),
      ]);
    }
  };

  return (
    <div className="flex w-screen h-screen ">
      <div className="flex-1 flex flex-col ">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse mt-20">
          <div ref={messagesEndRef} />

          {messages.map((message, index) => (
            <div key={index}>
              <div className="flex justify-end mb-8 ml-36">
                <div className="bg-stone-900 text-white px-4 py-2 rounded-lg whitespace-pre-wrap">
                  {message.user}
                </div>
              </div>
              <div className="flex justify-start mb-8 mr-36">
                <div className="bg-stone-300 text-black px-4 py-2 rounded-lg whitespace-pre-wrap">
                  <ReactMarkdown>{message.ai}</ReactMarkdown>
                  {/* {message.sourceDocuments && (
                    <p className="font-bold mt-16">
                      Source : {message.sourceDocuments}
                    </p>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleMessageSubmit}
          className="flex justify-between p-4 rounded-lg bg-stone-200"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="min-h-10 max-h-24 flex-1 mr-2 px-4 py-2 rounded-lg focus:outline-none"
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleMessageSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
