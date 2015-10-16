
var friends_data = [
  {'party':'HDZ', 'votes': 0.32},
  {'party':'SDP', 'votes': 0.16},
  {'party':'Orah', 'votes': 0.22},
  {'party':'Živi zid', 'votes': 0.11},
  {'party':'HSS', 'votes': 0.11},
  {'party':'HNS', 'votes': 0.16},
  {'party':'HDSSB', 'votes': 0.05},
  {'party':'Most nezavisnih lista', 'votes': 0.01},
  {'party':'Stranka Milana Bandića', 'votes': 0.08},
  {'party':'Hrvatski laburisti', 'votes': 0.14},
  {'party':'IDS', 'votes': 0.12},
  {'party':'HSP AS', 'votes': 0.01},
  {'party':'HSU', 'votes': 0.01},
  {'party':'HSP', 'votes': 0.01},
  {'party':'ostali', 'votes': 0.16}
];

$(document).ready(function () {

  init_controls();

  change_btn_vote_style(currently_selected_vote);

  if (current_vote!=-1 && current_meta!=0) {
    show_results();
  }

});

function init_controls() {

  $("#question-vote button").click(function (e) {
    currently_selected_vote = this.attributes.party.value;
    change_btn_vote_style(currently_selected_vote);
    console.log('Odabrali ste stranku ' + friends_data[currently_selected_vote].party);
  });

  $("#question-meta").slider({
      ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80,90, 100],
      ticks_labels: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
      ticks_snap_bounds: 1
    }
  );

  $("#button-vote").click(function (e) {

    currently_selected_meta = $("#question-meta").val();

    if (currently_selected_vote!=-1 && currently_selected_meta!=0) {
      $('#current-vote-label').text('Glasovali ste za stranku ' + friends_data[currently_selected_vote].party + ' i predviđate da će dobiti ' + currently_selected_meta + '% glasova na izborima.');
    
      user_vote({'vote': currently_selected_vote, 
                 'meta': currently_selected_meta
                });
    }
    else {
      $('#current-vote-label').html('<span style="color:red">Molim vas odgovorite na oba pitanja!</span>');
    }

  });

  $('#question-vote button').hover(function () {
    if (currently_selected_vote != this.attributes.party.value) {
      $(this).removeClass('btn-default');
      $(this).addClass('btn-info');
    }
  }, function () {
    if (currently_selected_vote != this.attributes.party.value) {
      $(this).removeClass('btn-info');
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
      console.log("Vaša izborna jedinica (" + current_voting_region + ") je zabilježena.");
  });
}

function change_btn_vote_style(vote_value) {
  
  $('#question-vote button').removeClass('btn-info');
  $('#question-vote button').addClass('btn-default');
  
  if (vote_value != -1) {
    $('#question-vote button[party='+vote_value+']').removeClass('btn-default');
    $('#question-vote button[party='+vote_value+']').addClass('btn-info');
  }
  
}

function show_results() {
  $('#results').show(1000);

  drawStatisticsOfFriends(friends_data);
}

function hide_results() {
  $('#results').hide();
}

function user_vote(d) {

  current_vote = d.vote;
  current_meta = d.meta;

  console.log('Vaš glas za stranku ' + friends_data[current_vote].party + ' (redni broj ' + current_vote + ') je zabilježen.');
  console.log('Vaš odgovor na meta pitanje (' + current_meta + '%) je zabilježen.');

  show_results();

  // // TODO: Here goes ajax call!
  // var data = 'vote=' + vote_value;
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


function drawStatisticsOfFriends(data) {

  var margin = { top: 100, right: 20, bottom: 50, left: 150 },
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
  
  var x = d3.scale.linear().range([width, 0]);
  var y = d3.scale.ordinal().rangeRoundBands([0, height], .1);

  // TODO: Find better way to assign colors to parties!
  var color = d3.scale.ordinal()
    .range([d3.rgb(165,0,38), d3.rgb(244,109,67), d3.rgb(254,224,144), d3.rgb(116,173,209), d3.rgb(49,54,149)]);
  
  var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(10, "%")
    .orient("top");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  $("#statistics-of-friends").empty();
  
  var svg = d3.select("#statistics-of-friends").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([1.1*d3.max(friends_data.map(function(d){return d.votes;})),0]);
  y.domain(data.map(function(d){return d.party;}));
  
  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis)
  .append("text")
      .attr("x", width/2)
      .attr("dy", "-30px")
      .style("text-anchor", "center")
      .text("postotak glasova");
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  d3.selectAll(".axis text").style("font-size","15px");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("width", function(d) { return x(d.votes); })
      .attr("y", function(d) { return y(d.party); })
      .attr("height", y.rangeBand())
      .attr("fill", "steelblue")
      .transition()
      .duration(1500)
      .attrTween("width", function (d) {
        return d3.interpolate(0, x(d.votes));
      });
  
  svg.selectAll(".bar-text")
     .data(data)
  .enter().append("text")
      .attr("x", function(d) { return x(d.votes); })
      .attr("y", function(d) { return y(d.party); })
      .attr("dx",20)
      .attr("dy",15)
      .attr("text-anchor", "middle")
      .transition()
      .duration(1500)
      .tween("text", 
        function(d) {
            var i = d3.interpolate(this.textContent, Math.round(d.votes*100));
            return function(t) {
                this.textContent = Math.round(i(t)) + "%";
                };
        })
      .attrTween("x", function (d) {
        return d3.interpolate(0, x(d.votes));
      });
    
  }

