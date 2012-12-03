/**
 * @author Ajeet Maurya
 */
function liftKaraWin() {
    var webservice = require('/lib/webservice');
    var config = require('/lib/config');
    //var settings = new config();
    var endpoint = 'http://192.168.100.96:4242/api/';
    //Lift karade window
    var liftWin = Ti.UI.createWindow({backgroundColor:'transparent'});
    
        var liftView = Titanium.UI.createView({
        left: '20dp',
        top: '106dp',
        borderColor:'black',
        borderRadius:8,
        borderWidth:5,
        width: '280dp',
        height: '192dp',
        backgroundColor: '#fb886d'
    });

    var destinationText = Titanium.UI.createTextField({
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
        left: '103dp',
        top: '37dp',
        width: '157dp',
        height: '30dp',
        value: '',
        color: '#000000',
        font: {fontFamily: 'Helvetica', fontSize: 14}
    });
    liftView.add(destinationText);

    var liftKaraBtn = Titanium.UI.createButton({
        left: '20dp',
        top: '111dp',
        width: '100dp',
        height: '44dp',
        title: 'Lift Kara De',
        color: '#324f85',
        font: {fontFamily: 'Helvetica-Bold', fontSize: 15}
    });
    liftKaraBtn.addEventListener('click',function(e){
        
       var endpnt = endpoint+'wants';
       var xyz = config.accessTokenSecret;
       var verifier=Ti.App.Properties.getString('pin');
       var param = {'user':{'authtoken':config.accessToken,'authsecret':xyz,'authverifier':verifier },
                    'loc':{'lat':config.latitude,'lon':config.longitude },
                    'destination':destinationText.value
                    };
       Ti.API.info(param);
      webservice.callWebServiceJSON('POST',endpnt,param,function(e){
            liftWin.close();
         }); 
    });
    
    
    liftView.add(liftKaraBtn);
    var cancelBtn = Titanium.UI.createButton({
        left: '150dp',
        top: '111dp',
        width: '100dp',
        height: '44dp',
        title: 'cancel',
        color: '#324f85',
        font: {fontFamily: 'Helvetica-Bold', fontSize: 15}
    });
    cancelBtn.addEventListener('click', function(e)
    {
        liftWin.close();
    });
    liftView.add(cancelBtn);

    var destinationLbl = Titanium.UI.createLabel({
        left: '5dp',
        top: '41dp',
        width: '97dp',
        height: '21dp',
        text: 'Destination',
        color: '#000000',
        font: {fontFamily: 'Helvetica', fontSize: 18}
    });
    liftView.add(destinationLbl);
    liftWin.add(liftView);
    
    return liftWin;
}
module.exports = liftKaraWin;