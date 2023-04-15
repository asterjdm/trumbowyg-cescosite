
   
function decodeEntity(inputStr) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = inputStr;
    return textarea.value;
}


function isUserLike(Type, userPK, likes){

   
    //"+", data[i].reaction
    
 //   console.log(likes.length)
    for (let i = 0; i < Object.keys(likes).length; i++) {
        if(likes["reaction#" + i].type == Type ){
            if(likes["reaction#" + i].USER_FK == userPK ){
                return true
            }
        }
        
    }
    return false
}

function countLike(Type, likes){
    //"+", data[i].reaction
    let result = 0
 //   console.log(likes.length)
    for (let i = 0; i < Object.keys(likes).length; i++) {
        if(likes["reaction#" + i].type == Type ){
            result ++
            //console.log(likes["reaction#" + i].type )
        }
        
    }
    return result;
}

function getCloudData(){
    return $.get('getPosts.php',true)
}

function reaction(type, PK){

    $.get('getPosts.php',true)


    is_co = document.getElementById("user_pk").value


    if(is_co == 'false'){
        window.location.href = "?page=connection"
       

    }else{
      
    //  window.location.href = 'like.php?num='+PK + "&type="+encodeURIComponent(type)

        $.post("like.php",{
            num : PK,
            type : type
        })
        /*
        
        $.get('getPosts.php',true , function(result) {

    
            data =  JSON.parse(decodeEntity(result))

            updateLikes(data[Object.keys(data).find(key => data[key].ARTICLES_PK == PK)])
            
        
            
        })
        
        */

        $.when(getCloudData()).done(function (result) {
            data =  JSON.parse(decodeEntity(result))

            updateLikes(data[Object.keys(data).find(key => data[key].ARTICLES_PK == PK)])
         });
        
    }
}


function updateLikes(article){

    console.log(article)
    pk = article.ARTICLES_PK


      
        let nbLike = 0
        let nbNeutre = 0
        let nbDislike = 0
        let scrLike = "./img/upvote_vide.png"
        let scrNeutre = "./img/neutrevote_vide.png"
        let scrDislike = "./img/downvote_vide.png"



            if(typeof article.reaction != "undefined"){

                
                nbLike = countLike( "+", article.reaction)
                nbNeutre = countLike( "=", article.reaction)
                nbDislike = countLike( "-", article.reaction)
                user_pk = document.getElementById("user_pk").value
                if (isUserLike("+", user_pk, article.reaction)) {
                    scrLike = "./img/upvote_plein.png"
                }
                if (isUserLike("=", user_pk, article.reaction)) {
                    scrNeutre = "./img/neutrevote_plein.png"
                }
                if (isUserLike("-", user_pk, article.reaction)) {
                    scrDislike = "./img/downvote_plein.png"
                }
            
            }
            console.log("imgLike" + pk)
            document.getElementById("imgLike" + pk).src = scrLike
            document.getElementById("imgDislike" + pk).src = scrDislike
            document.getElementById("imgNeutrelike" + pk).src = scrNeutre

            console.log("LikeP" + pk)
            document.getElementById("LikeP" + pk).innerHTML = nbLike
            document.getElementById("NeutreP" + pk).innerHTML = nbNeutre
            document.getElementById("DislikeP" + pk).innerHTML = nbDislike


    
        

    
}

function coments(articlePK){

    var article = document.getElementById("large_coms" + articlePK);
    if(getComputedStyle(article).display == "none"){
        article.style.display = "block"
    }else{
        article.style.display = "none"
    }




}

function sendComData(a_pk)
{


    console.log("a")
    user_pk = document.getElementById("user_pk").value


    if(user_pk == ''){
        window.location.href = "?page=connection"
       

    }else{


    var comcontent = document.getElementById("comText" + a_pk).value;


    var titlee = document.getElementById("title" + a_pk).value;




   
   

    $.ajax({
        type: 'post',
        url: 'coment.php',
        data: {
            textC:comcontent,
            articlePK:a_pk,
            title:titlee
        },
        success: function(response) {
         
            $.when(getCloudData()).done(function (result) {
                let i = Object.keys(data).find(key => data[key].ARTICLES_PK == a_pk)
                data =  JSON.parse(decodeEntity(result))
                console.log(data)
           
                loadCom(data[i].comments, a_pk)

                document.getElementById("comText" + a_pk).value = ""
            });
        }
    });
    
        
     
    }
}


function signal(id, title) {
    let sure = prompt("Cette article ne respect pas les règle de CescoSite ? (oui/non)", "non");
    if (sure == "oui") {
    
        location.href = "./signal.php?id=" + id
    }
    
}

function loadCom(coments, pk)
{
   



        let comesHtml =""
        
        console.log(coments)
  

        if(typeof coments != 'undefined'){
            for (let ii = 0; ii < Object.keys(coments).length; ii++) {
                comesHtml += "<section>"
                comesHtml += "<b>_______________________</b><br>" 
                    comesHtml += coments["com"+ii].content
                    
                    comesHtml += "</section>"
                
            }
        }
        comesHtml += "<b>_______________________</b><br>" 

        comEmp = document.getElementById('com' +pk)

        comEmp.innerHTML = comesHtml
    
}


function loadPost(index, data){
    console.log(index)

    article = data[index]
    pk = article.ARTICLES_PK

    artZone = document.getElementById("artZone")

    let articlesHtml = ""

    

    articlesHtml += "<div id = art"+pk+" class= 'post_zone'>"
    articlesHtml += "<div class='top_of_post'>"
    articlesHtml += "<div class='hight_left_post'>"
    articlesHtml += "<button class='profile_photo_post'></button>"
    articlesHtml += '<div class="user_date_post"><p class="post_user">' + article.creator + '</p>'
    articlesHtml += '<p class="post_date">'+ article.dat +'</p></div></div><br>'
    articlesHtml += '<div class="little"><p class="post_little_title">'+ article.title +'</p></div>'
    articlesHtml += '<div class="line"></div>'
    articlesHtml += '<div class="post_text">'+ article.content +'</div>'
    articlesHtml += '<div class="bottom_post_button">'
    articlesHtml += '<div '+ "onclick='signal("+pk+")'" +' class="report"><p class="text_in_button_bottom_left">!</p></div>'
    articlesHtml += '<div onclick="coments('+pk+')" class="comment"><p class="text_in_button_bottom_right">></p></div>'

    articlesHtml += "<div style = 'display:none' id = 'large_coms"+pk+"'>"
    
    articlesHtml += "<div class='zonetxt' id='comment-form'  id='comForm'> <textarea class='comText' id='comText"+pk+"' name='textC'></textarea>  <input id = 'title"+pk+"' name='title'  style='visibility : hidden' value='"+article.title+"'> <br> <button onclick = 'sendComData("+pk+")' class='boutton' type='submit'  id='submit' alt='submit'>Envoyer</button> </div>"
    
    articlesHtml += "<div  id = 'com"+pk+"'>"

        //coments here

    articlesHtml += "</div>"
    articlesHtml += "</div>"
   
    articlesHtml += "</div>"

    /*
                
    articlesHtml += "<h1>" + article.title + "</h1><br>"
    articlesHtml += article.content
    
    articlesHtml += "<br><br><strong><i>Article créé par " + article.creator + ".    Date : " + article.dat + "</strong></i>"

    articlesHtml += "<br>"

    articlesHtml += "<button onclick = 'coments("+pk+")' >&dArr;Commentaires&dArr;</button>"
    articlesHtml += "<button onclick = 'signal("+pk+")' >Signaler</button>"



    articlesHtml += "<div style = 'display:none' id = 'large_coms"+pk+"'>"
    
    articlesHtml += "<div class='zonetxt' id='comment-form'  id='comForm'> <textarea class='comText' id='comText"+pk+"' name='textC'></textarea>  <input id = 'title"+pk+"' name='title'  style='visibility : hidden' value='"+article.title+"'> <br> <button onclick = 'sendComData("+pk+")' class='boutton' type='submit'  id='submit' alt='submit'>Envoyer</button> </div>"

    articlesHtml += "<div  id = 'com"+pk+"'>"

        //coments here

    articlesHtml += "</div>"

    articlesHtml += "</div>"


    

        

    articlesHtml += "<div class = 'avi' id = 'avi"+pk+"'>"

        let nbLike = 0
        let nbNeutre = 0
        let nbDislike = 0
        let scrLike = "./img/upvote_vide.png"
        let scrNeutre = "./img/neutrevote_vide.png"
        let scrDislike = "./img/downvote_vide.png"



            if(typeof article.reaction != "undefined"){

                
                nbLike = countLike( "+", article.reaction)
                nbNeutre = countLike( "=", article.reaction)
                nbDislike = countLike( "-", article.reaction)
                user_pk = document.getElementById("user_pk").value
                if (isUserLike("+", user_pk, article.reaction)) {
                    scrLike = "./img/upvote_plein.png"
                }
                if (isUserLike("=", user_pk, article.reaction)) {
                    scrNeutre = "./img/neutrevote_plein.png"
                }
                if (isUserLike("-", user_pk, article.reaction)) {
                    scrDislike = "./img/downvote_plein.png"
                }
            
            }
        // console.log(scrLike)
            articlesHtml += "<button class='like' onclick = 'reaction(\"+\", "+pk+")' ><img id='imgLike" + pk + "' width =50 src='"+scrLike+"'></button><p id=LikeP"+pk+" >"+nbLike+"</p>"
            articlesHtml += "<button class='neutrelike' onclick = 'reaction(\"=\", "+pk+")' ><img id='imgNeutrelike" + pk + "'width =50 src='"+scrNeutre+"'></button><p id=NeutreP"+pk+" >"+nbNeutre+"</p>"
            articlesHtml += "<button class='dislike' onclick = 'reaction(\"-\", "+pk+")' ><img id='imgDislike" + pk + "' width =50 src='"+scrDislike+"'></button><p id=DislikeP"+pk+" >"+nbDislike+"</p>"
            


    articlesHtml += "</div>"


    articlesHtml += "</section>"
*/
    artZone.innerHTML += articlesHtml
  
    



}
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
function loadAll(){
    $.when(getCloudData()).done(function (result) {
        data =  JSON.parse(decodeEntity(result))
        range = document.getElementById("range").value
    
        if(range == "more_times"){

        }else if(range == "more_likes"){
            data.sort(function(a, b) {
                let aReactions = 0;
                let bReactions = 0;
                if (a.reaction) {
                  Object.values(a.reaction).forEach(function(reaction) {
                    if (reaction.type === '+') {
                      aReactions += 1;
                    }
                  });
                }
                if (b.reaction) {
                  Object.values(b.reaction).forEach(function(reaction) {
                    if (reaction.type === '+') {
                      bReactions += 1;
                    }
                  });
                }
                return bReactions - aReactions;
              });
              
        }else if(range == "random"){
            shuffle(data);
        }
        document.getElementById("artZone").innerHTML = ""

        for (let i = 0; i < data.length; i++) {
        
        
            loadPost(i, data)
            loadCom(data[i].comments, data[i].ARTICLES_PK)
        
            
        }
     });
    
}


loadAll()   

$(document).ready(function() {
    
    $('#range').change(function(){
     loadAll()
    });
});
