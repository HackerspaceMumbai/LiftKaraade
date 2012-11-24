require 'net/http'
require 'json'

json = {
	"user"=> {
	"handle"=> "@priteshjrocks",
	"authtoken"=> "z",
	"authsecret"=> "y"
},
	"loc"=> {
	"lat"=> 12,
	"long"=> 34
}

uri = URI.parse("http://localhost:4242/api/wants.json")
response = Net::HTTP.post_form(uri, {"search" => "Berlin"})

