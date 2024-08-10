const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");
const main = document.querySelector("#mainCont");
const filterBtn = document.querySelector("#filterBtn");
const noPosts = document.querySelector("#noPosts")

var currPage = 1, totalPages = 0, posts  , bookmarksIDs=JSON.parse(localStorage.getItem('bookmarks')) , likesIDs=JSON.parse(localStorage.getItem('likes'));

nextBtn.addEventListener('click', async() => {
    currPage++;
    const url = GenerateGetPostsRequestURL();
    await GetPostsRequest(url)
    SetPaginationButtons(currPage, totalPages);
    renderPosts();
})
prevBtn.addEventListener('click',async () => {
    currPage--;
    const url = GenerateGetPostsRequestURL();
    await GetPostsRequest(url)
    SetPaginationButtons(currPage, totalPages);
    renderPosts();
})

filterBtn.addEventListener('click', async function() {
    currPage = 1;
    const url = GenerateGetPostsRequestURL();
    await GetPostsRequest(url)
    SetPaginationButtons(currPage, totalPages);
    renderPosts();
  
});


MainPageLoad()
async function MainPageLoad()
{   
    //======Change BaseUrl========
    const baseUrl = "https://localhost:44359/api/Bookmark/GetPosts?page=1"
    let queryParams = ""
    let localStorageItems =  JSON.parse(localStorage.getItem('bookmarks'))
    console.log("this are bookmarks: " , localStorageItems)
    if ( localStorageItems && localStorageItems.length>0)
    {
        localStorageItems.forEach(item => {
            queryParams += `&postID=${item}`;
        });
    }
    await GetPostsRequest(baseUrl+queryParams)
    SetPaginationButtons(currPage, totalPages);
    renderPosts();
}

function SetSignsButtons() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const loveSign = card.querySelector(".hstack #loveSign");
        const bookmarkSign = card.querySelector(".hstack #bookmarkSign");
        var url ; 
        if (ExistsInLocalStorage('likes',loveSign.dataset.postId))
          loveSign.classList.add('red')
        loveSign.addEventListener('click', async () => {
            const postId = loveSign.dataset.postId;
            loveSign.classList.toggle('red');
            if (loveSign.classList.contains('red')) {
              url = `https://localhost:44359/api/Post/Like?postID=${postId}&add=${true}`
              likesIDs.push(postId)
              localStorage.setItem("likes",JSON.stringify(likesIDs))
            }
           else {
           url = `https://localhost:44359/api/Post/Like?postID=${postId}&add=${false}`   
           const deleteID = likesIDs.indexOf(postId)
           if(deleteID != -1)
             likesIDs.splice(deleteID,1)
           localStorage.setItem("likes",JSON.stringify(likesIDs))
        }
           await GetPostsRequest(url)
        });
        
       
    });
}


function GetPostsRequest(url) {
    console.log("url:", url)

   return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            posts = data.Data
            console.log("this is Data: ", data)
            totalPages = data.PageCount;
            console.log("total: ", totalPages)
        })
        .catch(error => {

            console.error('Error:', error);
        });
}

function GetSelectedCheckBoxItems() {
    const selectedCheckboxes = [];

    const checkboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]:checked');


    // Iterate over selected checkboxes and push their values to the array
    checkboxes.forEach(checkbox => {
        selectedCheckboxes.push(checkbox.name);
    });

    return selectedCheckboxes;
}
function GenerateGetPostsRequestURL()
{

    //      ========change baseUrl =========
    //https://localhost:44359/api/Bookmark/GetPosts?page=1&postID=1&postID=2&filter=Flutter
    const baseUrl = `https://localhost:44359/api/Bookmark/GetPosts?page=${currPage}`
    let queryParams = ""
    let localStorageItems =  JSON.parse(localStorage.getItem('bookmarks'))
    if ( localStorageItems && localStorageItems.length>0)
    {
        localStorageItems.forEach(item => {
            queryParams += `&postID=${item}`;
        });
    }
    let filterList = GetSelectedCheckBoxItems();

    if (filterList && filterList.length > 0) {
        filterList.forEach(item => {
            queryParams += `&filter=${item}`;
        });
    }
   
    return `${baseUrl}${queryParams}`;
}

function ExistsInLocalStorage(key, value)
{
    const items = localStorage.getItem(key);
    if(items)
    {
        const parsedList = JSON.parse(items)
        if (parsedList.includes(value)) {
            return true;
          } else {
           
            return false;
          }
    }
    
    return false
     
}
function SetPaginationButtons(curr, total) {
    if (curr != 1)
        prevBtn.classList.remove("disabledBtn")
    else if (curr == 1)
        prevBtn.classList.add("disabledBtn")

    if (curr != total)
        nextBtn.classList.remove("disabledBtn")
    else if (curr == total)
        nextBtn.classList.add("disabledBtn")
    if(total == 0)
     {
        prevBtn.classList.add("disabledBtn")
        nextBtn.classList.add("disabledBtn")
     }
}


function renderPosts() {

    while (mainCont.firstChild)
        mainCont.removeChild(mainCont.firstChild)

    if (posts != null) {
        noPosts.remove()
        posts.forEach(post => {
            const card = createCard(post);
            main.appendChild(card);
        });
        SetSignsButtons()
    }
}

function createCard(post) {
    const postTime= getTimeDifferenceFromBackend(post.publishDate);
    const cardDiv = document.createElement("div");
    cardDiv.className = "container mt-3 col-9";
    cardDiv.innerHTML = `
      <div class="card mb-3 shadow-lg" >
        <div class="row g-0">
          <div class="col-md-3 d-flex align-items-center justify-content-center">
            <img src="Assets/Untitled1.png" class="img-fluid rounded-md-and-above" alt="..." style="width: 100%; height: 100%;">
            
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">
              <span id="jobInfo">Company:</span> ${post.companyName}<br> 
               <span id="jobInfo">Position:</span> ${post.position}<br>
                <span id="jobInfo">Duration:</span> ${post.duration}<br>
                <span id="jobInfo">Paid:</span> ${post.paid}
              </p>
              <div class="hstack mb-1">
                <i class="bi bi-heart-fill" id="loveSign" data-post-id="${post.ID}"></i>
                <span id="LikesNum">(${post.numberOfLikes})</span>
                <a target="_blank" href="${post.postLink}" class="submitBtn ms-auto shadow-lg">Apply</a>
              </div>
              <div class="d-flex justify-content-between align-items-center"> 
               <small class="text-body-secondary">Last Updated ${postTime}</small>
              <small class="text-muted" id="signature">${post.signature}</small>  
            </div>
            </div>
          </div>
        </div>
      </div>
    `;
    return cardDiv;
}

function getTimeDifferenceFromBackend(backendDateTime) {
    const backendDate = new Date(backendDateTime);
    const currentTime = new Date();
    const timeDifferenceMs = currentTime - backendDate;
    const timeDifferenceSeconds = timeDifferenceMs / 1000;
  
    if (timeDifferenceSeconds < 60) {
        
        return `${Math.floor(timeDifferenceSeconds)} seconds ago`;
    } else if (timeDifferenceSeconds < 3600) {
        
        const minutes = Math.floor(timeDifferenceSeconds / 60);
        
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceSeconds < 86400) {
        const hours = Math.floor(timeDifferenceSeconds / 3600);
       
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        
        const days = Math.floor(timeDifferenceSeconds / 86400);
       
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

function StopPropagation(event) {
    event.stopPropagation();
}

