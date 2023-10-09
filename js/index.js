let btnValue = 0;

const fetchPosts = () => {
  const pContainer = el("#post-container", body);
  const spinnerDiv = `
    <div id="spinner" role="status"></div>
    <div class="spinner">Loading...</div>
  `;
  updateHtml(pContainer, spinnerDiv);
  fetch("https://jsonplaceholder.typicode.com/posts/", {
    method: "get",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((posts) => {
      setStorage("posts", posts);
      renderPosts();
    });
};

const getPosts = () => {
  return getStorage("posts", []);
};

const renderPosts = () => {
  const allPosts = getPosts();
  const postNo = el("#postNo");
  const pContainer = el("#post-container", body);
  updateHtml(pContainer, postContainer(allPosts, postNo.value));
  const addBtns = els(".product-container .card-footer>button");
  addBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      el("#productImagePath").click();
      btnValue = btn.value;
    });
  });
};

const bodyTitle = `
    <section>
      <div class="p-5 mb-2 bg-dark text-white text-center">
        <div class="d-flex justify-content-center">
          <div id="myClass" class="input-group w-50">
            <label class="input-group-text" for="inputGroupSelect01">Show:</label>
            <select id="postNo" class="form-select" id="inputGroupSelect01">
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
            </select>
            <button id="fetchApi" type="button" class="btn btn-light">
              Reload
            </button>
          </div>
        </div>
      </div>
      <div>
        <input type="file" class="form-control d-none" id="productImagePath" placeholder="Product Image Path" accept="image/jpeg, image/png" />
        <label class="d-none" for="productImagePath">Product Image Path</label>
        <img id="previewProductImage" src="#" alt="Preview Product Image" class="d-none"  />
      </div>
    </section>
`;

const createPostCard = function (
  cardId,
  cardName,
  cardDetails,
  cardImage = null
) {
  let cardTag = `
      <span> 450x300 </span>
      <span class="vl"></span>
    `;

  if (cardImage)
    cardTag = `
            <img src="${cardImage}" alt="${cardName}" class="h-100 w-100"></img>
        `;

  return `
    <div class="col card-item">
        <div class="card h-100">
          <div class="card-div fs-1">
            <span class="vl badge text-bg-dark sale d-none">Sale</span>
            ${cardTag}
          </div>
          <div class="card-body">
            <h5 class="card-title fw-bold product-name">${cardName}</h5>
            <p class="card-text">$${cardDetails}</p>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-outline-dark" value="${cardId}">
              Select Photo
            </button>
          </div>
        </div>
    </div>
`;
};

const postContainer = (allProd, selectedNo = 10) => {
  let allPCards = "";
  let i = 0;
  allProd.forEach((prod) => {
    if (i < selectedNo) {
      allPCards += createPostCard(prod.id, prod.title, prod.body, prod.photo);
    }
    i++;
  });
  el("#fetchApi").innerHTML = "Reload";
  if (!allPCards) {
    el("#fetchApi").innerHTML = "Api Fetch";
    return `
            <div class="h2 my-5 text-center text-danger">No Posts Found!</div>
        `;
  }

  return `
    <div class="container text-center mb-5 mt-5 product-container">
        <div class="row row-cols-1 row-cols-md-4 g-4">
            ${allPCards}
        </div>
    </div>
    `;
};

renderHtml(body, bodyTitle);
renderHtml(body, '<div id="post-container"></div>');

renderPosts();

el("#fetchApi").addEventListener("click", (event) => {
  fetchPosts();
});

el("#postNo").addEventListener("change", () => {
  renderPosts();
});

el("#productImagePath").addEventListener("change", async (event) => {
  const allPosts = getPosts("posts");
  const index = allPosts.findIndex((obj) => obj.id == btnValue);
  if (index !== -1) {
    let prevImage = el("#previewProductImage");
    allPosts[index].photo = await loadImage(event, prevImage);
    allPosts.splice(index, 1, allPosts[index]);
    setStorage("posts", allPosts);
    renderPosts();
  }
});
