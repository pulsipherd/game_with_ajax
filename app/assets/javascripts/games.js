var currentGame = {};
var showForm = false;
var editingGame;

function getGame(id) {
  $.ajax({
    url: '/games/' + id,
    method: 'GET'
  }).done(function (game) {
    if (editingGame) {
      var li = $("[data-id='" + id + "'").parent();
      $(li).replaceWith(game)
      editingGame = null
    } else {
      $('#games-list').append(game);
    }  
  });
}

$(document).ready( function () {
  $('.game-item').on('click', function () {
    currentGame.id = this.dataset.id
    currentGame.name = this.dataset.name
    $ajax({
      url: '/games/' + currentGame.id + '/characters',
      method: 'GET',
      dataType: 'JSON'
    }).done(function (characters) {
      $('#game').text('Characters in ' + currentGame.name)
      var list = $('#characters');
      list.empty();
      characters.forEach(function (char) {
        var li = '<li data-character-id="' + char.id + '">' + char.name + '-' + char.power + '</li>'
        list.append(li)
      });
    });
  });
});

$('#toggle').on('click', function toggle() {
  showForm = !showForm;
  $('#game-form').remove()
  $('#games-list').toggle()

  if (showForm) {

    $.ajax({
      url: '/game_form',
      method: 'GET'
      data: { id: editingGame}
    }).done(function(html) {
      $('#toggle').after(html);
    });
  }
});


$('#toggle').on('click', function () {
  toggle();
});



$(document).on('submit', '#game-form form', function(e) {
  // $(document).on('click', '.game-item', function() {
  // I can't figure out where this line goes. Does it replace line 47? It seems to do something a bit different, if it doesn't have the 'e'. Was that understood to have been needed? Okay. I think it goes at the bottom, on line 79, where I've put it.
  e.preventDefault();
  var data = $(this).serializeArray();
  var url: '/games',
  var method: 'POST',
  if (editingGame) {
    url = url + '/' + editingGame;
    method = 'PUT'
  }

  $.ajax({
    url: url,
    type: method,
  })

  }).done(function (game) {
    toggle();
    getGame(game.id);
    var g = '<li class="game-item" data-id="' + game.id + '" data-name="' + game.name + '">' + game.name + '_' + game.description + '</li>';
    name + '-' + game.description + '</li>';
    $('#games-list').append(g);
  }).fail(function (err) {
    alert(err.responseJSON.errors)
  });
});

$(document).on('click', '#edit-game', function () {
  editingGame = $(this).siblings('.game-item').data().id
  toggle();
});

$(document).on('click', '#delete-game', function () {
  var id = $(this).siblings('.game-item').data().id
  $.ajax({
    url: '/games/' + id,
    method: 'DELETE'
  }).done(function () {
    var row = $("[data-id='" + id + "']")
    // I added the close bracket where I did (despite it not being in the follow-along) because the other bracket is right after the quotes, so it would make sense to me for the end bracket to be inside the unquote. There are all sorts of strange things with quotes, though, that I don't quite understand. 
    row.parent().remove('li');
  });
});