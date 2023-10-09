// import {print} from './test.js'

// const post = () => {
//   const postList = getStorage("posts") ?? [];
//   const postOperations = {
//     addPosts:(posts) => {
//       // let post = {
//       //   userId: p_userId,
//       //   id: p_id,
//       //   body: p_body,
//       //   title: p_title,
//       //   photo: p_photo,
//       // };

//       postList.push(...posts);
//       setStorage("posts", postList);
//     }

//   };
// };

const setPosts = () => {
  fetch("https://jsonplaceholder.typicode.com/posts/", {
    method: "get",
  })
    .then((res) => {
      const posts = res.json();
      console.log(posts);
      return posts;
    })
    .then((posts) => {
      // console.log(posts);
      // // const post = getStorage("posts") || [];
      localStorage.clear("posts");
      // const post = [];
      // post.push(posts);
      setStorage("posts", posts);
    })
    .catch((e) => {
      console.log("error", e);
    });
};

const getPosts = () => {
  const posts = getStorage("posts") || [];
  return posts;
};

const allPosts = getPosts();

const bodyTitle = `
<section>
  <div class="p-5 mb-2 bg-dark text-white text-center">
  <div class="d-flex justify-content-center">
  <div id="myClass" class="input-group w-50">
  <label class="input-group-text" for="inputGroupSelect01">Show:</label>
  <select id="postNo" class="form-select" id="inputGroupSelect01">
    <option value="10" selected>10</option>
    <option value="20">20</option>
    <option value="50">50</option>
    <option value="100">100</option>
  </select>
  <button id="fetchApi" type="button" class="btn btn-light">Api Fetch</button>
</div>
  </div>
  </div>
</section>
`;

const createPostCard = function (
  productId,
  productName,
  productDetails,
  productImage = null
) {
  let productTag = `
            <span> 450x300 </span>
            <span class="vl"></span>
    `;

  if (productImage)
    productTag = `
            <img src="${productImage}" alt="${productName}" class="h-100 w-100"></img>
        `;

  return `
    <div class="col product-item">
        <div class="card h-100">
          <div class="card-div fs-1">
            <span class="vl badge text-bg-dark sale d-none">Sale</span>
            ${productTag}
          </div>
          <div class="card-body">
            <h5 class="card-title fw-bold product-name">${productName}</h5>
            <p class="card-text">$${productDetails}</p>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-outline-dark" value="${productId}">
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

  if (!allPCards) {
    return `
            <div class="h2 my-5 text-center text-danger">No Posts Found!</div>
        `;
  }

  return `
  <input type="file" class="form-control d-none" id="productImagePath" placeholder="Product Image Path" accept="image/jpeg, image/png">
  <label class="d-none" for="productImagePath">Product Image Path</label>
  <img id="previewProductImage" src="#" alt="Preview Product Image" class="d-none">
  <div id="post-container">
    <div class="container text-center mb-5 mt-5 product-container">
        <div class="row row-cols-1 row-cols-md-4 g-4">
            ${allPCards}
        </div>
    </div>
  </div>
    `;
};

renderHtml(body, bodyTitle);

let postNo = el(document, "#postNo");

renderHtml(body, postContainer(allPosts, postNo.value));

function updateClass() {
  const width = window.innerWidth;
  const targetDiv = el(document, "#myClass");

  if (width < 768) {
    targetDiv.classList.remove("w-50");
    targetDiv.classList.add("w-100");
  } else {
    targetDiv.classList.remove("w-100");
    targetDiv.classList.add("w-50");
  }
}

window.addEventListener("resize", updateClass);
updateClass();

let addBtns = els(document, ".product-container .card-footer>button");
let btnValue = 0;
addBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    el(document, "#productImagePath").click();
    console.log(btn.value);
    btnValue = btn.value;
  });
});
let prevImage = el(document, "#previewProductImage");
el(document, "#productImagePath").addEventListener("change", async (event) => {
  const index = allPosts.findIndex((obj) => obj.id == btnValue);
  if (index !== -1) {
    allPosts[index].photo = await loadImage(event, prevImage);
    // const allPosts = getPosts('posts');
    allPosts.splice(index, 1, allPosts[index]);
    setStorage("posts", allPosts);
    console.log(allPosts);
    let postNo = el(document, "#postNo");
    updateHtml(
      el(body, "#post-container"),
      postContainer(allPosts, postNo.value)
    );
    let addBtns = els(document, ".product-container .card-footer>button");
    addBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        el(document, "#productImagePath").click();
        console.log(btn.value);
        btnValue = btn.value;
      });
    });
  }
});

selectInput = el(document, "#postNo");

const fetchBtn = el(document, "#fetchApi");
fetchBtn.addEventListener("click", (event) => {
  fetchBtn.innerHTML = "Reset";
  setPosts();
  // const allPosts = getPosts();
  let postNo = el(document, "#postNo");
  updateHtml(
    el(body, "#post-container"),
    postContainer(getStorage("posts"), postNo.value)
  );
  let addBtns = els(document, ".product-container .card-footer>button");
    addBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        el(document, "#productImagePath").click();
        console.log(btn.value);
        btnValue = btn.value;
      });
    });
  // const inputValue = selectInput.value;

  // // Reload the page
  // location.reload();

  // // Set the input value back after the page reloads
  // selectInput.value = inputValue;
});

selectInput.addEventListener("change", () => {
  const allPosts = getPosts();
  let postNo = el(document, "#postNo");
  updateHtml(
    el(body, "#post-container"),
    postContainer(allPosts, postNo.value)
  );
  let addBtns = els(document, ".product-container .card-footer>button");
    addBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        el(document, "#productImagePath").click();
        console.log(btn.value);
        btnValue = btn.value;
      });
    });
  // const inputValue = selectInput.value;

  // // Reload the page
  // location.reload();

  // // Set the input value back after the page reloads
  // selectInput.value = 20;
});





// print();