document.addEventListener("DOMContentLoaded", async () => {
  const programmingLanguages = await fetchProgrammingLanguages();
  const programmingLanguagesSelect = document.querySelector("#programming-languages");
  
  populateProgrammingLanguagesSelect(programmingLanguagesSelect, programmingLanguages);
  programmingLanguagesSelect.addEventListener("change", handleRequestStates);
});

async function fetchProgrammingLanguages() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );
    return await response.json();
  } catch (error) {
    console.log(`Error fetching programming languages: ${error}`);
  }
}

function populateProgrammingLanguagesSelect(selectElement, languages) {
  languages.forEach(language => {
    const option = document.createElement("option");
    option.value = language.value;
    option.textContent = language.title;
    selectElement.appendChild(option);
  });
}

async function handleRequestStates(event) {
  const programmingLanguageSelected = event.currentTarget.value;
  const requestStatesDiv = document.querySelector("#request-state");

  requestStatesDiv.innerHTML = `<p class="request-state-text">Loading, please wait...</p>`;
  requestStatesDiv.classList.add("loading-state");

  fetchRandomRepository(programmingLanguageSelected, requestStatesDiv);
}

async function fetchRandomRepository(programmingLanguageSelected, requestStatesDiv) {
  try {
    const response = await fetch(
      `https://github-repository-finder-main-9q1f1ewn2-ajay-addikes-projects.vercel.app/api/github?language=${programmingLanguageSelected}`
    );

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const data = await response.json();
    const repositories = data.items;

    if (!repositories.length) throw new Error("No repositories found.");

    const randomIndex = Math.floor(Math.random() * repositories.length);
    const repo = repositories[randomIndex];

    displayRepository(requestStatesDiv, repo);
  } catch (error) {
    console.log(`Error fetching repositories: ${error}`);
    requestStatesDiv.innerHTML = `<p class="request-state-text">Error fetching repositories</p>`;
  }
}

function displayRepository(container, repo) {
  container.innerHTML = `
    <a href="${repo.html_url}" target="_blank" class="repository-url">
      <h2 class="repository-name">${repo.name}</h2>
    </a>
    <p class="repository-description">${repo.description || "No description available."}</p>
    <div class="repository-stats">
      <p>🌐 Language: ${repo.language || "N/A"}</p>
      <p>⭐ Stars: ${repo.stargazers_count}</p>
      <p>🍴 Forks: ${repo.forks}</p>
      <p>🐛 Open Issues: ${repo.open_issues_count}</p>
    </div>
  `;
}
