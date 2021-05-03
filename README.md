# final-project
Demo: http://tinyurl.com/smartRecipesFullDemo


Voice demo: https://tinyurl.com/4zxdpvk

Hello, My name is john Bonanno
For my final project I’ve created a smart – assistant style Alexa Skill called smart recipes

I wanted to create a Alexa skill that could help me decide on the next meal I would make, that also could able to send me that recipe that I had decided on.

Most of my early development was in creating a voice interaction model / Voice User Interface
and as I had never developed in the AWS cloud before, or programmed in Node, there was a bit of a learning curve. After I had achieved a voice user interface I was pleased with, I started on the portion of the code that sent the email containing the recipe, and this proved to be the most difficult part of my project. I decided to utilize the AWS SES to send the email – or simple email service. I knew that my sendEmail() function had to return a promise() , but at first I had very little luck understanding the documentation around returning a promise successfully.
	
A promise is an object that represents whether an async function, such as my send email function, has completed. I had to return a promise to inform my Lambda function whether the send email was successful or not. Because I had the code working to send an email in isolation on the AWS cloud, I was utterly baffled when time after time, my Alexa responded” I Don’t know that” or with some other error. Eventually, I began researching asynchronous functions more deeply, and found that to successfully return a promise, you must first define the type of promise that you will be returning. I ended up returning a “Bluebird” promise from the bluebird promises library.

At this point, I had restarted or refactored my code pretty much from scratch several times, and learning to be flexible on the technologies and methods I use was an important lesson learned. I have my Alexa Skill running off a Node.js backend hosted entirely in an AWS Lambda Console. Initially, I had only planned to code only my sendEmail function in the Lambda, and to call it from my backend hosted in the Alexa Developer Console. However, I was very pleased developing in the Lambda Console compared to the Alexa Developer Console, so I decided to use the lambda function as my whole back end. 

Eventually, I found a blog post written by an aws employee about using the Bluebird promise library for Node.js and I quickly went to define my promise as one from the bluebird library. And as quickly as I had found that blog post, I had a working Alexa app that could send an email. 
At this point, I had about 9 days left before the code freeze, and quickly sorted out the code to send different emails for each different recipe, and created some different PDF’s of recipes in Adobe InDesign, on a trial. Working in InDesign was awesome, I really enjoyed using it.

I decided to host my recipes that I designed in the S3 Cloud, a service provided by AWS. As I was in a time crunch, I thought that simply providing the link of the desired recipe to the sendEmail function I had created in my lambda, was the Quickest, albeit one of the dirtiest ways I could get my recipes to pop up in my own inbox. If I had had more time, I would have worked to embed the images into the email’s I sent, and also create a complementary application where the Ingredients in the inventory could be managed. 

Configuring the S3 was far easier than configuring the permissions than for the sendEmail() function, because Amazon places some safety measures to ensure you aren’t sending unsolicited emails. 

The final step I took in my project, was to do some error handling. If the recipe requested wasn’t available in the list of recipes, or an ingredient was missing required for the recipe, Alexa would then let me know. 




