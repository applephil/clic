$(function() {

  _.templateSettings = {
    interpolate: /\{\{=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

  // TODO: populate this with sign-up values
  var SignUpModel = Backbone.Model.extend({

  });

  var LoggedInView = Backbone.View.extend({
    loggedInTemplate: _.template($('#make_template').html()),

    initialize: function() {

    },

    events: {

    },

    render: function() {
      this.$el.html(this.loggedInTemplate({

      }));
    }


  });

	var LoginView = Backbone.View.extend({

    loginFormTemplate: _.template($('#login_form_template').html()),

    initialize: function() {

    },

    events: {
      "click #sign_in_button": "signIn",
      "click #register_button": "register",
    },

    render: function() {
      this.$el.html(this.loginFormTemplate({
        email: ""
      }));

    },

    signIn: function() {
      var email = this.$("input[name=email]").val();
      var password = this.$("input[name=password]").val();

      var user = Parse.User.logIn(email, password, {
        success: function(user) {
          console.log("success logging in");
          router.navigate('', {trigger: true});
        },

        error: function(user, error) {
          console.log("Failed user log in: " + error.message);
        }
      });

    }

	});


  var RegisterView = Backbone.View.extend({

    registerFormTemplate: _.template($('#register_form_template').html()),

    events: {
      "click #register_button": "register"
    },

    register: function() {
      var email = this.$("input[name=email]").val();
      var password = this.$("input[name=password]").val();

      var user = new Parse.User();
      user.set('username', email);
      user.set('password', password);

      user.signUp(null, {
        success: function(user) {
          console.log("Success in registration");
          router.navigate('', {trigger: true});
        },
        error: function(user, error) {
          console.log("Failed user registration: code: " + error.code + ", " + error.message);
        }
      });

    },

    render: function() {
      this.$el.html(this.registerFormTemplate());
    }


  });


  // Router to manage single page application - based on
  // http://blog.viison.com/post/11097185009/how-to-switch-views-using-backbonejs
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      'register': 'register'
    },

    el: $("#content_view"),

    index: function() {
      if (Utils.isLoggedIn()) {
        this.loadView(new LoggedInView());
      } else {
        this.loadView(new LoginView());
      }
    },

    register: function() {
      this.loadView(new RegisterView());
    },

    // swap content_view 
    loadView: function(view) {
      this.view && this.view.remove();
      
      this.el.html(view.el);

      view.render();

      this.view = view;
    }

  });


  // START APP!
  var router = new Router();
  Backbone.history.start();

});




var Utils = {

  isLoggedIn: function() {
    if (Parse.User.current()) {
      return true;
    } else {
      return false;
    }
  }



};