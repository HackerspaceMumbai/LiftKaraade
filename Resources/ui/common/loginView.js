
function loginView() {
    
    var social = require('/lib/social');
    var loginWin = Ti.UI.createWindow();
    var loginView = Titanium.UI.createView({
    width: 320,
    height: 480,
    backgroundColor: '#ff8000'
});

var appName = Titanium.UI.createLabel({
    left: 33,
    top: 114,
    width: 255,
    height: 78,
    text: 'Lift Kara de',
    color: '#ffffff',
    font: {fontFamily: 'GillSans-Bold', fontSize: 36}
});
loginView.add(appName);

var signIn = Titanium.UI.createButton({
    left: 88,
    top: 253,
    width: 140,
    height: 29,
    color: '#324f85',
    image: '/images/twitter_signIn.png',
    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
    font: {fontFamily: 'Helvetica-Bold', fontSize: 15}
});
signIn.addEventListener('click', function()
{
    var twitter = social.create({
        site: 'Twitter', 
        consumerKey: 'fZlebkjJIIDMaeO1YYTNRQ',
        consumerSecret: 'eGCBq980enUeApC6WljE0mMjUXMCReZ82fTxMVFRX4' 
    });
    var isAuthorize = twitter.isAuthorized();
    if(isAuthorize == null)
    {
        twitter.authorize(function(e) {
           alert('authorized ');
        });
    }
    else
    {
     Ti.App.Properties.setObject('token',isAuthorize);   
        Ti.API.info('tokens are '+ JSON.stringify(isAuthorize));
        var home = require('/ui/common/homeView');
        new home().open();
    }
   
    //twitter.deauthorize();
});
loginView.add(signIn);
loginWin.add(loginView);
return loginWin;   
}
module.exports = loginView;