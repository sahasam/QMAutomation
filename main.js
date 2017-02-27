var pubnub;
var pubkey = "pub-c-c2d65144-cdff-4686-b439-805c13176afc";
var subkey = "sub-c-8e99e904-fb29-11e6-9c1a-0619f8945a4f";


$('#pagetabs a').click(function (e) {
    e.preventDefault()
    if(this.id == 'tab-inventory') {
       pubnub.publish({
           message:{"command":"listGear"}, 
           channel:"database-channel"
       });
    }
    $(this).tab('show')
})

window.onload = function(){
    init();
}
function init() {
    pubnub = new PubNub({
        publishKey:pubkey,
        subscribeKey: subkey
    });

    pubnub.addListener({
        message: function(Object) {
            console.log("Listener ",Object);
            var record = Object.message.record; 
            
            if(Object.channel == "gearList-channel") {
                console.log("I am still here");
                //$('#console').html("Filtered To gearList-channel")
                var data = Object.message.list
                displayMessage(data);
            }
        }
    })
    pubnub.subscribe({
        channels: ['database-channel','gearList-channel','userList-channel']
    });
}

var  publish = function(record,command){
// Publish a simple message to the demo_tutorial channel
    var message = {
        "command": command,
        "datastore": "gear",
        "record": record
    };

    pubnub.publish({
        message: message,
        channel: 'database-channel'
    }); 
}

function guid() {
    //crate a random number within the parameters
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }   

    //create the final uuid
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}    

var displayMessage = function(message) {
    $('#console').html(JSON.stringify(message));
    console.log(message);
    var data = message;
    createList(data);
}    


//Form Handling Methods

//Handles adding a person to database
$( "#button-a-person" ).on("click", function() {
        
    var name = $("#addPerson-name").val();
    var id = $("#addPerson-email").val();
    var quality = $('').val();


    //create the checkin json object
    var record = {
        "id": id,
        "name": name
    };

    console.log(record);
    publish(record,"save","user");

 
});

$( "#button-a-gear" ).on("click", function() {
        
    var gearType = $("#addGear-gearType").val();
    var valueId = $("#addGear-gearId").val();
    var quality = $("input[name='quality']:checked").val();
    
    var todayDate = new Date();
    var dateString = todayDate.getFullYear() + '-' + (todayDate.getDate() + 1) + '-' + todayDate.getMonth();
    
    


    //create the checkin json object
    var record = {
        "id": valueId,
        "name": gearType,
        "condition": quality,
        "status": 0,
        "owner": {
            "id": ""
        }
    };

    console.log(record);
    publish(record,"save","gear");
});
    var  publish = function(record,command,datastore){
    // Publish a simple message to the demo_tutorial channel
        var message = {
            "command": command,
            "datastore": datastore,
            "record": record
        };

        pubnub.publish({
            message: message,
            channel: 'database-channel'
        }); 
    }

$("#searchbutton").on("click",function() {
    var searchValue = $("#searchbar").val();
    
    var message = {
        "command":"findGear",
        "name" : searchValue
    }
    
    pubnub.publish({
        message: message,
        channel: "database-channel"
    });
});


// Utility functions for bootstrap
function createList(data) {
    var items = data;
    var startTag = "<ul class='list-group'>";
    var endTag = "</ul>";
    
    var listItems = [];
    var outItems = [];
    
    items.forEach((item) => {
      if (item.status == 0) {
          var item1 = makeListItem(item);
          listItems.push(item1);
      }  
      else {
          var item1 = makeListItem(item);
          outItems.push(item1);
      }
    });
    
    //for(var i = ;i<items.length - 1;i--) {
    //    var item = makeListItem(items[i]);
    //    listItems.push(item);
    //};
    
    
    console.log("This is the listItems" + listItems);
    
    var html = startTag + listItems.join("") + endTag;
    var html1 = startTag + outItems.join("") + endTag;
    
    
    
    $("#inshack-list").html(html);
    $('#outshack-list').html(html1);

}

// make a list item out of a gear object (id + gearType)
function makeListItem(item){
    //var html = "<li id=''>" + item.label + "</li>";
    var html = '<li class="list-group-item" id="'+item.id+'">'+item.id+ ' \t' + item.name + ' '+ '</li>';
    return html
}




