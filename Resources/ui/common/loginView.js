
function loginView() {
    var config = require('/lib/config');
    //var settings = new config();
    
    var social = require('/lib/social');
    
    var loginWin = Ti.UI.createWindow();
    var loginView = Titanium.UI.createView({
    width: 320,
    height: 480,
    backgroundColor: '#ff8000'
});

var appName = Titanium.UI.createLabel({
    left: 20,
    top: 114,
    width: 255,
    height: 78,
    text: 'Lift Kara de',
    color: '#ffffff',
    font: {fontFamily: 'GillSans-Bold', fontSize: 36}
});
loginView.add(appName);
var logo = Titanium.UI.createImageView({
    top: 114,
    left:240,
    width:75,
    image:'/images/logo.png'
})
loginView.add(logo);

var signIn = Titanium.UI.createButton({
    
    top: 253,
    width: 249,
    height: 49,
    color: '#324f85',
    image: '/images/twitter_login.png',
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
    
    if(!isAuthorize)
    {
        twitter.authorize(function(e) {
           var home = require('/ui/common/homeView').homeView();
        home.open();
        });
    //config.accessToken = isAuthorize.accessToken;
    //config.accessTokenSecret = isAuthorize.accessTokenSecret;
    }
    else
    {
        
        config.accessToken = isAuthorize.accessToken;
        config.accessTokenSecret = isAuthorize.accessTokenSecret;
        
        var home = require('/ui/common/homeView').homeView();
         home.open();
    }
   
    //twitter.deauthorize();
});
loginView.add(signIn);
loginWin.add(loginView);
return loginWin;   
}
module.exports = loginView;