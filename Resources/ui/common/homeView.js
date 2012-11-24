/**
 * @author Ajeet Maurya
 */

var currentRegionLat;
var currentRegionLong;
function homeView(){
    
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
    var tabGroup = Ti.UI.createTabGroup(); 
    var mapWindow = Ti.UI.createWindow({
        backgroundColor:'fb886d',
        tabBarHidden:true,
        barColor:'ff8000'
    });
    var tab = Ti.UI.createTab({
        title:'Lift Kara De',
        window: mapWindow
    });
    tabGroup.addTab(tab);
    
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
            latitudeDelta : 0.5,
            longitudeDelta : 0.5
        };
        mapView.setRegion(region);
    });
    
        
    getLiftBtn.addEventListener('click',function(){
        var liftWin = require('/ui/common/liftKaraWin');
        new liftWin().open();
        
    });
    
    return tabGroup;
    

    
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
    Ti.App.Properties.setString('lat',currentRegionLat);
    Ti.App.Properties.setString('long',currentRegionLong);
        var region = {
            latitude : e.coords.latitude,
            longitude : e.coords.longitude,
            latitudeDelta : 0.5,
            longitudeDelta : 0.5
        };
        
        callback(region);
  }); 

}
module.exports = homeView;
