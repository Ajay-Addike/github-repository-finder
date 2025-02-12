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

function populateProgrammingLanguagesSelect(
  programmingLanguagesSelect,
  programmingLanguages
) {
  programmingLanguages.forEach((programmingLanguage) => {
    const option = document.createElement("option");
    option.value = programmingLanguage.value;
    option.textContent = programmingLanguage.title;

    programmingLanguagesSelect.appendChild(option);
  });
}

const handleRequestStates = async (event) => {
  const programmingLanguagesSelect = document.querySelector(
    "#programming-languages"
  );

  let programmingLanguageSelected = "";

  const requestStatesDiv = document.querySelector("#request-state");

  const fulFilledState = requestStatesDiv.childElementCount > 1;

  if (fulFilledState) {
    while (requestStatesDiv.firstChild) {
      requestStatesDiv.removeChild(requestStatesDiv.firstChild);
    }
    programmingLanguageSelected = programmingLanguagesSelect.value;
  } else {
    programmingLanguagesSelect.removeChild(
      programmingLanguagesSelect.firstElementChild
    );
    programmingLanguageSelected = event.currentTarget.value;
    requestStatesDiv.removeChild(requestStatesDiv.firstElementChild);
  }

  const requestStateText = document.createElement("p");
  requestStateText.textContent = "Loading, please wait...";
  requestStateText.classList.add("request-state-text");
  requestStatesDiv.classList.remove("error-state");
  requestStatesDiv.classList.remove("fulfilled-state");
  requestStatesDiv.classList.add("loading-state");
  requestStatesDiv.appendChild(requestStateText);

  fetchRandomRepository(
    programmingLanguageSelected,
    requestStatesDiv,
    requestStateText
  );
};

async function fetchRandomRepository(
  programmingLanguageSelected,
  requestStatesDiv,
  requestStateText
) {
  try {
    const query = programmingLanguageSelected
      ? `language:${programmingLanguageSelected}`
      : "stars:>1"; 
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`
    );
    const data = await response.json();
    const repositories = data.items;

    const randomIndex = getRandomIndex(repositories.length);

    const repositoryURL = repositories[randomIndex].html_url;
    const repositoryName = repositories[randomIndex].name;
    const repositoryDescription = repositories[randomIndex].description;
    const repositoryLanguage = repositories[randomIndex].language;
    const repositoryStars = repositories[randomIndex].stargazers_count;
    const repositoryForks = repositories[randomIndex].forks;
    const repositoryOpenIssues = repositories[randomIndex].open_issues_count;

    displayRandomRepository(
      requestStatesDiv,
      requestStateText,
      repositoryURL,
      repositoryName,
      repositoryDescription,
      repositoryLanguage,
      repositoryStars,
      repositoryForks,
      repositoryOpenIssues
    );

    displayRefreshButton();
  } catch (error) {
    console.log(`Error fetching repositories: ${error}`);
    displayErrorState(requestStatesDiv, requestStateText);
  }
}

const getRandomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);

function displayRandomRepository(
  requestStatesDiv,
  requestStateText,
  URL,
  name,
  description,
  language,
  stars,
  forks,
  openIssues
) {
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

  const languageContainer = document.createElement("div");
  const repositoryLanguage = document.createElement("p");
  repositoryLanguage.innerText = language;
  languageContainer.appendChild(repositoryLanguage);

  const starsContainer = document.createElement("div");
  starsContainer.classList.add("stats-with-icon-container");
  const starIcon = document.createElement("img");
  starIcon.classList.add("stats-icon");
  starIcon.src = "./assets/icons/star.svg";
  starIcon.alt = "GitHub stars";
  const repositoryStars = document.createElement("p");
  repositoryStars.textContent = stars;
  starsContainer.append(starIcon, repositoryStars);

  const forksContainer = document.createElement("div");
  forksContainer.classList.add("stats-with-icon-container");
  const forksIcon = document.createElement("img");
  forksIcon.classList.add("stats-icon");
  forksIcon.src = "./assets/icons/git-fork.svg";
  forksIcon.alt = "GitHub forks";
  const repositoryForks = document.createElement("p");
  repositoryForks.textContent = forks;
  forksContainer.append(forksIcon, repositoryForks);

  const openIssuesContainer = document.createElement("div");
  openIssuesContainer.classList.add("stats-with-icon-container");
  const issuesIcon = document.createElement("img");
  issuesIcon.classList.add("stats-icon");
  issuesIcon.src = "./assets/icons/circle-alert.svg";
  issuesIcon.alt = "GitHub issues";
  const repositoryOpenIssues = document.createElement("p");
  repositoryOpenIssues.textContent = openIssues;
  openIssuesContainer.append(issuesIcon, repositoryOpenIssues);

  repositoryStatsContainer.append(
    languageContainer,
    starsContainer,
    forksContainer,
    openIssuesContainer
  );

  requestStatesDiv.append(
    repositoryAnchor,
    repositoryDescription,
    repositoryStatsContainer
  );
}

function displayRefreshButton(errorState) {
  const refreshButton = document.querySelector("#retry-button");
  refreshButton.classList.remove("inactive");

  refreshButton.textContent = errorState ? "Click to retry" : "Refresh";

  const repositoryFinderForm = document.querySelector("#repository-finder-form");
  repositoryFinderForm.removeEventListener("submit", handleFormSubmit);
  repositoryFinderForm.addEventListener("submit", handleFormSubmit);
}

function handleFormSubmit(event) {
  event.preventDefault();
  handleRequestStates();
}

function displayErrorState(requestStatesDiv, requestStateText) {
  requestStatesDiv.classList.add("error-state");
  requestStateText.textContent = "Error fetching repositories";
  displayRefreshButton(true);
}
