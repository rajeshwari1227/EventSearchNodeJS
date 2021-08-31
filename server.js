var cookieParser = require('cookie-parser');

const express = require('express')
const axios = require('axios')
var app = express()
const https = require('https')
const { response } = require('express')
const { request } = require('http')
var geohash = require("ngeohash")

var glob_var = 'hello'


app.use(cookieParser())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId: '389016a7e6d240e8a5fee675f6582083',
  clientSecret: '0b070e2c37f940a781772a860bd073a2',
  redirectUri: 'http://www.example.com/callback'
});

const ticketmaster_api = "wy8TIzyZC4k2uPo8jJVg2GfiyzBhNWmH"





  app.get('/spotify', function (req, resp) {
    final_res1 = []
    key = req.query.key
    console.log("req key",key)




    spotifyApi.clientCredentialsGrant().then(
      function(data) {
        console.log('The access token is ' + data.body['access_token']);
        spotifyApi.setAccessToken(data.body['access_token']);
        // spotify(key)


        spotifyApi.searchArtists(
          key,
          { limit: 10, offset: 0 },
          function(err, data) {
            if (err) {
              console.error('Something went wrong!',err.statusCode);
              if (err.statusCode == 401){
              spotify_set_access(key)
              }else{
              return {}
              }
            } else {
              console.log(data.body)
    
              
              res={}
              try{
                res['name'] = data.body.artists.items[0].name
              }catch{
                res['name'] = ''
    
              }
              try{
                res['followers'] = data.body.artists.items[0].followers.total
              }catch{
                res['followers'] = ''
    
              }
    
              try{
                res['popularity'] = data.body.artists.items[0].popularity
              }catch{
                res['popularity'] = ''
    
              }
    
    
              try{
                res['check'] = data.body.artists.items[0].external_urls.spotify
              }catch{
                res['check'] = ''
    
              }
              final_res1.push(res)
              console.log(final_res1)
              resp.json(res)
              
            }
          }
          
        );



      },
      function(err) {
        console.log('Something went wrong!', err);
        
      }
    );

    
    console.log("thos trsr",final_res1)



  })

  function spotify(key){
    console.log("key in",key)


    spotifyApi.searchArtists(
      key,
      { limit: 10, offset: 0 },
      function(err, data) {
        if (err) {
          console.error('Something went wrong!',err.statusCode);
          if (err.statusCode == 401){
          spotify_set_access(key)
          }else{
          return {}
          }
        } else {
          console.log(data.body)
          return(data.body)
        }
      }
    );

  }


function spotify_set_access(key){

  
  // Get an access token and 'save' it using a setter
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token is ' + data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);
      spotify(key)
    },
    function(err) {
      console.log('Something went wrong!', err);
      
    }
  );
}




   

app.get('/autocomplete', function (req, resp) {
// console.log(req.query.var1)
key_val = req.query.var1

url_val = 'https://app.ticketmaster.com/discovery/v2/suggest?apikey=wy8TIzyZC4k2uPo8jJVg2GfiyzBhNWmH&keyword='+key_val

axios.get(url_val)
  .then(function (response) {
    // console.log('success')
    // console.log(response.data);
    // console.log(response.data.length)
    data = response.data
    obj_len = Object.keys(response.data).length
    let result = []
    if(obj_len > 1){
      try{
      for(var i = 0;i<data._embedded.attractions.length;i++){
        result.push(data._embedded.attractions[i]['name'])
      }
    }
    catch (e) {
      console.log(e)
    }

    }
    // console.log(result)



    resp.json(result);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    console.log('hello')

  });




})









app.get('/venueDetails', function (req, resp) {
  // console.log(req.query.var1)
  venue = req.query.venue
  console.log('venue111111',venue)
  // url_val = "https://app.ticketmaster.com/discovery/v2/venues/"+venue+".json?apikey="+ticketmaster_api
  url_val = "https://app.ticketmaster.com/discovery/v2/venues/"+venue+".json?apikey="+ticketmaster_api

  
  axios.get(url_val)
    .then(function (response) {
      final_res =[]
      var res = {}
      // console.log(response)
      venue_obj = response.data

      try{
        res['address'] = venue_obj.address.line1
      }
      catch{
        res['address'] = ''

      }
      state_city =[]
      try{
        state_city.push(venue_obj.city.name)
      }
      catch{
        

      }
      try{
        state_city.push(venue_obj.state.name)
      }
      catch{
        

      }
      res['city'] = state_city.join(',')

    
    try{
      if(venue_obj.boxOfficeInfo.phoneNumberDetail != undefined){
      res['phone'] =venue_obj.boxOfficeInfo.phoneNumberDetail
      }else{
        res['phone'] =''
      }
    }
    catch{
      res['phone'] =''

    }

    try{
      res['open'] =venue_obj.boxOfficeInfo.openHoursDetail
    }
    catch{
      res['open'] =''

    }

    try{
      res['general'] =venue_obj.generalInfo.generalRule
    }
    catch{
      res['general'] =''

    }

    try{
      res['child'] =venue_obj.generalInfo.generalRule
    }
    catch{
      res['child'] =''

    }

        try{
      res['name'] =venue_obj.name
    }
    catch{
      res['name'] =''

    }

    try{
      res['lng'] =venue_obj.location.longitude
    }
    catch{
      res['lng'] =''

    }
    try{
      res['lat'] =venue_obj.location.latitude
    }
    catch{
      res['lat'] =''

    }


    
    final_res.push(res)


    console.log(final_res)
      
  
      resp.json(final_res);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      console.log('hello')
  
    });
  
  
  
  
  })






app.get('/eventDetails', function (req, resp) {
  // console.log(req.query.event)
  id = req.query.event
  
  url_val = "https://app.ticketmaster.com/discovery/v2/events/"+id+"?apikey=wy8TIzyZC4k2uPo8jJVg2GfiyzBhNWmH"
  
  axios.get(url_val)
    .then(function (response) {
      // console.log('s')
      // console.log(response.data);
      var response_obj = response.data
      var res={}
      artist = []
      artist_url = []
            try{
                for(var i=0;i<response_obj._embedded.attractions.length;i++){

                  try{
                    artist.push(response_obj['_embedded']['attractions'][i]['name'])
                  }
                  catch{

                  }
                  try{
                    artist_url.push(response_obj['_embedded']['attractions'][i]['url'])
                  }
                  catch{

                  }

                }
                res['artist']  = artist
                res['artist_url']  = artist_url
             
            }
            catch{


                res['artist']  = artist
                res['artist_url']  = artist_url
            }
            try{
            res['name'] = response_obj['name']
            }catch{
            res['name'] = ''
            
        }
        try{
          res['date'] = response_obj['dates']['start']['localDate']
          }catch{
          res['date'] = ''
          
      }
      try{
        res['venue'] = response_obj['_embedded']['venues'][0]['name']
        }catch{
        res['venue'] = ''
        
    }
    genre = []
    try{
      if (events[i]['classifications'][0]['subGenre']['name'] != 'Undefined'){
      genre.push(events[i]['classifications'][0]['subGenre']['name'])
      }
    }
    catch{
      
    }
    try{
      if (events[i]['classifications'][0]['subGenre']['segment'] != 'Undefined'){

      genre.push(events[i]['classifications'][0]['segment']['name'])
      }
    }
    catch{
    }
    try{
      if (events[i]['classifications'][0]['type']['name'] != 'Undefined'){

      genre.push(events[i]['classifications'][0]['type']['name'])
      }
    }
    catch{
    }
    try{
      if (events[i]['classifications'][0]['subType']['name'] != 'Undefined'){

      genre.push(events[i]['classifications'][0]['subType']['name'])
      }
    }
    catch{
    }try{
      if (events[i]['classifications'][0]['genre']['name'] != 'Undefined'){

      genre.push(events[i]['classifications'][0]['genre']['name'])
      }
    }
    catch{
    }

    res['category'] = genre.join('|')

    try{
      res['status'] = response_obj['dates']['status']['code']
      }catch{
      res['status'] = ''
      
  }

  try{
    res['seatmap'] = response_obj['seatmap']['staticUrl']
    }catch{
    res['seatmap'] = ''
    
}
try{
  res['ticket'] = response_obj['url']
  }catch{
  res['ticket'] = ''
  }

  try{
    res['venue_id'] = response_obj['_embedded']['venues'][0]['id']
    }catch{
    res['venue_id'] = ''
    }





  min_max = []
  try{
      min_max.push(response_obj['priceRanges'][0]['min'])
}
  catch{
}
  try{
      min_max.push(response_obj['priceRanges'][0]['max'])
  }
  catch{
  }

  if (min_max){
      res['price'] = min_max.join(' - ')
  }
  else{
      res['price'] = ''
  }


  // for(var j=0;j<artist.length;j++){
  //   val = spotify(artist[j])

  //   console.log("Artist111",val)

  // }

  
  
      resp.json(res);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      console.log('hello')
  
    });
  
  
  
  
  })
  
function getDataPromise(val) {
  console.log(val.replace(' ','+'))
  return axios({
          url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+val.replace(' ','+')+'&key=AIzaSyAcSMaNFC5VFoUJPAEoPioTmkoutY7864c',
          method: 'get',
          timeout: 8000,
          headers: {
              'Content-Type': 'application/json',
          }
      })
     .then(res => res.data)
     .catch (err => console.error(err))
  }










app.get('/eventlists', function (req, resp) {



  category= {'All':'','Music':'KZFzniwnSyZfZ7v7nJ','Sports':'KZFzniwnSyZfZ7v7nE','Arts':'KZFzniwnSyZfZ7v7na','Film':'KZFzniwnSyZfZ7v7nn','Miscellaneous':'KZFzniwnSyZfZ7v7n1'}

console.log(req.query.category)
console.log(category[req.query.category])

console.log('didtance ',req.query.distance)

console.log(req.query.here)

var res_data = {}
// data = []
// console.log('urllllll',req.url)
var geo_hash = ''
var search_cat = ''
var radius =10
var miles = 'miles'
location_name = ''
var here = (req.query.here).split(',')
// if (req.query.category != 'All'){
search_cat = category[req.query.category]
// } 


if (req.query.distance!=''){
  radius = req.query.distance
}
if (req.query.units!='' || req.query.units!='miles'){
  miles = req.query.units
}
console.log(req.query.keyword,radius,miles,search_cat)


// console.log(search_cat)
event_fetch_url = " https://app.ticketmaster.com/discovery/v2/events.json?apikey="+ticketmaster_api+"&keyword="+req.query.keyword+"&segmentId="+search_cat+"&radius="+radius+"&unit="+miles+"&geoPoint="

if(req.query.loctype == 'location'){
  location_name = req.query.location
getDataPromise(location_name)
.then(function(res){
  var lat = res.results[0].geometry.location.lat  
  var lng = res.results[0].geometry.location.lng


  geo_hash = geohash.encode(lat,lng,7)

  // console.log(geo_hash)


  axios.get(event_fetch_url+geo_hash)
.then(function (response) {
  // console.log('success')
  // console.log(response.data);
  res = parse_data(response.data)
  
  resp.json(res);
})
.catch(function (error) {
  // handle error
  console.log(error);
})
  

})
}
else{
  // resp.json("hello hre")
  
  geo_hash = geohash.encode(here[0],here[1],7)
console.log(here)
  
  axios.get(event_fetch_url+geo_hash)
.then(function (response) {
  // console.log('success')
  // console.log(response.data);
  res = parse_data(response.data)

  console.log("check what is returning",res)
  
  resp.json(res);
})
.catch(function (error) {
  // handle error
  console.log(error);
})
  





}


console.log(glob_var)





})


function parse_data (data){
  var result = []
  if (Object.keys(data).length >2){
    try{
    console.log(data._embedded.events.length)
    events = data._embedded.events
    for(var i =0;i<events.length;i++){
      res = {}

      try{
      date = events[i]['dates']['start']['localDate']
      }
  catch{
      date= 'N/A'
  }



  res[0] = date

  try{
    res[1] = events[i]['name']
    res[4] = events[i]['id']
}
catch{
  res[1] = 'N/A'
  res[4] = ''
}

genre = []
try{
  if (events[i]['classifications'][0]['subGenre']['name'] != 'Undefined'){
  genre.push(events[i]['classifications'][0]['subGenre']['name'])
  }
}
catch{
  
}
try{
  if (events[i]['classifications'][0]['subGenre']['segment'] != 'Undefined'){

  genre.push(events[i]['classifications'][0]['segment']['name'])
  }
}
catch{
}
try{
  if (events[i]['classifications'][0]['type']['name'] != 'Undefined'){

  genre.push(events[i]['classifications'][0]['type']['name'])
  }
}
catch{
}
try{
  if (events[i]['classifications'][0]['subType']['name'] != 'Undefined'){

  genre.push(events[i]['classifications'][0]['subType']['name'])
  }
}
catch{
}try{
  if (events[i]['classifications'][0]['genre']['name'] != 'Undefined'){

  genre.push(events[i]['classifications'][0]['genre']['name'])
  }
}
catch{
}


if(genre.length >0){
res[2] = genre.join('|')
}
else{
  res[2] = 'N/A'
}

try{
  res[3] = events[i]['_embedded']['venues'][0]['name']
}
catch{
  res[3] = 'N/A'
}

try{
  res[5] = events[i]['_embedded']['venues'][0]['id']
}
catch{
  res[5] = ''
}

result.push(res)
    }
  }catch{
    return {}
  }

  result.sort(function(a, b){
    console.log('hello',a[0],b[0])
    var dateA=new Date(a[0]), dateB=new Date(b[0])
    return ( dateA-dateB )//sort by date ascending
})
  return result


  }
  else{
    return false
  }


}


app.get('/hello', function (req, resp) {
  console.log("inside hello")
  resp.json({'status':300})
})

module.exports=app;


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
