
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

  drawStatisticsOfFriends(friends_data);
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
    .orient("top");

  var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(15, "%")
    .orient("left"); // vertical bars

  $("#statistics-of-friends").empty();
  
  var svg = d3.select("#statistics-of-friends").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([1.1*d3.max(friends_data.map(function(d){return d.votes;})),0]);
  y.domain(data.map(function(d){return d.party;}));
  
  svg.append("g")
      .attr("class", "x axis") // .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  .append("text") // .attr("transform", "rotate(-90)")
      .attr("x", width/2)
      .attr("dy", "-30px")
      .style("text-anchor", "center")
      .text("postotak glasova");
  svg.append("g")
      .attr("class", "y axis") // .attr("transform", "translate(-15,0)") // So that we aviod clash with axis label.
      .call(yAxis);

  // d3.selectAll(".axis text").style("font-size","15px");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0) //.attr("x", function(d) { return width - x(d.votes); })
      .attr("width", function(d) { return x(d.votes); })
      .attr("y", function(d) { return y(d.party); })
      .attr("height", y.rangeBand())
      .attr("fill", "steelblue")
      .transition()
      .duration(1500);
  
  // var state = svg.selectAll(".state")
  //     .data(data_postoci)
  // .enter().append("g")
  //     .attr("class", "g")
  //     .attr("transform", function (d) { return "translate(" + x0(d.godine) + ",0)"; });
  
  // state.selectAll("rect")
  //     .data(function (d) { return d.glasovi; })
  // .enter().append("rect")
  //     .attr("width", x1.rangeBand())
  //     .attr("x", function (d) { return x1(d.name); })
  //     .style("fill", function (d) { return color(d.name); })
  //     .attr("height", function (d) { return height - y(0); })
  //     .attr("y", function (d) { return y(0); })
  //     .transition()
  //     .duration(1500)
  //     .attr("height", function (d) { return height - y(d.value); })
  //     .attr("y", function (d) { return y(d.value); });
  
  // state.selectAll("text")
  // .data(function (d) { return d.glasovi; })
  // .enter(function (d) { return d.glasovi; }).append("text")
  //     .attr("y", function (d) { return y(0); })
  //     .attr("x", function (d) { return x1(d.name); })
  //     .attr("dx",20)
  //     .attr("dy",-5)
  //     .attr("text-anchor", "middle")
  //     .attr("font-family","sans-serif")
  //     .attr("font-size","17px")
  //     .attr("fill",function (d) { return color(d.name); })
  //     .transition()
  //     .duration(1500)
  //     .attr("y", function (d) { return y(d.value); })
  //     .tween("text", 
  //       function(d) {
  //           var i = d3.interpolate(this.textContent, Math.round(d.value*100));
  //           return function(t) {
  //               this.textContent = Math.round(i(t)) + "%";
  //               };
  //       });
  
  // // A bit of styling
  // d3.selectAll(".axis").style("font","10px sans-serif");
  // d3.selectAll(".axis path, .axis line")
  //   .style("fill","none")
  //   .style("stroke","#000")
  //   .style("shape-rendering","crispEdges");
  // d3.selectAll(".x.axis path");//.style("display","none");
  
  // var legend = svg.selectAll(".legend")
  //     .data(seriesNames.slice())
  // .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });
  
  // legend.append("rect")
  //     .attr("x", width - 18)
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);
  
  // legend.append("text")
  //     .attr("x", width - 24)
  //     .attr("y", 9)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .style("fill", color)
  //     .attr("font-size","15px")
  //     .text(function (d) { return d; })
  //     .on("click", function (d) {
  //         alert(d);
  //     });
    
  }

