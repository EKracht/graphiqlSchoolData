import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

let schoolData = {
  instructors: [
    {_id:1, firstName:'Dana', lastName:'Cury', age:25, gender:'F'},
    {_id:2, firstName:'Steve', lastName:'Clawson', age:34, gender:'M'},
    {_id:3, firstName:'Greg', lastName:'Manich', age:38, gender:'M'},
    {_id:4, firstName:'Loid', lastName:'Green', age:22, gender:'M'},
    {_id:5, firstName:'Jessica', lastName:'knees', age:55, gender:'F'},
    {_id:6, firstName:'Anna', lastName:'Henderson', age:22, gender:'F'}
  ],
  students: [
    {_id:111, firstName:'Nick', lastName:'Yam', age:12, gender:'M', level:'Freshman'},
    {_id:222, firstName:'Elsa', lastName:'Yumer', age:14, gender:'F', level:'Sophomore'},
    {_id:333, firstName:'Owen', lastName:'Poper', age:11, gender:'M', level:'Senior'},
    {_id:444, firstName:'Jesse', lastName:'Green', age:10, gender:'M', level:'Juinor'},
    {_id:555, firstName:'Bob', lastName:'Ill', age:13, gender:'M', level:'Senior'},
    {_id:666, firstName:'Kim', lastName:'Henderson', age:12, gender:'F', level:'Freshman'}
  ],
  courses: [
    {_id:11, name:'Math', instructor:1, student: 111},
    {_id:22, name:'Engish', instructor:2, student: 111},
    {_id:33, name:'Physics', instructor:3, student: 222},
    {_id:44, name:'Health', instructor:4, student: 222},
    {_id:55, name:'Gym', instructor:5, student: 333},
    {_id:66, name:'History', instructor:6, student: 444}
  ],
  grades: [
    {_id:10, student:111, course:11, grade:'A'},
    {_id:20, student:111, course:22, grade:'B'},
    {_id:30, student:222, course:33, grade:'F'},
    {_id:40, student:222, course:44, grade:'C'},
    {_id:50, student:333, course:55, grade:'A'},
    {_id:60, student:444, course:66, grade:'D'}
  ]
}

let instructorType = new GraphQLObjectType({
  name: 'Instructor',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    fullName: {
      type: GraphQLString,
      resolve: ({firstName, lastName}) => `${firstName} ${lastName}`
    },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    courses: { 
      type: courseType,
      resolve: ({_id}) => {
        for (let i = 0; i < schoolData.courses.length; i++) {
          if (schoolData.courses[i].instructor = _id) {
            return schoolData.courses[i];
          }
        }     
      }
    }
  })
});

let studentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    fullName: {
      type: GraphQLString,
      resolve: ({firstName, lastName}) => `${firstName} ${lastName}`
    },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    level: { type: GraphQLString },
    grades: {
      type: new GraphQLList(gradeType),
      resolve: ({_id}) => {
        let studentGrades = [];
        for (let i = 0; i < schoolData.grades.length; i++) {
          if (schoolData.grades[i].student == _id) {
            studentGrades.push(schoolData.grades[i]);
          }
        }
        return studentGrades;
      }
    },
    courses: {
      type: new GraphQLList(courseType),
      resolve: ({_id}) => {
        let studentCourses = [];
        for (let i = 0; i < schoolData.courses.length; i++) {
          if (schoolData.courses[i].student == _id) {
            studentCourses.push(schoolData.courses[i]);
          }
        }
        return studentCourses;
      }
    }
  })
});

let courseType = new GraphQLObjectType({
  name: 'Course',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    instructor: {
      type: instructorType,
      resolve: ({instructor}) => {
        for (let i = 0; i < schoolData.instructors.length; i++) {
          if (schoolData.instructors[i]._id = instructor) {
            return schoolData.instructors[i];
          }
        }
        return null;
      }
    },
    grade: {
      type: gradeType,
      resolve: ({_id}) => {
        for (let i = 0; i < schoolData.grades.length; i++) {
          if (schoolData.grades[i].course = _id) {
            return schoolData.grades[i];
          }
        }
        return null;
      }
    }
  })
});

let gradeType = new GraphQLObjectType({
  name: 'Grade',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    student: {
      type: new GraphQLNonNull(studentType),
      resolve: ({student}) => {
        for (let i = 0; i < schoolData.students.length; i++) {
          if (schoolData.students[i]._id = student) {
            return schoolData.students[i];
          }
        }
        return null;
      }
    },
    course: {
      type: courseType,
      resolve: ({course}) => {
        for (let i = 0; i < schoolData.courses.length; i++) {
          if (schoolData.courses[i]._id = course) {
            return schoolData.courses[i];
          }
        }
        return null;
      }
    },
    grade: { type: GraphQLString }
  })
});

let schoolSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      instructors: {
        type: new GraphQLList(instructorType),
        args: {
          filter: { type: GraphQLString }
        },
        resolve: (_, {filter}) => {
          if (filter) {
            var results = [];
            for (let i = 0; i < schoolData.instructors.length; i++) {
              if (schoolData.instructors[i].firstName == filter || schoolData.instructors[i].lastName == filter) {
                results.push(schoolData.instructors[i]); 
              }
            }
            return results;
          } else {
            return schoolData.instructors;
          }
        }
      },
      students: {
        type: new GraphQLList(studentType),
        args: {
          filter: { type: GraphQLString }
        },
        resolve: (_, {filter}) => {
          if (filter) {
            var results = [];
            for (let i = 0; i < schoolData.students.length; i++) {
              if (schoolData.students[i].firstName == filter || schoolData.students[i].lastName == filter) {
                results.push(schoolData.students[i]); 
              }
            }
            return results;
          } else {
            return schoolData.students;
          }
        }
      },
      courses: {
        type: new GraphQLList(courseType),
        resolve: (_, {filter}) => {
          if (filter) {
            var results = [];
            for (let i = 0; i < schoolData.courses.length; i++) {
              if (schoolData.courses[i][name] == filter) {
                results.push(schoolData.courses[i]); 
              }
            }
            return results;
          } else {
            return schoolData.courses;
          }
        },      
      },
      grades: {
        type: new GraphQLList(gradeType),
        resolve: () => schoolData.grades
      }
    })
  })
});

export default schoolSchema;