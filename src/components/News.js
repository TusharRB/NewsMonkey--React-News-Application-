import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string, // pts
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(20);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=631111b0f2d343f4b0774ccc184ecdd3&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(50);
    let parseData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parseData.articles,
      totalResults: parseData.totalResults,
      loading: false,
    });

    this.props.setProgress(100);
  }

  // Run Methodology => 1.constructor() =>  2.render() =>  3.componentDidMount()

  async componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  };

  handleNextClick = async () => {
    // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))){
    //     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=631111b0f2d343f4b0774ccc184ecdd3&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
    //     this.setState({loading:true})
    //     let data = await fetch(url);
    //     let parseData = await data.json()
    //     // this.setState({loading:false})
    //     this.setState({
    //         page: this.state.page + 1,
    //         articles: parseData.articles,
    //         loading:false
    //     })
    // }
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };

  fetchMoreData = async() => {

    this.setState({page:this.state.page + 1})
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=631111b0f2d343f4b0774ccc184ecdd3&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    let data = await fetch(url);
    let parseData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parseData.articles),
      totalResults: parseData.totalResults,
      loading: false,
    });
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: "35px 0" }}>
          NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          Headlines
        </h1>

        {this.state.loading && <Spinner />}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
        //   loader={<h4>Loading...</h4>}
          loader={<Spinner />}
        >
            <div className="container">
          <div className="row">
            {/* col-md-4 => Medium Device */}

            {!this.state.loading &&
              this.state.articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 70) : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* 
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1}
                        onClick={this.handlePrevClick}
                        className="btn btn-primary my-5">&larr; Previous</button>
                    <button onClick={this.handleNextClick}
                        disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
                        className="btn btn-primary my-5">Next &rarr;</button>
                </div> */}
      </>
    );
  }
}

export default News;
