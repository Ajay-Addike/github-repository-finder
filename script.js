document.addEventListener("DOMContentLoaded", async () => {
  const programmingLanguages = await fetchProgrammingLanguages();
  const programmingLanguagesSelect = document.querySelector(
    "#programming-languages"
  );
  populateProgrammingLanguagesSelect(
    programmingLanguagesSelect,
    programmingLanguages
  );
  programmingLanguagesSelect.addEventListener("change", handleRequestStates);
});

async function fetchProgrammingLanguages() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );
    const programmingLanguages = await response.json();
    return programmingLanguages;
  } catch (error) {
    console.log(`Error fetching programming languages: ${error}`);
  }
}

async function fetchRepositories() {
  try {
    const response = await fetch("./data/repos.json"); // Fetch cached data
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error loading repositories:", error);
  }
}

async function handleRequestStates(event) {
  const programmingLanguagesSelect = document.querySelector(
    "#programming-languages"
  );
  const requestStatesDiv = document.querySelector("#request-state");
  
  let programmingLanguageSelected = event.currentTarget.value;

  if (requestStatesDiv.firstChild) {
    requestStatesDiv.innerHTML = "";
  }

  const requestStateText = document.createElement("p");
  requestStateText.textContent = "Loading, please wait...";
  requestStateText.classList.add("request-state-text");
  requestStatesDiv.classList.add("loading-state");
  requestStatesDiv.appendChild(requestStateText);

  fetchRandomRepository(programmingLanguageSelected, requestStatesDiv, requestStateText);
}

async function fetchRandomRepository(programmingLanguageSelected, requestStatesDiv, requestStateText) {
  try {
    const repositories = await fetchRepositories();
    const filteredRepos = repositories.filter(repo => repo.language === programmingLanguageSelected);

    if (filteredRepos.length === 0) {
      throw new Error("No repositories found for this language.");
    }

    const randomIndex = Math.floor(Math.random() * filteredRepos.length);
    const repo = filteredRepos[randomIndex];

    displayRandomRepository(
      requestStatesDiv,
      requestStateText,
      repo.html_url,
      repo.name,
      repo.description,
      repo.language,
      repo.stargazers_count,
      repo.forks,
      repo.open_issues_count
    );
  } catch (error) {
    console.log(`Error fetching repositories: ${error}`);
    displayErrorState(requestStatesDiv, requestStateText);
  }
}

function displayRandomRepository(requestStatesDiv, requestStateText, URL, name, description, language, stars, forks, openIssues) {
  requestStatesDiv.classList.remove("error-state");
  requestStatesDiv.classList.add("fulfilled-state");
  requestStatesDiv.removeChild(requestStateText);

  const repositoryAnchor = document.createElement("a");
  repositoryAnchor.classList.add("repository-url");
  repositoryAnchor.href = URL;
  repositoryAnchor.target = "_blank";
  repositoryAnchor.rel = "noopener noreferrer";

  const repositoryName = document.createElement("h2");
  repositoryName.classList.add("repository-name");
  repositoryName.textContent = name;

  repositoryAnchor.appendChild(repositoryName);

  const repositoryDescription = document.createElement("p");
  repositoryDescription.classList.add("repository-description");
  repositoryDescription.textContent = description;

  const repositoryStatsContainer = document.createElement("div");
  repositoryStatsContainer.classList.add("repository-stats");

  const statsHTML = `
    <div class="stats-with-icon-container">
      <p>Language: ${language}</p>
    </div>
    <div class="stats-with-icon-container">
      <p>⭐ Stars: ${stars}</p>
    </div>
    <div class="stats-with-icon-container">
      <p>🔀 Forks: ${forks}</p>
    </div>
    <div class="stats-with-icon-container">
      <p>🐞 Open Issues: ${openIssues}</p>
    </div>
  `;

  repositoryStatsContainer.innerHTML = statsHTML;
  requestStatesDiv.append(repositoryAnchor, repositoryDescription, repositoryStatsContainer);
}

function displayErrorState(requestStatesDiv, requestStateText) {
  requestStatesDiv.classList.add("error-state");
  requestStateText.textContent = "Error fetching repositories";
  requestStatesDiv.appendChild(requestStateText);
}
