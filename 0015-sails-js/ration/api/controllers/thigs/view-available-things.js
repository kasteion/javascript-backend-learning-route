module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Available things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/thigs/available-things'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
