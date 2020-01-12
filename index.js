// Create a command-line application that dynamically generates a PDF profile from a GitHub username.
// The user will be prompted for a favorite color, which will be used as the background color for cards.
// The PDF will be populated with the following:
// Profile image
// User name
// Links to the following:
// User location via Google Maps
// User GitHub profile
// User blog
// User bio
// Number of public repositories
// Number of followers
// Number of GitHub stars
// Number of users following

const inquirer = require('inquirer');
const axios = require('axios');
//const util = require('util');
const pdf = require('pdf-creator-node');
// const PDFDocument = require('pdfkit');
const fs = require('fs');

// Object to save application state
const app = {
    color: 'orange',
    username: 'ffortizn',
    login: '',
    imageUrl: 'https://avatars0.githubusercontent.com/u/2782134?v=4',
    name: 'Fernando Nicolas',
    location: '',
    gitProfileUrl: '',
    blog: '',
    bio: '',
    publicRepos: 0,
    followers: 0,
    stars: 0,
    following: 0
};

// ask for color
const color = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'];
var bgColor = 'orange';
var username = '';

function getUsername() {
    const getUsername = inquirer.prompt({
        message: 'Enter github username:',
        type: 'input',
        name: 'username',
        default: 'ffortizn'
    })
    app.username = getUsername.username;
}

function getColor() {
    const getColor = inquirer.prompt({
        message: 'What\'s your favorite color (for background color)?',
        type: 'list',
        name: 'color',
        choices: color,
        default: 'orange'
    })
    app.color = getColor.color;
}

function printApp() {
    console.info(app);
}

function askQuestions() {
    inquirer
        .prompt([
            {
                message: 'What\'s your favorite color (for background color)?',
                type: 'list',
                name: 'color',
                choices: color,
                default: 'orange'
            },
            {
                message: 'Enter github username:',
                type: 'input',
                name: 'username',
                default: 'ffortizn'
            },
        ])
        .then(answers => {
            app.color = answers.color;
            app.username = answers.username;
            getGitProfile();
            // generatePdf();
        });
}

function getGitProfile() {
    const queryUrl = `https://api.github.com/users/${app.username}`;
    axios
        .get(queryUrl)
        .then(function (res) {
            app.login = res.data.login;
            app.imageUrl = res.data.avatar_url;
            app.name = res.data.name;
            app.location = res.data.location,
                app.gitProfileUrl = res.data.html_url,
                app.blog = res.data.blog,
                app.bio = res.data.bio,
                app.publicRepos = res.data.public_repos,
                app.followers = res.data.followers;
            getGitStars();
        });
}

function getGitStars() {
    const queryUrl = `https://api.github.com/users/${app.username}/repos?per_page=100`;
    axios
        .get(queryUrl)
        .then(function (res) {
            let stars = 0
            const repoData = res.data;
            repoData.forEach(element => {
                stars += parseInt(element.stargazers_count);
            });
            app.stars = stars;
            generatePdf();
        });
}

function generatePdf() {
    var html = fs.readFileSync('template.html', 'utf8');
    var options = {
        format: "A2",
        orientation: "portrait",
        border: "10mm",
        // header: {
        //     height: "45mm",
        //     contents: '<div style="text-align: center;">Author: Francisco Ortiz</div>'
        // },
        // "footer": {
        //     "height": "28mm",
        //     "contents": {
        //         first: 'Cover page',
        //         2: 'Second page', // Any page number is working. 1-based index
        //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        //         last: 'Last Page'
        //     }
        // }
    }

    var document = {
        html: html,
        data: {
            app: app
        },
        path: "./output.pdf"
    };

    pdf.create(document, options)
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        });
    printApp();
}

askQuestions();
//generatePdf();
//printApp();


// askQuestions();
// console.info('\napp.username: ' + app.username);
// console.info('----------');
// console.log(app.color);
// console.log(app.username);
    //console.info(inquirer.answers.username);



    // ask username

// while (bgValid === false) {
//     console.log('What\'s your favorite color (for background color)?\n');
//     for (let i = 0; i < color.length; ++i)
//         console.log(`${color[i]}: ${i}`);
//     bgColor = inquirer('');
//     bgValid = true;
// }
// Minimum Requirements
// Functional, deployed application.
// GitHub repository with a unique name and a README describing project.
// The application generates a PDF resume from the user provided GitHub profile.
// The generated resume includes a bio image from the user's GitHub profile.
// The generated resume includes the user's location and a link to their GitHub profile.
// The generated resume includes the number of: public repositories, followers, GitHub stars and following count.
// The background color of the generated PDF matches the color that the user provides.