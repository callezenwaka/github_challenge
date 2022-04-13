'use strict'

// assign base URL
const baseUrl = "https://api.github.com/graphql";

// get github token
const github_data = {
    "token":process.env.TOKEN,
    // "hinsencamp": "hinsencamp",
}

// declare request header
const headers = { 
    'content-type': 'application/json', 
    'Accept': 'application/json',
    'Authorization': `Bearer ${github_data["token"]}`,
}

// declare 
const menubar = document.querySelector('#menubar');
const dropdown = document.querySelector('#dropdown');
const search = document.querySelector('#search');
const anchor = document.querySelector('#anchor');
const username = document.querySelector('#username');
const searches = document.querySelectorAll('.searching');
const completed = document.querySelector('#completed');
const fullname = document.querySelector('#fullname');
const shortname = document.querySelector('#shortname');
const bio = document.querySelector('#bio');
const followers = document.querySelector('#followers');
const following = document.querySelector('#following');
const starred = document.querySelector('#starred');

// toggle menu bar on mobile
menubar.addEventListener('click', () => {
    dropdown.classList.toggle('active');
});

// listen on username search
search.addEventListener('keyup', () => {
    const value = search.value.trim();
    if (!value.length == 0) {
        username.innerHTML = value;
        username.setAttribute('aria-label', value)
        anchor.href = 'https://github.com/search?q='+value+'&amp;type=users';
        searches.forEach(search => {
            search.classList.remove('d-none');
        })
    } else {
        searches.forEach(search => {
            search.classList.add('d-none');
        })
    }
});

completed.addEventListener('click', ()=> {
    document.querySelector('#search').value = '';
    dropdown.classList.toggle('active');
    searches.forEach(search => {
        setTimeout(() => {
            search.classList.add('d-none');
            // search.value = '';
        }, 1000);
        
    })
})

// declare query parameters
const query = (val) => `query {
    user(login: ${val}) {
        name
        email
        url
        starredRepositories {
            totalCount
        }
        avatarUrl
        following {
            totalCount
        }
        followers {
            totalCount
        }
        company
        location
        websiteUrl
        twitterUsername
        id
        bio
        repositories(last: 20) {
            totalCount
            nodes {
                name
                isFork
                nameWithOwner
                stargazerCount
                description
                updatedAt
                url
                nameWithOwner
                owner {
                    avatarUrl
                    url
                }
                licenseInfo {
                    key
                    name
                }
                parent {
                    name
                    nameWithOwner
                    forkCount
                }
                languages {
                    nodes {
                        color
                        name
                    }
                }
                primaryLanguage {
                    name
                }
            }
        }
    }
}`

// declare fetch user function
// async function fetchUser(e) {
//     e.preventDefault();
//     const search = document.querySelector('#search');
//     const value = JSON.stringify(search.value.trim());
//     // fetch user data
//     fetch(baseUrl, {
//         method: "POST",
//         headers: headers,
//         body: JSON.stringify({query: query(value)}),
//     })
//     .then(async (serverPromise) => {
//         try {
//             const res = await serverPromise.json();
//             let user = res.data.user;
//             console.log(user);
//             fullname.innerHTML = user.name || '';
//             shortname.innerHTML = user.name || '';
//             bio.innerHTML = user.bio || '';
//             followers.innerHTML = user.followers.totalCount || '';
//             following.innerHTML = user.following.totalCount || '';
//             starred.innerHTML = user.starredRepositories.totalCount || '';
//             avatar.src = user.avatarUrl || '';
//             return res.data;
//         } catch (e) {
//             return console.log(e);
//         }
//     })
//     .catch((e) => console.log(e));
// }

// define date parser function
function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
}

// declare fetch user function to fetch user and repos
async function getUser() {
    const search = document.querySelector('#search');
    const value = !search.value.length == 0? JSON.stringify(search.value.trim()) : JSON.stringify("callezenwaka");
    try {
        let res = await fetch(baseUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({query: query(value)}),
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// declare fetch user function to render repos
async function renderRepos(e) {
    e.preventDefault();
    const fullname = document.querySelector('#fullname');
    const shortname = document.querySelector('#shortname');
    const bio = document.querySelector('#bio');
    const followers = document.querySelector('#followers');
    const following = document.querySelector('#following');
    const starred = document.querySelector('#starred');
    const avatar = document.querySelector('#avatar');
    const repositories = document.querySelector('#repositories');
    let res = await getUser();
    let user = res.data.user;
    let repos = res.data.user.repositories.nodes;
    // assign user bio
    fullname.innerHTML = user.name || '';
    shortname.innerHTML = user.name || '';
    bio.innerHTML = user.bio || '';
    followers.innerHTML = user.followers.totalCount || '';
    following.innerHTML = user.following.totalCount || '';
    starred.innerHTML = user.starredRepositories.totalCount || '';
    repositories.innerHTML = user.repositories.totalCount || '';
    avatar.src = user.avatarUrl || '';
    // declare html temp container
    let html = '';
    repos.forEach(repo => {
            let htmlSegment =   `<li class="list--item">
                                    <div class="repo--wrapper">
                                        <div class="repo--item">
                                            <h3 class="">
                                                <a href="/${repo.nameWithOwner}" class="repo--link" id="name">${repo.name}</a>
                                            </h3>
                                            <span class="fork--item">
                                                Forked from
                                                <a class="fork--link" href="/${repo.nameWithOwner}" id="parentName">${repo.nameWithOwner}</a>
                                            </span>
                                        </div>
                                        <div>
                                            <p class="repo--description" itemprop="description" id="description">${repo.description? repo.description : ''}</p>
                                        </div>
                                        <div class="repo--footer">
                                            <span class="language--wrapper">
                                                <span class="repo-language-color" style="background-color: #2c3e50" id="languageColor"></span>
                                                <span itemprop="programmingLanguage" id="programmingLanguage">${repo.primaryLanguage? repo.primaryLanguage.name : ''}</span>
                                            </span>
                                            <a class="forked--icon" href="/${repo.nameWithOwner}/network/members" id="forkCount">
                                                <svg aria-label="fork" role="img" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="">
                                                    <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                                                </svg>
                                                ${repo.parent? repo.parent.forkCount : 0}
                                            </a>
                                            <span class="license" id="licenseName">
                                                <svg class="" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                                                    <path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path> 
                                                </svg>
                                                ${repo.licenseInfo? repo.licenseInfo.name : ''}
                                            </span>
                                            Updated
                                            <relative-time datetime="2021-05-27T13:43:40Z" class="repo--update" title="May 27, 2021, 2:43 PM GMT+1" id="updatedAt">${repo.updatedAt? formatDate(repo.updatedAt) : ''}</relative-time>
                                        </div>
                                    </div>
                                    <div class="star--wrapper">
                                        <div class="star--align">
                                            <div class="star--display">
                                                <form class="" action="/${repo.nameWithOwner}/star" method="post">
                                                    <input type="hidden" name="context" value="user_stars">
                                                    <button class="btn star--btn" type="submit" aria-label="Star this repository" title="Star ${repo.nameWithOwner}">
                                                        <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                                                            <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                                                        </svg>
                                                        Star
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </li>`;
        // 
        html += htmlSegment;
    });
    // assign repos to container and render contents
    let reposContainer = document.querySelector('#reposContainer');
    reposContainer.innerHTML = html;
}

// default account on load
window.onload = function(e) {
    renderRepos(e);
};
