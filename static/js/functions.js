
$(document).ready(function () {

  // draw_results();

  init_controls();

  change_btn_vote_style(current_vote);

  if (current_vote!=-1) {
    show_results();
  }

});

function init_controls() {

  $("#question-vote button").click(function (e) {
    current_vote = this.attributes.party.value;
    change_btn_vote_style(current_vote);
    console.log('Odabrali ste stranku ' + current_vote);
  });

  $("#question-meta").slider({
      ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80,90, 100],
      ticks_labels: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
      ticks_snap_bounds: 1
    }
  );

  $("#button-vote").click(function (e) {
    user_vote({'vote': current_vote, 
               'meta': $("#question-meta").val()
              });
  });

  $('#question-vote button').hover(function () {
    if (current_vote != this.attributes.party.value) {
      $(this).removeClass('btn-default');
      $(this).addClass('btn-success');
    }
  }, function () {
    if (current_vote != this.attributes.party.value) {
      $(this).removeClass('btn-success');
      $(this).addClass('btn-default');
    }
  });

  $('#voting-region li').click(function (e) {
    current_voting_region = this.attributes.region_id.value;
    console.log('Odabrali ste izbornu jedinicu ' + current_voting_region);
  });
  $('#voting-region li a').click(function (e) {
    event.preventDefault()
    $('#chosen-field-text').text($(this).text());
    $('#chosen-field-text').val($(this).text());
  });

  $("#button-submit-extra").click(function (e) {
    if(current_voting_region==-1) {
      console.log("Nite odabrali izbornu jedinicu");
    }
      console.log("Odgovori poslani.");
  });
}

function change_btn_vote_style(vote_value) {
  
  $('#question-vote button').removeClass('btn-success');
  $('#question-vote button').addClass('btn-default');
  
  if (vote_value != -1) {
    $('#question-vote button[party='+vote_value+']').removeClass('btn-default');
    $('#question-vote button[party='+vote_value+']').addClass('btn-success');
  }
  
}

function show_results() {
  // $('#results').removeClass('results-hidden');
  // $('#results').addClass('results-visible');
  $('#results').show(1000);

  $('#current-vote').text(current_vote);
  $('#current-meta').text(current_meta);
}

function hide_results() {
  // $('#results').removeClass('results-visible');
  // $('#results').addClass('results-hidden');
  $('#results').hide();
}

function user_vote(d) {

  current_vote = d.vote;
  current_meta = d.meta;
  console.log('Glasali ste za stranku ' + current_vote);
  if (current_meta) {
    console.log('Vase meta pitanje je ' + current_meta);
  }
  else {
    console.log('Niste odgovorili na meta pitanje:-(');
  }

  show_results();

  // var data = 'vote=' + vote_value;
  // //start the ajax
  // $.ajax({
  //   url: "/vote/",
  //   type: "POST",
  //   data: data,
  //   cache: true,
  //   success: function (data, textStatus, jqXHR) {
  //     current_vote = data;
  //     change_btn_vote_style(current_vote);
  //     change_vote_msg(current_vote);
  //     draw_results();
  //   },
  //   complete: function (jqXHR, textStatus) {},
  //   error: function (jqXHR, textStatus, errorThrown) {}
  // });

}
