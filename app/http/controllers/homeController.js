const Menu=require('../../models/menu');
function homeController(){
    return{
       async index(req,res){
            const Food=await Menu.find();
            console.log(Food);
            res.render('home',{Food:Food});
        }
    }
}
module.exports=homeController;