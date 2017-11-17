const localhostURL = 'http://localhost:3000'
const herokuURL = 'https://obscure-tundra-13055.herokuapp.com'
// const baseURL = localhostURL
const baseURL= window.location.href.includes('127.0.0.1') ? localhostURL : herokuURL

//dynamically populates students in dropdown
document.body.onload = popStudentDropdown
let dropDown = document.querySelector('#pickStudent')

function popStudentDropdown() {
  axios.get(`${baseURL}/students`)
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
  event.preventDefault()
  makeNewStudent()
  })


function makeNewStudent(){
  clearNotes()
  let newContainer = document.createElement('div')
  newContainer.classList.add('studentNote')
  let newStudentForm = document.createElement('form')
  let newstudentName = document.createElement('textarea')
  let newSubmitButton = document.createElement('button')
  let newTitle = document.createElement('h4')
  newTitle.innerHTML = 'Enter Student\'s Name'
  newSubmitButton.classList='btn bg-success btn-small flexCol'
  newSubmitButton.innerHTML = 'Create New Student'

  noteContainer.append(newContainer)
  newContainer.append(newTitle)
  newContainer.append( newStudentForm )
  newStudentForm.append(newstudentName)
  newStudentForm.append(newSubmitButton)
  newSubmitButton.addEventListener('click', event=>{
    event.preventDefault()
    submitStudent(newstudentName.value)

  })
}

function submitStudent(name){

  axios.post(`${baseURL}/students`,{name})
  .then(result=>{

    let newOption = document.createElement('option')
    newOption.innerHTML = result.data[0].name
    newOption.value = result.data[0].id
    dropDown.append(newOption)

    update(result.data[0].id)
  })
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

      let newLine = document.createElement('hr')


      newContainer.appendChild(commentTitle)
      newContainer.appendChild(comment)
      newContainer.appendChild(newLine)

      // newForm.prepend(comment)
      // newForm.prepend(commentTitle)






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

//create new note then display it
function createNote(id, currentNote) {
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

     axios.post(`${baseURL}/students/${id}`, {note:noteContent.value})
     .then(result=>{
       update(id)
     })
  })
}
//listens for new note btn click then invokes createNote()
let newNoteBtn = document.querySelector('#newNote')
newNoteBtn.addEventListener('click', event => {
  event.preventDefault()
  if(dropDown.value){
  createNote(dropDown.value)}

})





function editNote(note_id, content, editDelNoteDiv){
  clearNotes()
  let newTitle = document.createElement('h4')
  let newForm = document.createElement('form')
  let newContainer = document.createElement('div')
  let newComment = document.createElement('textarea')
  let newButton = document.createElement('button')
  newTitle.innerHTML='Edit Note'
  newComment.innerHTML=content

  newComment.classList.add('showAll')
  newContainer.classList.add('containerSize')

  newButton.classList.add('bg-success')
  newButton.classList.add('btn')
  newButton.classList.add('btn-large')
  newButton.classList.add('flexCol')
  newButton.innerHTML='Edit note'

  noteContainer.prepend(newContainer)
  newContainer.appendChild(newForm)
  newForm.appendChild(newTitle)
  newForm.appendChild(newComment)


  newForm.appendChild(newButton)
  newComment.focus()
$(newComment).height( $(newComment)[0].scrollHeight)

  newButton.addEventListener('click', event=>{
    event.preventDefault()
    content=newComment.value

    axios.put(`${baseURL}/notes/${note_id}`, {content})
    .then(note=>{
      update(dropDown.value)

    })
  })




}



//populates student's notes
function update(id) {
  var noteContent = document.querySelector('#noteContent')
  var noteTitle = document.querySelector('#noteTitle')
  //gets all of one student's notes

  return axios.get(`${baseURL}/students/${id}`)
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
        let newEdit = document.createElement('a')
        let newLine = document.createElement('hr')
        let commentBtn = document.createElement('button')
        let newButton = document.createElement('button')
        let editDelNoteDiv = document.createElement('div')
        newEdit.innerHTML= 'Edit Note'
        newComment.placeholder='Comment'
        newForm.name=`#${el.id}`


        newButton.type='submit'
        newButton.classList.add('bg-success')
        newButton.classList.add('btn')
        newButton.classList.add('btn-large')
        newButton.classList.add('flexCol')
        newButton.classList.add('commentBtn')
        // newButton.classList.add('float-right')
        newButton.classList.add('newComment')

        // newButton.style.display='none'

        commentBtn.classList='bg-success btn btn-small flexCol'

        newTitle.classList.add('noteTitle')
        newContent.classList.add('contentColor')

        newEdit.href='#'
        newEdit.classList.add('editNote')
        newEdit.classList.add('padDown')


        newDeleteNote.innerHTML ='Delete Note'
        newDeleteNote.role='button'
        newDeleteNote.classList='btn btn-small bg-success marginDown'
        newDeleteNote.addEventListener('click', event=>{
          event.preventDefault()
          deleteNote(el.id)
        })

        // newDeleteComment.classList.add('float-right')

        newButton.id=`submit-${el.id}`
        newDeleteNote.id=`edit-${el.id}`
        newButton.innerHTML='Submit'
        newButton.classList.add('marginDown')

        newContainer.classList.add('studentNote')
        newContainer.classList.add('displayMe')
        newContainer.classList.add('containerSize')

        noteContainer.prepend(newContainer)
        newContainer.appendChild(newTitle)
        newContainer.appendChild(newContent)
        newContainer.appendChild(newLine)

        addComments(el.id, newForm, newContainer)

        newContainer.appendChild(newForm)
        newForm.appendChild(newComment)
        newForm.appendChild(newButton)
        newForm.appendChild(newEdit)
        newForm.appendChild(newDeleteNote)


        //moment.js formats dates and times from a timestamp
        let date = moment(el.created_at).format('LL')
        newContent.textContent = el.content
        newTitle.textContent = date

        newEdit.addEventListener('click', event=>{
          content=el.content
          event.preventDefault()
          editNote(`${el.id}`, content, editDelNoteDiv)
        })


        newForm.appendChild(editDelNoteDiv)
        editDelNoteDiv.appendChild(newEdit)

      })
      addListenersToCommentButtons(notes.data)
    })

}
//listener for update student notes
dropDown.addEventListener('change', event => {
  update(dropDown.value)
})


function destroyComments(note_id){
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
