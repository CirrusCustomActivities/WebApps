define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

              if (key === 'sms'){
                    $('#sms-text').val(val);
              }  
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        var smsTextValue = $('#sms-text').val();

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "sms": smsTextValue,
            "emailAddress": "{{Contact.Default.Email}}",
            "mobile":  "{{Contact.Attribute.SMSActivity.MobileNumber}}",
            "SubscriberKey":  "{{Contact.Attribute.SMSActivity.SubscriberKey}}",
            "FirstName":  "{{Contact.Attribute.SMSActivity.FirstName}}",
            "LastName":  "{{Contact.Attribute.SMSActivity.LastName}}"
        }];
        
        payload['metaData'].isConfigured = true;
        console.log(payload);
        connection.trigger('updateActivity', payload);
    }


});
