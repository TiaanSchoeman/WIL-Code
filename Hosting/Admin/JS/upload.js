import { storage, db, auth } from "../firebase.js";
import { ref, uploadBytesResumable, getDownloadURL, listAll } 
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Elements
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");
const fileList = document.getElementById("fileList");

uploadBtn.addEventListener("click", uploadFile);

async function uploadFile() {
  const file = fileInput.files[0];
  if (!file) return (uploadStatus.textContent = "Please choose a file.");

  uploadStatus.textContent = "Uploading...";

  const user = auth.currentUser;
  const userId = user ? user.uid : "public";

  const storageRef = ref(storage, `uploads/${userId}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      let progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      uploadStatus.textContent = `Uploading: ${progress}%`;
    },
    (error) => {
      uploadStatus.textContent = "Upload failed.";
      console.log(error);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      // Save metadata to Firestore (optional)
      await addDoc(collection(db, "uploads"), {
        fileName: file.name,
        url: downloadURL,
        uploadedBy: userId,
        timestamp: serverTimestamp()
      });

      uploadStatus.textContent = "Upload complete!";
      loadFiles(); // refresh list
    }
  );
}

// Load uploaded files
async function loadFiles() {
  const user = auth.currentUser;
  const userId = user ? user.uid : "public";

  const folderRef = ref(storage, `uploads/${userId}`);

  fileList.innerHTML = "Loading files...";

  try {
    const result = await listAll(folderRef);

    if (result.items.length === 0) {
      fileList.innerHTML = "<p>No files uploaded yet.</p>";
      return;
    }

    fileList.innerHTML = "";

    result.items.forEach(async (itemRef) => {
      const url = await getDownloadURL(itemRef);

      const fileDiv = document.createElement("div");
      fileDiv.className = "file-item";
      fileDiv.innerHTML = `
        <a href="${url}" target="_blank">${itemRef.name}</a>
      `;

      fileList.appendChild(fileDiv);
    });
  } catch (err) {
    console.log(err);
    fileList.innerHTML = "Error loading files.";
  }
}

// Auto-load files when page opens
auth.onAuthStateChanged(() => {
  loadFiles();
});
