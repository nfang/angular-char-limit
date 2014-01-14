"use strict";

(function () {

angular.module("angular-char-limit", [])
  .factory("CharLimitObserver", function () {

    function parseRange(ranges, max) {
      var inverted = {}, rngStarts = [], rngObj = {}, rngName, rngVal, i, len;

      for (rngName in ranges) {
        rngVal = ranges[rngName] >= 1 ? ranges[rngName] : parseInt(ranges[rngName] * max);
        rngStarts.push(rngVal);
        inverted[rngVal] = rngName;
      }
      rngStarts.sort();
      for (i = 0, len = rngStarts.length; i < len; i++) {
        (function (idx) {
          if (idx === (len - 1)) {
            rngObj[inverted[rngStarts[idx]]] = [rngStarts[idx], max];
          } else {
            rngObj[inverted[rngStarts[idx]]] = [rngStarts[idx], rngStarts[idx+1]];  
          }
        })(i);
      }

      return rngObj;
    }

    var CharLimitObserver = function (text, limit, ranges) {
      var lmt = parseInt(limit)
        , rangeObj = ranges || { "safe": 0, "warning": .6, "danger": .8 };

      this.text = text;
      this.limit = lmt < text.length ? text.length : lmt;
      this.ranges = parseRange(rangeObj, lmt);
    }

    CharLimitObserver.prototype.getState = function () {
      var len = this.text.length, state;

      if (len >= this.limit) {
        state = "exploded";
      } else {
        for (var stateName in this.ranges) {
          if (this.ranges[stateName][0] <= len && len < this.ranges[stateName][1]) {
            state = stateName;
            break;
          }
        }
      }
      return { len: len, limit: this.limit, state: state };
    }

    CharLimitObserver.prototype.update = function (text) {
      this.text = text;
      return this;
    }

    return CharLimitObserver;
  })
  .directive("charLimit", ["CharLimitObserver", function (CharLimitObserver) {
    return {
      restrict: "A",
      
      scope: {
        limit          : "@charLimit",
        clRanges       : "@",
        clStateChanged : "&"
      },

      controller: function ($scope) {
        var curState = "";

        $scope.notify = function () {
          var stateObj = $scope.observer.getState();

          if (curState !== stateObj.state) {
            curState = stateObj.state;
            $scope.$apply(function () {
              $scope.clStateChanged({ e: stateObj });
            });
          }
        }
      },
      
      link: function (scope, element, attrs) {
        var ranges = scope.$eval(scope.clRanges);
        scope.observer = new CharLimitObserver(element.val(), scope.limit, ranges);

        element.bind("keyup", function () {
          scope.observer.update(element.val());
          scope.notify();
        });
      }
    }
  }]);

})();