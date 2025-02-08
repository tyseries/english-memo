"use client"
import { useState, useEffect } from "react";
import db from "@/lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

interface Memo {
  english: string;
  meaning: string;
}

export default function Home() {
  const [english, setEnglish] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");
  
  const [archives, setArchives] = useState<Memo[]>([]);

  const saveMemo = async () => {
    try {
      if (english && meaning) {
        await addDoc(collection(db, "english_memos"), {
          english,
          meaning,
        });
        setEnglish("");
        setMeaning("");
        fetchMemos();
      }
    } catch (error) {
      console.error("Error saving memo:", error);
    }
  };

  const fetchMemos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "english_memos"));
      const fetchedMemos: Memo[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMemos.push(doc.data() as Memo);
      });
      setArchives(fetchedMemos);
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  return (
    <div className="md:w-1/2 md:mx-auto mx-4 mb-4 md:mb-8 md:mt-4 font-light">
      <div className="flex items-center gap-2 py-4 bg-white sticky top-0">
        <div className="flex items-center gap-2 w-full">
          <input
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="English"
            className="h-10 px-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 w-1/2 placeholder:text-zinc-400 outline-none duration-200 focus:ring-2 ring-offset-2"
          />
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="Meaning"
            className="h-10 px-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 w-1/2 placeholder:text-zinc-400 outline-none duration-200 focus:ring-2 ring-offset-2"
          />
        </div>
        <button
          onClick={saveMemo}
          className="px-4 py-2 rounded-full bg-zinc-800 text-white w-fit outline-none duration-200 focus:ring-2 ring-offset-2"
        >
          Save
        </button>
      </div>

      <div className="bg-zinc-50 p-4 rounded-lg mt-4">
        <h1 className="text-xl">Archived</h1>
        <div className="border-t mt-2 mb-4 border-zinc-200" />

        <div className="space-y-4">
          {archives.length > 0 ? (
            archives.map((memo, index) => (
              <div key={index}>
                <p>{memo.english}</p>
                <p className="text-zinc-400 text-sm mt-0.5">{memo.meaning}</p>
              </div>
            ))
          ) : (
            <p>No archived memos yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}