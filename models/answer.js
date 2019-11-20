export class Answer {
  constructor(id, correct, text, solved = false) {
    this.id = id;
    this.correct = correct;
    this.text = text;
    this.solved = solved;
  }
}

// {id:'0',correct:true, text:'',}
