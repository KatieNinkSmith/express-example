const React = require("react");

class Edit extends React.Component {
  render() {
    console.log("Edit");
    return (
      <form
        action={`/api/vegetables/${this.props.id}/edit?_method=PUT`}
        method="POST"
      >
        Name:{" "}
        <input
          type="text"
          name="name"
          defaultValue={this.props.vegetable.name}
        />{" "}
        <br />
        Color:{" "}
        <input
          type="text"
          name="color"
          defaultValue={this.props.vegetable.color}
        />{" "}
        <br />
        Is Ready to Eat:
        {this.props.vegetable.readyToEat ? (
          <input type="checkbox" name="readyToEat" defaultChecked />
        ) : (
          <input type="checkbox" name="readyToEat" />
        )}
        <br />
        <input type="submit" name="" value="Edit Vegetable" />
      </form>
    );
  }
}

module.exports = Edit;
