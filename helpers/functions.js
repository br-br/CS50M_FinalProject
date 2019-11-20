export const shuffle = array => {
  let result = [...array];
  let tmp,
    current,
    top = array.length;

  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = result[current];
      result[current] = result[top];
      result[top] = tmp;
    }

  return result;
};
export const shuffleInPlace = array => {
  let tmp,
    current,
    top = array.length;

  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
  return array;
};
