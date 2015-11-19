require('newrelic')
var sleep = require('sleep');
var run = require('./app.js');
var redis = require('redis')
var client = redis.createClient(6379, 'redis_server', {})
run.app.post('/register',function(req, res){
    sleep.sleep(2);
    var user = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        confirmPassword: req.body.cpassword
    };
    /*if(req.body.confirmEmail===undefined){
      client.set("emailFeature",false);
    }else{
      client.set("emailFeature",true);
    }*/
    run.validateString(user.firstName);
    run.validateString(user.lastName);
    run.checkAge(user.age);
    run.validatePassword(user.password, user.confirmPassword);
    if(run.error.length > 0)
    {
        res.render("errorRegister.jade",{message: run.error});
        run.error = "";
    }
    else
    {
    client.get("emailFeature",function(err,value){
        console.log(value);
        if(value=='true'){
        console.log("Email feature true ")
        //var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, "password");
        var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
        var email = new sendgrid.Email();
        var sendemail = user.email;
        email.addTo(sendemail);
        email.setFrom("savidhal@ncsu.edu");
        email.setSubject("RegisterForm Signup Success");
        var text = "Thank you for signing up on RegisterForm,"+user.firstName+". We are glad to have you on-board"
        // console.log(text);
        email.setHtml(text);

        sendgrid.send(email,function(err,json){
            if(err){
                //console.log(err)
                client.set("emailFeature",false);
            }
        });
        // console.log("email sent");
        // console.log("Added user");
         res.render("successRegister.jade");
         }
         else{
         console.log("emailFeature turned off");
         res.render("successRegister.jade");
         }
     });


     }
 });


run.app.listen(process.env.PORT || 3000);


