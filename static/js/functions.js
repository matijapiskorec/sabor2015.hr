
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

// Get them while they are hot: http://www.izbori.hr/140zas/kandid/1/kandid.html
var election_regions = [
  {'party_id': 1, 'short_name': 'Lista Alena Džombe', 'party': 'ALBANSKA, BOŠNJAČKA, CRNOGORSKA, MAKEDONSKA I SLOVENSKA NACIONALNA MANJINA, ALEN DŽOMBA (kandidat), NAPRIJED HRVATSKA! - PROGRESIVNI SAVEZ IVE JOSIPOVIĆA, UDRUGA BOŠNJAKA BRANITELJA DOMOVINSKOG RATA VUKOVARSKO - SRIJEMSKE ŽUPANIJE, BOŠNJAČKO KULTURNO UMJETNIČKO DRUŠTVO "BEHAR" GUNJA ', 'regions': [12]},
  {'party_id': 2, 'short_name': 'Lista Alije Avdića', 'party': 'ALBANSKA, BOŠNJAČKA, CRNOGORSKA, MAKEDONSKA I SLOVENSKA NACIONALNA MANJINA, ALIJA AVDIĆ, dipl. krim. (kandidat), STRANKA BOŠNJAKA HRVATSKE - SBH ', 'regions': [12]},
  {'party_id': 3, 'short_name': 'A - HSP', 'party': 'AUTOHTONA - HRVATSKA STRANKA PRAVA - A - HSP', 'regions': [1,2,3,4,5,6,7,8,9,10]},
  {'party_id': 4, 'short_name': 'Naprijed Hrvatska!', 'party': 'NAPRIJED HRVATSKA! - PROGRESIVNI SAVEZ IVE JOSIPOVIĆA, NARODNA STRANKA - REFORMISTI - REFORMISTI, STRANKA HRVATSKIH UMIROVLJENIKA - UMIROVLJENICI, ZELENI FORUM, DUBROVAČKI DEMOKRATSKI SABOR - DDS ', 'regions': [1,2,4,7,8]},
  {'party_id': 5, 'short_name': 'HKS, HSP, OS', 'party': 'HRVATSKA KONZERVATIVNA STRANKA - HKS, HRVATSKA STRANKA PRAVA - HSP, OBITELJSKA STRANKA - OS ', 'regions': [1,2,3,4,5,6,7,8,9,10,11]},
  {'party_id': 6, 'short_name': 'SDP, HNS, HSU, Laburisti, A-HSS, ZS', 'party': 'SOCIJALDEMOKRATSKA PARTIJA HRVATSKE - SDP, HRVATSKA NARODNA STRANKA - LIBERALNI DEMOKRATI - HNS, HRVATSKA STRANKA UMIROVLJENIKA - HSU, HRVATSKI LABURISTI - STRANKA RADA, AUTOHTONA - HRVATSKA SELJAČKA STRANKA - A - HSS, ZAGORSKA STRANKA - ZS, SAMOSTALNA DEMOKRATSKA SRPSKA STRANKA - SDSS', 'regions': [1,2,3,4,5,6,7,8,9,10]},
  {'party_id': 7, 'short_name': 'HDZ, HSS, HSP AS, BUZ, HSLS, HRAST, HDS, ZDS', 'party': 'HRVATSKA DEMOKRATSKA ZAJEDNICA - HDZ, HRVATSKA SELJAČKA STRANKA - HSS, HRVATSKA STRANKA PRAVA DR. ANTE STARČEVIĆ - HSP AS, BLOK UMIROVLJENICI ZAJEDNO - BUZ, HRVATSKA SOCIJALNO - LIBERALNA STRANKA - HSLS, HRVATSKI RAST - HRAST, HRVATSKA DEMOKRŠĆANSKA STRANKA - HDS, ZAGORSKA DEMOKRATSKA STRANKA - ZDS ', 'regions': [1,2,3,4,5,6,7,8]},
  {'party_id': 8, 'short_name': 'Živi Zid', 'party': 'ŽIVI ZID', 'regions': [2,3,4,5,6,7,8]},
  {'party_id': 9, 'short_name': 'ORaH', 'party': 'ODRŽIVI RAZVOJ HRVATSKE - ORaH', 'regions': [1,2,3,4,5,6,7,8,9,10]},
];

var parties = [
  {'id': 1, 'name': 'SOCIJALDEMOKRATSKA PARTIJA HRVATSKE - SDP'},
  {'id': 2, 'name': 'HRVATSKA DEMOKRATSKA ZAJEDNICA - HDZ'},
  {'id': 3, 'name': 'NAPRIJED HRVATSKA! - PROGRESIVNI SAVEZ IVE JOSIPOVIĆA'},
  {'id': 4, 'name': 'HRVATSKA SELJAČKA STRANKA - HSS'},
  {'id': 5, 'name': 'ODRŽIVI RAZVOJ HRVATSKE - ORaH'},
  {'id': 6, 'name': 'ŽIVI ZID'}
];

$(document).ready(function () {

  init_controls();

  if (current_vote!=-1 && current_meta!=0) {
    show_results();
  }

});

function init_controls() {

  $("#question-vote").multiselect({
    nonSelectedText: 'Prije izbora stranke odaberite izbornu jedinicu!',
    onChange: function(option, checked, select) {
        currently_selected_vote = $(option).val();

        console.log('Odabrali ste sljedeću listu:');

        $('#currently-selected-party-label').empty();
        $('#currently-selected-party-label').append('Odabrali ste sljedeću listu:')
        var temp_parties = _.pluck(_.where(election_regions,{'party_id':Number(currently_selected_vote)}), 'party');
        var currently_selected_parties = temp_parties[0].split(',').map(function(d){return d.trim();});

        console.log(currently_selected_parties);

        currently_selected_parties.forEach( function(d) {
            $('#currently-selected-party-label').append(
              '<p style="margin-bottom:0px;">' + d + '</p>'
              );
          });
      }
  });

  $("#question-region").multiselect({
    nonSelectedText: 'Odaberite izbornu jedinicu...',
    onChange: function(option, checked, select) {
        currently_selected_region = $(option).val();
        currently_selected_vote = -1; // Reset the vote because maybe it doesn't exist in new election region.
        
        console.log('Odabrali ste izbornu jedinicu ' + currently_selected_region );

        $('#current-vote-label').empty();
        $('#currently-selected-party-label').empty();

        // Build dropdown menu for parties based on chosen election region
        $('#question-vote').empty();
        var parties_in_region = election_regions.filter(function(d){return _.includes(d.regions,Number(currently_selected_region));});
        parties_in_region.forEach( function(d) {
            $('#question-vote').append(
              '<option value="' + d.party_id + '">' + d.short_name + '</option>'
              );
          });
        $("#question-vote").multiselect('setOptions',{
          nonSelectedText: 'Odaberite stranku iz izborne jedinice ' + currently_selected_region + '...'
        });
        $('#question-vote').multiselect('rebuild');
      }
  });

  $("#question-meta").slider({
      ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80,90, 100],
      ticks_labels: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
      ticks_snap_bounds: 1
    }
  );

  $("#button-vote").click(function (e) {

    currently_selected_meta = $("#question-meta").val();

    if (currently_selected_vote!=-1 && currently_selected_meta!=0 && currently_selected_region!=-1) {
      var temp_party = _.pluck(_.where(election_regions,{'party_id':Number(currently_selected_vote)}), 'short_name');
      // $('#current-vote-label').text('Glasali ste za stranku ' + temp_party + ' (' + currently_selected_region + ' izborna jedinica) i predviđate da će dobiti ' + currently_selected_meta + '% glasova na izborima.');
      $('#current-vote-label').text('Glasali ste za izbornu listu ' + temp_party + ' (' + currently_selected_region + ' izborna jedinica) i predviđate da će dobiti ' + currently_selected_meta + '% glasova na izborima.');
    
      user_vote({'vote': currently_selected_vote, 
                 'meta': currently_selected_meta,
                 'region': currently_selected_region
                });
    }
    else {
      $('#current-vote-label').html('<span style="color:red">Molim vas odgovorite na sva tri pitanja!</span>');
    }

  });

  // TODO: For returning users, after login we should update the state of all questions based on what we retrieve from database.
  parties.forEach( function(d) {
      $('#question-parties').append(
        '<option value="' + d.id + '">' + d.name + '</option>'
        );
    });

  $("#question-parties").multiselect({
    maxHeight: 200,
    enableCaseInsensitiveFiltering: true,
    buttonText: function(options, select) {
      if (options.length === 0) {
          return 'Odaberite stranke koje simpatizirate...';
      }
      else 
      if (options.length===1) {
          return  '1 stranka odabrana';
      }
      else if (options.length===2 || options.length===3) {
          return  options.length + ' stranke odabrane';
      }
      else {
          return options.length + ' stranki odabranih';
      }
    }
  });

  $("#button-vote-extra").click(function (e) {

    // We can fetch selected parties in onChange callback of multiselect, but it's better to do it directly here.
    selected_parties = [];
    $('#question-parties option:selected').each(function(i,d){
        selected_parties.push($(this).val()); // If we want text then use $(this).text()
    });

    if (selected_parties.length!=0) {
      var selected_parties_names = selected_parties.map(function(d){return _.pluck(_.where(parties,{'id':Number(d)}),'name')[0];});
      $('#current-vote-extra-label').text('Sljedeće stranke simpatizirate: '); // + selected_parties_names.join(', '));
      selected_parties_names.forEach(function(d) {
         $('#current-vote-extra-label').append('<p style="margin-bottom:0px;">' + d + '</p>');
      });

      user_vote_extra({'parties': selected_parties});
    }
    else {
      $('#current-vote-extra-label').html('<span style="color:red">Molim vas odaberite barem jednu stranku koju simpatizirate!</span>');
    }

  });

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
  current_region = d.region;

  var temp_party = _.pluck(_.where(election_regions,{'party_id':Number(current_vote)}), 'party');
  console.log('Glasali ste za stranku ' + temp_party + ' (' + current_region + ' izborna jedinica) i predviđate da će dobiti ' + current_meta + ' glasova na izborima.');

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

function user_vote_extra(d) {

  console.log('Vaš glas za stranke koje simpatizirate je zabilježen:');
  console.log(d.parties);

  // TODO: Here goes ajax call!

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

