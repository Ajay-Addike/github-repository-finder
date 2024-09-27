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
    // console.log(programmingLanguages);
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

  // Request states container
  const requestStatesDiv = document.querySelector("#request-state");

  // Fulfilled state (repository data already displayed)
  const fulFilledState = requestStatesDiv.childElementCount > 1;

  // Remove previous repository data from the DOM if it exists (when the user clicked the refresh button)
  if (fulFilledState) {
    // Remove the previous repository data
    while (requestStatesDiv.firstChild) {
      requestStatesDiv.removeChild(requestStatesDiv.firstChild);
    }
    // Get the selected programming language value when the user clicks the refresh button
    programmingLanguageSelected = programmingLanguagesSelect.value;
  } else {
    // Remove "Select a language" option the first time the user selects a language to avoid the user selecting it again
    programmingLanguagesSelect.removeChild(
      programmingLanguagesSelect.firstElementChild
    );
    // Get the selected programming language value when the user changes the select value
    programmingLanguageSelected = event.currentTarget.value;
    // Remove the initial text when the user selects a programming language
    requestStatesDiv.removeChild(requestStatesDiv.firstElementChild);
  }

  // Add the loading state
  const requestStateText = document.createElement("p");
  requestStateText.textContent = "Loading, please wait...";
  requestStateText.classList.add("request-state-text");
  requestStatesDiv.classList.remove("error-state");
  requestStatesDiv.classList.remove("fulfilled-state");
  requestStatesDiv.classList.add("loading-state");
  requestStatesDiv.appendChild(requestStateText);

  // The requestStatesDiv and the requestStateText are passed as arguments to display the repository data when the fetch is successful
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
    // Fetch the repositories from the GitHub API
    const query = programmingLanguageSelected
      ? `language:${programmingLanguageSelected}`
      : "stars:>1"; // Default query if the user doesn't select a programming language (get the most starred repositories in any language)
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

    // console.log(
    //   `Name: ${repositoryName}\nDesc: ${repositoryDescription}\nLang: ${repositoryLanguage}\nStars: ${repositoryStars}\nForks: ${repositoryForks}\nIssues: ${repositoryOpenIssues}`
    // );

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
  // Remove error state and add the fulfilled state
  requestStatesDiv.classList.remove("error-state");
  requestStatesDiv.classList.add("fulfilled-state");
  requestStatesDiv.removeChild(requestStateText);

  // Repository anchor
  const repositoryAnchor = document.createElement("a");
  repositoryAnchor.classList.add("repository-url");
  repositoryAnchor.href = URL;
  repositoryAnchor.target = "_blank";
  repositoryAnchor.rel = "noopener noreferrer";

  // Repository name h2
  const repositoryName = document.createElement("h2");
  repositoryName.classList.add("repository-name");
  repositoryName.textContent = name;

  repositoryAnchor.appendChild(repositoryName);

  // Repository description paragraph
  const repositoryDescription = document.createElement("p");
  repositoryDescription.classList.add("repository-description");
  repositoryDescription.textContent = description;

  // Repository stats container
  const repositoryStatsContainer = document.createElement("div");
  repositoryStatsContainer.classList.add("repository-stats");

  // Repository language container
  const languageContainer = document.createElement("div");
  const repositoryLanguage = document.createElement("p");
  repositoryLanguage.innerText = language;
  languageContainer.appendChild(repositoryLanguage);

  // Repository stars container
  const starsContainer = document.createElement("div");
  starsContainer.classList.add("stats-with-icon-container");
  const starIcon = document.createElement("img");
  starIcon.classList.add("stats-icon");
  starIcon.src = "./assets/icons/star.svg";
  starIcon.alt = "GitHub stars";
  const repositoryStars = document.createElement("p");
  repositoryStars.textContent = stars;
  starsContainer.append(starIcon, repositoryStars);

  // Repository forks container
  const forksContainer = document.createElement("div");
  forksContainer.classList.add("stats-with-icon-container");
  const forksIcon = document.createElement("img");
  forksIcon.classList.add("stats-icon");
  forksIcon.src = "./assets/icons/git-fork.svg";
  forksIcon.alt = "GitHub forks";
  const repositoryForks = document.createElement("p");
  repositoryForks.textContent = forks;
  forksContainer.append(forksIcon, repositoryForks);

  // Repository open issues container
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

  // If there's an error fetching the repositories, display the retry button with the error state. Otherwise, display the refresh button with the fulfilled state
  if (errorState) {
    refreshButton.classList.remove("refresh-background-color");
    refreshButton.classList.add("button-error");
    refreshButton.textContent = "Click to retry";
  } else {
    refreshButton.classList.remove("button-error");
    refreshButton.classList.add("refresh-background-color");
    refreshButton.textContent = "Refresh";
  }

  const repositoryFinderForm = document.querySelector(
    "#repository-finder-form"
  );
  // Remove the previous event listener to avoid multiple event listeners
  repositoryFinderForm.removeEventListener("submit", handleFormSubmit);
  repositoryFinderForm.addEventListener("submit", handleFormSubmit);
}

function handleFormSubmit(event) {
  event.preventDefault();
  // Fetch the repositories again when the user clicks the refresh or retry button
  handleRequestStates();
}

function displayErrorState(requestStatesDiv, requestStateText) {
  requestStatesDiv.classList.remove("fulfilled-state");
  requestStatesDiv.classList.add("error-state");
  requestStateText.textContent = "Error fetching repositories";
  // Flag to display the retry button with the error state
  const errorState = true;

  displayRefreshButton(errorState);
}
