import React, { Component } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import axios from "axios";
import config from "../../../config";

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
    };
  }

  getNewRelease = async () => {
    console.log(axios.defaults.headers.common["Authorization"]);
    try {
      const { data } = await axios.get(
        config.api.baseUrl + "/browse/new-releases?locale=sv_IN"
      );
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  getPlayLists = async () => {
    try {
      const { data } = await axios.get(
        config.api.baseUrl + "/browse/featured-playlists?locale=sv_IN"
      );
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  getCategories = async () => {
    try {
      const { data } = await axios.get(
        config.api.baseUrl + "/browse/categories?locale=sv_IN"
      );
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  componentDidMount = async () => {
    try {
      const token = await axios(config.api.authUrl, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(config.api.clientId + ":" + config.api.clientSecret),
        },
        data: "grant_type=client_credentials",
        method: "POST",
      }).then((response) => response);

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + token.data.access_token;

      const [categories, playlists, newrelease] = await axios.all([
        this.getCategories(),
        this.getPlayLists(),
        this.getNewRelease(),
      ]);
      this.setState({
        newReleases: newrelease ? newrelease.albums.items : [],
        playlists: playlists ? playlists.playlists.items : [],
        categories: categories ? categories.categories.items : [],
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock
          text="RELEASED THIS WEEK"
          id="released"
          data={newReleases}
        />
        <DiscoverBlock
          text="FEATURED PLAYLISTS"
          id="featured"
          data={playlists}
        />
        <DiscoverBlock
          text="BROWSE"
          id="browse"
          data={categories}
          imagesKey="icons"
        />
      </div>
    );
  }
}
