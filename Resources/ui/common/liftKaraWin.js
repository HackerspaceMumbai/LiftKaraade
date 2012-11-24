/**
 * @author Ajeet Maurya
 */
function liftKaraWin() {
    var webservice = require('/lib/webservice');
    var endpoint = 'http://192.168.1.25:4242/api/';
    //Lift karade window
    var liftWin = Ti.UI.createWindow({backgroundColor:'transparent'});
        var liftView = Titanium.UI.createView({
        left: '20dp',
        top: '106dp',
        width: '280dp',
        height: '192dp',
        backgroundColor: '#ffffff'
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
        left: '30dp',
        top: '111dp',
        width: '100dp',
        height: '44dp',
        title: 'Lift Kara De',
        color: '#324f85',
        font: {fontFamily: 'Helvetica-Bold', fontSize: 15}
    });
    var cancelBtn = Titanium.UI.createButton({
        left: '130dp',
        top: '111dp',
        width: '100dp',
        height: '44dp',
        title: 'cancel',
        color: '#324f85',
        font: {fontFamily: 'Helvetica-Bold', fontSize: 15}
    });
    liftKaraBtn.addEventListener('click', function()
    {
        var token = Ti.App.Properties.getObject('token');
        var endpnt = endpoint+'wants';
        var param = {'user':{'authtoken':token.accessToken,
                            'authsecret':token.accessTokenSecret},
                            'loc':{
                                'lat':Ti.App.Properties.getString('lat'),
                                'long':Ti.App.Properties.getString('long')
                                
                            },
                            'destination':destinationText.value
                            }
                            
        webservice.callWebServiceJSON('POST',endpnt,param,function(e){
            Ti.Api.info(JSON.stringify(e));
        });
        
    });
    liftView.add(liftKaraBtn);
    
    cancelBtn.addEventListener('click', function()
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