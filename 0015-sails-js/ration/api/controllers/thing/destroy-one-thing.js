module.exports = {


  friendlyName: 'Destroy one thing',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    await Thing.destroy({ id: inputs.id });
    return this.exits.success();
  }


};
