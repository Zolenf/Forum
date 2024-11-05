const doc = document;

const form = doc.getElementById("form");
const postBody = doc.getElementById("post-body");
const postName = doc.getElementById("post-name");
const postsContainer = doc.querySelector(".posts");
const refreshBtn = doc.querySelector(".refresh-btn");
const adminCode = "2115"; // Ustaw swój sekret
const adminSubmitBtn = doc.getElementById("admin-submit");
const adminCodeInput = doc.getElementById("admin-code");

// Funkcja do wyświetlania wiadomości
async function displayPosts() {
  postsContainer.innerHTML = "";

  const response = await fetch("https://forum-backend-lac.vercel.app/posts");
  const posts = await response.json();

  posts.forEach((post) => {
    const postElement = doc.createElement("div");
    postElement.className = "post";
    postElement.id = post.id;

    postElement.innerHTML = `
      <h3>${post.name}</h3>
      <p>${post.message}</p>
    `;
    const deleteBtn = doc.createElement("i");
    deleteBtn.className = "fa fa-trash-o unactive";
    deleteBtn.id = "trash";

    postsContainer.appendChild(postElement);
    postElement.appendChild(deleteBtn);
  });

  // Sprawdza status admina i ustawia widoczność ikon kosza
}

// Funkcja do sprawdzenia statusu administratora
function checkAdminStatus() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const trashIcons = document.querySelectorAll(".fa-trash-o");

  trashIcons.forEach((icon) => {
    if (isAdmin) {
      icon.classList.remove("unactive");
    } else {
      icon.classList.add("unactive");
    }
  });
}

// Obsługa formularza
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch("https://forum-backend-lac.vercel.app/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: postName.value,
      body: postBody.value,
    }),
  });

  postName.value = "";
  postBody.value = "";
  displayPosts();
});

// Obsługa przycisku Refresh
refreshBtn.addEventListener("click", async () => {
  displayPosts();
});

// Obsługa wprowadzenia kodu administratora
adminSubmitBtn.addEventListener("click", () => {
  if (adminCodeInput.value === adminCode) {
    localStorage.setItem("isAdmin", "true");
    alert("You are now an admin!");
    checkAdminStatus();
  } else {
    alert("Incorrect code.");
  }
});

// Wywołaj funkcję przy starcie, aby ustawić początkowy stan ikon
checkAdminStatus();

// Obsługa klikania na ikonę usuwania wiadomości
postsContainer.addEventListener("click", async (e) => {
  if (e.target.id === "trash") {
    const postElement = e.target.closest(".post");
    const postId = postElement.id;

    await fetch(`https://forum-backend-lac.vercel.app/posts/${postId}`, {
      method: "DELETE",
    });

    displayPosts();
  }
});

// Wywołujemy funkcję, aby załadować wiadomości przy starcie
displayPosts();

if (localStorage.getItem("isAdmin") === "true") {
  checkAdminStatus();
  alert("You are an admin!");
}
