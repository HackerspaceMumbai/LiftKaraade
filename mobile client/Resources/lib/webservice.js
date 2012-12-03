/**
 * @author Ajeet Maurya
 */


exports.callWebServiceJSON = function(httpRequest,endpoint, param, callback) {
    /*
     * Checking Network connection
     */
    var response = {};
    if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
        var alertDialog = Titanium.UI.createAlertDialog({
            title : 'Error!',
            message : 'Error reaching to Server.No internet connectivity',
            buttonNames : ['OK']
        });
        alertDialog.show();
        return;
    }
    var Obj = [];
    var xhr = Titanium.Network.createHTTPClient({

        onload : function(e) {

            Titanium.API.info("e value " + JSON.stringify(e));
            Titanium.API.info("Success response is" + this.responseText);
            Obj = JSON.parse(this.responseText);
            response.responseCode = xhr.status;
            response.responseMsg = Obj;
            callback(response);

        },

        onerror : function(e) {

            Titanium.API.info("Error response is" + this.responseText);
            response.responseCode = xhr.status;
            response.responseMsg = xhr.statusText;
            Titanium.API.info(" response is" + JSON.stringify(response));
            callback(response);
        },

        timeout : 5000

    });
    xhr.open(httpRequest, endpoint);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Ti.API.info('url is ' + endpoint);
    Ti.API.info('parameter is '+param);
    xhr.send(JSON.stringify(param));

}