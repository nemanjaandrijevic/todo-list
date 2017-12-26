// Backbone model

var Todo = Backbone.Model.extend({
  defaults: {
    todo: '',
    status: 'active'
  }
});


//Backbone Collection

var Todos = Backbone.Collection.extend({});

//instantiate a Collection

var todos = new Todos();

//Backbone View for one todo

var TodoView = Backbone.View.extend({
  model: new Todo(),
  tagName: 'tr',
  // className: 'todo-item',
  className: function() {
    var classes = [];

    // add default class
    classes.push('todo-item');

    // add another class based on model status
    if (this.model.get('status') == 'active') {
      classes.push("todo-item--active");
    } else {
      classes.push("todo-item--completed");
    }

    // return className as string
    // join func. converts array to string with given separator
    // ie. [1,2,3,4,5].join(', ') => "1, 2, 3, 4, "
    return classes.join(' ');
  },

  events: {
    'click .edit-todo': 'edit',
    'click .update-todo': 'update',
    'click .cancel': 'cancel',
    'click .delete-todo': 'delete',
    'click .todo-item-check': 'check'
  },

  initialize: function() {
    this.template = _.template( $('.todos-list-template').html() );
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  edit: function() {
    $('.edit-todo').hide();
    $('.delete-todo').hide();
    this.$('.update-todo').show();
    this.$('.canel').show();

    var todo = this.$('.todo').html();

    this.$('.todo').html('<input type="text" class="form-control todo-update" value="' + todo + '">');
  },

  update: function() {
    this.model.set('todo', $('.todo-update').val());
  },

  canel: function() {
    todosView.render();
  },

  delete: function() {
    this.model.destroy();
  },

  check: function(e) {
    // dom element
    var checkbox = e.currentTarget;
    // jquery element (wrapped dom element)
    // var $checkbox = $(checkbox);

    // if checkbox is checked or not => true|false
    var isChecked = checkbox.checked;
    // console.log('chb', checkbox, isChecked);

    // update model
    if (isChecked) {
      this.model.set('status', 'completed');
    } else {
      this.model.set('status', 'active');
    }
  },
});

//Backbone View for all todos

var TodosView = Backbone.View.extend({
  model: todos,

  el: $('.todos-list'),

  initialize: function() {
    var self = this;

    //Listen any change on Collection
    this.model.on('change add remove reset', function(e) {
      console.log('Collection changed ...');
      self.render();
    });
  },

  render: function() {
    var self = this;
    //clear html
    self.$el.html('');
    _.each(this.model.models , function(todo) {
      //create new todo view
      var itemView = new TodoView({
        model: todo
      });

      self.$el.append(itemView.render().$el);
    });
    return this;
  },
});

$(document).ready(function() {
  var todosView = new TodosView();

  $('.deleteAll').on('click', function(){
    todos.reset(null);
  });

  $('.add-todo').keypress(function(e) {
    if(e.which !== 13) {
      return;
    }

    if($('.todo-input').val() == ''){
      return;
    }

    if($('.todo-input').val().length < 4){
      $('.error-msg').html('Text must be at least 4 characters long');
      $('.error-msg').fadeIn();
      return;
    }

    $('.error-msg').fadeOut();

    //create a todo model
    var todo = new Todo({
      todo: $('.todo-input').val(),
    });

    //clean inputs
    $('.todo-input').val('');

    todos.add(todo);
  });

  $('.show-all').on('click', function() {
    $('.todo-item').show();
  });

  $('.show-active').on('click', function() {
    $('.todo-item--active').show();
    $('.todo-item--completed').hide();
  });
  
  $('.show-completed').on('click', function() {
    $('.todo-item--active').hide();
    $('.todo-item--completed').show();
  })
})
