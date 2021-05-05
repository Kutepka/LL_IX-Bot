const fs = require('fs')

const upload = (req, res) => {
  const file = req.swagger.params.file.value
  const type = req.swagger.params.type.value
  const name = req.swagger.params.name.value
  const pathUpload = `../api/uploads/${type}`

  if (!fs.existsSync(pathUpload)) {
    fs.mkdirSync(pathUpload, { recursive: true })
  }
  
  const newName =  `${file.md5}.${name.split('.').pop()}`
  const newPath = `${pathUpload}/${newName}`
  
  fs.copyFile(file.tempFilePath, newPath, err => {
    fs.unlink(file.tempFilePath, () => {})
    if(err) {
      res.json({ success: false, error })
    } else {
      res.json({ success: true, result: `/${type}/${newName}` })
    }
  });
}

module.exports = { upload }