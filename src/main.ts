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

const codeInput = document.getElementById("code") as HTMLInputElement;
const nameInput = document.getElementById("coursename") as HTMLInputElement;
const progressionInput = document.getElementById("progression") as HTMLSelectElement;
const syllabusInput = document.getElementById("syllabus") as HTMLInputElement;

// Definierar en lista av kurser
let courses: CourseInfo[] = [];

/**
 * Ladda kurser från localStorage vid start
 */
function loadCoursesFromLocalStorage(): void {
  const storedCourses = localStorage.getItem("courses");
  if (storedCourses) {
    courses = JSON.parse(storedCourses);
    renderCourses();
  }
}

/**
 * Spara kurser till localStorage
 */
function saveCoursesToLocalStorage(): void {
  localStorage.setItem("courses", JSON.stringify(courses));
}

/**
 * Ladda kurser från API och localStorage
 */
async function loadCourses(): Promise<void> {
  try {
    const response = await fetch("https://webbutveckling.miun.se/files/ramschema_ht24.json");

    if (!response.ok) {
      throw new Error("Fel vid anslutning till JSON-data...");
    }

    const apiCourses: CourseInfo[] = await response.json();

    // Lägg till API-kurser som inte redan finns i localStorage
    apiCourses.forEach((course) => {
      if (!courses.some((c) => c.code === course.code)) {
        courses.push(course);
      }
    });

    saveCoursesToLocalStorage();
    renderCourses();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Rendera kurser i listan
 */
function renderCourses(): void {
  courseList.innerHTML = ""; // Rensa listan först

  courses.forEach((course) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${course.code} - ${course.coursename} (${course.progression}) `;

    // Skapa en länk till kursplanen
    const syllabusLink = document.createElement("a");
    syllabusLink.href = course.syllabus;
    syllabusLink.textContent = "[Kursplan]";
    syllabusLink.target = "_blank"; // Öppna i ny flik

    // Skapa en radera-knapp
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Radera";
    deleteButton.classList.add("delete-button"); // Lägg till en CSS-klass
    deleteButton.addEventListener("click", () => removeCourse(course.code));

    // Lägg till länken och knappen i listan
    listItem.appendChild(syllabusLink);
    listItem.appendChild(deleteButton);
    courseList.appendChild(listItem);
  });
}

/**
 * Lägga till en ny kurs från formuläret
 */
function addCourse(event: Event): void {
  event.preventDefault();

  const newCourse: CourseInfo = {
    code: codeInput.value.trim(),
    coursename: nameInput.value.trim(),
    progression: progressionInput.value as "A" | "B" | "C",
    syllabus: syllabusInput.value.trim(),
  };

  // Validera att kurskoden är unik
  if (courses.some((course) => course.code === newCourse.code)) {
    alert("Kurskoden finns redan! Ange en unik kod.");
    return;
  }

  // Validera att progressionen är korrekt, extra säkerhet trots att html-koden är dropdown-meny med endast a, b och c
  if (!["A", "B", "C"].includes(newCourse.progression)) {
    alert("Ogiltig progression! Måste vara A, B eller C.");
    return;
  }

  // Lägg till kurs och uppdatera
  courses.push(newCourse);
  saveCoursesToLocalStorage();
  renderCourses();

  // Nollställ formuläret
  courseForm.reset();
}

/**
 * Ta bort en kurs baserat på kurskoden
 */
function removeCourse(code: string): void {
  courses = courses.filter((course) => course.code !== code);
  saveCoursesToLocalStorage();
  renderCourses();
}

// Event listener för formuläret
courseForm.addEventListener("submit", addCourse);

// Ladda kurser från localStorage och API när sidan laddas
loadCoursesFromLocalStorage();
loadCourses();
