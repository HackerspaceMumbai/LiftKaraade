/**
 * @author Ajeet Maurya
 */

var currentRegionLat;
var currentRegionLong;
var config = require('/lib/config');
exports.homeView= function(){
    var webservice = require('/lib/webservice');
    var handle= '';
    
    //var settings = new config();
    var endpoint = 'http://192.168.100.96:4242/api/';
    Titanium.Geolocation.purpose = "Recieve User Location";
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Titanium.Geolocation.distanceFilter = 10;
    
    
    var leftViewPanel = Ti.UI.createView({
        top:'50dp',
        left:'-5dp',
        borderRadius:9,
        borderColor:'fb886d',
        borderWidth:5,
        width: '54dp',
        height: '150dp',
        backgroundColor: 'transparent'
    
    });
    var getLiftBtn = Ti.UI.createButton({
        top:'5dp',
        left:'5dp',
        image:'/images/Thumb-Up-icon.png',
        width:'40dp',
        height:'40dp',
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
    
    });
    
    var giveLiftBtn = Ti.UI.createButton({
        top:'55dp',
        left:'5dp',
        image:'/images/car-icon.png',
        width:'40dp',
        height:'40dp',
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
    
    });
    var setPositionBtn = Ti.UI.createButton({
        top:'105dp',
        left:'5dp',
        image:'/images/Compass.png',
        width:'40dp',
        height:'40dp',
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
    
    });
    leftViewPanel.add(getLiftBtn);
    leftViewPanel.add(giveLiftBtn);
    leftViewPanel.add(setPositionBtn);
    //creating TabGroup
   // var tabGroup = Ti.UI.createTabGroup(); 
    var mapWindow = Ti.UI.createWindow({
        backgroundColor:'fb886d',
        tabBarHidden:true,
        title:'Lift Kara De',
        barColor:'ff8000'
    });
    /*var tab = Ti.UI.createTab({
        title:'Lift Kara De',
        window: mapWindow
    });
    tabGroup.addTab(tab);
    */
    //creating MapView
    var mapView = Titanium.Map.createView({
        mapType : Titanium.Map.STANDARD_TYPE,
        animate : 'true',
        regionFit : 'true',
        userLocation : 'true',
    });
    
    //setting current location on map
    getLocation(function(e){
            
        mapView.setRegion(e);
        mapWindow.add(mapView);  
        mapWindow.add(leftViewPanel);
         
    });
    
    //Re-set user current Location
    setPositionBtn.addEventListener('click',function(e){
        var region = {
            latitude : currentRegionLat,
            longitude : currentRegionLong,
            latitudeDelta : 0.005,
            longitudeDelta : 0.005
        };
        
        mapView.setRegion(region);
    });
    
        
    getLiftBtn.addEventListener('click',function(){
        var liftWin = require('/ui/common/liftKaraWin');
        
       new liftWin().open();
        
    });
     giveLiftBtn.addEventListener('click',function(){
         var endpnt= endpoint+'gives';
         var param = {'user':{'handle':handle,'authtoken':config.accessToken,
                            'authsecret':config.accessTokenSecret},
                            'loc':{
                                'lat':config.latitude,
                                'lon':config.longitude
                                
                            }                            
                            };
         webservice.callWebServiceJSON('POST',endpnt,param,function(e){
             Ti.API.info('give response is'+JSON.stringify(e));
             var annote =[];
             annote = getAnnotation(e);
             Ti.API.info('anote after call '+JSON.stringify(annote));
             handle = e.me.user.handle;
             if(annote.length>1)
            mapView.Annotations.push(annote);
            else
            {
                var annote1 = annote[0];
                mapView.addAnnotation(annote1);
                 mapView.selectAnnotation(annote1);
            }
           
         });
        
        
    });
    
    mapView.addEventListener('click',function(e){
        var selfData = e.annotation.selfData;
        var id = e.annotation.myid;
        var clickSource = e.clicksource;
        if(e.clicksource == 'rightButton')
        {
            var endpnt = endpoint+'tweet';
            var param = {'me':selfData,'to':id};
            webservice.callWebServiceJSON('POST',endpnt,param,function(e){
                if(e.responseCode ==200)
                alert('tweet send');
                else
                alert('failed to contact');
                
            });
        }
        
    });
    
    return mapWindow;
    

    
}
function getLocation(callback){
//Get the current position and set it to the mapview
Titanium.Geolocation.getCurrentPosition(function(e) {
    if(!e.success || e.error) {
        alert('error ' + JSON.stringify(e.error));
        return;
    }
    currentRegionLat = e.coords.latitude;
    currentRegionLong = e.coords.longitude;
    config.latitude = e.coords.latitude;
        config.longitude = e.coords.longitude;
        var region = {
            latitude : e.coords.latitude,
            longitude : e.coords.longitude,
            latitudeDelta : 0.005,
            longitudeDelta : 0.005
        };
        
        callback(region);
  }); 

}

function getAnnotation(data)
{
    var _data = [];
    var annote =[];
    _data = data.responseMsg.fakirs;
    
    for(var i=0;i<_data.length;i++)
    {
        var annotation = Titanium.Map.createAnnotation({
           latitude:_data[i].loc.lat,
            longitude:_data[i].loc.lon,
            title:_data[i].user.handle,
            subtitle:'Lift kara de',
            image:'/images/thumb-up.png',
            animate:true,
            rightButton: '/images/tweet-bird-icon.png',
            myid:_data[i]._id,
            selfData:data.responseMsg.me._id
        });
        annote[i]=annotation;
    }
    Ti.API.info('annote is '+JSON.stringify(annote));
    return annote;
}
//module.exports = homeView;
