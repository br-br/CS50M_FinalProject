class Quiz {
  constructor(id, owner, title, description, questions = []) {
    this.id = id;
    this.owner = owner;
    this.title = title;
    this.description = description;
    this.questions = questions;
  }
}
export default Quiz;
