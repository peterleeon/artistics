// ******* TODO ********

var app = angular.module("myTestApp",  ['ngAnimate', 'ui.router', 'ui.bootstrap'])

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        // route to show our basic form (/form)
        .state('homes', {
            url: '/homes',
            templateUrl: 'home.html',
            css: "style.css"
        })

        // Condition: steps
        .state('steps', {
            url: '/steps',
            templateUrl: 'conditions.html',
            controller: 'ShoppingController as shop'
        })
        .state('steps.t1', {
            url: '/t1',
            templateUrl: 'steps/steps_t1.html'
        })
        .state('steps.t2', {
            url: '/t2',
            templateUrl: 'steps/steps_t2.html'
        })
        .state('steps.t3', {
            url: '/t3',
            templateUrl: 'steps/steps_t3.html'
        })

        .state('steps.thankyoupage', {
            url: '/thankyoupage',
            template: '<h1>Thank you. </h1>'
                      + '<p>Your coverage is: {{coverageRate}}%</p>'
                      + '<p>Copy this code back to MTurk page: {{mturkcode}}</p>'
        })

        .state('onecondition', {
          url: '/onecondition',
          controller: 'ShoppingController as shop'
        })

        // url will be /form/interests
        .state('nothingtoshow', {
            url: '/nothingtoshow',
            template: '<h1>This is nothing on this page</h1>'
        });

      // catch all route
      // send users to the form page
      // $urlRouterProvider.otherwise('/baseline/t1');
})

.controller('codeService', ['$scope', function($scope) {
  $scope.mturkcode = 'ok'
  $scope.$on('updateCode', function(event, data) {
    console.log(data);

    $scope.mturkcode = data
  })
}])

.controller('ShoppingController',[ '$rootScope','$scope', '$http', '$state', function($rootScope,$scope, $http, $state) {

  const stateMachineModel = t2sm.FSM.fromJSON(finiteStateMachine)
  const fsm = stateMachineModel
  console.log(fsm)
  var stateMachineModelExisting
  $scope.mturkcode = ''

  var mathRandom = Math.floor(Math.random() * 2)
  console.log(mathRandom)
  var condition = ''
  // if (mathRandom == 0) {
    condition = 'followMe'
    $state.go("steps.t1")
  // } else {
  //   condition = 'baseline'
  //   $state.go("steps.t2")
  // } 
  
  // condition = 'steps'
  // $state.go("steps.t2")
  
  var shop = this;
  shop.tags = allTags;
  shop.items = itemData
  $scope.selectedItems = itemData
  $scope.numItem = 4
  $scope.startItem = 0
  $scope.logs = []
  shop.numItems = 0
  shop.addedItemList = []
  shop.addedItemListCache = []
  shop.searchString = ''
  shop.quantity = [0,1,2,3,4,5,6]
  $scope.otherWorkerSteps = exitingPath
  $scope.currentWorkerSteps = []
  $scope.taskInd = 0
  $scope.coverageRate = 0
  $scope.startRecording = false
  // get worker code from the server side
  $http.get('/getCode'). then(function(data) {
    console.log(data['data']);
    $scope.mturkCode = data['data']
    $scope.finalResult = [{
      condition: condition,
      workerCode: $scope.mturkCode,
      time: (new Date()).getTime()
    }]
  })

  var flag = 0
  $scope.flag1 = 0

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    event.preventDefault();
  });
  const str = '{"initial":"start","states":{}}'
  const fsm2 = t2sm.FSM.fromJSON(JSON.parse(str));
  // baseline functions
  $scope.startBaselineFirstTask = function() {
    var contents = document.getElementById('showexample')
    
    // new t2sm.StateMachineDisplay(fsm, contents)
    
    fsm2.setActiveState("start");
    // const fsm2 = new t2sm.FSM();

    var contents2 = document.getElementById('showexample1')
    
    function myDisplay(fod) {
        const body = document.createElement('body');
        const content = document.createElement('div');
        const element = fod.getElement();
        // content.style.width = "90px"
        element.appendChild(body);
        body.setAttribute('style', 'font-family: Helvetica, Arial, Sans-Serif; font-size: 10px')
        body.appendChild(content);
        console.log(fod)
        if(fod.getDisplayType() == 0) {
          content.textContent = "State: " + fod.getName();
          element.addEventListener('click', function() {
            intermediateState(fod.getName())
          })
          if (fod.getName() == "(start)") {
            // remove this thing
            content.id = 'needToRemoveState'
            // content.click()
          }
          
        } else {
          content.textContent = "Action: " + fod.payload;
          console.log("Please click a state")
          if (fod.getName() == "transition_0") {
            // remove this thing
            content.id = 'needToRemove'
            // content.click()
          }
          
        }
    }

    function intermediateState(clickedState) {
      $('button#filterButton-2').removeClass('active')

      if (clickedState == 'searching') {
        fsm.setActiveState("searching");
        fsm2.setActiveState("searching");
        $scope.cleanUpBefore()
        // add 'watermelon' in the input box
        shop.searchString = 'Toy cars'
        shop.search()
        $scope.$apply()
      } else if (clickedState == 'filtering') {
        fsm.setActiveState("filtering");
        fsm2.setActiveState("filtering");
        $scope.cleanUpBefore()
        // button is down
        $('button#filterButton-2').addClass('active')
        // call filtering
        shop.filterItems('Toys')
        $scope.$apply()
      } else if (clickedState == 'itemList') {
        fsm.setActiveState("itemList");
        fsm2.setActiveState("itemList");
        $scope.cleanUpBefore()
        $scope.$apply()
      } else if (clickedState == 'cart_checking') {
        fsm.setActiveState("cart_checking");
        fsm2.setActiveState("cart_checking");
        // modal show
        $("#myModal").modal();
      } else if (clickedState == 'start') {
        fsm.setActiveState("start");
        fsm2.setActiveState("start");
        $scope.cleanUpBefore()
        $scope.$apply()
      }
      $scope.finalResult.push({
        type: "clicking states",
        elementId: clickedState,
        time: (new Date()).getTime()
      })
      
      updateTheWrap()
    }

    
    const a = new t2sm.StateMachineDisplay(fsm2, contents2, myDisplay);
    $('#SvgjsSvg1006').css('min-height', '200px');
    $('#SvgjsSvg1006').css('min-width', '200px');
    $('#SvgjsRect1016').remove()
    $('#needToRemove').remove()
    
    fsm.on('transitionFiredEvent', (event) => {
        const {transition} = event;
        console.log(transition)
        const from = fsm.getTransitionFrom(transition);
        const to = fsm.getTransitionTo(transition);
        if(!fsm2.hasState(from)) {
            fsm2.addState(fsm.getStatePayload(from), from);
        }
        if(!fsm2.hasState(to)) {
            fsm2.addState(fsm.getStatePayload(to), to);
        }
        if(!fsm2.hasTransition(transition)) {
            fsm2.addTransition(from, to, fsm.getTransitionAlias(transition), fsm.getTransitionPayload(transition), transition);
        }
        fsm2.fireTransition(transition, event);
    });
    $scope.cleanUpBefore =function() {
      shop.numItems = 0
        shop.addedItemList = []
        $scope.startItem = 0
        shop.searchString = ''
        $scope.selectedItems = shop.items
        $scope.removeAllWraps()
    }
    // fsm.fireTransition(st);
    // $scope.formStateMachine()


    $scope.startRecording = true
    //set everything to the initial state
    shop.numItems = 0
    shop.addedItemList = []
    $scope.startItem = 0
    shop.searchString = ''
    $scope.selectedItems = shop.items
  }

  $scope.setNewState = function() {
    shop.addedItemList = task3Data
    shop.numItems = 0
    shop.addedItemList.forEach(function(item, index){
      shop.numItems += item.itemQty
    })
  }

  // step condition functions
  $scope.startStepsConditionFirstTask = function() {
    $scope.startRecording = true
    $scope.showInstructions = !$scope.showInstructions
    stateMachineModelExisting = t2sm.FSM.fromJSON(existingTraceTask1)
    $scope.startBaselineFirstTask()
    $scope.currentWorkerSteps = []
    // show steps
    $scope.taskInd = 1
    flag = 1
    // trigger the state machine model
    $scope.resetExistingStateMachineModel()
    // fsm2.removeTransition(fsm2.getOutgoingTransitions('(start)')[0])
    // fsm2.removeState('(start)')
    console.log("worker's current state: ", stateMachineModel.getActiveState());
  }

  $scope.resetExistingStateMachineModel = function() {
    stateMachineModel.setActiveState("start");
    //check all the transition states
    var curStateExistingTrace = 'start'
    var curStateObj = stateMachineModelExisting.getState(curStateExistingTrace)
    var outGoingTransitionArr = curStateObj.outgoingTransitions
    
    // find all the related region
    var regionArr = []
    for(var i = 0; i < outGoingTransitionArr.length; i++) {
      regionArr.push(outGoingTransitionArr[i]['alias']);
    }
    // highlight regionArr
    // regionArr.forEach(function(item) {
    //   $scope.wrapUpWithFieldSet(item)
    // })
  }

  $scope.wrapUpWithFieldSet = function(item) {
    console.log(item)
    if (item == 'Navigate' && (!shop.disablePrePageButton() && !shop.disableNextPageButton())) {

    } else {
      var elementID = lookUpForWrapDiv[item]
      var domElement = document.querySelector( '#'+elementID ) 
      var myEl = angular.element( domElement );
      myEl.addClass('elementlistwrap');
    
    }
    // myEl.wrap("<fieldset id='"+elementID+"' style='border: 2px solid red;'></fieldset>");
    // $('fieldset#'+elementID).prepend('<legend style="width:auto">Please DO NOT interact with the elements right now. Read instruction!</legend>')
  }

  $scope.restartStepsConditionFirstTask = function() {
    // $scope.currentWorkerSteps = []
    
    // $scope.startBaselineFirstTask()
    // $scope.restartTask()
    // go and reset. ..
    fsm.setActiveState("start");
    fsm2.setActiveState("start");
    $scope.cleanUpBefore()
  }

  $scope.restartTask = function() {
    $scope.removeAllWraps()
    $scope.resetExistingStateMachineModel()
  }

  $scope.removeAllWraps = function() {
    // remove all wrap style
    $('legend').remove()
	
    var cnt = $("fieldset").contents();
    $("fieldset").replaceWith(cnt);
    for(var action in lookUpForWrapDiv) {
      var elementID = lookUpForWrapDiv[action]
      var myEl = angular.element( document.querySelector( '#'+elementID ) );
      myEl.removeClass('elementlistwrap');
    }
  }

  $scope.startStepsConditionSecondTask = function() {
    
    stateMachineModelExisting = t2sm.FSM.fromJSON(existingTraceTask2)
    $scope.currentWorkerSteps = []
    $scope.taskInd = 2
    $scope.removeAllWraps()
    $scope.startBaselineFirstTask()
    $scope.resetExistingStateMachineModel()
  }

  $scope.restartStepsConditionSecondTask = function() {
    $scope.currentWorkerSteps = []
    $scope.startBaselineFirstTask()
    $scope.restartTask()
  }

  $scope.startStepsConditionThirdTask = function() {
    stateMachineModelExisting = t2sm.FSM.fromJSON(existingTraceTask3)
    $scope.currentWorkerSteps = []
    $scope.startBaselineFirstTask()
    $scope.taskInd = 3
    $scope.setNewState()
    $scope.removeAllWraps()
    $scope.resetExistingStateMachineModel()
  }

  $scope.restartStepsConditionThirdTask = function() {
    $scope.setNewState()
    $scope.currentWorkerSteps = []
    $scope.restartTask()
  }

  $scope.eventsOnTheTaskPanel = function(e) {
    if (e.target.getAttribute('id')) {
      $scope.logData(e)
    }
  }

  $scope.logData = function(e) {
    console.log(e.type,e.target.getAttribute('id'));
    if (e.target.getAttribute('id') != 'submitThridTaskButton') {
      $scope.checkGoals()
    }
    if (e.type == 'click') {
      $scope.finalResult.push({
        type: e.type,
        elementId: e.target.getAttribute('id'),
        url: $(location).attr('href'),
        time: (new Date()).getTime()
      })
    }
    if (e.type == 'keypress') {
      $scope.finalResult.push({
        type: e.type,
        content: e.key,
        elementId: e.target.getAttribute('id'),
        url: $(location).attr('href'),
        time: (new Date()).getTime()
      })
    }
  }

  $scope.checkGoals = function() {
    console.log();
    if ($scope.taskInd <= 3) {
      var text = $('.panel-heading').text().indexOf('Watermelon')
      if (text != -1) {
        $scope.isGoalAchieved = true;
        // alert('Congrats you found it! You can submit and move on.')
      } else {
        $scope.isGoalAchieved = false
      }
    } else if ($scope.taskInd == 2) {
      var isDone = false
      for (var i = 0; i < shop.addedItemList.length; i++) {
        var item = shop.addedItemList[i]
        if (item['itemName'] == 'iPhone' && item['itemQty'] == 2) {
          isDone = true
          $scope.isGoalAchieved = true;
          break;
        }
      }
      if (!isDone) {
        $scope.isGoalAchieved = false;
      }
    } else if ($scope.taskInd == 3){
      if (shop.addedItemList.length < 3) {
        $scope.isGoalAchieved = true;
      } else {
        $scope.isGoalAchieved = false
      }
    }
  }

  $scope.pushDataInWorkerSteps = function(e) {
    $scope.currentWorkerSteps.push({
      action: e.type,
      element: e.target.getAttribute('id'),
      key: e.type == "keypress"? e.key:''
    })
  }

  $scope.clicking = function(e) {
    console.log($scope.coverageRate)
    if (e.target.getAttribute('id') && e.target.getAttribute('id') != "elementlistwrap") {
      $scope.logData(e)
      // step condition
      if (flag != 0) {
        if (e.type == 'keypress') {
          if (e.key == 'Enter') {
            $scope.pushDataInWorkerSteps(e)
          } else  {
            var prev_action = $scope.currentWorkerSteps[$scope.currentWorkerSteps.length - 1]
            if (prev_action.action != 'keypress' || prev_action.key == "Enter") {
              $scope.pushDataInWorkerSteps(e)
            }
          }
        } else {
          $scope.pushDataInWorkerSteps(e)
        }
        //stateMachineModel.transition(action, element)
        updateStates(e)
      }

      // state machine visualization condition
      if ($scope.flag1 !=0) {
        $scope.currentWorkerSteps.push({
          action: e.type,
          element: e.target.getAttribute('id')

        })
        // cleanStateMachine()
        appendNode({
          action: e.type,
          element: e.target.getAttribute('id')
        })
        // setStateMachine({
        //   action: e.type,
        //   element: e.target.getAttribute('id')
        // }, 'svg1-canvas')
      }
    }
  }
  // transfer steps trace into a state machine
  $scope.formStateMachine = function() {
    var traceArray = exampleTrace
    var tempFSM = new t2sm.FSM()
    console.log(tempFSM)
    for (var i = 0; i < traceArray.length; i++) {
      if (traceArray[i].hasOwnProperty('elementId')) {
        var step = traceArray[i]['type'] + " " + traceArray[i]['elementId']
        var transition = handcraft_ui_model[step]
        
        if (i > 0) { // if this is not the first transition
          var preStep = traceArray[i-1]['type'] + " " + traceArray[i-1]['elementId']
          var lastTransition = handcraft_ui_model[preStep]
          if (transition != lastTransition) { // if the current transtion isn't the same as the last one, creat new state
            var newState = tempFSM.addState();
            var currentState = tempFSM.getActiveState()
            const tName = tempFSM.addTransition(currentState, newState, transition,transition);
            // change active state
            tempFSM.fireTransition(tName)
          }
        } else {  // if this is the firs transition 
          var newState = tempFSM.addState();
          const tName = tempFSM.addTransition('(start)', newState, transition,transition);
        }
        
      }
    }
    console.log(tempFSM)
  }
  
  function updateStates(e) {
    var action = e.type
    var elementID = e.target.getAttribute('id')
    var key = e.key
    var eventAction = action + " " + elementID
    if (key == 'Enter') {
      eventAction = action + " Enter " + elementID
    }
    //update the state in the true state machine
    for (var transition in handcraft_ui_model) {
      if (eventAction.indexOf(transition) != -1) {
        stateMachineModel.fireTransition(handcraft_ui_model[transition])
      }
    }
    updateTheWrap()
    $scope.coverageRate = (100 * fsm2.transitionLabels.size / fsm.transitionLabels.size).toFixed(1)
  }

  function updateTheWrap() {

    var currentState = stateMachineModel.getActiveState()
    // remove all existing class
    for(var action in lookUpForWrapDiv) {
      var elementID = lookUpForWrapDiv[action]
      var domElement = document.querySelector( '#'+elementID ) 
      var myEl = angular.element( domElement );
      myEl.removeClass('elementlistwrap');
      
    }
    // $scope.removeAllWraps()
    // find the new next class
    // if (stateMachineModelExisting.hasState(currentState)) {
    //   var curStateObj = stateMachineModelExisting.getState(currentState)
    //   var transArr = curStateObj.outgoingTransitions
    //   if (transArr.length > 0) {
    //     var regionArr = []
    //     for(var i = 0; i < transArr.length; i++) {
    //       regionArr.push(transArr[i]['alias'])
    //     }
    //     console.log(regionArr);
    //     // add class to the next next actions
    //     regionArr.forEach(function(item) {
    //       $scope.wrapUpWithFieldSet(item)
    //     })
    //   }
    // }

    // update the workers' state machine
    var curStateObj = fsm2.getState(fsm2.getActiveState())
    var outGoingTransitionArr = curStateObj.outgoingTransitions
    var regionArr = []
    
    for(var i = 0; i < outGoingTransitionArr.length; i++) {
      console.log('actions ', outGoingTransitionArr[i]['alias'])
      regionArr.push(outGoingTransitionArr[i]['alias']);
    }
    // highlight regionArr: for 4th study
    // regionArr.forEach(function(item) {
    //   $scope.wrapUpWithFieldSet(item)
    // })
  }


  function removeStartStates() {
    // trigger click button function
    console.log('ok')
    document.getElementById("removestate").click();
  }

  shop.disableNextPageButton = function() {
    if ($scope.startItem >= ($scope.selectedItems.length - $scope.numItem)) {
      return false
    } else {
      return true
    }
  }

  shop.disablePrePageButton = function() {
    if ($scope.startItem > 0) {
      return true
    } else {
      return false
    }
  }

  shop.nextPage = function() {
    $scope.startItem += $scope.numItem
    // if ($scope.startItem > (shop.items.length - $scope.numItem)){
    //   $scope.disableNextPageButton = true
    //   $scope.disablePrePageButton = true
    // }
  }

  shop.prePage = function() {
    $scope.startItem -= $scope.numItem
  }

  shop.filterItems = function (tagName) {
    // loop shop.tags and set all class to ''
    $scope.logs.push({
      'action': 'click',
      'element': tagName +' button',
      'timestamp': (new Date()).getTime()
    })

    // set to the first page
    $scope.startItem = 0

    var tempArray = new Set([])
    if (tagName == 'All') {
      $scope.filtering = false
      shop.items.forEach(function(item){
          tempArray.add(item);
      });
    } else {
      $scope.filtering = true
      shop.items.forEach(function(item){
        if(item.category == tagName){
          tempArray.add(item);
        }
      });
    }
    $scope.selectedItems  = Array.from(tempArray);

  }

  shop.checkItem = function (inputItem) {
    var category = inputItem.category
    var found = false;
    var tempArray = new Set()
    if ($scope.filtering) {
      shop.items.forEach(function(item){
        if(!found && item.category == category){
          tempArray.add(item);
          found = true;
        }
      });
      $scope.selectedItems = Array.from(tempArray)
    } else {
      found = true
    }
    return found;
  }

  shop.buyItem = function(currentItem, numberOfItem) {
    if (numberOfItem != null && numberOfItem > 0) {
      var flag = false
      var ind = 0
      shop.addedItemList.forEach(function(item, index){
        if (item.itemName == currentItem.itemName) {
          flag = true
          ind = index
        }
      })
      if (flag) {
        shop.addedItemList[ind]['itemQty'] += numberOfItem
      } else {
        shop.addedItemList.push({
          'itemName': currentItem.itemName,
          'itemQty': numberOfItem,
          'imgURL': currentItem.imgURL
        })
      }
      console.log('item3Data: ', task3Data);
      shop.numItems += numberOfItem
    }
  }

  shop.showStep = function(step) {
    if (step.element == 'Dropdown List') {
      // display all similar element
      var iEl = angular.element( document.querySelectorAll('#dropdownList'));
      iEl.wrap('<div class="wrapping"></div>');
    }
  }

  shop.removeItem = function(removingItem) {
    console.log();
    shop.addedItemListCache.forEach(function(item, index){
      if(item.itemName == removingItem.itemName){
        shop.addedItemListCache.splice(index, 1);
        // shop.numItems -= removingItem.itemQty
      }
    });
  }

  shop.openCartPanel = function() {
    $scope.openshoppingcart = true
    $scope.opendelivery = false
    shop.addedItemListCache = JSON.parse(JSON.stringify(shop.addedItemList));
  }

  $scope.gobacktohomepage = function() {
    $scope.opendelivery = false
    $scope.openshoppingcart = false
    $scope.allset = false
  }

  shop.saveItem = function(itemList) {
    console.log(itemList);
    var newNumOfItem = 0
    itemList.forEach(function(item){
      newNumOfItem += item.itemQty
    });
    shop.addedItemList = JSON.parse(JSON.stringify(shop.addedItemListCache));
    shop.numItems = newNumOfItem
    $scope.openshoppingcart = false
    $scope.opendelivery = true
  }

  $scope.submitNewPersonalInfo = function() {
    $scope.addinfo = 'Add'
    $scope.adding = false
    $scope.personalInfo.push({
      'home': this.temphome,
      'phone': this.tempphone,
      'email': this.tempemail
    });
    this.temphome = '';
    this.tempphone = '';
    this.tempemail = '';
  };

  $scope.personalInfo = [
    {
      home: 'xxx',
      phone: 'xxx',
      email: 'xxx'
    }
  ]
  $scope.addinfo = 'Add'
  $scope.addnewpersonalinformation = function() {
    if ($scope.addinfo == 'Add') {
      $scope.addinfo = 'Cancel'
      $scope.adding = true
    } else {
      $scope.addinfo = 'Add'
      $scope.adding = false
    }
  }

  $scope.removePersonalInfo = function(removeInfo) {
    $scope.personalInfo.forEach(function(item, index){
      if(item.home == removeInfo.home 
        && item.phone == removeInfo.phone 
        && item.email == removeInfo.email ){
          $scope.personalInfo.splice(index, 1);
      }
    });
  }

  $scope.thankyoupage = function() {
    $scope.opendelivery = false
    $scope.allset = true
    // 
  }

  shop.search = function() {
    console.log(shop.searchString);
    // remove white space first
    $scope.filtering = true
    var tempArray = new Set()
    if (shop.searchString == '') {
      $scope.selectedItems = shop.items
    } else {
      // find substring
      $scope.startItem = 0
      shop.items.forEach(function(item){
        if(item.itemName.toLowerCase().indexOf(shop.searchString.toLowerCase())!= -1){
          tempArray.add(item);
        }
      });
      $scope.selectedItems = Array.from(tempArray)
      // if ($scope.selectedItems.length == 0) {
      //   $scope.startItem = 0
      // }
    }
  }

  shop.bugReport = function() {
    $scope.bugReportText = true
    shop.bugReportContent = ''
  }

  shop.submitBugReport = function() {
    $scope.bugReportText = false
    console.log(shop.bugReportContent);
    $scope.finalResult.push({
      type: 'submit a bug report',
      content: shop.bugReportContent,
      url: $(location).attr('href'),
      time: (new Date()).getTime()
    })
  }

  shop.cancelBugReport = function() {
    $scope.bugReportText = false
  }

  shop.submit = function() {
    console.log(fsm2)
    console.log(fsm)
    // if ($scope.isGoalAchieved) {
    console.log(fsm)
    $scope.finalResult.push({
      coverageRate: $scope.coverageRate
    })
    console.log($scope.finalResult)
    $http.post('/saveData',$scope.finalResult).
        then(function(response) {
          console.log(response['data']);
          $scope.mturkcode = response['data']
          $scope.$emit('updateCode', {
            data: 'fff'
          })
          // $state.go('thankyoupage')
        })
  }

}])


window.onbeforeunload = function() {
   return "Are you sure, your work will be lost.";
};

var exitingPath = {
  task1: [
    {
      action: 'click',
      element: 'searchBox'
    },
    {
      action: 'type in',
      element: 'searchBox'
    },
    {
      action: 'type Enter in',
      element: 'searchBox'
    }

  ],
  task2: [
    {
      action: 'click',
      element: 'filterButton-2'
    },
    {
      action: 'click',
      element: 'nextButton'
    }
  ],
  task3: [
    {
      action: 'click',
      element: 'nextButton'
    },
    {
      action: 'click',
      element: 'nextButton'
    },
    {
      action: 'click',
      element: 'nextButton'
    }
  ]
}

var task3Data = [
  {
    'itemName': 'Teddy Bear',
    'itemQty': 2
  },
  {
    'itemName': 'Watermelon',
    'itemQty': 4
  },
  {
    'itemName': 'Pear',
    'itemQty': 2
  }
]

var allTags = ['All','Devices','Fruit','Toys']

var itemData = [
  {
    itemName: 'Apple',
    itemId: '1',
    imgURL: './images/apple.png',
    category: 'Fruit',
    desc: 'abc'
  },
  {
    itemName: 'Banana',
    itemId: '2',
    imgURL: './images/banana.jpg',
    category: 'Fruit',
    desc: 'abc'
  },
  {
    itemName: 'Pear',
    itemId: '3',
    imgURL: './images/pear.jpeg',
    category: 'Fruit',
    desc: 'abc'
  },
  {
    itemName: 'Mango',
    itemId: '4',
    imgURL: './images/mango.jpg',
    category: 'Fruit',
    desc: 'abc'
  },
  {
    itemName: 'Monitor',
    itemId: '5',
    imgURL: './images/monitor.jpg',
    category: 'Devices',
    desc: 'abc'
  },
  {
    itemName: 'Headphone',
    itemId: '6',
    imgURL: './images/headphone.jpg',
    category: 'Devices',
    desc: 'abc'
  },
  {
    itemName: 'iPhone',
    itemId: '7',
    imgURL: './images/iphone.jpeg',
    category: 'Devices',
    desc: 'abc'
  },
  {
    itemName: 'Lego',
    itemId: '8',
    imgURL: './images/lego.jpg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Toy cars',
    itemId: '9',
    imgURL: './images/car1.jpg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Toy cars',
    itemId: '9',
    imgURL: './images/car2.jpg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Toy cars',
    itemId: '9',
    imgURL: './images/car5.jpg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Toy cars',
    itemId: '9',
    imgURL: './images/car3.jpeg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Toy cars',
    itemId: '9',
    imgURL: './images/car4.jpg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Toy cars',
    itemId: '9',
    imgURL: './images/car6.jpg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Drone',
    itemId: '10',
    imgURL: './images/drone.jpeg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Watermelon',
    itemId: '11',
    imgURL: './images/watermelon.jpg',
    category: 'Fruit',
    desc: 'abc'
  },
  {
    itemName: 'Teddy bear',
    itemId: '12',
    imgURL: './images/teddy.jpeg',
    category: 'Toys',
    desc: 'abc'
  },
  {
    itemName: 'Keyboard',
    itemId: '13',
    imgURL: './images/keyboard.jpg',
    category: 'Devices',
    desc: 'abc'
  }

]

var exampleTrace = [
  {
    "condition": "steps",
    "workerCode": "3f8d9ae2-8323-a78d-7b11-44f9eb12fbc3",
    "time": 1530885461933
  },
  {
    "type": "click",
    "elementId": "startFirstTask",
    "url": "http://localhost:4000/#!/baseline/t1",
    "time": 1530885464090
  },
  {
    "type": "click",
    "elementId": "searchBox",
    "url": "http://localhost:4000/#!/baseline/t1",
    "time": 1530885465351
  },
  {
    "type": "keypress",
    "content": "w",
    "elementId": "searchBox",
    "url": "http://localhost:4000/#!/baseline/t1",
    "time": 1530885465516
  },
  {
    "type": "keypress",
    "content": "a",
    "elementId": "searchBox",
    "url": "http://localhost:4000/#!/baseline/t1",
    "time": 1530885465684
  },
  {
    "type": "click",
    "elementId": "nextButton",
    "url": "http://localhost:4000/#!/baseline/t1",
    "time": 1530885467276
  },
  {
    "type": "click",
    "elementId": "searchBox",
    "url": "http://localhost:4000/#!/baseline/t1",
    "time": 1530885480518
  },
  {
    "type": "keypress",
    "content": "Enter",
    "elementId": "searchBox",
    "url": "http://localhost:4000/#!/baseline/t1",
    "time": 1530885488873
  }
  // {
  //   "type": "click",
  //   "elementId": "submitFirstTaskButton",
  //   "url": "http://localhost:4000/#!/baseline/t1",
  //   "time": 1530885492249
  // }
]

var existingTraceTask1 = {
  "initial": "start",
  "states": {
    "start": {
      "on": {
        "Search": "searching"
      }
    },
    "searching": {
      "on": {
        "Search_success": "itemList"
      }
    },
    "itemList": {}
  }
}


var existingTraceTask2 = {
  "initial": "start",
  "states": {
    "start": {
      "on": {
        "Filter": "filtering"
      }
    },
    "filtering": {
      "on": {
        "Filter_success": "itemList"
      }
    },
    "itemList": {}
  }
}

var existingTraceTask3 = {
  "initial": "start",
  "states": {
    "start": {
      "on": {
        "Navigate": "itemList"
      }
    },
    "itemList": {}
  }
}

var lookUpForWrapDiv = {
  "Search": "searchwrap",
  "Filter": "filterwrap",
  "Navigate": "elementlistwrap",
  "Open_cart": "cartwrap",
  "Search_success": "elementlistwrap",
  "Filter_success": "elementlistwrap",
  "Save_cart": "elementlistwrap",
  "Unsave_cart": "elementlistwrap"
}

var finiteStateMachine = {
  "initial": "start",
  "states": {
    "start": {
      "on": {
        "Search": "searching",
        "Filter": "filtering",
        "Navigate": "itemList",
        "Open_cart": "cart_checking"
      },
      "actionList": {
        "click Searchbox": "Search",
        "click anyfilter button": "Filter",
        "click navigation button": "Navigate",
        "click cart button": "Open_cart"
      }
    },
    "searching": {
      "onEntry": [
        "search loading"
      ],
      "on": {
        "Search_success": {
          "itemList": {
            "actions": [
              "updateItems"
            ]
          }
        },
        "Filter": "filtering",
        "Navigate": "itemList",
        "Open_cart": "cart_checking"
      },
      "actionList": {
        "Keypress enter": "Search_success",
        "Searchbox out of focus": "Cancel_search",
        "click anyfilter button": "Filter",
        "click cart button": "Open_cart"
      }
    },
    "itemList": {
      "on": {
        "Search": "searching",
        "Filter": "filtering",
        "Open_cart": "cart_checking"
      },
      "actionList": {
        "click Searchbox": "Search",
        "click anyfilter button": "Filter",
        "click any item qty": "Select_item",
        "click any add to the cart": "Select_item",
        "click cart button": "Open_cart"
      }
    },
    "filtering": {
      "onEntry": [
        "filter loading"
      ],
      "on": {
        "Filter_success": {
          "itemList": {
            "actions": [
              "updateItems"
            ]
          }
        },
        "Search": "searching",
        "Open_cart": "cart_checking",
        "Navigate": "itemList"
      },
      "actionList": {
        "click Searchbox": "Search",
        "click anyfilter button": "Filter"
      }
    },
    "cart_checking": {
      "onEntry": [
        "cart is opened"
      ],
      "on": {
        "Save_cart": "itemList",
        "Unsave_cart": "itemList"
      },
      "actionList": {
        "click save button": "Save",
        "click modaltitle": "Unsave"
      }
    }
  }
}

var handcraft_ui_model = {
   "click nextButton":"Navigate",
   "click prevButton":"Navigate",
   "click searchBox": "Search",
   "keypress searchBox": "Search",
   "keypress Enter searchBox": "Navigate",
   "click filterButton-":"Filter",
   "click saveItemButton":"Save_cart",
   "click cartOpenButton":"Open_cart",
   "click myModal":"Unsave_cart",
   "click quantitySelectionForItem": "Navigate",
   "click cartButton": "Navigate"
}
