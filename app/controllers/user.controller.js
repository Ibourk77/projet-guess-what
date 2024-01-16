const emailValidator = require ("email-validator");
const { passwordStrength } = require('check-password-strength');
const bcrypt = require('bcrypt');
const { User } = require("../models");

const userController = {

  // formulaire inscription
  signup(req,res){
    res.render('signup', {error: [], post: {}});
  },

  async signupAction(req,res){
    try {
      const {
        username,
        email,
        password,
        passwordConfirm
      } = req.body;

      const errors = [];
      

      /****** vérification formulaire *******/
      if(!username || !email || !password || !passwordConfirm){
        errors.push('Tous les champs sont obligatoires');
      }

      if(!emailValidator.validate(email)){
        errors.push("Format d'email invalide");
      }

      // force medium
      if(passwordStrength(password).id < 2){
        errors.push('Mot de passe insuffisant');
      }

      if(passwordConfirm !== password){
        errors.push('Les mots de passe ne correspondent pas');
      }

      if(errors.length){
        return res.status(400).render('sinup', {errors, post: req.body});
      }

      // une fois toute la vérif formulaire passé et validé on peut inscrire l'utilisateur
      // mais avant on chiffre le MDP
      encryptedPassword = await bcrypt.hash(password, 10);

      await User.create({
        username,
        email,
        password: encryptedPassword
      });

      res.redirect('/signin');
    
    }catch(err){
      next(err);
    }
  },

  // formulaire connexion
  signin(_, res){
    res.render('signin', {errors: [], post: {}});
  },

  async signinAction(req,res){
    const { email, password, remenber } = req.body;
    const errors = [];
  
  if(!email || !password){
    errors.push('tous les champs sont obligatoires');
  }

  if(!emailValidator.validate(email)){
    errors.push("Format d'email invalide");
  }

  const user = await User.findOne({ where: {email} });

  // rester le plus flou possible sur l'objet de l'erreur
  if(!user){
    errors.push("Identifiants invalide")
  }else {
    // comparer le mot de passe enregistré en BDD (user.password) avec celui saisis par l'utilisateur 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      errors.push("Identifiants invalide")
    }
  }

  if(errors.length){
    return res.render('signin', {errors, post: {email}});
  }

  // une fois les vérif formualaire connexion passé et validé on peut connecter l'utilisateur
  // 
  
  
  }





}