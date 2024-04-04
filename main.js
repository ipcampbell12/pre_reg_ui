import fakeData from '../data';

let currentPage = 1
const pageSize = 5; // Number of items per page

const statusArr = ["submitted","scheduled","pending","completed"]


function returnColor(lookup){
  console.log("The function has run")
  const colorScheme ={
    "submitted":"tan",
    "scheduled":"yellow",
    "pending":"orange",
    "completed":"lightgreen"
  };
  console.log("The color is: "+colorScheme[lookup])
  return colorScheme[lookup]
}

const smallCardHtml = (row) => `
  <li class="small-card me-4"  id="card-${row[0]}" style="background-color:${returnColor(row[11])}">
      <h6 class="center"> ${row[1]}</h6>
      <div class="row">
        <p class="col-6 col-sm-4"> ${row[2]}</p>
        <p class="card-text col-6 col-sm-4"> ${row[3]}</p>
        <p class="card-text col-6 col-sm-4"> ${row[4]}</p>  
      </div>
      <button class="btn btn-primary btn-sm m-1">Open Student</button>
  </li>
  <br>
`

const modalHtml = (row) => `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${row[1]}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul>
          <li>Student Number: ${row[2]}</li>
          <li>School: ${row[3]}</li>
          <li>Grade Level: ${row[4]}</li>
          <li>Phone Number: ${row[5]}</li>
          <li>Alternate Phone Number: ${row[6]}</li>
          <li>Parent: ${row[7]}</li>
          <li>Address: ${row[8]}</li>
          <li>DOB: ${row[8]}</li>
        </ul>
      <p>Status: ${row[11]}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
`


  function openModal(event){
      const id = event.target.parentNode.id;
      console.log(id)
      const idx = id.split("-")[1]-1;
      const student = fakeData[idx];
      console.log(student)
      const modalElement = document.createElement("div")
      modalElement.classList.add("modal")
      modalElement.innerHTML = modalHtml(student)
      modalElement.hidden = false;

      const modal = new bootstrap.Modal(modalElement)
      modal.show()
      //console.log(modalElement)
      
  }

 function addEventListeners(){
   
    for(let i=1;i<=fakeData.length;i++){
      try{
        const id = document.getElementById(`card-${i}`)
        id.addEventListener("click",openModal)
      }catch(e){
        console.log("Card is not visible on page")
      }
       
    }
 }



// PAGINATION FUNCTIONALITY BELOW

function addDataToColumns(){
  //console.log("Fake data"+fakeData)
  statusArr.forEach(status => {
     
      const filtereData = fakeData.filter(row => row[11]===status);
      displayStudents(status,filtereData)
  })
}

function renderDataForPage(data, htmlTemp, page) {
  console.log("renderDataForPage:"+data)
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = data.slice(startIndex, endIndex);
  console.log("pageData is: "+pageData)
  const html = pageData.map((row) => htmlTemp(row)).join("");
  console.log("html is"+html)
  return html;
}
// Function to render pagination buttons
function renderPaginationButtons(data) {
  //console.log("renderPaginationButtons: "+data)
  const totalPages = Math.ceil(data.length / pageSize);
  const maxVisibleButtons = 5; // Maximum number of visible pagination buttons
  const currentPageIndex = currentPage - 1;

  let startPage = Math.max(0, currentPageIndex - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisibleButtons - 1);

  // Adjust startPage and endPage if maxVisibleButtons exceeds totalPages
  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(0, totalPages - maxVisibleButtons);
  }

  let paginationHTML = `
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="gotoPage(${currentPage - 1})" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>`;

  for (let i = startPage + 1; i <= endPage + 1; i++) {
    paginationHTML += `
        <li class="page-item ${currentPage === i ? 'active' : ''}">
          <a class="page-link" href="#" onclick="gotoPage(${i})">${i}</a>
        </li>`;
  }

  paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="gotoPage(${currentPage + 1})" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>`;

  return paginationHTML;
}

// Function to display students for the current page
function displayStudents(column,data) {
  console.log(column)
  //console.log("displayStudents: "+data)
  const element = document.getElementById(`paginated-list-${column}`);
  const renderedData = renderDataForPage(data, smallCardHtml,currentPage);
  console.log(renderedData)
  element.innerHTML = `
    <div class="row">
      <div class="col-md-12">${renderedData}</div>
    </div>`;
  document.getElementById(`pagination-${column}`).innerHTML = renderPaginationButtons(data);
}




// Function to navigate to a specific page
window.gotoPage = function(page) {
  currentPage = page;
  // displayStudents();
  addDataToColumns()
  addEventListeners()
};


document.addEventListener("DOMContentLoaded",function(){
  console.log("This event listenere is running")
  // displayStudents()
  addDataToColumns()
  addEventListeners()
})