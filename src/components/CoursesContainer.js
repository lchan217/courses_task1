import React, { Component } from "react";
import { Form, Button, Container, Dimmer, Loader } from "semantic-ui-react";
import ResultList from "./ResultList";

class CoursesContainer extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      isLoading: true,
      search: "",
      results: []
    };
  }

  componentDidMount() {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://quze-intern-test.s3.us-east-2.amazonaws.com/course-data.json"
    )
      .then(response => response.json())

      .then(response => {
        this.setState({
          courses: response,
          isLoading: false,
          results: response
        });
      });
  }

  handleChange = event => {
    this.setState({ search: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    let results = this.state.courses.filter(course => {
      return course.title
        .toLowerCase()
        .includes(this.state.search.toLowerCase());
    });
    this.setState({ results: results });
  };

  clearFilter = () => {
    this.setState({ results: this.state.courses });
  };

  receiveTag = tag => {
    let results = [];
    this.state.courses.map(course => {
      return (
        course.quzeTags &&
        course.quzeTags.split(",").filter(quzeTag => {
          if (quzeTag === tag) return results.push(course);
        })
      );
    });

    this.setState({ results: results });
  };
  render() {
    let data;
    if (this.state.isLoading) {
      data = (
        <Dimmer active inverted>
          <Loader inline='centered'>Loading</Loader>
        </Dimmer>
      );
    } else {
      data = (
        <Container>
          <h1>Courses</h1>
          <div>
            Search by Title:
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <input
                  type='text'
                  placeholder='Search courses'
                  value={this.state.search}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <i>Click on tags to see similar topics</i>
              <br />
              <br />
              <Button type='submit'>Search</Button>
              <Button onClick={this.clearFilter} type='submit' floated='right'>
                Clear
              </Button>
            </Form>
          </div>
          <br />
          <ResultList
            courses={this.state.results}
            receiveTag={this.receiveTag}
          />
        </Container>
      );
    }

    return <div>{data}</div>;
  }
}

export default CoursesContainer;
