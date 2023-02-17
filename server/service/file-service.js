const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

class fileService{
  saveFile(file){
    try{
      const fileName = uuid.v4() + '.jpg'
      const filePath = path.resolve('static', fileName)
      file.mv(filePath)
      return fileName
    }catch(e){
      console.log(e);
    }
  }

  removeFile(fileName){
    try{
      const filePath = path.resolve('static', fileName)
      fs.access(filePath, err => {
        if(!err){
          fs.unlink(filePath, err => {})
        } 
      })
      return fileName
    }catch(e){
      console.log(e);
    }
  }
}

module.exports = new fileService()