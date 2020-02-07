var express = require('express');
var router = express.Router();

//File Upload code with multer
var multer = require('multer');
var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images/')
    },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });  

router.get('/',function(req, res, next) {
    res.render('sales', {products: myProducts})
})


//Direct User to Create Product Form
router.get('/sale-create',(req, res, next)=> {
    res.render('sale-create')
})

//Direct User to Edit Product Form
router.get('/sale-edit/:id',(req, res, next)=> {
    let prodId = req.params.id | 0;
    let product = myProducts.find(product=>product.id == prodId);
    res.render('sale-edit',{ product: product});
});

//Delete product 
router.get('/sale-delete/:id',(req,res,next)=> {
    let prodId = req.params.id | 0;
    myProducts.splice(myProducts.findIndex(p => p.id == prodId),1);
    //can also do  myProducts = myProducts.filter(p => p.id !== prodId);  this will exculde the item that you are looking for 
    res.redirect('/sales')
})

//Post New Product
router.post('/sale-create', upload.single('imageUpload'), (req,res,next)=>{
    myProducts.push({
       id: req.body.id | 0,
       name: req.body.name,
       price: req.body.price,
       size: req.body.size,
       image_path: '/images/'+req.file.originalname
    })
    res.redirect('/sales')
})

//Edit Product     post is when a user is iputing information and your are going to give them some information 
router.post('/sale-edit/:id', upload.single('imageUpload'), (req,res,next)=>{
    
    //find product in array
    let prodId = req.params.id | 0;
    productToEdit = myProducts.find(product=> product.id === prodId);
    
    productToEdit.id = req.body.id | 0;
    productToEdit.name =  req.body.name;
    productToEdit.price = req.body.price;
    productToEdit.size = req.body.size;
    let imgPath = req.file == undefined ? req.body.image_path : '/images/'+req.file.originalname ;
    productToEdit.image_path = imgPath;

    res.redirect('/sales')
})

//Product details page     get is when you are sending the user to a new page 
router.get('/:id',function(req, res, next) {
    let prodId = req.params.id | 0;
    let prod = myProducts.find(product=> product.id === prodId);
    res.render('sale-detail', { product: prod })
})



class Product{
    constructor(id,name,price,size,image_path){
        this.id = id
        this.name = name
        this.price = price
        this.size = size
        this.image_path = image_path
    }
}


let myProducts = []
myProducts.push(
    new Product(1,'Pant',3.99,'M','/images/pants.jpg'),
    new Product(2,'Shirt',75.99,'34"','/images/babyYoda.jpg'),
    new Product(3,'Jacket',35.00,'M','/images/jacket.jpg')
)




module.exports = router;