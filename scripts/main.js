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
let newStudentBtn = document.querySelector('#NewStudent')
newStudentBtn.addEventListener('click', event=>{
  makeNewStudent()
  })


function makeNewStudent(){
  clearNotes()
  let newContainer = document.createElement('div')
  newContainer.classList.add('studentNote')
  let newStudentForm = document.createElement('form')
  let newstudentName = document.createElement('textarea')
  let newSubmitButton = document.createElement('button')
  newSubmitButton.classList='btn bg-success btn-small flexCol'
  newSubmitButton.innerHTML = 'Create New Student'
  // newButton.classList.add('bg-success')
  // newButton.classList.add('btn')
  // newButton.classList.add('btn-large')
  // newButton.classList.add('flexCol'

  noteContainer.append(newContainer)
  newContainer.append( newStudentForm )
  newStudentForm.append(newstudentName)
  newStudentForm.append(newSubmitButton)
}


var allNotes = document.querySelector('#allNotes')
var noteContainer = document.querySelector('#noteContainer')

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
      let student_id=parseInt(dropDown.value)
      let noteId = parseInt(event.target.id.split('-')[1])
      submitComment(noteId, student_id, formText)

    })
  })
}

function addComments(note_id, newForm, newContainer){
  axios.get(`${baseURL}/comments/${note_id}`)
  .then(result=>{
    result.data.forEach(el=>{
      let date = moment(el.created_at).format('LL')

      let commentTitle = document.createElement('h6')
      commentTitle.innerHTML=date
      commentTitle.classList.add(`comment-${note_id}`)
      commentTitle.classList.add('commentTitle')

      let comment = document.createElement('p')
      comment.innerHTML = el.comment
      comment.classList.add(`comment-${note_id}`)
      comment.classList.add('contentColor')

      newContainer.appendChild(commentTitle)
      newContainer.appendChild(comment)

      // newForm.prepend(comment)
      // newForm.prepend(commentTitle)

      console.log(comment);




    })
    // console.log(result.data);

  })
}

function submitComment(noteId, student_id, formText){

  axios.post(`${baseURL}/comments`, {note_id:noteId, student_id:student_id, comment:formText,})
  .then(result=>{
    clearNotes()
    update(student_id)

  })
}

function getNote(note_id){

  return axios.get(`${baseURL}/notes/${note_id}`)
  .then(note=>{
    console.log(note.data.result[0].content);
    clearNotes()
    let newContent = document.createElement('p')
    let newContainer = document.createElement('div')
    newContent.innerHTML=note.data.result[0].content
    //this one
    noteContainer.append(newContainer)
    newContainer.appendChild(newContent)
    newContainer.classList.add('studentNote')
    newContainer.classList.add('displayMe')

  })
}

//populates student's notes
function update(id) {
  var noteContent = document.querySelector('#noteContent')
  var noteTitle = document.querySelector('#noteTitle')
  //gets all of one student's notes

  return axios.get(`${baseURL}/student/${id}`)
    .then((notes) => {
      clearNotes()
      //for each note for this student create a new div, p, textarea and h4
      //then add the date and content for that note in the p and h4
      notes.data.forEach((el) => {

        let newTitle = document.createElement('h4')
        let newForm = document.createElement('form')
        let newContent = document.createElement('p')
        let newContainer = document.createElement('div')
        let newComment = document.createElement('textarea')
        let newDeleteNote = document.createElement('button')

        newComment.placeholder='Comment'
        newForm.name=`#${el.id}`


        let newButton = document.createElement('button')
        newButton.type='submit'
        newButton.classList.add('bg-success')
        newButton.classList.add('btn')
        newButton.classList.add('btn-large')
        newButton.classList.add('flexCol')
        newButton.classList.add('commentBtn')
        // newButton.classList.add('float-left')

        newTitle.classList.add('noteTitle')
        newContent.classList.add('contentColor')

        newDeleteNote.innerHTML ='Delete Note'
        // newDeleteNote.href=`#${el.id}`


        newDeleteNote.role='button'
        newDeleteNote.classList='btn btn-small '
        newDeleteNote.addEventListener('click', event=>{
          event.preventDefault()
          // deleteComment(1, newForm, noteContainer)
          deleteNote(el.id)
        })




        // newDeleteComment.classList.add('float-right')

        newButton.id=`submit-${el.id}`
        newDeleteNote.id=`edit-${el.id}`
        newButton.innerHTML='Submit'
        newContainer.classList.add('studentNote')
        newContainer.classList.add('displayMe')

        noteContainer.prepend(newContainer)
        newContainer.appendChild(newTitle)
        newContainer.appendChild(newContent)

        addComments(el.id, newForm, newContainer)

        newContainer.appendChild(newForm)
        newForm.appendChild(newComment)
        newForm.appendChild(newButton)
        newForm.appendChild(newDeleteNote)


        //moment.js formats dates and times from a timestamp
        let date = moment(el.created_at).format('LL')
        newContent.textContent = el.content
        newTitle.textContent = date



      })
      addListenersToCommentButtons(notes.data)
    })

}
//listener for update student notes
dropDown.addEventListener('change', event => {
  update(dropDown.value)
})


function destroyComments(note_id){
  console.log('hello');
  return axios.delete(`${baseURL}/comments/${note_id}`)
}

function deleteNote(note_id){
  // console.log(noteId);
  return axios.delete(`${baseURL}/notes/${note_id}`)
  .then(result=>{
    destroyComments(note_id)
    update(dropDown.value)
  })
}



// function deleteComment(id, form, noteContainer){
//     getNote(id)
//     clearNotes()
//
//     // noteContainer.append(form)
//     // newContainer.append(form)
// }

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
