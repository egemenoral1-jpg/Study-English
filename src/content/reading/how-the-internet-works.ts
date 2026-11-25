import type { Article } from "./types";

const article: Article = {
  id: "how-the-internet-works",
  title: "How Does the Internet Work?",
  level: "A2+",
  topic: "İnternet nasıl çalışır",
  summaryTr: "IP adresi, DNS ve paketlerle bir web sayfasının bilgisayarına nasıl ulaştığı.",
  paragraphs: [
    "Every day you open websites, send messages and watch videos. It feels simple: you type an address and the page appears. But behind this simple action, many computers work together in less than a second.",
    "The internet is a huge network of networks. Your laptop connects to your home router, the router connects to your internet provider, and the provider connects to other networks around the world. Every device on this network has an IP address, for example 142.250.184.14. An IP address is similar to a home address: it tells other computers where to send the data.",
    "People are not good at remembering long numbers, so we use names like google.com instead. When you type a name in your browser, your computer first asks a DNS server for the IP address. DNS works like the contacts app on your phone. You look for a name, and it gives you the number.",
    "Next, your browser sends a request to the server at that address. A server is just a computer that is always on and waits for requests. The request says something like: \"Please send me the home page.\" The server prepares the response, usually an HTML file, and sends it back.",
    "The data does not travel as one big piece. It is divided into small packets. Each packet has the address of the destination, and it can take a different path through the network. When all the packets arrive, your computer puts them together again in the correct order. If a packet is lost, it is sent again.",
    "Finally, the browser reads the HTML, downloads the images and styles, and shows the page on your screen. Today most websites use HTTPS, which means the data is encrypted. So even if someone catches your packets on the way, they cannot read them.",
  ],
  glossary: [
    { word: "huge", tr: "devasa", pos: "adjective" },
    { word: "network", tr: "ağ", pos: "noun" },
    { word: "router", tr: "yönlendirici, modem", pos: "noun" },
    { word: "provider", tr: "sağlayıcı", pos: "noun" },
    { word: "IP address", tr: "IP adresi", pos: "noun" },
    { word: "similar to", tr: "-e benzer", pos: "phrase" },
    { word: "instead", tr: "bunun yerine", pos: "adverb" },
    { word: "request", tr: "istek", pos: "noun" },
    { word: "response", tr: "yanıt", pos: "noun" },
    { word: "divided", tr: "bölünmüş", pos: "verb" },
    { word: "packets", tr: "paketler", pos: "noun" },
    { word: "destination", tr: "varış noktası, hedef", pos: "noun" },
    { word: "path", tr: "yol", pos: "noun" },
    { word: "arrive", tr: "varmak, ulaşmak", pos: "verb" },
    { word: "encrypted", tr: "şifrelenmiş", pos: "adjective" },
  ],
  questions: [
    {
      id: "q1",
      question: "What is an IP address, and why does every device need one?",
      sample: "An IP address is a number that shows where a device is on the network. It is similar to a home address, so other computers know where to send the data.",
      keywords: ["similar", "home address", "where", "send", "data"],
    },
    {
      id: "q2",
      question: "What does a DNS server do?",
      sample: "It finds the IP address of a website name. It works like the contacts app on a phone: you give it a name and it gives you the number.",
      keywords: ["IP address", "name", "contacts", "number", "finds"],
    },
    {
      id: "q3",
      question: "Why is the data divided into packets?",
      sample: "Small packets can take different paths through the network. When they arrive, the computer puts them together again, and a lost packet can be sent again.",
      keywords: ["small", "different paths", "arrive", "together", "lost"],
    },
    {
      id: "q4",
      question: "What happens after the server sends the response?",
      sample: "The browser reads the HTML file, downloads the images and styles, and then shows the page on the screen.",
      keywords: ["browser", "HTML", "downloads", "images", "shows"],
    },
    {
      id: "q5",
      question: "Why is HTTPS important?",
      sample: "Because the data is encrypted. If someone catches the packets, they cannot read them.",
      keywords: ["encrypted", "catches", "cannot read", "packets"],
    },
  ],
};

export default article;
