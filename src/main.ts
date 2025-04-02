// Definierar strukturen med interface
interface CourseInfo {
  code: string;
  coursename: string;
  progression: "A" | "B" | "C";
  syllabus: string;
}

// Hämta DOM-element och typa korrekt
const courseForm = document.getElementById("courseForm") as HTMLFormElement;
const courseList = document.getElementById("courseList") as HTMLUListElement;

// Definierar en lista av kurser
let courses: CourseInfo[] = [];

// Funktion för att ladda kurser från API
async function loadCourses(): Promise<void> {
  try {
      const response = await fetch("https://webbutveckling.miun.se/files/ramschema_ht24.json");

      if (!response.ok) {
          throw new Error("Fel vid anslutning till JSON-data...");
      }

      console.log("Svar från API:", response);

      // Försök att parsa JSON-datan och spara den i kurser
      const data: CourseInfo[] = await response.json();

      // Sätt kurserna till det hämtade resultatet
      courses = data;

      // Rendera kurser på sidan
      renderCourses();

  } catch (error) {
      console.error(error);
  }
}

// Funktion för att rendera kurser i listan
function renderCourses(): void {
  courseList.innerHTML = ""; // Rensa listan först

  courses.forEach(course => {
      const listItem = document.createElement("li");
      listItem.textContent = `${course.code} - ${course.coursename} (${course.progression})`;
            // Skapa en länk till kursplanen
            const syllabusLink = document.createElement("a");
            syllabusLink.href = course.syllabus;
            syllabusLink.textContent = "[Kursplan]";
            syllabusLink.target = "_blank"; // Öppna i ny flik
      
            // Lägg till länken i listan
            listItem.appendChild(syllabusLink);
      
            courseList.appendChild(listItem);
  });
}

// Ladda kurser när sidan laddas
loadCourses();

