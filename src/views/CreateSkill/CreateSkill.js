import React from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from "reactstrap";
import { CreatableSelect } from "@atlaskit/select";
// react plugin used to create DropdownMenu for selecting items
import Select from "react-select";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Creatable } from "react-select";
import Panelheader from "../../components/PanelHeader/PanelHeader";

const createOption = label => ({
  label,
  value: label.toLowerCase().replace(/\W/g, "")
});

class CreateSkill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOptions: [],
      selectOptionsSubSkill: [],
      name: "",
      id: "",
      input: "",
      isLoading: false,
      value: undefined,
      value2: undefined
    };
  }

  componentDidMount() {
    const decode = jwt_decode(localStorage.getItem("accessToken"));
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    axios
      .post(
        "https://localhost:5001/api/skill/get",
        {
          clientid: parseInt(localStorage.getItem("decoded"))
        },
        config
      )
      .then(response => {
        const selectOptions = response.data.map(item => ({
          value: item.id,
          label: item.name
        }));
        console.log(selectOptions);
        this.setState({ selectOptions: selectOptions });
      });
  }
  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitHandler = e => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    axios
      .post(
        "https://localhost:5001/api/subskill",
        {
          name: this.state.name,
          skillid: this.state.value.value,
          clientid: parseInt(localStorage.getItem("decoded"))
        },
        config
      )

      .then(response => {
        console.log("Hello world", response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value: newValue }, newState => {});

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    axios
      .post(
        "https://localhost:5001/api/subskill/get",
        {
          clientid: parseInt(localStorage.getItem("decoded")),
          skillid: newValue.value
        },
        config
      )
      .then(response => {
        const selectOptionsSubSkill = response.data.map(item => ({
          value: item.id,
          label: item.name
        }));
        console.log(selectOptionsSubSkill);
        this.setState({ selectOptionsSubSkill: selectOptionsSubSkill });
      });
  };
  handleChange2 = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value2: newValue }, newState => {
      console.log(this.state.value2);
      console.log(this.state.value);
    });
  };

  // ------------------------------- SKILL CREATING ------------------------------------->
  handleCreate = inputValue => {
    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    this.setState({ isLoading: true });
    console.group("Option created");
    console.log("Wait a moment...");
    const { selectOptions } = this.state;
    const newOption = createOption(inputValue);
    console.log(newOption.value);
    console.groupEnd();

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    axios
      .post(
        "https://localhost:5001/api/skill",
        {
          name: newOption.label,
          clientid: parseInt(localStorage.getItem("decoded"))
        },
        config
      )

      .then(response => {
        console.log("Hello world post response", response);
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
          }
        };
        axios
          .post(
            "https://localhost:5001/api/skill/get",
            {
              clientid: parseInt(localStorage.getItem("decoded"))
            },
            config
          )
          .then(response => {
            const selectOptions = response.data.map(item => ({
              value: item.id,
              label: item.name
            }));
            this.setState({ selectOptions });

            for (let index = 0; index < selectOptions.length; index++) {
              if (selectOptions[index].label === newOption.label) {
                console.log(selectOptions[index].value);
                newOption.value = selectOptions[index].value;
                console.log(newOption);
                console.log(selectOptions[index].value);
                this.setState({
                  isLoading: false,
                  selectOptions: [...selectOptions],
                  value: newOption
                });
              }
            }
          });
      })
      .catch(error => {
        console.log(error);
      });
    console.log(newOption);
  };
  // ------------------------------------------------------------------------------------------------>
  handleCreate2 = inputValue => {
    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    this.setState({ isLoading: true });
    console.group("Option created");
    console.log("Wait a moment...");
    const { selectOptions } = this.state;
    const newOption = createOption(inputValue);
    console.log(newOption);
    console.groupEnd();

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
      }
    };
    axios
      .post(
        "https://localhost:5001/api/subskill",
        {
          name: newOption.label,
          clientid: parseInt(localStorage.getItem("decoded")),
          skillid: this.state.value.value
        },
        config
      )

      .then(response => {
        console.log("Hello world post response", response);
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") + ""}`
          }
        };
        axios
          .post(
            "https://localhost:5001/api/subskill/get",
            {
              clientid: parseInt(localStorage.getItem("decoded")),
              skillid: this.state.value.value
            },
            config
          )
          .then(response => {
            const selectOptionsSubSkill = response.data.map(item => ({
              value: item.id,
              label: item.name
            }));
            this.setState({ selectOptionsSubSkill });

            for (let index = 0; index < selectOptionsSubSkill.length; index++) {
              if (selectOptionsSubSkill[index].label === newOption.label) {
                console.log(selectOptionsSubSkill[index].value);
                newOption.value = selectOptionsSubSkill[index].value;
                console.log(newOption);
                console.log(selectOptionsSubSkill[index].value);
                this.setState({
                  isLoading: false,
                  selectOptionsSubSkill: [...selectOptionsSubSkill],
                  value2: newOption
                });
              }
            }
          });
      })
      .catch(error => {
        console.log(error);
      });
    console.log(newOption);
  };
  render() {
    const { isLoading, options, value } = this.state;
    return (
      <div>
        <Panelheader size="sm" />
        <div className="content">
          <form onSubmit={this.submitHandler}>
            <Row>
              <Col xs="6">
                <Card className="card-chart">
                  <CardHeader>
                    <CardTitle>Select or create skill</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <CreatableSelect
                      isClearable
                      isLoading={isLoading}
                      onChange={this.handleChange}
                      onCreateOption={this.handleCreate}
                      options={this.state.selectOptions}
                      value={value}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card className="card-chart">
                  <CardHeader>
                    <CardTitle>Search and create subskill</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <CreatableSelect
                      isClearable
                      isLoading={isLoading}
                      onChange={this.handleChange2}
                      onCreateOption={this.handleCreate2}
                      options={this.state.selectOptionsSubSkill}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card className="card-chart">
                  <CardHeader>
                    <CardTitle>Create SubSkill</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <input
                      placeholder="Sub-Skill Name"
                      type="text"
                      name="name"
                      value={this.state.name}
                      onChange={this.changeHandler}
                    />
                    <p></p>
                    <input
                      placeholder="id"
                      type="number"
                      name="id"
                      value={this.state.id}
                      onChange={this.changeHandler}
                    />
                    <Button>go</Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateSkill;
