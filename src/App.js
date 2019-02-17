import React, { Component } from "react";
import Navbar from "./Components/Navbar";
import Content from "./Components/Content";
import { Route } from "react-router-dom";
class App extends Component {
  state = {
    SearchResult: [],
    movie: {
      title: "",
      genre: "",
      director: "",
      actors: "",
      plot: "",
      language: "",
      country: "",
      awards: "",
      img_url: "",
      imdbRating: "",
      production: ""
    },
    liked: []
  };

  saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  getFromLocalStorage = key => {
    return JSON.parse(localStorage.getItem(key));
  };

  componentDidMount = () => {
    const liked = this.getFromLocalStorage("likedMovies");
    if (liked !== null)
      this.setState({
        liked
      });
  };

  async handleMovie(searchID) {
    let res = await (await fetch(
      `http://www.omdbapi.com/?apikey=aa806481&i=${searchID}`
    )).json();
    await this.setState({
      movie: {
        title: res.Title,
        genre: res.Genre,
        director: res.Director,
        actors: res.Actors,
        plot: res.Plot,
        language: res.Language,
        country: res.Country,
        awards: res.Awards,
        img_url: res.Poster,
        imdbRating: res.imdbRating,
        production: res.Production
      }
    });
  }

  async handleMovieNameSearch(name) {
    let res = await (await fetch(
      `http://www.omdbapi.com/?apikey=aa806481&t=${name}`
    )).json();
    await this.setState({
      movie: {
        title: res.Title,
        genre: res.Genre,
        director: res.Director,
        actors: res.Actors,
        plot: res.Plot,
        language: res.Language,
        country: res.Country,
        awards: res.Awards,
        img_url: res.Poster,
        imdbRating: res.imdbRating,
        production: res.Production
      }
    });
  }

  async handleSearch(searchInput) {
    if (searchInput.trim() !== "") {
    }
    let res = await (await fetch(
      `http://www.omdbapi.com/?apikey=aa806481&s=${searchInput}`
    )).json();
    await this.setState({
      SearchResult: [...res.Search]
    });
  }

  handleLike = title => {
    if (this.state.liked.includes(title)) {
      let index;
      index = this.state.liked.indexOf(title);
      let arr = [...this.state.liked];
      arr.splice(index, 1);
      this.setState(
        {
          liked: arr
        },
        () => {
          this.saveToLocalStorage("likedMovies", this.state.liked);
        }
      );
    } else {
      let arr = [...this.state.liked];
      arr.push(title);
      this.setState(
        {
          liked: arr
        },
        () => {
          this.saveToLocalStorage("likedMovies", this.state.liked);
        }
      );
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <Route
            path="/"
            render={props => (
              <Navbar
                onSearch={this.handleSearch.bind(this)}
                likedMovies={this.state.liked}
                onSearchByName={this.handleMovieNameSearch.bind(this)}
                {...props}
              />
            )}
          />
        </div>
        <Content
          movie={this.state.movie}
          onLiked={this.handleLike}
          likedMovies={this.state.liked}
          movies={this.state.SearchResult}
          onSearchById={this.handleMovie.bind(this)}
        />
      </div>
    );
  }
}

export default App;
