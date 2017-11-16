function noteTemplate() {

  return `
  <div class='row marginUp'>
    <div class="col ">
      <h4 id='noteTitle'>New Note</h4>
      <form id='formNewNote'>

        <label for='content'>Notes</label>
        <textarea type='text' id='content' rows='5' placeholder="Notes"></textarea>
        <button type="submit" id='makeNoteBtn' class="btn btn-large bg-success">Make Note</button>
      </form>

    </div>
  </div>
  `

}
