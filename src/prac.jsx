import React, { Component } from "react";

class Data {
  constructor(value, lastName) {
    this.firstName = value;
    this.lastName = lastName;
  }
}

export default class Car extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    // Example API call
    fetch("https://jsonplaceholder.typicode.com/users/2")
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API response has a 'name' and 'username' field
        const apiData = new Data(data.name, data.username);
        this.setState({ data: apiData, loading: false });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ error, loading: false });
      });
  }

  render() {
    const { data, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <div>
        <h1>{data.firstName + " " + data.lastName}</h1>
      </div>
    );
  }
}
