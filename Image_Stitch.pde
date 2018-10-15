//Inspired by https://forum.processing.org/two/discussion/12512/load-multiple-images-and-pixels-sequentially


PImage [] (name); 
int n = 0;
int colNum = 10;
int rowNum = 10;
PImage thisPhoto;

//int randomNum = 1; //comment out when random black pixel values are added

void setup() {
  size (720, 720);
  background(0);

  int colWidth = 10; 
  int rowHeight = 10;
  int colNum = width/colWidth;
  int rowNum = height/rowHeight;

  
  for(int loop=0; loop < 4; loop++){
  
      for(int i=0; i < 72; i++){ //72 rows
        //println(i);
        for(int j=0; j < 72; j++){ //72 columns
          int randomNum = int(random(numOfImgs)+1); //randomly selecting through 741 images starting at 000.jpg+1
          println(randomNum); //prints random number sort in console
          String theTitle; //string to correctly select + cycle through images in data folder
          if(randomNum < 10){ //image file number 000-009
            theTitle = "(name)00";
          }
          else if(randomNum < 100){ //image file number 010-099
            theTitle = "(name)0";
          }
          else{
            theTitle = "(name)"; //image file number 100+
          }
          thisPhoto = loadImage(theTitle+randomNum+".jpg"); //load images into canvas
          thisPhoto = thisPhoto.get(i*10, j*10, 10, 10); //take part of image and load into canvas
          
          if(random(10) < 1){ //when values are less than x, a black square is placed in pixel area
            image(thisPhoto,i*colWidth, j*rowHeight, 10, 10); //fills cols + rows with random pixel data
          }
        }
      }
  
    save("(fileName)_"+loop+".png"); 
  }
}
  
 
void draw() {

}
