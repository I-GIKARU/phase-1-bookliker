document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.querySelector("#list");
    const showPanel = document.querySelector("#show-panel");
    const currentUser = { id: 1, username: "pouros" };

    function fetchBooks() {
        fetch("http://localhost:3000/books")
            .then(res => res.json())
            .then(books => books.forEach(displayBookTitle));
    }

    function displayBookTitle(book) {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        bookList.appendChild(li);
    }

    function showBookDetails(book) {
        const showPanel = document.getElementById("show-panel");
        showPanel.innerHTML = ""; // Clear previous content
    
        const bookTitle = document.createElement("h2");
        bookTitle.textContent = book.title;
    
        const bookImage = document.createElement("img");
        bookImage.src = book.img_url; // Ensure this matches the API response key
        bookImage.alt = book.title;
    
        const bookDescription = document.createElement("p");
        bookDescription.textContent = book.description;
    
        const usersList = document.createElement("ul");
        book.users.forEach(user => {
            const li = document.createElement("li");
            li.textContent = user.username;
            usersList.appendChild(li);
        });
    
        const likeButton = document.createElement("button");
        likeButton.textContent = "Like";
        likeButton.addEventListener("click", () => toggleLike(book, usersList, likeButton));
    
        // Append elements
        showPanel.append(bookTitle, bookImage, bookDescription, usersList, likeButton);
    }
    

    function toggleLike(book) {
        const userList = document.querySelector("#user-list");
        const likeBtn = document.querySelector("#like-btn");
        let updatedUsers;
        
        if (book.users.some(user => user.id === currentUser.id)) {
            updatedUsers = book.users.filter(user => user.id !== currentUser.id);
            likeBtn.textContent = "Like";
        } else {
            updatedUsers = [...book.users, currentUser];
            likeBtn.textContent = "Unlike";
        }

        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ users: updatedUsers })
        })
        .then(res => res.json())
        .then(updatedBook => {
            book.users = updatedBook.users;
            userList.innerHTML = updatedBook.users.map(user => `<li>${user.username}</li>`).join("");
        });
    }

    fetchBooks();
});
