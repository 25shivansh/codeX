import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import axios from "axios";

function App() {
  const [code, setCode] = useState(`def sum():\n  return a + b\n`);
  const [review, setReview] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    const response = await axios.post("http://localhost:3000/ai/get-review/", { code });
    setReview(response.data);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <header className="text-center text-4xl font-bold py-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
        CodeX - AI Code Reviewer 🤖
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Side */}
        <div className="lg:w-1/2 bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 space-y-4">
          <input
            type="file"
            accept=".js, .py, .css, .cpp, .cs, .ts, .html, .json, .java"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-[400px] overflow-auto">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
              }}
            />
          </div>

          <button
            onClick={reviewCode}
            className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-500 hover:to-blue-500 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            Review Code 🤖
          </button>
        </div>

        {/* Right Side */}
        <div className="lg:w-1/2 bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 max-h-[600px] overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">AI Review Output 📋</h2>
          {review ? (
            <Markdown
              rehypePlugins={[rehypeHighlight]}
              className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300 leading-relaxed"
            >
              {review}
            </Markdown>
          ) : (
            <p className="text-gray-500 italic">Your AI review will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

