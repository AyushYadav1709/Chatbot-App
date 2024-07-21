const {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} = require("@langchain/google-genai");
const { ConversationalRetrievalQAChain } = require("langchain/chains");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
require("dotenv").config();

const Chat = require("../models/chat");

if (!process.env.GOOGLE_API_KEY) {
  console.error("GOOGLE_API_KEY is not set in the environment variables.");
  process.exit(1);
}

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "embedding-001",
});

async function setupModel() {
  const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName: "france",
  });

  return ConversationalRetrievalQAChain.fromLLM(
    new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "gemini-pro",
      temperature: 0.3,
    }),
    vectorStore.asRetriever(),
    {
      qaChainOptions: {
        type: "stuff",
        prompt: ChatPromptTemplate.fromTemplate(
          `Bonjour! I'm your go-to AI for deep insights into France. With an extensive database on all things French, I'm here to deliver comprehensive responses that dive into the nuances of your inquiries. Let's engage in meaningful conversations where I provide elaborate explanations. Just ask your question, and I'll provide precise answers without any irrelevant information. Ready to explore France together? I give answers in markdown Chat History: {chat_history} Question: {question}`
        ),
      },
      returnSourceDocuments: true,
    }
  );
}

exports.getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.userId }).sort({ _id: -1 });
    const chatList = chats.map((chat) => ({
      _id: chat._id.toString(),
      title: chat.title,
    }));
    res.status(200).json({ chats: chatList });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSpecificChat = async (req, res, next) => {
  const chatId = req.params.chatID;
  try {
    const response = await Chat.findOne({ _id: chatId, userId: req.userId });
    const reversedChats = response.chats.reverse();
    res.status(201).json({
      message: "Chat extracted.",
      chats: reversedChats,
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postNewChatting = async (req, res, next) => {
  const question = req.body.question;
  try {
    const chain = await setupModel();
    let chat_history = req.body.chat_history || "";
    const result = await chain.call({ question, chat_history });
    // chat_history += `${question}\n${result.text} `;

    // const sourceDocuments = result.sourceDocuments.map((doc) => ({
    //   pageContent: doc.pageContent,
    //   metadata: doc.metadata,
    // }));
    const newChat = new Chat({
      userId: req.userId,
      title: question,
      chats: [{ user: question, ai: result.text }],
    });
    const savedChat = await newChat.save();
    res.status(200).json({
      id: savedChat._id,
      ai: result.text,
      // sourceDocuments: sourceDocuments[0]["metadata"]["source"],
      // document: sourceDocuments[0]["pageContent"],
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postExistingChatting = async (req, res, next) => {
  const chatId = req.params.chatID;
  try {
    const response = await Chat.findOne({ _id: chatId, userId: req.userId });
    const chain = await setupModel();
    let chat_history = req.body.chat_history || "";
    const question = req.body.question || "";
    const result = await chain.call({ question, chat_history });
    response.chats.push({ user: question, ai: result.text });
    await response.save();
    res.status(200).json({
      ai: result.text,
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
// exports.postChatting = async (req, res, next) => {
//   try {
//     const chain = await setupModel();

//     let chat_history = req.body.chat_history || "";

//     const question = req.body.question || "";
//     const result = await chain.call({ question, chat_history });
//     chat_history += `${question}\n${result.text} `;

//     const sourceDocuments = result.sourceDocuments.map((doc) => ({
//       pageContent: doc.pageContent,
//       metadata: doc.metadata,
//     }));

//     res.status(200).json({
//       ai: result.text,
//       sourceDocuments: sourceDocuments[0]["metadata"]["source"],
//       document: sourceDocuments[0]["pageContent"],
//     });
//   } catch (err) {
//     console.log(err);
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
