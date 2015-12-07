/**
 * Created by Sushil on 9/14/2015.
 */
var needle = require("needle")
var fs=require("fs")
var headers = require("./default_digocean.json")
//var aws_config = require("./default_aws.json")
fs.writeFile('./inventory', '[webservers]\n', function (err) {
    if (err) throw err;
    console.log('created Inventory file');
});
try {
    headers = require("./digital_ocean_config.json")
}catch(err){
    console.log('Misssing Digital ocean config file: digital_ocean_config.json');
    console.log('Place digital_ocean_config.json in current dir confgured as follows')
    console.log(headers)
    process.exit(1)
}

var dig_ocean_keys = []
needle.get("https://api.digitalocean.com/v2/account/keys", {headers:headers}, function(error, response){
    if(!error) {
        var data = response.body;
        if (response.headers) {
            console.log("Calls remaining", response.headers["ratelimit-remaining"]);
        }
        if (data.ssh_keys) {
            console.log('Found Keys')
            for(var i=0; i<data.ssh_keys.length;+i++) {
                dig_ocean_keys.push(data.ssh_keys[i].id)
            }
            console.log(dig_ocean_keys)
        }
    }
})


var client =
{

    createDroplet: function (dropletName, region, imageName, onResponse)
    {


        setTimeout(function(){
            var data =
            {
                "name": dropletName, "region":region,
                "size":"512mb",
                "image":imageName,
                // Id to ssh_key already associated with account.
                //"ssh_keys":[625870],
                "ssh_keys":dig_ocean_keys,
                "backups":false,
                "ipv6":false,
                "user_data":null,
                "private_networking":null
            };

            console.log("Attempting to create: "+ JSON.stringify(data) );

            ;
            needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse )},3000)
    },
    listDropletById: function( dID, onResponse){
            console.log('Looking up droplet '+dID)
            setTimeout(function(){
                needle.get("https://api.digitalocean.com/v2/droplets/"+dID, {headers:headers}, onResponse)
            }, 20000)

},
    deleteDroplet: function( onResponse){
        needle.delete("https://api.digitalocean.com/v2/droplets/"+dropletId, null, {headers:headers}, onResponse)
    }
};
exports.client=client