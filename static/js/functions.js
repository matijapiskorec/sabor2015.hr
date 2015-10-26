
var sabor2015 = angular.module('sabor2015', []);

sabor2015.controller('sabor2015ctrl', ['$scope', '$http', function ($scope, $http) {

    $scope.user_info = {};

    $scope.setRegion = function(region) {
      $scope.user_info.vote_region = region;
      $scope.$apply();
    };

    $scope.setList = function(list) {
      $scope.user_info.vote_list = list;
      $scope.$apply();
    };

    $scope.setMeta = function(meta) {
      $scope.user_info.vote_meta = meta;
      $scope.$apply();
    };

    // Generic function for retrieving data
    $scope.getData = function(url) {
      $http(url)
        .success(function (data) {
          $scope.masterData = data;
          $scope.error = ''; // clear the error messages

        })
        .error(function (data, status) {
          if (status === 404) {
            $scope.error = 'Database not available!';
          } else {
            $scope.error = 'Error: ' + status;
          }
        });
    };

    // Generic function for retrieving data
    $scope.getFriendsData = function(url) {
      $http({url: url, method: 'GET'})
        .success(function (data) {
          $scope.friends_data = data;
          $scope.error = ''; // clear the error messages

        })
        .error(function (data, status) {
          if (status === 404) {
            $scope.error = 'Database not available!';
          } else {
            $scope.error = 'Error: ' + status;
          }
        });
    };

    // Following data is retrieved as soon as the web page loads
    // We could retrieve it through server's filesystem or through rest call
    // For retrieving from server's filesystem, depending on server's configuration you can also retrieve compressed json: user_info.json.gz

    // Data on user
    $scope.loadUserData = function(url) {
      $http({url: url, method: 'GET'})
        .success(function (data) {
          $scope.initial_user_info = data;
          $scope.error = ''; // clear the error messages

          if (data.returning_user) {
            $('#results').show(1000);
            $scope.getFriendsData("../data/friends_data.json");
            $scope.getVotesInTime("../data/votes_in_time.json");
          }

        })
        .error(function (data, status) {
          if (status === 404) {
            $scope.error = 'Database not available!';
          } else {
            $scope.error = 'Error: ' + status;
          }
      });
    };

    // TODO: This is loaded even on the welcome page. Maybe this is not neccessary?
    $scope.loadUserData("../data/new_user_info.json");
    // $scope.loadUserData("../data/user_info.json");


    // Data on political parties
    // $http({url: "../data/parties.json", method: 'GET'}) 
    $scope.loadPartiesData = function(url) {
      $http({url: url, method: 'GET'})
      .success(function (data) {
        $scope.parties = data;
        $scope.error = ''; // clear the error messages
      })
      .error(function (data, status) {
        if (status === 404) {
          $scope.error = 'Database not available!';
        } else {
          $scope.error = 'Error: ' + status;
        }
      });
    };

    // Data on election regions and lists in them
    // $http({url: "../data/election_regions.json", method: 'GET'}) 
    $scope.loadElectionRegionsData = function(url) {
      $http({url: url, method: 'GET'})
      .success(function (data) {
        $scope.election_regions = data;
        $scope.error = ''; // clear the error messages
      })
      .error(function (data, status) {
        if (status === 404) {
          $scope.error = 'Database not available!';
        } else {
          $scope.error = 'Error: ' + status;
        }
      });
    };

    // Data on election regions
    // $http({url: "../data/regions.json", method: 'GET'}) 
    $scope.loadRegionsData = function(url) {
      $http({url: url, method: 'GET'})
      .success(function (data) {
        $scope.regions = data;
        $scope.error = ''; // clear the error messages
      })
      .error(function (data, status) {
        if (status === 404) {
          $scope.error = 'Database not available!';
        } else {
          $scope.error = 'Error: ' + status;
        }
      });
    };

    // Data on votes in time
    $scope.getVotesInTime = function(url) {
      $http({url: url, method: 'GET'})
        .success(function (data) {
          $scope.votes_in_time = data;
          $scope.error = ''; // clear the error messages
        })
        .error(function (data, status) {
          if (status === 404) {
            $scope.error = 'Database not available!';
          } else {
            $scope.error = 'Error: ' + status;
          }
        });
    };

    // TODO: THIS SHOULD BE LOADED FROM SERVER WITH AJAX CALL!
    $scope.totalNumberOfVotes = Math.floor(Math.random()*10000);

    // Data on election regions
    // $http({url: "../data/election_regions_locations.json", method: 'GET'}) 
    $scope.loadElectionRegionsLocations = function(url) {
      $http({url: url, method: 'GET'})
      .success(function (data) {
        $scope.election_regions_locations = data;
        $scope.error = ''; // clear the error messages
      })
      .error(function (data, status) {
        if (status === 404) {
          $scope.error = 'Database not available!';
        } else {
          $scope.error = 'Error: ' + status;
        }
      });
    };

}]);


// Buttons for mockup loading of user data
sabor2015.directive('loadUserData', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      $(element).html(
        '<button id="button-old-user" class="btn btn-lg btn-default">Stari korisnik</button>'
      );

      $("#button-old-user").click(function (e) {
        scope.loadUserData("../data/user_info.json");
      });

    }};

}); 


sabor2015.directive('regions', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      // size="2" is a workaround so that first option is not automatically selected
      // https://github.com/davidstutz/bootstrap-multiselect/issues/129
      $(element).html(
        '<select id="question-region" size="2"></select>'
      );

      scope.loadRegionsData(attrs.url);

      scope.$watch('regions', function (newData, oldData) {

        if (!newData) { return; }

        var regions = newData; // regions is also in controller scope

        regions.forEach( function(d) {
            $('#question-region').append(
              '<option value="' + d.id + '">' + d.label + '</option>'
              );
          });

        $("#question-region").multiselect({
          nonSelectedText: 'Odaberite izbornu jedinicu...',
          onChange: function(option, checked, select) {
            scope.setRegion($(option).val());
            }
        });

      });

      scope.$watchGroup(['regions','initial_user_info.vote_region'], function (newData, oldData) {

        if (!newData[0] || !newData[1]) { return; }
        $("#question-region").multiselect('select', newData[1]);

        console.log('Inicijalna izborna jedinica je postavljena na ' + newData[1]);
      });

      scope.$watch('user_info.vote_region', function (newData, oldData) {

        if (!newData) { return; }

        console.log('Korisnik je odabrao izbornu jedinicu ' + newData);
      });

    }};

}); 


sabor2015.directive('questionList', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      // size="2" is a workaround so that first option is not automatically selected
      // https://github.com/davidstutz/bootstrap-multiselect/issues/129
      $(element).html(
        '<select id="question-list" size="2"></select> ' + 
        '<div id="selected-list-label"></div>'
      );

      $("#question-list").multiselect({
        nonSelectedText: 'Prije izbora stranke odaberite izbornu jedinicu!',
        maxHeight: 200,
        onChange: function(option, checked, select) {
            scope.setList($(option).val());
          }
      });

      // Build dropdown menu for parties based on chosen election region
      var buildMenuLists = function (vote_region) {
          $('#question-list').empty();
          var parties_in_region = scope.election_regions.filter(function(d){return _.includes(d.regions,Number(vote_region));});
          parties_in_region.forEach( function(d) {
              $('#question-list').append(
                '<option value="' + d.list_id + '">' + d.short_name + '</option>'
                );
            });
          $("#question-list").multiselect('setOptions',{
            nonSelectedText: 'Odaberite stranku iz izborne jedinice ' + vote_region + '...'
          });
          $('#question-list').multiselect('rebuild');
      }

      var updateSelectedListLabel = function(vote_list) {
          $('#selected-list-label').empty();
          $('#selected-list-label').append('Odabrali ste sljedeću listu stranaka:')
          var temp_parties = _.pluck(_.where(scope.election_regions,{'list_id':Number(vote_list)}), 'parties');
          var parties = temp_parties[0].split(',').map(function(d){return d.trim();});

          parties.forEach( function(d) {
              $('#selected-list-label').append(
                '<p style="margin-bottom:0px;">' + d + '</p>'
                );
            });
      }

      scope.loadElectionRegionsData(attrs.url);

      scope.$watchGroup(['election_regions','initial_user_info.vote_region','initial_user_info.vote_list'], function (newData, oldData) {

        if ( !newData[0] || !newData[1] || !newData[2]) { return; }
        
        // election_regions = newData[0]; // new
        buildMenuLists(newData[1]); // new
        updateSelectedListLabel(newData[2]);
        
        $("#question-list").multiselect('select', newData[2]);

        console.log('Inicijalna izborna jedinica za koju je korisnik glasao je ' + newData[1] + ' pa smo izgradili izbornik lista. Korisnik je glasao za stranku ' + newData[2]);

      });

      scope.$watch('user_info.vote_region', function (newData, oldData) {

        if ( !newData ) { return; }
        buildMenuLists(newData);

        // We have to reset the vote for list to some default value because that list maybe doesn't exist in the new region.
        // scope.setList("4");  // THIS GIVES ERRORS BECAUSE THE CHANGE PROPAGATES ALL THE WAY TO CALCULATION OF LABEL FOR LIST OF PARTIES
        // scope.setList("-1"); // This gives error for reasons unknown to me.
        scope.user_info.vote_list = "-1"; // This works.

        $('#selected-list-label').empty();
        console.log('Ups, netko je postavio novu izbornu jedinicu (' + newData + '), moramo resetirati liste!');

      });

      scope.$watch('user_info.vote_list', function (newData, oldData) {

        if ( !newData ) { return; }
        if (newData==-1) { return; } // This means that vote got reset after choosing new region, do nothing.
        updateSelectedListLabel(newData);
        console.log('Korisnik je odabrao listu ' + newData + ' iz ' + scope.user_info.vote_region + ' izborne jedinice.');

      });

    }};

}); 


sabor2015.directive('questionMeta', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      $(element).html(
        '<div class="slider-row">' +
        '<input id="question-meta" type="text" data-slider-min="0"' + 
        ' data-slider-max="100" data-slider-step="1" data-slider-value="0" />' +
        '</div>'
        );

      $("#question-meta").slider({
        ticks: [0, 25, 50, 75, 100],
        ticks_labels: ['0%', '25%', '50%', '75%', '100%'],
        ticks_snap_bounds: 1
      }
      );

      $("#question-meta").on('slideStop', function(e) {
        // console.log(e.value);
        scope.setMeta(e.value);
      });
      

     scope.$watch('initial_user_info.vote_meta', function (newData, oldData) {

        if (!newData) { return; }

        $("#question-meta").slider('setValue',newData);

        console.log('Inicijalna vrijednost meta pitanja je ' + newData);
      });

    }};

}); 


sabor2015.directive('buttonVote', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      $(element).html(
        '<div style="height:5px;clear:both;"></div>' +
        '<p id="current-vote-label"></p>' +
        '<div style="height:5px;clear:both;"></div>' +
        '<button id="button-vote" class="btn btn-lg btn-default">Glasaj</button>'
      );

      $("#button-vote").click(function (e) {

        // User has to change at least one question (from his previous session) in order to submit a new vote
        // And the vote for list must not be -1 because this means that he changed a region in the meantime

        // TODO: UNDER ONE SESSION, USER CAN SUBMIT AS MANY ANSWERS AS HE WANTS, EVEN IF THEY ARE ALL THE SAME! 
        // TODO: IF USER CHANGES HIS VOTE AND THEN RETURNS THE OLD VALUES BEFORE SUBMITTING, HE WILL BE ABLE TO SUBMIT ALTHOUGH ANSWERS ARE THE SAME!

        if ( (scope.user_info.vote_region || scope.initial_user_info.vote_region ) && // region should be defined
             (scope.user_info.vote_list || scope.initial_user_info.vote_list ) && scope.user_info.vote_list!=-1 && // list should be defined and not reset (-1)
             (scope.user_info.vote_meta || scope.user_info.vote_meta==0 || scope.initial_user_info.vote_meta || scope.initial_user_info.vote_meta==0 ) && // meta should be defined, but it could also be 0
             (scope.user_info.vote_region || scope.user_info.vote_list || scope.user_info.vote_meta || scope.user_info.vote_meta==0 ) // at least one new information, otherwise no use in voting
             ) {

          // All values which are not set by the user in this session should be taken from initialization
          var region = scope.user_info.vote_region ? scope.user_info.vote_region : scope.initial_user_info.vote_region;
          var list = scope.user_info.vote_list ? scope.user_info.vote_list : scope.initial_user_info.vote_list;
          var meta = scope.user_info.vote_meta || scope.user_info.vote_meta==0 ? scope.user_info.vote_meta : scope.initial_user_info.vote_meta;

          var list_name = _.pluck(_.where(scope.election_regions,{'list_id':Number(list)}), 'short_name');
          $('#current-vote-label').text('Glasali ste za izbornu listu ' + list_name + ' (' + region + ' izborna jedinica) i predviđate da će dobiti ' + meta + '% glasova na izborima.');
        
          user_vote({'list': list, 
                     'meta': meta,
                     'region': region
                    });
        }
        else {
          $('#current-vote-label').html('<span style="color:red">Molim vas odgovorite na sva tri pitanja!</span>');
        }

      });

      var user_vote = function (d) {

        var list_name = _.pluck(_.where(scope.election_regions,{'list_id':Number(d.list)}), 'parties');
        console.log('Glasali ste za stranku ' + list_name + ' (' + d.region + ' izborna jedinica) i predviđate da će dobiti ' + d.meta + ' glasova na izborima.');

        $('#results').show(1000);
        scope.getFriendsData("../data/friends_data.json");
        scope.getVotesInTime("../data/votes_in_time.json");

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

    }};

}); 

sabor2015.directive('results', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

     scope.$watch('friends_data', function (newData, oldData) {

        if (!newData) { return; }
        var friends_data = newData;

        $(element).show(1000);

        $('#total-votes-friends').text(
          friends_data.map(function(d){return d.votes})
                      .reduce(function(prev,curr){return curr + prev;})
        );

        // TODO: DATA ON TOTAL VOTES SHOULD BE LOADED IN CONTROLER AND APPROPRIATE WATCH PUT SOMEWHERE HERE! 
        $('#total-votes').text("555");

      });

    }};

}); 


sabor2015.directive('statisticsOfFriends', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

     // scope.$watch('friends_data', function (newData, oldData) {
     scope.$watchGroup(['election_regions','friends_data'], function (newData, oldData) {

        if (!newData[0] || !newData[1]) { return; }

        var friends_data = newData[1];
        var election_regions = newData[0];

        var data = friends_data.map(function(d){return {
          "list": _.pluck(_.where(election_regions,{'list_id':Number(d.list)}),'short_name')[0],
          "votes": d.votes
        };});
        data.sort(function(a,b){return b.votes-a.votes;});

        // All lists that together make less than 10% of friend's votes are aggregated to one category
        var reduceData = function(data) {
          var totalNumberOfVotes = data.map(function(d){return d.votes})
                .reduce(function(prev,curr){return curr + prev;});
          var reducedData = [];
          var currentSumVotes = 0;
          var data_the_rest = {"list": "ostali", "votes": 0};
          data.forEach(function(d){
            if (currentSumVotes>= 0.9*totalNumberOfVotes) {
              data_the_rest.votes += d.votes;
            }
            else {
              reducedData.push(d);
            }
            currentSumVotes = currentSumVotes + d.votes;
          });
          reducedData.push(data_the_rest);
          return reducedData;
        };

        // var data = reduceData(data);

        // This could go outside watch but then we have problems with duplication of text labels...

        $(element).html(
          '<div id="statistics-of-friends"></div>'
        );

        var margin = { top: 50, right: 20, bottom: 20, left: 200 },
            width = 500 - margin.left - margin.right;
        var height = friends_data.length*30 - margin.top - margin.bottom;
        
        var x = d3.scale.linear().range([width, 0]);
        var y = d3.scale.ordinal().rangeRoundBands([0, height], .1);

        // TODO: Find better way to assign colors to parties!
        var color = d3.scale.ordinal()
          .range(["#3f007d","#54278f","#6a51a3","#807dba","#9e9ac8","#bcbddc","#dadaeb","#efedf5","#fcfbfd"]);
          // .range([d3.rgb(165,0,38), d3.rgb(244,109,67), d3.rgb(254,224,144), d3.rgb(116,173,209), d3.rgb(49,54,149)]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .ticks(10) // .ticks(10, "%")
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

        // ... up to here.

        x.domain([1.1*d3.max(data.map(function(d){return d.votes;})),0]);
        y.domain(data.map(function(d){return d.list;}));
        
        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis)
        .append("text")
            .attr("x", width/2)
            .attr("dy", "-30px")
            .style("text-anchor", "center")
            .text("glasovi prijatelja");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        d3.selectAll(".axis text").style("font-size","12px");

        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("width", function(d) { return x(d.votes); })
            .attr("y", function(d) { return y(d.list); })
            .attr("height", y.rangeBand())
            .attr("fill", "steelblue") //.attr("fill", function(d){return color(d.list);})
            //.attr("stroke","black")
            .transition()
            .duration(1500)
            .attrTween("width", function (d) {
              return d3.interpolate(0, x(d.votes));
            });
        
        svg.selectAll(".bar-text")
           .data(data)
        .enter().append("text")
            .attr("x", function(d) { return x(d.votes); })
            .attr("y", function(d) { return y(d.list); })
            .attr("dx",20)
            .attr("dy",15)
            .attr("text-anchor", "middle")
            .transition()
            .duration(1500)
            // .tween("text", 
            //   function(d) {
            //       var i = d3.interpolate(this.textContent, d.votes); // Math.round(d.votes*100));
            //       return function(t) {
            //           this.textContent = Math.round(i(t)); // this.textContent = Math.round(i(t)) + "%";
            //           };
            //   })
            .attrTween("x", function (d) {
              return d3.interpolate(0, x(d.votes));
            });

      });

    }};

}); 


sabor2015.directive('questionExtra', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      $(element).html(
          '<select id="question-parties" multiple="multiple"></select>' +
          '<div style="height:5px;clear:both;"></div>' +
          '<p id="vote-parties-label"></p>' +
          '<div style="height:5px;clear:both;"></div>' +
          '<button id="button-vote-parties" class="btn btn-lg btn-default">Glasaj</button>'
        );

      $("#button-vote-parties").click(function (e) {

          // We can fetch selected parties in onChange callback of multiselect, but it's better to do it directly here.
          var selected_parties = [];
          $('#question-parties option:selected').each(function(i,d){
              selected_parties.push($(this).val()); // If we want text then use $(this).text()
          });

          if (selected_parties.length!=0) {
            var selected_parties_names = selected_parties.map(function(d){return _.pluck(_.where(scope.parties,{'party_id':Number(d)}),'name')[0];});
            $('#vote-parties-label').text('Sljedeće stranke simpatizirate: ');
            selected_parties_names.forEach(function(d) {
               $('#vote-parties-label').append('<p style="margin-bottom:0px;">' + d + '</p>');
            });

            user_vote_extra({'parties': selected_parties});
          }
          else {
            $('#vote-parties-label').html('<span style="color:red">Molim vas odaberite barem jednu stranku koju simpatizirate!</span>');
          }

      });

     var user_vote_extra = function (d) {

        console.log('Simpatizirate sljedeće stranke: ' + d.parties );

        // TODO: Here goes ajax call!

      }

      scope.loadPartiesData(attrs.url);

      scope.$watch('parties', function (newData, oldData) {

        if (!newData) { return; }
        
        newData.forEach( function(d) {
            $('#question-parties').append(
              '<option value="' + d.party_id + '">' + d.name + '</option>'
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

      });

      // For returning users, after login we update the state of all questions based on what we retrieved from database.
      scope.$watchGroup(['regions','initial_user_info.vote_parties'], function (newData, oldData) {

        if (!newData[0] || !newData[1]) { return; }
        $('#question-parties').multiselect('select', newData[1]);
        
        console.log('Inicijalne stranke koje se simpatiziraju su ' + newData[1]);
      });


    }};

}); 


sabor2015.directive('votesInTime', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

     scope.$watch('votes_in_time', function (newData, oldData) {

        if (!newData) { return; }

        var data = newData;

        data.forEach(function(d) {
          d.time = d3.time.format("%d/%m/%Y %H").parse(d.time);
        });

        var margin = {top: 20, right: 20, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(d3.time.day)
            .tickFormat(d3.time.format("%e.%m."))
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.time); })
            .y(function(d) { return y(d.votes); });

        $(element).html(
          '<div id="votes-in-time"></div>'
        );

        $("#votes-in-time").empty();

        var svg = d3.select("#votes-in-time").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) { return d.time; }));
        y.domain(d3.extent(data, function(d) { return d.votes; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .append("text")
            .attr("x", width/2) // .attr("dy", ".71em")
            .attr("dy", "3em")
            .style("text-anchor", "middle")
            .text("Vrijeme");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)") //.attr("y", 10)
            .attr("x", height/2)
            .attr("dx", "-6.5em")
            .attr("dy", "-2.5em")
            .style("text-anchor", "end")
            .text("Ukupni broj glasova");

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

      });

    }};

}); 


sabor2015.directive('progressChart', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      $(element).html(
        '<div id="progress-chart"></div>'
      );

      scope.$watch('totalNumberOfVotes', function (newData, oldData) {

        if (!newData) { return; }
        var totalNumberOfVotes = newData;
        
        $('#progress-chart').empty();

        var width = 300,
          height = 300,
          radius = Math.min(width, height) / 2;

        var total_votes = 10000;

        var color_rim = d3.rgb(44,123,182); // bluish
        var color_center = d3.rgb(215,25,28); // redish
        var color_empty = d3.rgb(200, 200, 200);

        var svg = d3.select("#progress-chart").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var arc_zero = d3.svg.arc()
          .innerRadius(radius - 0.20 * radius) // 0.45 * radius)
          .outerRadius(radius - 0.05 * radius) // 0.05 * radius)
          .startAngle(0);

        var path_zero = svg.append("path")
          .datum({
            endAngle: 2 * Math.PI
          })
          .attr("fill", color_empty)
          .attr("d", arc_zero);

          var progress_ratio = totalNumberOfVotes / total_votes;

          var arc = d3.svg.arc()
            .innerRadius(radius - 0.20 * radius) // 0.45 * radius)
            .outerRadius(radius - 0.05 * radius); // 0.05 * radius);

          var za_arc = svg.append("path")
            .datum({
              startAngle: 0,
              endAngle: 0
            })
            .attr("fill", color_rim)
            .attr("d", arc)
            .transition()
            .duration(2000)
            .attrTween("d", function (d) {
              var interpolate = d3.interpolate(d.endAngle, progress_ratio*2*Math.PI); //ratio_protiv * 2 * Math.PI);
              return function (t) {
                d.endAngle = interpolate(t);
                $('.votes-all').text(Math.floor(t*totalNumberOfVotes));
                return arc(d);
              }
            });

          // // TODO: Animated text that updates the total number of votes, but I don't know where to put it:-(
          // svg.append("text")
          //   .attr("dy", "0.5em") //.attr("dy", ".75em")
          //   .attr("y", 0) //.attr("y", -0.15 * radius)
          //   .attr("x", 0)
          //   .attr("text-anchor", "middle")
          //   .attr("font-family", "sans-serif")
          //   .attr("font-size", "22px")
          //   .attr("fill", color_rim)
          //   .text("0")
          //   .transition()
          //   .duration(2000)
          //   .tween("text",
          //     function () {
          //       var i = d3.interpolate(this.textContent, totalNumberOfVotes);
          //       return function (t) {
          //         this.textContent = Math.round(i(t)) + " glasova";
          //       };
          //     });

          svg.append("circle")
            .attr("cy", 0)
            .attr("cx", 0)
            .attr("r", radius - 0.20 * radius - 0.02 * radius)
            .attr("fill", color_center);

          svg.append("text")
            .attr("y", -0.05 * radius)
            .attr("x", 0)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "65px")
            .attr("fill", "white")
            .text("sabor");

          svg.append("text")
            .attr("y", 0.35 * radius)
            .attr("x", 0)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "50px")
            .attr("fill", "white")
            .text("2015.hr");

      });


    }};

}); 


sabor2015.directive('findRegion', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      $(element).html(
        '<input id="find-region-input" type="text">' + 
        '<div id="find-region-list" style="max-height:200px;overflow-y:scroll;width:500px;"></div>'
      );

      scope.loadElectionRegionsLocations(attrs.url);

      scope.$watch('election_regions_locations', function (newData, oldData) {

        if (!newData) { return; }
        
        var election_regions_locations = newData;

        // TODO: Some other options which are probably not needed at this time...
        // threshold: 0.6, location: 0, distance: 100, maxPatternLength: 32

        var options = {
            caseSensitive: false,
            includeScore: false,
            shouldSort: true,
            keys: ["location","county"] // TODO: Maybe is better to search just by location?
          };

        var fuse = new Fuse(election_regions_locations, options);

        $('#find-region-input').on('keyup', function(e) {
            $('#find-region-list').empty();
            var result = fuse.search($(this).val());

            result.forEach( function(d) {
                $('#find-region-list').append(
                  '<p style="margin-bottom:0px;">' + d.location + ', ' + d.county + ', ' + d.election_region + '. izborna jedinica</p>'
                  );
              });

        });


      });


    }};

}); 



sabor2015.directive('statisticsOfFriendsCircle', function ($parse) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

     scope.$watchGroup(['election_regions','friends_data'], function (newData, oldData) {

        if (!newData[0] || !newData[1]) { return; }

        var friends_data = newData[1];
        var election_regions = newData[0];

        var data = friends_data.map(function(d){return {
          "list": _.pluck(_.where(election_regions,{'list_id':Number(d.list)}),'short_name')[0],
          "votes": d.votes
        };});
        data.sort(function(a,b){return b.votes-a.votes;});

        // This could go outside watch but then we have problems with duplication of text labels...

        $(element).html(
          '<div id="statistics-of-friends-circle"></div>'
        );

        var margin = { top: 20, right: 20, bottom: 20, left: 20 },
            width = 800 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;
        var radius = Math.min(width, height) / 2;
        
        $("#statistics-of-friends-circle").empty();
        
        var svg = d3.select("#statistics-of-friends").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g");

        svg.append("g")
          .attr("class", "slices");
        svg.append("g")
          .attr("class", "labels");
        svg.append("g")
          .attr("class", "lines");

        // ... up to here.

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d.votes;
          });

        var arc = d3.svg.arc()
          .outerRadius(radius * 0.7) // 0.8)
          .innerRadius(radius * 0.6); // 0.4);

        var outerArc = d3.svg.arc()
          .innerRadius(radius * 0.7)
          .outerRadius(radius * 0.7); // 0.9);

        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var key = function(d){ return d.data.list; };

        // All lists that together make less than 10% of friend's votes are aggregated to one category
        var reduceData = function(data) {
          var totalNumberOfVotes = data.map(function(d){return d.votes})
                .reduce(function(prev,curr){return curr + prev;});
          var reducedData = [];
          var currentSumVotes = 0;
          var data_the_rest = {"list": "ostali", "votes": 0};
          data.forEach(function(d){
            if (currentSumVotes>= 0.9*totalNumberOfVotes) {
              data_the_rest.votes += d.votes;
            }
            else {
              reducedData.push(d);
            }
            currentSumVotes = currentSumVotes + d.votes;
          });
          reducedData.push(data_the_rest);
          return reducedData;
        };

        var data = reduceData(data);

        // TODO: Adding default color ("#fcfbfd") multiple times at the end ensures that color never repeats.
        //       This could be done smarter. 
        var color = d3.scale.ordinal()
          .domain( data.map(function(d){return d.list;}) )
          .range(["#3f007d","#54278f","#6a51a3","#807dba","#9e9ac8","#bcbddc","#dadaeb","#efedf5","#fcfbfd","#fcfbfd","#fcfbfd","#fcfbfd","#fcfbfd","#fcfbfd"]);

        change(data);
        

        function change(data) {

          /* ------- PIE SLICES -------*/
          var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

          slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.list); })
            .attr("class", "slice");

          slice   
            .transition().duration(1000)
            .attrTween("d", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                return arc(interpolate(t));
              };
            })

          slice.exit()
            .remove();

          /* ------- TEXT LABELS -------*/

          var text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

          text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d) {
              return d.data.list + ' (' + d.data.votes + ')';
            });

          function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
          }

          text.transition().duration(1000)
            .attrTween("transform", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = 0.85 * radius * (midAngle(d2) < Math.PI ? 1 : -1); // 0.85 finetunes horizontal distance
                return "translate("+ pos +")";
              };
            })
            .styleTween("text-anchor", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
              };
            });

          text.exit()
            .remove();

          /* ------- SLICE TO TEXT POLYLINES -------*/

          var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);
          
          polyline.enter()
            .append("polyline");

          polyline.transition().duration(1000)
            .attrTween("points", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.80 * (midAngle(d2) < Math.PI ? 1 : -1); // 0.80 finetunes horizontal distance
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
              };      
            });
          
          polyline.exit()
            .remove();

        };

      });

    }};

}); 

