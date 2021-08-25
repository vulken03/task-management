//@ts-check
const { add, multiply } = require("./calculator");
/**
 * Student Name
 * @type {string}
 */
const studentName = "john-doe";

/**
 * Array of grades
 * @type {Array<number>}
 */
const grades = [1, 2, 3, 4];

/**
 * TODO object
 * @type {{id:number,name:string}}
 */

//id is number or string
const todo = {
  id: 1,
  name: "Play cricket",
};

/**
 * function of calculate tax
 * @param {number} amount -total amount
 * @param {number} tax -total percentage
 * @returns {string} -calculation of tax
 */
const calculateTax = (amount, tax) => {
  return `${amount + amount * tax}`;
};

console.log(calculateTax(120, 25));

/**
 * A student
 * @typedef {Object} Student
 * @property {number} id -student ID
 * @property {string} name -student name
 * @property {number|string} [age] -student age(optional)
 * @property {boolean} isActive -Student is Active
 */

/**
 * @type {Student}
 */

const student = {
  id: 1,
  name: "Viraj",
  age: 21,
  isActive: true,
};

/**
 * class to create person Information
 */

class person {
  /**
   * personInfo object
   * @param {Object} personInfo -Object of person information
   */
  constructor(personInfo) {
    /**
     *person name
     *@property {string} name -name of person
     */

    this.name = personInfo.name;
    /**
     *person age
     *@property {number|string} age -age of person
     */
    this.age = personInfo.age;
  }
  /**
   * greet function
   *@property {Function} greet -A greeting with the name and age
   *@returns void
   */

  greet() {
    console.log(`hello my name is ${this.name} and I am ${this.age} year old.`);
  }
}

/**
 * See {@link person}
 */
const person1 = new person({
  name: "Viraj",
  age: 21,
});
// console.log(person1.greet());

console.log(add(20, 30));
console.log(multiply(20, 30));

