//import fs from 'fs';
import { Router } from "express";
const router = Router();
import productService from '../services/db/products.services.js'


const productServices = new productService();



router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    let products;

    if (req.query.filter === 'vehiculo') {
      products = await productServices.getProducts("vehiculo");
    } else if (req.query.sort === '') {
      products = await productServices.getPrices();
    } else {
      products = await productServices.getLimit(limit);
    }

    console.log(products);
    res.status(201).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "No se pudieron obtener los productos." });
  }
});





router.get('/pages/:page', async (req, res) => {
  try {
    let page = parseInt(req.params.page);
    let user = await productServices.getName(req.session.user.email);
    console.log(user);
    
    let products = await productServices.getPage(page);
    
    console.log(products);
    
    if (req.session.user.role !== 'admin') {
      res.render('products', {
        isValid: true,
        user: user.first_name,
        email: user.email,
        docs: products.docs,
        hasPrevPage: products.hasPrevPage,
        prevLink: `/api/products/pages/${products.prevPage}`,
        page: products.page,
        hasNextPage: products.hasNextPage,
        nextLink: `/api/products/pages/${products.nextPage}`
      });
    }else{
      res.render('admin');
    } 
    
  } catch (error) {
    console.error(error);
    res.status(500).send({message: "No se pudieron obtener los productos."});
  }
  
})




router.post('/pages/:page', (req, res) => {
  // Aquí deberías destruir la sesión del usuario
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    } else {
      // Redirige al usuario a la página de inicio de sesión después de destruir la sesión
      res.redirect('/');
    }
  });
});




    //CORRESPONDE A LA ENTREGA ANTERIOR



router.get('/',async(req,res)=>{
  const limit = req.query.limit || 10;
  try {
      let carts = await productServices.getAll(limit);
      res.send(carts);
  } catch (error) {
      console.error(error);
      res.status(500).send({message: "No se pudo obtener los estudiantes."});
  }
  
})



//POST
router.post('/',async(req,res)=>{
  const product = req.body
  try {
      let result = await productServices.save(product);
      res.status(201).send(result);
  } catch (error) {
      console.error(error);
      res.status(500).send({message: "No se pudo guardar el producto, complete todos los campos."});
  }
})



router.put('/:pid', async (req, res) => {
  const productIdToUpdate = req.params.pid;
  const updateFields = req.body;

  try {
      const updatedProduct = await productServices.updateById(productIdToUpdate, updateFields);
      res.send(updatedProduct);
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "No se pudo actualizar el producto." });
  }
});


router.delete('/:pid', async (req, res) => {
  const deleteProductId = req.params.pid;

  try {
      const updatedProduct = await productServices.deleteById(deleteProductId);
      res.send(updatedProduct);
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "No se pudo actualizar el producto." });
  }
});




export default router;






/* const guardarProductosEnArchivo = () => {
    try {
        fs.promises.mkdir(dirName, { recursive: true });
        fs.writeFileSync(productosFilePath, JSON.stringify(nuevoArray, null, 2), 'utf8');
        console.log('Datos guardados en el archivo productos.json.');
    } catch (error) {
        console.log('No se pudo escribir el archivo productos.json:', error);
    }
}; */

// Leer productos desde el archivo si existe

/* const leerProductosDeArchivo = () => {
    try {
        if (fs.existsSync(productosFilePath)) {
            const data = fs.readFileSync(productosFilePath, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.log('No se pudo leer el archivo productos.json:', error);
        return [];
    }
}; */

// Cargar productos al iniciar el servidor

/* nuevoArray.push(...leerProductosDeArchivo());
if (nuevoArray.length > 0) {
    id = nuevoArray[nuevoArray.length - 1].id + 1;
} */


//ruta get "/"


/* router.get('/', (req, res) => {
  const products = nuevoArray;
  const limit = parseInt(req.query.limit);

  if (!Number.isNaN(limit)) {
  const limitedProducts = [];
  for (let i = 0; i < limit && i < products.length; i++) {
      limitedProducts.push(products[i]);
  }
  res.send(limitedProducts);
  } else {
  res.send(products);
  }
}); */





//ruta get /:pid

/* router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  const product = nuevoArray.find(product => product.id === productId);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }

}); */





// Ruta POST "/"
/* const camposRequeridos = (title, description, code, price, status, stock, category, thumbnail) => {
    return !(!title || !description || !code || !price || !status || !stock || !category || !thumbnail);
};

const validarCampos = (req, res, next) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    if (!camposRequeridos(title, description, code, price, status, stock, category, thumbnail)) {
        return res.status(400).send('Error: Todos los campos son obligatorios');
    }
    next();
};

router.post('/', validarCampos, (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    const producto = {
        id: id++,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    };

    nuevoArray.push(producto);
    guardarProductosEnArchivo();
    res.send({ status: "success", message: "Producto AGREGADO con éxito" });
}); */

//ruta put "/"

/* router.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  let resultado = nuevoArray.findIndex(product => product.id === productId);

  if (resultado < 0) {
      return res.status(404).send('Producto no encontrado, no se puede actualizar');
  }

  const {title, description, code, price, status, stock, category, thumbnail } = req.body;

  nuevoArray[resultado] = {
      id: productId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
  }
  console.log(nuevoArray);

  res.send({ status: "success", message: "Producto ACTUALIZADO con éxito" });
}); */


//ruta delete "/"


/* router.delete('/:pid', (req, res) => {

  const productId = parseInt(req.params.pid);

  const resultado = nuevoArray.findIndex(product => product.id === productId);

  if (resultado !== -1) {
    nuevoArray.splice(resultado, 1);
  }
  else{
    console.log('producto no encontrado');
  }
  
  res.send({ status: "success", message: "Producto ELIMINADO con éxito" });

}); */

