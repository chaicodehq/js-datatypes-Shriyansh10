/**
 * 📝 School Report Card Generator
 *
 * Sharma ji ke bete ka report card generate karna hai! Student ka naam aur
 * subjects ke marks milenge, tujhe pura analysis karke report card banana hai.
 *
 * Rules:
 *   - student object: { name: "Rahul", marks: { maths: 85, science: 92, ... } }
 *   - Calculate using Object.values() and array methods:
 *     - totalMarks: sum of all marks (use reduce)
 *     - percentage: (totalMarks / (numSubjects * 100)) * 100,
 *       rounded to 2 decimal places using parseFloat(val.toFixed(2))
 *     - grade based on percentage:
 *       "A+" (>= 90), "A" (>= 80), "B" (>= 70), "C" (>= 60), "D" (>= 40), "F" (< 40)
 *     - highestSubject: subject name with highest marks (use Object.entries)
 *     - lowestSubject: subject name with lowest marks
 *     - passedSubjects: array of subject names where marks >= 40 (use filter)
 *     - failedSubjects: array of subject names where marks < 40
 *     - subjectCount: total number of subjects (Object.keys().length)
 *   - Hint: Use Object.keys(), Object.values(), Object.entries(),
 *     reduce(), filter(), map(), Math.max(), Math.min(), toFixed()
 *
 * Validation:
 *   - Agar student object nahi hai ya null hai, return null
 *   - Agar student.name string nahi hai ya empty hai, return null
 *   - Agar student.marks object nahi hai ya empty hai (no keys), return null
 *   - Agar koi mark valid number nahi hai (not between 0 and 100 inclusive),
 *     return null
 *
 * @param {{ name: string, marks: Object<string, number> }} student
 * @returns {{ name: string, totalMarks: number, percentage: number, grade: string, highestSubject: string, lowestSubject: string, passedSubjects: string[], failedSubjects: string[], subjectCount: number } | null}
 *
 * @example
 *   generateReportCard({ name: "Rahul", marks: { maths: 85, science: 92, english: 78 } })
 *   // => { name: "Rahul", totalMarks: 255, percentage: 85, grade: "A",
 *   //      highestSubject: "science", lowestSubject: "english",
 *   //      passedSubjects: ["maths", "science", "english"], failedSubjects: [],
 *   //      subjectCount: 3 }
 *
 *   generateReportCard({ name: "Priya", marks: { maths: 35, science: 28 } })
 *   // => { name: "Priya", totalMarks: 63, percentage: 31.5, grade: "F", ... }
 */
export function generateReportCard(student) {
  // Your code here
  if(student===null || typeof student!='object' || Array.isArray(student) || typeof student.name !='string' || student.name.length==0 || student.marks===null || typeof student.marks!='object' || Array.isArray(student.marks) || Object.keys(student.marks).length==0 ) return null
  for(let i of Object.values(student.marks)){
    if(Number.isNaN(Number(i)) || i<0 || i>100) return null
  }
  
  let subjects = Object.entries(student.marks);
  let totalSubjects = Object.values(student.marks).length;
  let totalMarks = Object.values(student.marks).reduce((acc, mark) => (acc+mark), 0);
  let percentage = parseFloat(((totalMarks/(totalSubjects*100))*100).toFixed(2));
  const highest = {
    subject: '',
    marks: -Infinity
  }
  const lowest = {
    subject: '',
    marks: Infinity
  }
  subjects.map((sub)=> {
    if(highest.marks<sub[1]) {
      highest.subject = sub[0];
      highest.marks = sub[1];
    }
  })
  subjects.map((sub)=> {
    if(lowest.marks>sub[1]) {
      lowest.subject = sub[0];
      lowest.marks = sub[1];
    }
  })
  let passedSubjects = subjects.filter((sub) => sub[1]>=40)
  let failedSubjects = subjects.filter((sub) => sub[1]<40)
  let grade;
  if(percentage>=90) grade = 'A+'
  else if(percentage>=80) grade = 'A'
  else if(percentage>=70) grade = 'B'
  else if(percentage>=60) grade = 'C'
  else if(percentage>=40) grade = 'D'
  else grade = 'F'
  return { name: student.name, totalMarks, percentage, grade, highestSubject: highest.subject, lowestSubject: lowest.subject, passedSubjects: Array.from(passedSubjects.map((sub)=> sub[0])), failedSubjects: Array.from(failedSubjects.map((sub)=> sub[0])), subjectCount: totalSubjects }
}

