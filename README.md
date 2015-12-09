GraphQL Fun!

This app stores school data. Using schemas for instructors, students, courses, and grades, you can gather data from GraphIQL on combinations that make sense. You can also filter your searches GraphIQL is the best!

Heroku Link:

https://peaceful-tundra-6038.herokuapp.com/graphql

Example:

This query:

query {
  students(filter: "Nick") {
    fullName,
    level,
    courses {
      name,
      grade {
        grade,
        student {
          gender
        }
      },
      instructor {
        lastName
      }
    }
  }
}

will give you:

{
  "data": {
    "students": [
      {
        "fullName": "Nick Yam",
        "level": "Freshman",
        "courses": [
          {
            "name": "Math",
            "grade": {
              "grade": "A",
              "student": {
                "gender": "M"
              }
            },
            "instructor": {
              "lastName": "Cury"
            }
          },
          {
            "name": "Engish",
            "grade": {
              "grade": "A",
              "student": {
                "gender": "M"
              }
            },
            "instructor": {
              "lastName": "Cury"
            }
          }
        ]
      }
    ]
  }
}