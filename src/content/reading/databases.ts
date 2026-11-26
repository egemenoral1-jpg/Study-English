import type { Article } from "./types";

const article: Article = {
  id: "databases",
  title: "Databases: Where Applications Keep Their Data",
  level: "B1-",
  topic: "Veritabanları",
  summaryTr: "Tablolar, SQL, indeksler ve ilişkisel / NoSQL veritabanları arasındaki fark.",
  paragraphs: [
    "Almost every application you use needs to remember something. An online shop remembers products and orders, a social network remembers users and posts, and a banking app remembers every payment. All this information is stored in a database.",
    "The most common type is the relational database. Popular examples are PostgreSQL, MySQL and SQLite. In a relational database, data is organized in tables, which look a lot like spreadsheets. Each row is one record, for example one customer, and each column is one piece of information, such as the name or the email address. Every row usually has a unique ID, so the system can find it quickly.",
    "Tables can be connected to each other. Imagine a table of customers and a table of orders. Instead of writing the customer's name again in every order, the order only stores the customer's ID. This relationship saves space and prevents mistakes, because if a customer changes their email, you update it in only one place.",
    "To read or change data, developers use a language called SQL. For example, the query SELECT name FROM customers WHERE city = 'Ankara' returns the names of all customers who live in Ankara. SQL is quite readable, even for beginners, because it is similar to normal English sentences.",
    "When a table has millions of rows, searching can become slow. To solve this problem, databases use indexes. An index works like the index at the back of a book: instead of reading every page, you go directly to the right place.",
    "Not all databases are relational. NoSQL databases, such as MongoDB or Redis, store data in more flexible formats like documents or key-value pairs. They can be faster and easier to scale for some tasks, but relational databases are still the standard choice for most business applications, because they keep data consistent and reliable.",
  ],
  glossary: [
    { word: "relational", tr: "ilişkisel", pos: "adjective" },
    { word: "organized", tr: "düzenlenmiş", pos: "verb" },
    { word: "spreadsheets", tr: "hesap tabloları (Excel gibi)", pos: "noun" },
    { word: "record", tr: "kayıt", pos: "noun" },
    { word: "unique", tr: "benzersiz", pos: "adjective" },
    { word: "relationship", tr: "ilişki", pos: "noun" },
    { word: "prevents", tr: "önler", pos: "verb" },
    { word: "query", tr: "sorgu", pos: "noun" },
    { word: "returns", tr: "döndürür", pos: "verb" },
    { word: "readable", tr: "okunabilir", pos: "adjective" },
    { word: "indexes", tr: "indeksler, dizinler", pos: "noun" },
    { word: "directly", tr: "doğrudan", pos: "adverb" },
    { word: "flexible", tr: "esnek", pos: "adjective" },
    { word: "scale", tr: "ölçeklemek", pos: "verb" },
    { word: "consistent", tr: "tutarlı", pos: "adjective" },
    { word: "reliable", tr: "güvenilir", pos: "adjective" },
  ],
  questions: [
    {
      id: "q1",
      question: "How is data organized in a relational database?",
      sample: "Data is organized in tables. Each row is one record, each column is one piece of information, and every row usually has a unique ID.",
      keywords: ["tables", "row", "record", "column", "unique ID"],
    },
    {
      id: "q2",
      question: "Why does the orders table store only the customer's ID?",
      sample: "Because it saves space and prevents mistakes. If the customer's information changes, you only update it in one place.",
      keywords: ["saves space", "prevents", "mistakes", "update", "one place"],
    },
    {
      id: "q3",
      question: "What is SQL used for?",
      sample: "SQL is a language that developers use to read or change data in a database. You write a query, and the database returns the result.",
      keywords: ["language", "read", "change", "data", "query"],
    },
    {
      id: "q4",
      question: "How does an index make searching faster?",
      sample: "It works like the index of a book. The database goes directly to the right place instead of reading every row.",
      keywords: ["book", "directly", "right place", "instead", "every row"],
    },
    {
      id: "q5",
      question: "What is the difference between relational and NoSQL databases?",
      sample: "Relational databases use tables and keep data consistent, whereas NoSQL databases use more flexible formats like documents and can be easier to scale.",
      keywords: ["tables", "flexible", "documents", "scale", "consistent"],
    },
  ],
};

export default article;
