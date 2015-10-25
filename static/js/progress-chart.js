

var progressChart = angular.module('progressChart', []);

progressChart.controller('progressChartCTRL', ['$scope', '$http', function ($scope, $http) {

    // TODO: THIS SHOULD BE LOADED FROM SERVER WITH AJAX CALL!
    $scope.totalNumberOfVotes = Math.floor(Math.random()*10000);

}]);


progressChart.directive('progressChart', function ($parse) {
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

// // TODO: IT IS NOT POSSIBLE TO HAVE TO ANGULAR APPS IN THE SAME PAGE, SO YOU HAVE TO MANUALLY BOOTSTRAP THEM
// angular.bootstrap($('#progress-chart'),['progressChart']);