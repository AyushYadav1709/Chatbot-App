import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRouteLoaderData } from "react-router-dom";

export default function Chat({ onNewChat }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const token = useRouteLoaderData("root");

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setMessages([{ user: inputValue }, ...messages]);
      setInputValue("");

      const response = await fetch("http://localhost:3000/chatting-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          question: inputValue,
        }),
      });

      const responseData = await response.json();

      setMessages((prevMessages) => [
        {
          user: inputValue,
          ai: responseData.ai,
        },
        ...prevMessages.slice(1),
      ]);
      onNewChat(responseData.id, inputValue);
    }
  };

  return (
    <div className="flex w-screen h-screen ">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse mt-20">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-3xl">Start chatting...</p>
            </div>
          ) : (
            messages.map((message, index) => (
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
            ))
          )}
        </div>

        <form
          onSubmit={handleMessageSubmit}
          className="flex justify-between p-4 rounded-lg bg-stone-200"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleMessageSubmit(e);
              }
            }}
            className="min-h-10 max-h-24 flex-1 mr-2 px-4 py-2 rounded-lg focus:outline-none"
            placeholder="Type your message..."
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
