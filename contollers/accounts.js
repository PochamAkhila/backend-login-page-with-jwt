const AccountModel=require('../model/accounts')
const _=require("lodash")
// const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const tokenCreater = (id) => {
    return jwt.sign({id},process.env.SECRET,{expiresIn: "1d"})
}

const forLogin = async (req,res) =>{
    const { email,password} = req.body
    try {
        const user =await AccountModel.login(email ,password)
        const token = tokenCreater(user.id)
        res.status(200).json({email,token})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

const forSignup = async (req,res) =>{
    const { email,password} = req.body
    try {
        const user =await AccountModel.signup(email ,password)
        const token = tokenCreater(user.id)
        res.status(200).json({email,token})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}


const createAccount = function (req, res, next) {
    const product = new AccountModel(req.body);
    product.save(function (err, data) {
        if (err) {
            return res.status(422).send(err);
        }
        return res.send(data)
    });

}

const getAccounts=function (req,res,next) {
    // return res.send('i am products controller');

    if(req.params.id){
        AccountModel.findOne({_id:req.params.id},
            function(err,data){return res.send(data)
             })
            }
    else {
        AccountModel.find({},function(err,data){
            return res.send(data)
            // return res.send('i am products controller');
        })
    }
   
}


const deleteAccount = function(req,res,next){
    const id = _.get(req,"params.id",null)
    AccountModel.findByIdAndDelete(id,function(err,data){
        if(err){
            return res.status(404).send(err)
        }
        return res.send(data)
    })
   
}

const updateAccount = function(req,res,next){
    const id = _.get(req,"params.id", null)
    const body = _.get(req,"body" , {})
    AccountModel.findByIdAndUpdate(id,{$set:body},function(err,data){
        if(err){
            return res.status(404).send(err)
        }
        return res.status(200).send({message : "done"})
    })

}
module.exports={getAccounts,createAccount,deleteAccount,updateAccount,forSignup,forLogin}