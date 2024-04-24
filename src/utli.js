/**
 * Build a simple greeting message
 * @param {string} [message="hello"] - the message
 * @returns {string} the greeting message
 */
export function say_hello(message = "hello") {
  return `${message}, World!`;
}

/**
 * Create times str
 * @param {number} [count=1] - times
 * @param {string} [message="hi"] - message
 * @returns {string} the times message
 */
export function times_str(count = 1, message = "hi") {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += message;
  }
  return result;
}
