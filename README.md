An AngularJS directive to count characters in a text box and report state when the contents reach certain amount.

### Usage

By default, when the contents fill up 60% of the text box, the state changes to `warning`, and 80% to `danger`.

```
<input type="text" char-limit="20" cl-state-changed="clStateChanged(e)" />

<script src="angular.js"></script>
<script src="angular-char-limit.js"></script>
<script>
  var app = angular.module("DemoApp", ["angular-char-limit"]);
  app.controller("DemoCtrl", function ($scope) {
    $scope.clStateChanged = function (e) {
      $scope.state = e.state;
    }
  });
</script>
```

The default settings can be changed by providing custom ranges:

```
<input type="text" char-limit="20" cl-state-changed="clStateChanged(e)" cl-ranges="{easy:0, medium:5, hard:.8}" />
```

With this setting, the fifth character will trigger the "medium" state, and "hard" will be triggered when 80% of the box is filled up. 

The state changes to `exploded` when the amount of content reaches the limit.