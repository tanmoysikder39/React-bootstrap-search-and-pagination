import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  Button,
  Modal,
  Input,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";

export class App extends Component {
  constructor(props) {
    super(props);
    // this.getItems();

    this.state = {
      item: [],
      searchArray: [],
      newInfoModal: false,
      columns: [
        {
          dataField: "albumId",
          text: "Album ID",
          sort: true,
        },
        {
          dataField: "id",
          text: "ID",
          sort: true,
        },
        {
          dataField: "title",
          text: "Title",
          sort: true,
          filter: textFilter(),
        },
        // {
        //   dataField: "url",
        //   text: "Image",
        //   sort: true,
        //   filter: textFilter(),
        // },
        {
          text: "Format Button",
          formatter: this.formatButton,
          sort: true,
        },
      ],
    };
  }

  formatButton = (cell, row) => {
    if (row.title) {
      return (
        <div>
          <button
            onClick={() =>
              this.viewInfo(row.thumbnailUrl, row.title, row.id, row.albumId)
            }
            className="btn btn-success"
          >
            Show Row Info In Modal
          </button>
        </div>
      );
    }
  };
  // getItems = async () => {
  //   try {
  //     let data = await axios({
  //       method: "get",
  //       url: "https://jsonplaceholder.typicode.com/photos",
  //     }).then(({ data }) => data);
  //     console.log(data);
  //     this.setState({
  //       item: data,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  componentDidMount() {
    axios
      .get("https://jsonplaceholder.typicode.com/photos")
      .then((res) => {
        this.setState({
          item: res.data,
        });

        console.log(res.data);
        this.searchArray = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //for search
  onChangeHandler(e) {
    console.log(e.target.value);
    let newArray = this.searchArray.filter((d) => {
      console.log(d);
      let searchValue = d.title.toLowerCase();

      return searchValue.indexOf(e.target.value) !== -1;
    });
    this.setState({
      item: newArray,
    });
  }

  // for modal
  toggleInfo() {
    this.setState({ newInfoModal: true });
  }

  handleClose = () => {
    this.setState({ newInfoModal: false });
  };

  viewInfo(thumbnailUrl, title, id, albumId) {
    this.setState({ newInfoModal: !this.state.newInfoModal });
    localStorage.setItem("albumId", albumId);
    localStorage.setItem("id", id);
    localStorage.setItem("title", title);
    localStorage.setItem("thumbnailUrl", thumbnailUrl);
  }

  render() {
    return (
      <div className="App">
        <input
          value={this.state.value}
          onChange={this.onChangeHandler.bind(this)}
          type="text"
          placeholder="Search for..."
          style={{
            float: "right",
            width: "20%",
            marginBottom: "10",
            borderColor: "#000",
            borderWidth: "1",
          }}
        />
        <BootstrapTable
          columns={this.state.columns}
          keyField="id"
          data={this.state.item}
          pagination={paginationFactory()}
          striped
          hover
          condensed
          bootstrap4
          filter={filterFactory()}
        />
        <Button color="#fff" onClick={this.toggleInfo.bind(this)}></Button>
        <Modal isOpen={this.state.newInfoModal} size="lz">
          <ModalHeader>
            Modal Header <button onClick={this.handleClose}>x</button>
          </ModalHeader>

          <ModalBody>
            <div>
              <img
                src={localStorage.getItem("thumbnailUrl")}
                height={200}
                alt=""
              />
              <Input
                value={localStorage.getItem("title")}
                style={{ marginTop: "10" }}
              />
              <Input
                value={localStorage.getItem("id")}
                style={{ marginTop: "10" }}
              />

              <Input
                value={localStorage.getItem("albumId")}
                style={{ marginTop: "10" }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={this.handleClose} className="btn btn-primary">
              Cancle
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
