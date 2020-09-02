let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");
let languageButtonsEl = document.querySelector("#language-buttons");

let getUserRepos = function(user){
    //format the github api url
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make request to the url
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayRepos(data,user);
            });
        }
        else{
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        //Notice this .catch() getting chained ont the end of the .then()
        alert("Unable to connet to GitHub");
    });
};

let formSubmitHandler = function(event){
    event.preventDefault();
    let username = nameInputEl.value.trim();

    if(username){
        getUserRepos(username);
        nameInputEl.value = "";
    }
    else{
        alert("Please enter a GitHub username");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);

let displayRepos = function(repos, searchTerm){
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //check if api returned any repos
    if (repos.length === 0){
        repoContainerEl.textContent = "No repositories found";
        return;
    }

    for (var i = 0; i < repos.length; i++){
        //format repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        //create container for each repo
        let repoEl = document.createElement('a');
        repoEl.classList = "list-item flex-row justify-space-between align-center"
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create span element to hold repo name
        let titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //append container to DOM
        repoContainerEl.appendChild(repoEl);

        //create status element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if(repos[i].open_issues_count > 0){
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else{
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);
    }
};

let getFeaturedRepos = function(language){
 let apiUrl = "https://api.github.com/search/repositories?q=" + language + "is:featured&sort=help-wanted-issues";

 fetch(apiUrl).then(function(response){
     if(response.ok){
         response.json().then(function(data){
             displayRepos(data.items, language);
         });
     }
     else{
         alert("Error: " + response.statusText);
     }
 });
};

let buttonClickHandler = function(event){
    let language = event.target.getAttribute("data-language");
    if(language){
        getFeaturedRepos(language);
        repoContainerEl.textContent = "";
    }
};

languageButtonsEl.addEventListener("click", buttonClickHandler);