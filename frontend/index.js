// Calling the DOM elements
const taskContent = document.querySelector('.task__contents');
const taskBody = document.querySelector('.task__modal__body');

// Card of Bill number
const htmlTaskContent = ({ id, bill_no, mobile_number, collected}) => `
    <div class="col-sm-6 col-md-4 col-lg-3 mt-3" id=${id} key=${id}>
        <div class="card shadow task__card">
        
            <div class="card-header d-flex justify-content-end task__card__header py-0 px-1">
                <button type="button" class="btn btn-outline-danger btn-sm m-2" name=${id} onclick="DeleteTask()">
                    <i class="fa-solid fa-trash-can" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outline-primary btn-sm m-2" name=${id} onclick="EditTask()">
                    <i class="fa-solid fa-pencil" name=${id}></i>
                </button>
            </div>

            <div class="card-body d-flex flex-column">
                <h1 class="card-title task__card__title">${bill_no}</h3>
                <p class="descriptions text-muted">${mobile_number}</p>
                <button type="button" class="btn btn-outline-${collected ? "secondary-emphasis": "primary" } btn-sm float-right" id="${id}" value=${collected} onclick="Collection(this)">${collected ? "Collected" : "Not Collected"}</button>
            </div>

        </div>
    </div>
`;

const loading = `
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="d-flex justify-content-center">
        <div class="alert alert-secondary-emphasis m-2" role="alert">
            Server restarting reload again ...
        </div>
    </div>
`

// State to tranfer data from permanent to temporary storage
const state = {
    bill_list : [],
};

// Bill data loader
const LoadInitialData = async () => {
    try {
        const localStorageCopy = await axios.get(`http://127.0.0.1:8000/api/bills/`)
        if(localStorageCopy != null) state.bill_list = localStorageCopy.data; 
    } catch (error) {
        taskContent.insertAdjacentHTML("beforeend",loading)
    }

    state.bill_list.map((bills) => {
        taskContent.insertAdjacentHTML("beforeend",htmlTaskContent(bills))
    })
}

// Submit the data to Django
const handleSubmit = async () => {
    const input = {
        bill_no: document.getElementById('Billno').value,
        mobile_number: document.getElementById('Mobileno').value
    }
    try{
        await axios.post(`http://127.0.0.1:8000/api/bills/`, input, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }catch(err){
        alert("Data is not Added.")
    }
}

// Reload when data is updated
window.addEventListener('load', LoadInitialData);

// Delete the bill
const DeleteTask = async (e) => {
    if(!e) e = window.event;
    // Calling the attribute name="${id}"
    const bill_id = e.target.getAttribute("name")
    let bill = state.bill_list.find(({ id }) => id === Number(bill_id))
    const confirmDelete = window.confirm(`${bill.bill_no} will not be recovered.`)
    
    if(confirmDelete){
        await axios.delete(`http://127.0.0.1:8000/api/bills/delete/${bill_id}`)
        
        // This is to check what tag is trigers 
        // Its explations
        // 1. We are Bounsing back to the main container [ class : task__content ]
        // 2. From that we say toh remove all the parent nodes associated with the child node i.e button
        // 3. we also did the same for the [ i : tag ] but 1 (.parentNode) was added
        // hence this will delete the card on the spot  
        const type = e.target.tagName;
        if(type === "BUTTON"){
            return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
                e.target.parentNode.parentNode.parentNode
            );
        }
        else{
            return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
                e.target.parentNode.parentNode.parentNode.parentNode
            );
        }
    }
};
// Delete end here

// Edit the Bill and mobile number 
const EditTask = (e) => {
    if(!e) e = window.event;
    const type = e.target.tagName

    let parentnode;
    let bill_No;
    let mobile_No;
    let SubmitButton;

    if(type === "BUTTON"){
        parentnode = e.target.parentNode.parentNode;
    }
    else{
        parentnode = e.target.parentNode.parentNode.parentNode;
    }

    // We are accessing the Tags By going back to the to parent node and then assecing ht echild node
    // NOTE : that the [ childNodes[3] ] []=> it only takes odd to access the desired tags
    bill_No = parentnode.childNodes[3].childNodes[1]
    mobile_No = parentnode.childNodes[3].childNodes[3]
    SubmitButton = parentnode.childNodes[3].childNodes[5]
    
    // Set attribute
    bill_No.setAttribute("contenteditable", "true")
    mobile_No.setAttribute("contenteditable", "true")
    SubmitButton.setAttribute('onclick', 'saveEdit()')
    SubmitButton.innerHTML = "Save Changes"
}

// Save changes 
const saveEdit = async (e) => {
    if(!e) e = window.event;

    const targetId = e.target.id

    const parentnode = e.target.parentNode;
    const bill_No = parentnode.childNodes[1]
    const mobile_No = parentnode.childNodes[3]
    const SubmitButton = parentnode.childNodes[5]
    
    // This will add the Changed data to the local and state Storage
    const updateData = {
        bill_no : bill_No.innerHTML,
        mobile_number : mobile_No.innerHTML,
    };

    try {
        await axios.patch(`http://127.0.0.1:8000/api/bills/edit/${targetId}`, updateData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        
    } catch (error) {
        alert(`${bill_No} is not updated.`)
    }

    bill_No.setAttribute("contenteditable", "false")
    mobile_No.setAttribute("contenteditable", "false")
    SubmitButton.setAttribute('onclick', 'collection(this)')
    SubmitButton.innerHTML = "Collected"
}
// Edit and save end here

// Search Bar for bill
const searchBar = (e) => {
    if(!e) e = window.event;
    
    while (taskContent.firstChild) {
        taskContent.removeChild(taskContent.firstChild);
    }

    const resultData = state.bill_list.filter(({ bill_no }) =>
        bill_no.toString().includes(e.target.value.toString())
    );

    resultData.map((bill) =>
        taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(bill))
    );
}
// search bar end here

// The Checkbox ogic to determine the bill taken or not
const Collection = (button) => {
    let isCollected = button.value === "true"
    let id = button.id

    isCollected = !isCollected

    if (isCollected){
        button.innerHTML = "Collected"
        button.setAttribute("class", "btn btn-outline-secondary-emphasis btn-sm float-right")
    } else {
        button.innerHTML = "Not Collected"
        button.setAttribute("class", "btn btn-outline-primary btn-sm float-right")
    }

    button.value = isCollected
    isCollectedUpdate(isCollected, id)
}

async function isCollectedUpdate(boolVal, id){
    const updateData = {
        collected: boolVal
    }
    try {
        await axios.patch(`http://127.0.0.1:8000/api/bills/edit/${id}`, updateData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    } catch (error) {
        alert(error)
    }
}
// Collection end here