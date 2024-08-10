

const sendBtn = document.querySelector("#sendBtn")
const Form = document.querySelector("form");
const controllerName = document.querySelector("#hiddenDiv").textContent;
const baseUrl = `https://localhost:44359/api/${controllerName}`

// sendBtn.addEventListener('click',async function (){
//   debugger
//   await PostRequest(`${BaseUrl}Post/AddPost`, formData);
//   // swal({
//   //   title: `Sent Successfully!
//   //    Thank You`,
//   //   type: "success",
//   //   confirmButtonColor: '#F59F54', 
//   // });
// })





Form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const requiredInputs = Form.querySelectorAll("input,textarea"); 
  let isValid = true;
  
  for (let i = 1; i < requiredInputs.length; i++) {
    
    if (requiredInputs[i].value.trim() === "") {
      
      requiredInputs[i].classList.add("error"); 
      isValid = false;
      break;
    }
  }
  
  
  
  if (isValid) {  
    const formData = {
      name:document.getElementById('UserName').value,
      content: document.getElementById('description').value,
    };
    
    try {
      debugger
      controllerName
      await AddPost(baseUrl, formData);
  
  } catch (error) {
  }
  Form.reset();
  }
});





function AddPost(url, data) {
  debugger
  return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  }) .then(response => {

    
      if (!response.ok) {
          
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => { 
    if (data.Success == true){
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
  }) .catch(error => {
        
    swal({
      title: `Somthing Went Wrong !
      Please Try Again...`,
     type: "error",
     confirmButtonColor: '#F59F54', 
    });
});
  
     
}



















 



  
