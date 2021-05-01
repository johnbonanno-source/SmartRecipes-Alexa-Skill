const AWS = require( 'aws-sdk' );

var SES = new AWS.SES( { apiVersion: '2010-12-01', region: 'us-east-1' } );

//when we are sending our email
//we have to return a promise
//this is because the sendEmail funx
//from SES
//is an ASYNCHRONOUS CALL to the simple email server
//we have to wait for this call to complete before RET

if  (typeof Promise === 'undefined' ) {
    
  AWS.config.setPromisesDependency( require( 'bluebird' ) );
  
}

//we will define our lambda funx for our alexa skill in here...
exports.handler = ( event, context, callback ) => {
    /*
    *This is where we will keep our menus
    *and perhaps our ingredients if we get
    *so far as to include checking our inventory
    *to see if we can make the recipe with OUR ingredients
    */

const breakfast = {  
    "bacon and eggs" : [ "bacon","eggs" ],
    "avocado toast" : [ "avocado" , "bread" , "eggs", "salt", "pepper" , "lime" ]
};
const lunch = {  
    "ham sandwich" : [ "ham","cheese" ]
};
const dinner = { "steak and eggs": ['steak','eggs']};
let ingredients = ['bacon','eggs','bread','ham','cheese','steak','salt','pepper','lime','avocado'];



    try {
        
        if ( event.request.type === 'LaunchRequest' ) {
            callback( null, buildResponse( 'Welcome to SmartRecipes. How may I help?' ) );
        } 
        else if ( event.request.type === 'IntentRequest' ) {
            const intentName = event.request.intent.name;
            

        if ( intentName === 'requestMeal' ) {
            const text = event.request.intent.slots.meal.value;
            if( text === 'breakfast' ){
                callback( null, buildResponse("For breakfast I can reccomend: "+Object.keys(breakfast)+"") );
            }
            else if(text === "lunch" ){
                callback( null, buildResponse("For lunch I can reccomend: "+Object.keys( lunch )+"") );
            }
            else if( text === "dinner" ){
                callback( null, buildResponse( "For dinner I can reccomend: " + Object.keys( dinner ) + "" ) );
            }
        }
        // else if ( intentName === 'listIngredients' ) {
        //     callback( null, buildResponse( ingredients.toString()+"" ) );
        // }

            
        else if ( intentName === 'requestRecipe' ) {
            const recipe = event.request.intent.slots.recipe.value;
            // if (recipe === "bacon and eggs"||recipe === "ham sandwich"||recipe === "advocado toast"||recipe === "steak and eggs"){
            if( Object.keys( breakfast ).includes (recipe ) || Object.keys( lunch ).includes( recipe )|| Object.keys( dinner ).includes( recipe )){    
                
                var currentRecipeIngredients;
                if(  Object.keys( breakfast ).includes( recipe ) ) {
                  currentRecipeIngredients = breakfast[ recipe ];
                  const result = currentRecipeIngredients.every( val => ingredients.includes( val ) );
                  if(result==true){
                  sendEmail( recipe );
                  callback( null, done( "Sending: " + recipe ) );
                  }
                }
                else if(  Object.keys( lunch ).includes( recipe ) ) {
                    currentRecipeIngredients = lunch[ recipe ];
                  const result = currentRecipeIngredients.every( val => ingredients.includes( val ));
                  if(result == true){
                      sendEmail( recipe );
                      callback( null, done( "Sending: " + recipe ) );
                  }
                }
                else if ( Object.keys( dinner ).includes(recipe ) ){
                  currentRecipeIngredients = dinner [ recipe ];
                  const result = currentRecipeIngredients.every( val => ingredients.includes( val ) );
                  if(result == true){
                      sendEmail( recipe );
                      callback( null, done( "Sending: " + recipe ) );
                  }
                }
                callback( null, buildResponse( "You are missing some ingredients for " + recipe +". Please update your ingredients to access this recipe." ) );
            }
        
            else
            {
            callback( null, buildResponse( "I'm sorry, I dont have " + recipe + "in my recipe book"));
            }
            
        }
        else if ( intentName === 'requestAllRecipes' ) {
            
            callback( null, buildResponse( Object.keys( breakfast ) + ", " +  Object.keys( lunch ) + ", " + Object.keys( dinner ) + "" ) );
        
        }
        
        
        else {
            callback( null, buildResponse( "Sorry, i don't understand" ));
        }
        } else if ( event.request.type === 'SessionEndedRequest' ) {
            callback( null, buildResponse( 'Session Ended' ) );
        }
    } catch ( e ) {
        context.fail( `Exception: ${e}` );
    }
};

function buildResponse( response ) {
    return {
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: response,
            },
            shouldEndSession: false,
        },
        sessionAttributes: {},
    };
}
function done( response ) {
    return {
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: response,
            },
            shouldEndSession: true,
        },
        sessionAttributes: {},
    };
}
function sendEmail ( text,event, context, callback ){
var link = "";


if ( text === 'steak and eggs' ){
    link = " https://resturantimg.s3.amazonaws.com/steak+and+eggs.pdf ";
}
else if ( text === 'bacon and eggs' ){
    link = "https://resturantimg.s3.amazonaws.com/bacon+and+eggs.pdf";
}
else if ( text === 'avocado toast' ){
    link = "https://resturantimg.s3.amazonaws.com/avocado+toast.pdf";
}
else if ( text === 'ham sandwich' ){
    link = "https://resturantimg.s3.amazonaws.com/ham+sandwich.pdf";
}

var params = {
    Destination: {
        ToAddresses: [ "smartrecipesmailer@gmail.com" ]
    },
    Message: {
        Body: {
            Text: { Data: "Your recipe: " +link
            }
        },

        Subject: { Data: "Your recipe for "+ text + " has arrived!" }
    },
    Source: "smartrecipesmenu@gmail.com"
};

return SES.sendEmail( params ).promise();
}

                                              