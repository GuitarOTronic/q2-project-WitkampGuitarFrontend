const localhostURL = 'http://localhost:3000/notes'
const herokuURL = 'https://ajax-blog-api.herokuapp.com/posts'
const baseURL = window.location.href.includes('127.0.0.1') ? localhostURL : herokuURL

//dynamically populates students in dropdown
document.body.onload = popStudentDropdown
let dropDown = document.querySelector('#pickStudent')

function popStudentDropdown() {
  axios.get(`${baseURL}/student`)
    .then(result => {
      result.data.forEach(el => {
        let newOption = document.createElement('option')
        newOption.innerHTML = el.name
        newOption.value = el.id
        dropDown.append(newOption)

      })
    }).catch(error => {
      console.log(error);
    })
}

// function getAll() {
//   return axios.get(`${baseURL}`).then(result => {
//     // console.log(result);
//   })
// }

let allNotes = document.querySelector('#allNotes')
let noteContainer = document.querySelector('#noteContainer')
//clears notes
function clearNotes() {
  while (noteContainer.hasChildNodes()) {
    noteContainer.removeChild(noteContainer.lastChild)
  }
}

//adds event listeners to all comment submit buttons
function addListenersToCommentButtons(studentNotes){
  let commentBtns = document.querySelectorAll('.commentBtn')
  commentBtns.forEach(el=>{
    el.addEventListener('click', event =>{
      event.preventDefault()
      let formText = event.target.parentNode.children[0].value
      console.log(studentNotes);
      let student_id=dropDown.value

      // let noteId=
      submitComment(studentNotes)
      console.log('Yay you clicked me!!');
    })
  })
}


function submitComment(studentNotes){
  // console.log(studentNotes);
  // console.log(studentNotes[0].student_id);
  // let studentID=
  // axios.post(`${baseURL}/student/${id}`, {comment:})
}


//populates student's notes
function update(id) {
  var noteContent = document.querySelector('#noteContent')
  var noteTitle = document.querySelector('#noteTitle')
  //gets all of one student's notes
  return axios.get(`${baseURL}/student/${id}`)
    .then((result) => {
      clearNotes()
      //for each note for this student create a new div, p, textarea and h4
      //then add the date and content for that note in the p and h4
      result.data.forEach(el => {
        console.log(el.id);
        let newTitle = document.createElement('h4')
        let newForm = document.createElement('form')
        let newContent = document.createElement('p')
        let newContainer = document.createElement('div')
        let newComment = document.createElement('textarea')
        newComment.id=`@${el.id}`
        newComment.placeholder='Comment'

        let newButton = document.createElement('button')
        newButton.type='submit'
        newButton.classList.add('bg-success')
        newButton.classList.add('btn')
        newButton.classList.add('btn-large')
        newButton.classList.add('flexCol')
        newButton.classList.add('commentBtn')
        newButton.innerHTML='Submit'
        newContainer.classList.add('studentNote')
        newContainer.classList.add('displayMe')

        noteContainer.prepend(newContainer)
        newContainer.appendChild(newTitle)
        newContainer.appendChild(newContent)

        newContainer.appendChild(newForm)
        newForm.appendChild(newComment)
        newForm.appendChild(newButton)


        //moment.js formats dates and times from a timestamp
        let date = moment(el.created_at).format('LL')
        newContent.textContent = el.content
        newTitle.textContent = date

      })
      addListenersToCommentButtons(result.data)
    })

}
//listener for update student notes
dropDown.addEventListener('change', event => {
  update(dropDown.value)
})


//create new note then display it
function createNote(id) {
  //hide shown notes
  let displayedNotes = document.querySelectorAll('.displayMe')
  displayedNotes.forEach(el => {
    el.style.display = 'none'
  })

  let newStudentNote = noteTemplate()
  noteContainer.innerHTML = newStudentNote
  let makeNoteBtn = document.querySelector('#makeNoteBtn')

  makeNoteBtn.addEventListener('click', event=>{
    event.preventDefault()
    let noteContent = document.querySelector('#content')

     axios.post(`${baseURL}/student/${id}`, {note:noteContent.value})
     .then(result=>{
       update(id)
     })
  })
}
//listens for new note btn click then invokes createNote()
let newNoteBtn = document.querySelector('#newNote')
newNoteBtn.addEventListener('click', event => {
  event.preventDefault()
  // console.log(dropDown.value);
  if(dropDown.value){
  createNote(dropDown.value)}

})
