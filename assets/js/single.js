const issueContainerEl = document.querySelector("#issues-container");
const limitWarningEl = document.querySelector("#limit-warning");
const repoNameEl = document.querySelector("#repo-name");

getRepoIssues = function(repo) {
    const apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc"
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

                //check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            document.location.replace("./index.html");
        }
    });
};

getRepoName = function(){
    let queryString = document.location.search
    console.log(queryString);
    repoName = queryString.split("=")[1];

    if(repoName){ 
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        //if no repo was given, redirect to  the homepage
        document.location.replace("./index.html");
    }
    
}

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    // append to warning container
    limitWarningEl.appendChild(linkEl);

  };

displayIssues = function(issues) {
    for (var i = 0; i < issues.length; i++) {
        //create a link element to take users to the issue on github
        
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create a span to hold title of issue 
        let titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container 
        issueEl.append(titleEl);

        //create a type element
        let typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if(issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        //apppend to container 
        issueEl.append(typeEl);

        issueContainerEl.append(issueEl);
    }
}

getRepoName();