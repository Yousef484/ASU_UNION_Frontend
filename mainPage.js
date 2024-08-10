const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");
const main = document.querySelector("#mainCont");
const postBtn = document.querySelector("#postBtn");
const filterBtn = document.querySelector("#filterBtn");
const paidYesRadio = document.getElementById('paidYes');
const paidNoRadio = document.querySelector("#paidNo");
const jobApplicationForm = document.querySelector("#jobApplicationForm");
const mainCard = document.querySelector(".mainCard")
const NotifyForm = document.querySelector("#NotifyForm")

var currPage = 1, totalPages = 0, posts , status , bookmarksIDs=JSON.parse(localStorage.getItem('bookmarks')) , likesIDs=JSON.parse(localStorage.getItem('likes'));

const BaseUrl = "https://localhost:44359/api/"


MainPageLoad();

filterBtn.addEventListener('click', async function() {
    currPage = 1;
    const url = GenerateGetPostsRequestURL();
    await GetPostsRequest(url)
    SetPaginationButtons(currPage, totalPages);
    renderPosts();
  
});









paidYesRadio.addEventListener('change', function() {
  if (paidYesRadio.checked) {
    paidYesRadio.classList.add('checked-radio');    
  } else {    
    paidYesRadio.classList.remove('checked-radio');
  }
});

paidNoRadio.addEventListener('change', function() {
  if (paidNoRadio.checked) {
    paidNoRadio.classList.add('checked-radio');    
  } else {    
    paidNoRadio.classList.remove('checked-radio');
  }
});








jobApplicationForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const requiredInputs = jobApplicationForm.querySelectorAll("input , select"); 
  let isValid = true;

  for (let i = 1; i < requiredInputs.length; i++) {
    
    if (requiredInputs[i].value.trim() === "") {
      
      requiredInputs[i].classList.add("error"); 
      isValid = false;
      break;
    }
  }

  
  const selectedPaidOption = document.querySelector('input[name="paid"]:checked');
  if (!selectedPaidOption) {
    isValid = false;
  }

  
  if (isValid) {  
    const formData = {
      signature:document.getElementById('signaturee').value,
      title: document.getElementById('title').value,
      position: document.getElementById('position').value,
      companyName: document.getElementById('company').value,
      duration: document.getElementById('duration').value,
      roleCategoryName: document.getElementById('roleCategory').value,
      postLink: document.getElementById('jobPostLink').value,
      paid: selectedPaidOption.value,
    };

    try {
      await PostRequest(`${BaseUrl}Post/AddPost`, formData);
  
  } catch (error) {
    
    
    
  }
  jobApplicationForm.reset();
  }
});





NotifyForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  debugger
  const requiredInputs = NotifyForm.querySelectorAll("input "); 
  let isValid = true;

  for (let i = 0; i < requiredInputs.length; i++) {
    
    if (requiredInputs[i].value.trim() === "") {
      
      requiredInputs[i].classList.add("error"); 
      isValid = false;
      break;
    }
  }

  
 
    const formData = {
      userName:document.getElementById('UserName').value,
      email: document.getElementById('UserEmail').value,
    }

    try {
      // change the url here
      // await PostRequest(`${BaseUrl}Post/AddPost`, formData);
  
  } catch (error) {
    
    
    
  }
  NotifyForm.reset();
  }
);























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



async function MainPageLoad()
{   
    await GetPostsRequest(`${BaseUrl}Post/GetPosts?page=1`)
    SetPaginationButtons(currPage, totalPages);
    renderPosts();
}


function PostRequest(url, data) {
  
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }) .then(response => {

        if (!response.ok) {
            status = false
            
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        return response.json();
    })
    .then(data => {
        posts = data.Data
        status = data.Success
        if (status == true){
        swal({
          title: `Sent Successfully!
           Thank You`,
          type: "success",
          confirmButtonColor: '#F59F54', 
        });
      }
      else 
      {
        swal({
          title: `Somthing Went Wrong !
          Please Try Again...`,
          type: "error",
          confirmButtonColor: '#F59F54', 
        }); 
      }
    })
    .catch(error => {
        
        swal({
          title: `Somthing Went Wrong !
          Please Try Again...`,
         type: "error",
         confirmButtonColor: '#F59F54', 
        });
    });
       
}


function GetSelectedCheckBoxItems() {
    const selectedCheckboxes = [];
    const checkboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        selectedCheckboxes.push(checkbox.name);
    });

    return selectedCheckboxes;
}

function GenerateGetPostsRequestURL()
{
    const baseUrl = "https://localhost:44359/api/Post"
    let queryParams = `?page=${currPage}`;
    var filterList = GetSelectedCheckBoxItems();

    if (filterList && filterList.length > 0) {
        filterList.forEach(item => {
            queryParams += `&filter=${item}`;
        });
    }

    return `${baseUrl}/GetPosts${queryParams}`;
}

function GetPostsRequest(url) {
    

   return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            posts = data.Data
            totalPages = data.PageCount;
        })
        .catch(error => {

           
        });
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
                <i class="bi bi-bookmark-fill" id="bookmarkSign" data-post-id="${post.ID}"></i>
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

function renderPosts() {

    while (mainCont.firstChild)
        mainCont.removeChild(mainCont.firstChild)

    if (posts != null) {
        posts.forEach(post => {
            const card = createCard(post);
            main.appendChild(card);
        });
        SetSignsButtons()
    }
}

function SetPaginationButtons(curr, total) {
    if (curr != 1)
    {
        mainCard.classList.add("hide")
        main.classList.remove("mt-2")
        main.classList.add("mt-5")
        prevBtn.classList.remove("disabledBtn")
    }
    else if (curr == 1)
    {
      main.classList.remove("mt-5")
        main.classList.add("mt-2")
      mainCard.classList.remove("hide")
        prevBtn.classList.add("disabledBtn")
    }
    if (curr != total)
        nextBtn.classList.remove("disabledBtn")
    else if (curr == total)
        nextBtn.classList.add("disabledBtn")
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
              url = `${BaseUrl}Post/Like?postID=${postId}&add=${true}`
              if(likesIDs == null)
               likesIDs = []
              likesIDs.push(postId)
              localStorage.setItem("likes",JSON.stringify(likesIDs))
            }
           else {
           url = `${BaseUrl}Post/Like?postID=${postId}&add=${false}`   
           const deleteID = likesIDs.indexOf(postId)
           if(deleteID != -1)
             likesIDs.splice(deleteID,1)
           localStorage.setItem("likes",JSON.stringify(likesIDs))
        }
           await GetPostsRequest(url)
        });
        
        if (ExistsInLocalStorage('bookmarks',bookmarkSign.dataset.postId))
          bookmarkSign.classList.add('yellow')
        bookmarkSign.addEventListener('click', () => {
            const postId = bookmarkSign.dataset.postId;
            bookmarkSign.classList.toggle("yellow");
            if (bookmarkSign.classList.contains('yellow')){
              if (bookmarksIDs == null)
               bookmarksIDs = []  
              bookmarksIDs.push(postId)
                localStorage.setItem("bookmarks",JSON.stringify(bookmarksIDs))
            }else{
              const deleteID = bookmarksIDs.indexOf(postId)
              if(deleteID != -1)
                bookmarksIDs.splice(deleteID,1)
            localStorage.setItem("bookmarks",JSON.stringify(bookmarksIDs))
            } 
           
        });
    });
}

function StopPropagation(event) {
    event.stopPropagation();
}




const notifyBtn = document.querySelector("#notifyBtn");

notifyBtn.addEventListener("click", async function(){

// make a form on the html and get the fiedls then call postRequest with the  form data that 
// you got from the fields then ;


})