const doc = document;

const form = doc.getElementById("form");
const postBody = doc.getElementById("post-body");
const postName = doc.getElementById("post-name");
const postsContainer = doc.querySelector(".posts");
const refreshBtn = doc.querySelector(".refresh-btn");

// Funkcja do wyświetlania wiadomości
async function displayPosts() {
  // Czyścimy zawartość kontenera
  postsContainer.innerHTML = "";

  // Pobieramy wiadomości z backendu
  const response = await fetch("https://forum-backend-lac.vercel.app/posts");
  const posts = await response.json();

  // Tworzymy elementy HTML dla każdej wiadomości
  posts.forEach((post) => {
    const postElement = doc.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = `
      <h3>${post.name}</h3>
      <p>${post.message}</p>
    `;
    postsContainer.appendChild(postElement);
  });
}

// Wywołujemy funkcję, aby załadować wiadomości przy starcie
displayPosts();

// Obsługa formularza
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Wysłanie nowej wiadomości do backendu
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

  // Czyszczenie pól formularza po wysłaniu
  postName.value = "";
  postBody.value = "";

  // Odświeżenie wyświetlanych wiadomości
  displayPosts();
});

// Obsługa przycisku Refresh
refreshBtn.addEventListener("click", async () => {
  // Odświeżenie wyświetlanych wiadomości
  displayPosts();
});
