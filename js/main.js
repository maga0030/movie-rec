const app = {
    URL: 'https://api.themoviedb.org/3/',
    imgURL: '',
    pages: [],
    show: new Event('show'),
    init: function () {
        // focus on the text field
        let input = document.getElementById('search-input');
        input.focus();
        setTimeout(app.addHandlers, 1234);
        
        //select all the ones with .page in 'em
        app.pages = document.querySelectorAll(".page");
        app.pages.forEach((pg) => {
            pg.addEventListener("show", app.pageShown);
        })
        
        history.replaceState({}, 'search-results', '#search-results');
    },
    addHandlers: function () {
        let btn = document.getElementById('search-button');
        btn.addEventListener('click', app.runSearch);
        app.retrieveImgUrl();
        let back_btn = document.getElementById('back-button');
        back_btn.addEventListener('click', app.back);
        document.addEventListener('keypress', function (ev) {
            let char = ev.char || ev.charCode || ev.which;
            if (char == 10 || char == 13) {
                // we have an enter or return key
                btn.dispatchEvent(new MouseEvent('click'));
            }
        });
    },
    runSearch: function (ev) {
        // do the fetch to get the list of movies
        ev.preventDefault();
        let page = 1;
        let input = document.getElementById('search-input');
        if (input.value) {
            // code will not run if the value is an empty string
            let url = app.URL + "search/movie?api_key=" + KEY + "&query=" + input.value + "&page=" + page;
            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    app.showMovies(data);
                    app.switchPages(); 
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    retrieveImgUrl: function() {
        let url = app.URL + "configuration?api_key=" + KEY;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let base_url = data.images.secure_base_url;
                let poster_size = data.images.poster_sizes[4];
                app.imgURL = base_url + poster_size;
            })
            .catch(err => {
                console.log(err);
            });
    },
    showMovies: function (movies) {
        let container = document.querySelector('#search-results .content');
        let df = document.createDocumentFragment();
        if (!document.querySelector('#search-results').classList.contains("active")) {
            document.querySelector('#recommend-results').classList.remove("active");
            document.querySelector('#search-results').classList.add("active");
        }
        
        container.innerHTML = "";
        movies.results.forEach(function(movie) {
            let div = document.createElement('div');
            div.classList.add('movie');
            
            let poster_div = document.createElement("div");
            poster_div.classList.add("poster-div");
            
            let title_div = document.createElement("div");
            title_div.classList.add("title-div");
            
        
            let title = document.createElement("a");
            title.classList.add('movie-title');                    
            title.setAttribute("data-target", "recommend-results");
            
            let year = document.createElement("h3");
            year.classList.add('movie-year');
            
            let poster = document.createElement("img");
            poster.classList.add('poster');
            
            let description = document.createElement("p");
            description.classList.add('movie-desc');
            
            title.appendChild(document.createTextNode(movie.title));
            title.setAttribute("data-movie", movie.id);

            let movie_year = movie.release_date;
            if (movie_year != null) movie_year = movie_year.split("-")[0];
            else movie_year = "--";
            
            if (movie.poster_path != null) {
                poster.src = app.imgURL + movie.poster_path;
            } else {
                poster.src = "img/no_poster.png";
            }
            
            year.appendChild(document.createTextNode(" (" + movie_year + ")"));
            description.appendChild(document.createTextNode(movie.overview));
            
            poster_div.appendChild(poster);
            title_div.appendChild(title);
            title_div.appendChild(year);
            title_div.appendChild(description);
            
            div.appendChild(poster_div);
            div.appendChild(title_div);
            
            // add click listener for getting recommended movies
            df.appendChild(div);
            
        });
        container.appendChild(df);
    },
    getRecommended: function (movie_id) {      
        // code will not run if the value is an empty string
        let url = app.URL + "movie/" + movie_id + "/recommendations?api_key=" + KEY;
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.results.length != 0) {
                    setTimeout(function() { app.showRecommended(data); }, 200);
                }
                else {
                    document.querySelector('#recommend-results .content').textContent = "THERE ARE NO RECOMMENDATIONS TO DISPLAY!";
                }   
            })
            .catch(err => {
                console.log(err);
            });
    },
    showRecommended: function (movies) {
        let container = document.querySelector('#recommend-results .content');
        let df = document.createDocumentFragment();
        container.innerHTML = "";
        
        movies.results.forEach(function(movie) {
            let div = document.createElement('div');
            div.classList.add('movie');
            
            let poster_div = document.createElement("div");
            poster_div.classList.add("poster-div");
            
            let title_div = document.createElement("div");
            title_div.classList.add("title-div");
            
            let title = document.createElement("h2");
            title.classList.add('rec-movie-title');
            
            let year = document.createElement("h3");
            year.classList.add('rec-movie-year');
            
            let poster = document.createElement("img");
            poster.classList.add('mini-poster');
            
            let rating_div = document.createElement("div");
            rating_div.classList.add("rating");
            
            let movie_rating = document.createElement("p");
            movie_rating.classList.add("movie-rating");
            
            let movie_rating_count = document.createElement("p");
            movie_rating_count.classList.add('movie-rating-count');
            
            title.appendChild(document.createTextNode(movie.title));
            let movie_year = movie.release_date;
            if (movie_year != null) movie_year = movie_year.split("-")[0];
            else movie_year = "--";
            year.appendChild(document.createTextNode(" (" + movie_year + ")"));
            
            if (movie.poster_path != null) {
                poster.src = "http://image.tmdb.org/t/p/w500" + movie.poster_path;
            } else {
                poster.src = "img/no_poster.png";
            }
            
            movie_rating.appendChild(document.createTextNode(movie.vote_average));
            movie_rating_count.appendChild(document.createTextNode(" (" + movie.vote_count + ")"));
            
            poster_div.appendChild(poster);
            title_div.appendChild(title);
            title_div.appendChild(year);
            title_div.appendChild(rating_div);
            
            div.appendChild(poster_div);
            div.appendChild(title_div);
            rating_div.appendChild(movie_rating);
            rating_div.appendChild(movie_rating_count);
            
            // add click listener for getting recommended movies
            df.appendChild(div);
        });
        container.appendChild(df);
            
    },
    switchPages: function() { 
        // create click event listener for all movie titles
        document.querySelectorAll('.movie-title').forEach((link) => {
            link.addEventListener("click", app.recommendList);
        })
        
        history.pushState({}, "search-results", "#search-results");
        document.getElementById("search-results").dispatchEvent(app.show);
        
        //run animation
        document.querySelector(".search-bar").classList.add("results");
        document.querySelector(".logo").classList.add("move");
        document.getElementById("back-button").classList.remove("no-display");
        document.getElementById("back-button").classList.add("display");
        document.querySelector(".page .attribution").classList.remove("not");
    },
    nav: function(event) {
        let currentPage = event.target.getAttribute("data-target");
        document.querySelector(".active").classList.remove("active");
        document.getElementById(currentPage).classList.add("active");
        console.log("[CURRENT PAGE1]: " + currentPage);
        history.pushState({}, currentPage, `#${currentPage}`);
        document.getElementById(currentPage).dispatchEvent(app.show);
    },
    recommendList: function(event) { // get recommendations
        event.preventDefault();
        let movie_id = event.target.getAttribute("data-movie");
        app.getRecommended(movie_id);
        app.nav(event);
        console.log("[NUM IN HISTORY]: " + history.length);
    },
    pageShown: function(event) {
        let hash = location.hash.replace("#", "");
    },
    back: function(event) {
        if (!document.querySelector('#search-results').classList.contains("active")) {
            document.querySelector('#recommend-results').classList.remove("active");
            document.querySelector('#search-results').classList.add("active");
            history.pushState({}, 'search-results', '#search-results');
        }
        
        let page = document.querySelector("#search-results .content");
        
        page.innerHTML = "";
        
        document.querySelector(".search-bar").classList.remove("results");
        document.querySelector(".logo").classList.remove("move");
        document.querySelector(".logo").classList.add("back");
        document.getElementById("back-button").classList.add("no-display");
        document.getElementById("back-button").classList.remove("display");
        document.querySelector(".page .attribution").classList.add("not");
    }
};

document.addEventListener('DOMContentLoaded', app.init);
