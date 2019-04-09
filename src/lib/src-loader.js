//SourceLoader 
export default (function(){
   function SourceLoader(scriptfile){
      return new Promise((resolve,reject)=>{
         var xhttp;
         if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
         } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
         }
         xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
               resolve(xhttp.responseText);
            }
         };
         xhttp.open("GET", scriptfile, true);
         xhttp.send();
      });
   }
   return SourceLoader;
}());
