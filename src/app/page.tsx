"use client"
import { useState, useEffect } from "react";
import db from "@/lib/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

interface Memo {
  id: string;  // Added ID to identify documents uniquely
  english: string;
  meaning: string;
}

export default function Home() {
  const [english, setEnglish] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");

  const [archives, setArchives] = useState<Memo[]>([]);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);  // New state for selected memo to edit

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

  const deleteMemo = async () => {
    if (editingMemo) {
      try {
        const memoRef = doc(db, "english_memos", editingMemo.id);
        await deleteDoc(memoRef);  // Delete the document
        setEditingMemo(null);  // Close the modal after deletion
        fetchMemos();  // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting memo:", error);
      }
    }
  };  

  const fetchMemos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "english_memos"));
      const fetchedMemos: Memo[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMemos.push({ id: doc.id, ...doc.data() } as Memo);
      });
      setArchives(fetchedMemos);
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  const updateMemo = async () => {
    if (editingMemo && editingMemo.english && editingMemo.meaning) {
      try {
        const memoRef = doc(db, "english_memos", editingMemo.id);
        await updateDoc(memoRef, {
          english: editingMemo.english,
          meaning: editingMemo.meaning,
        });
        setEditingMemo(null);  // Close modal after updating
        fetchMemos();  // Refresh the list
      } catch (error) {
        console.error("Error updating memo:", error);
      }
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  return (
    <div className="md:w-1/2 md:mx-auto mx-4 mb-4 font-light">
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
            archives.map((memo) => (
              <div
                key={memo.id}
                className="hover:bg-zinc-200 cursor-pointer"
                onClick={() => setEditingMemo(memo)}  // Trigger editing on click
              >
                <p>{memo.english}</p>
                <p className="text-zinc-400 text-sm mt-0.5">{memo.meaning}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-400">No archived memos yet.</p>
          )}
        </div>
      </div>

      {/* Edit Memo Modal */}
      {editingMemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur">
          <div className="bg-white p-6 rounded-lg w-3/4 md:w-1/4 flex flex-col">
            <div className="flex items-center mb-4">
              <h2 className="text-xl mr-2">Edit Memo</h2>
              <button className="ml-auto text-red-600 bg-red-50 px-2 py-0.5 rounded-lg" onClick={deleteMemo}>Delete</button>
            </div>
            <div className="mb-4">
              <input
                value={editingMemo.english}
                onChange={(e) =>
                  setEditingMemo({ ...editingMemo, english: e.target.value })
                }
                placeholder="English"
                className="h-10 px-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 w-full placeholder:text-zinc-400 outline-none duration-200 focus:ring-2 ring-offset-2"
              />
            </div>
            <div className="mb-4">
              <input
                value={editingMemo.meaning}
                onChange={(e) =>
                  setEditingMemo({ ...editingMemo, meaning: e.target.value })
                }
                placeholder="Meaning"
                className="h-10 px-4 py-2 rounded-lg bg-zinc-50 border border-zinc-200 w-full placeholder:text-zinc-400 outline-none duration-200 focus:ring-2 ring-offset-2"
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setEditingMemo(null)}  // Close modal without saving
                className="px-4 py-2 rounded-full bg-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={updateMemo}
                className="px-4 py-2 rounded-full bg-zinc-800 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}