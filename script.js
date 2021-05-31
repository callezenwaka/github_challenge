'use strict'

// declare 
const menubar = document.querySelector('#menubar');
const dropdown = document.querySelector('#dropdown');
const search = document.querySelector('#search');
const anchor = document.querySelector('#anchor');
const username = document.querySelector('#username');
const searches = document.querySelectorAll('.searching');

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

// assign base URL
const baseUrl = "https://api.github.com/graphql";

// get github token
const github_data = {
    "token": "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",
    // "hinsencamp": "hinsencamp",
}

// declare request header
const headers = { 
    'content-type': 'application/json', 
    'Accept': 'application/json',
    'Authorization': `Bearer ${github_data["token"]}`,
}

// declare query parameters
const query = (val) => `query {
    user(login: ${val}) {
        name
        repositories(last: 10) {
            nodes {
                name
                description
            }
        }
    }
}`

// declare fetch user function
async function fetchUser(e) {
    const search = document.querySelector('#search');
    const value = JSON.stringify(search.value.trim());
    e.preventDefault();
    console.log(headers);
    // fetch user data
    fetch(baseUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({query: query(value)}),
        // body: JSON.stringify({query: `
        //         query {
        //             user(login: ${value}) {
        //                 name
        //                 repositories(last: 3) {
        //                     nodes {
        //                         name
        //                         description
        //                     }
        //                 }
        //             }
        //         }
        //     `
        // }),
    })
    .then((serverPromise) => {
        serverPromise.json()
        .then((j) => console.log(j))
        .catch((e) => console.log(e))
    })
    .catch((e) => console.log(e));
}

