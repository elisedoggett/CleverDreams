// Inspiration from Kyle McDonald's code: https://github.com/kylemcdonald


var request; 
var w = 720; 
var h = 720;
var img;
var jsonWriter; //creating json writer for easier readability of data
var imgNum = 0; //count of image

var jsonContent = []; //creating an array for the json data to be contained/displayed in

function setup() {
  createCanvas(w, h);
  img = loadImage('data/[FILE_1 IN DATA FOLDER].jpg'); 
  jsonWriter = createWriter('[NAME OF OUTPUT IN JSON WRITER].json'); 
  setInterval(processImage, 20000); //every x-amount milliseconds, run process image, higher second count needed to properly process images + output correct data
}

function blobToBase64(blob, cb) { //used to create correct file format for google
  var reader = new window.FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function() {
    cb(reader.result);
  }
}

function canvasToBase64(canvas, cb) { //using to create correct file format for google
    canvas.toBlob(function(blob) {
        blobToBase64(blob, cb);
  },    'image/jpeg');
}

function upload() { //formatting what is being sent what's on the canvas to google to get info
    canvasToBase64(canvas, function(b64) { //sending contents of canvas to function and turns into b64 data which is text file 
      b64 = b64.replace('data:image/jpeg;base64,', ''); // remove unneccessary text/content from google
      request = {
        "requests":[ //requests for google in the format that cloud vision asks for 
          {
            "image":{ "content": b64 },
            "features":[
              {
                "type": "LABEL_DETECTION" //using google descriptions, input features that you want back (can add or remove as many as desired) 
              },
              {
                "type": "IMAGE_PROPERTIES" 
              }
            ]
          }
        ]
      };

      $.ajax({ //sending the information to google through jquery
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key='[API SUBSCRIPTION KEY]',
        contentType: 'application/json',
        data: JSON.stringify(request), //turning request that was created earlier into a string to go through the internet
        processData: false,
          
        success: function(data){ //getting the data back from the request
          console.log('info', data); //ability to see data in browser console
          var labelData = data.responses[0].labelAnnotations; //annotations from label detection that is put into text file
          var imageProps = data.responses[0].imagePropertiesAnnotation.dominantColors;
                        
          var jsonObject = {}; //writing data in json format, opening an array
          jsonObject.img = "[FILE_1 IN DATA FOLDER]" + imgNum; //name of array, match to file
          var results = [];
          // loop through first 5 descriptions
          for (var i = 0; i < 5; i++) { //**WHAT TO DO WHEN IMAGES HAVE LESS THAN 5 DESCRIPTIONS? ie. C1_die9 - CREATE AN IF/ELSE STATEMENT?
              results.push({
                  description: labelData[i].description,
                  score: labelData[i].score
              });
          }
          jsonObject.results = results; //create results as json, read in firefox
          var dominantColors = []; 
          for (var i = 0; i < 5; i++) { //loop through first 5 dominant colours
              dominantColors.push({
                  score: imageProps.colors[i].score,
                  rgb: [imageProps.colors[i].color.red, imageProps.colors[i].color.green, imageProps.colors[i].color.blue]
              });
    
          }
          jsonObject.dominantColors = dominantColors;
            
            
          jsonContent.push(jsonObject);
            
          imgNum++;
            
            var imgText = "";       
             
            
        if (imgNum ==10) { //amount of images in loop, print json data when img = 10
            
            jsonWriter.print(JSON.stringify(jsonContent)); //old writer no longer needed, json writer now new substitute
            jsonWriter.close(); //tidy up after data collection
            jsonWriter.clear(); //file offered as downloadable text
            
          }
        },
        error: function (data, textStatus, errorThrown) { //what happens if google goes wrong, just in case
          console.log('error: ' + data);
        }
      })
    })
}
function draw() {
  // whatever you draw here will be uploaded to google when you call upload()
  image(img, 0, 0, w, h); //image recreated on screen
    
}
function processImage() {
    if (imgNum<10) { //stop process after 10 images
        img = loadImage('data/[FILE_1 IN DATA FOLDER]'+imgNum+'.jpg'); //each time we move through, new number file is analysed
        print('data/[FILE_1 IN DATA FOLDER]'+imgNum+'.jpg');
    
    upload();
     
    }
  }
