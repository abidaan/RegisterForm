/**
 * Created by Shivaji, Sushil and Abidaan.
 */
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var error = '';
var redis = require('redis')

var client = redis.createClient(6379, 'redis_server', {})

app.engine('html', require('ejs').renderFile);
//Middleware
app.set('view engine','jade');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req, res){
    res.render('register.jade');
});

//var emailFeatureFlag = client.get("emailFeature");

function checkStringLength(a){
    if (a.length == 0){
        error += 'Please enter a value in the required field\n';
        return 0;
    }
    return 1;
}

function checkSpecialCharacters(a){
        if(a.match(/[_\W0-9]/))
            error += 'String contains invalid characters\n';
}

function validateString(a){
    checkStringLength(a);
    checkSpecialCharacters(a);
}

function checkAge(age){
    if(isNaN(age))
        error += 'Please enter numeric values\n';
    else{
        if(age <=0 || age > 200)
            error += 'Please enter a valid age\n';
    }
}

function validatePassword(password1, password2){
    if(password1===undefined || password1===null)
        error += 'Please enter password\n';
    else if(password1.length < 6 || password1.length >20)
        error += 'Password should be between 6 and 20 characters\n'
    else if(password1.match(/([a-z])/gi)===null||password1.match(/([0-9])/gi)===null)
        error += 'Password should contain atleast one character and one number\n';
    if(password1 != password2)
        error += 'Passwords do not match\n';
}

app.post('/register',function(req, res){
    var user = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        confirmPassword: req.body.cpassword
    };

    validateString(user.firstName);
    validateString(user.lastName);
    checkAge(user.age);
    validatePassword(user.password, user.confirmPassword);
    if(error.length > 0)
    {
        res.render("errorRegister.jade",{message: error});
        error = "";
    }
    else
    {
    client.get("emailFeature",function(err,value){
        // console.log(value);
        if(value==true){
        // console.log("Email feature true ")
        var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
        var email = new sendgrid.Email();
        var sendemail = user.email;
        email.addTo(sendemail);
        email.setFrom("savidhal@ncsu.edu");
        email.setSubject("RegisterForm Signup Success");
        var text = "Thank you for signing up on RegisterForm,"+user.firstName+". We are glad to have you on-board"
        // console.log(text);
        email.setHtml(text);

        sendgrid.send(email);
        // console.log("email sent");
        // console.log("Added user");
        client.set("emailFeature",false);
        res.render("successRegister.jade");
    }
    else{
        // console.log("emailFeature turned off");
        res.render("successRegister.jade");
    }
    });


    }
});
app.listen(process.env.PORT || 3000);
app.listen(process.env.PORT || 3001);
exports.checkStringLength = checkStringLength;
exports.checkSpecialCharacters=checkSpecialCharacters;
exports.validateString=validateString;
exports.checkAge=checkAge;
exports.validatePassword=validatePassword;
