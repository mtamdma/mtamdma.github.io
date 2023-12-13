data.sort(function(a,b){ //Сортировка базы данных по имени ингредиента
      if (a.INGREDIENT_NAME>b.INGREDIENT_NAME){return 1};
      if (a.INGREDIENT_NAME>b.INGREDIENT_NAME){return -1};
      return 0;
});

for (let i = 0; i<data.length;i++){data[i].LOCAL_ID=i} //присвоение ингредиентам локального ID

var ingredients = [];
var effects =[];

for (let item of data){ //составление списка эффектов
      if (!effects.includes(item.PRIMARY_EFFECT)){
            effects.push(item.PRIMARY_EFFECT,item.E1,[]);
      };
      if (!effects.includes(item.SECONDARY_EFFECT)){
            effects.push(item.SECONDARY_EFFECT,item.E2,[]);
      };
      if (!effects.includes(item.TERTIARY_EFFECT)){
            effects.push(item.TERTIARY_EFFECT,item.E3,[]);
      };
      if (!effects.includes(item.QUATERNARY_EFFECT)){
            effects.push(item.QUATERNARY_EFFECT,item.E4,[]);
      };
};


for (let item of data){ //составление списка ингредиентов
      ingredients.push({
            'LOCAL_ID':item.LOCAL_ID,
            'NAME':item.INGREDIENT_NAME,
            'EFFECTS':[[effects.indexOf(item.PRIMARY_EFFECT)/3,item.MM1,item.TM1,item.VM1],[effects.indexOf(item.SECONDARY_EFFECT)/3,item.MM2,item.TM2,item.VM2],[effects.indexOf(item.TERTIARY_EFFECT)/3,item.MM3,item.TM3,item.VM3],[effects.indexOf(item.QUATERNARY_EFFECT)/3,item.MM4,item.TM4,item.VM4]],
            'DESCRIPTION':item.DESCRIPTION,
      });
      effects[effects.indexOf(item.PRIMARY_EFFECT)+2].push(item.LOCAL_ID);
      effects[effects.indexOf(item.SECONDARY_EFFECT)+2].push(item.LOCAL_ID);
      effects[effects.indexOf(item.TERTIARY_EFFECT)+2].push(item.LOCAL_ID);
      effects[effects.indexOf(item.QUATERNARY_EFFECT)+2].push(item.LOCAL_ID)
};

for (let i = 0;i<effects.length;i++ ){ //преобразование списка эффектов к виду [Название эффекта, p/n]
      let foo =[effects[i],effects[i+1],effects[i+2]];
      effects.splice(i,3,foo);
}

GetVal()


function GetVal(){ //узнаем, от чего работаем
      const val = document.getElementById("type").value;
      if (val == "Ingredient"){
            console.log('qq');
            S_Ingredients();
      };
      if (val == "Effect"){
            console.log('ef');
            S_Effects();
      };
}

function S_Ingredients(){ //поиск ингредиентов
      document.getElementById('search').onkeyup = function() {
           document.getElementById('data').innerHTML = '';
           if(this.value.toLowerCase().length > 1) {
            for (let ingredient of ingredients){
                  if (ingredient.NAME.toLowerCase().includes(this.value.toLowerCase())){
                        document.getElementById('data').innerHTML +=
                              '<div id = "itemdata'+ingredient.LOCAL_ID+'">'+
                                    '<button class = "item" onclick=tgEffects('+ingredient.LOCAL_ID+')>'+ ingredient.NAME+ '</button>'+
                                    '<div class = "IngredientEffects" id = "efflist'+ ingredient.LOCAL_ID +'">'+
                                    '</div>'+
                              '</div>'
                  }
            }
           }

      }
}

function tgEffects(id){ //отобразить эффекты ингредиента
      if (document.getElementById('efflist' + id).innerHTML != ''){
            document.getElementById('efflist' + id).innerHTML = '';
      }
      else{
            ingredient = ingredients[id]
            document.getElementById('efflist' + id).innerHTML = '';
            document.getElementById('efflist'+ingredient.LOCAL_ID).innerHTML+=
                  '<div class = "effrow">'+
                  '<div class = "eff_check"><label><input type = "checkbox" id ="ch'+ingredient.LOCAL_ID+'_0"><div>'+effects[ingredient.EFFECTS[0][0]][0]+'</div><div></div></label></div>'+
                  '<div class = "eff_check"><label><input type = "checkbox" id ="ch'+ingredient.LOCAL_ID+'_1"><div>'+effects[ingredient.EFFECTS[1][0]][0]+'</div><div></div></label></div>'+
                  '</div>'+
                  '<div class = "effrow">'+
                  '<div class = "eff_check"><label><input type = "checkbox" id ="ch'+ingredient.LOCAL_ID+'_2"><div>'+effects[ingredient.EFFECTS[2][0]][0]+'</div><div></div></label></div>'+
                  '<div class = "eff_check"><label><input type = "checkbox" id ="ch'+ingredient.LOCAL_ID+'_3"><div>'+effects[ingredient.EFFECTS[3][0]][0]+'</div><div></div></label></div>'+
                  '</div>'+
                  '<div class= "effrow"><button onclick = Calculate('+ingredient.LOCAL_ID+')>Calculate</button></div>'+
                  '<div id="calculated'+ingredient.LOCAL_ID+'"></div>'
            }
}

function Calculate(id){
      document.getElementById("calculated"+id.toString()).innerHTML=''
      let effids = [];
      for (let i = 0; i < 4; i++){
            let checker = "ch" + id.toString() + "_" + i.toString();
            if (document.getElementById(checker).checked){effids.push(ingredients[id].EFFECTS[i][0])};
      }
      console.log(effids)
      for (let i of effids){
                  document.getElementById("calculated"+id.toString()).innerHTML+=effects[i][0]+": "
                  for (let item of effects[i][2]){document.getElementById("calculated"+id.toString()).innerHTML+=ingredients[item].NAME+", "};
                  document.getElementById("calculated"+id.toString()).innerHTML=document.getElementById("calculated"+id.toString()).innerHTML.slice(0,-2);
                  document.getElementById("calculated"+id.toString()).innerHTML+="<br>";
      }
}

function S_Effects(){ //поиск эффектов
      document.getElementById('search').onkeyup = function() {
           document.getElementById('data').innerHTML = '';
           if(this.value.toLowerCase().length > 1) {
            for (let i = 0; i < inglist.length; i++){
                  if (efflist[i][0].toLowerCase().includes(this.value.toLowerCase())){
                        document.getElementById('data').innerHTML += efflist[i][0] + "<br>";
                  }
            }
           }

      }
}