const Product = require('../models/categorias');

const { isnotBodyEmpty } = require('../utils/functions');


const administation = require('../models/administracion');
const fs = require('fs').promises;
const path = require('path');



exports.getAll_categorias = async (req, res) => {
  try {
    const products = await Product.getAll_Categorias();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


exports.getAll_categoriasData = async (req, res) => {
  try {
    const products = await Product.getAll_CategoriasData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


exports.getData_productosDestacados = async (id, res) => {
  try {
    // Obtener los códigos de productos destacados
    const productosDestacados = await Product.get_productosDestacados(id); // Asegúrate de pasar el ID correcto

    // Verificar si hay productos destacados
    if (!Array.isArray(productosDestacados) || productosDestacados.length === 0) {
      //console.log( "ff " + productosDestacados.length);
      return []; // Devolver un array vacío si no hay productos destacados
    }
    //console.log( "hh " + productosDestacados[0]);
    // Obtener la información de cada producto
    const productosInfo = await Promise.all(
      productosDestacados.map(async (producto) => {
        return await Product.get_producto(producto); // Asegúrate de que 'codigo' sea la propiedad correcta
      })
    );

    return productosInfo; // Devolver la información de los productos
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    throw new Error('Error al obtener productos destacados'); // Lanzar el error para que sea manejado en la ruta
  }
};




exports.get_producto = async (req, res) => {
  try {
    if (isnotBodyEmpty(req, res)) {
      console.log(req.body.id);
      res.json(await Product.get_producto(req.body.id))
    } else {
      res.json({ g: 'dfdfdolicitud vacío' });
    }
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
  }
};


exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto class object' });
  }
};



exports.isvalid = async (id) => {
  try {
    const r = await Product.get_productoIsValid(id);
    console.log('[isvalidkkkkkkkkk]', r);
    return r;
    //res.status(201).json(newProduct);
  } catch (error) {
    //res.status(400).json({ error: 'Error al crear producto class object' });
  }
};







exports.get_productoDetails2HHHHHHHHHHHH = async (req, res) => {
  try {
    // Obtener los códigos de productos destacados
    //const productosDestacados = await Product.get_productosDestacados(id); // Asegúrate de pasar el ID correcto
    if (isnotBodyEmpty(req, res)) {
      console.log(req.body.id);
      //return res;
      //res.json(await Product.get_producto(req.body.id))
    } else {
      res.json({ message: 'no se encuntra proct, vacío' });
      //return res;
    }

  } catch (error) {
    console.error('Error al obtener productos:', error);
    //throw new Error('Error al obtener productos destacados'); // Lanzar el error para que sea manejado en la ruta
  }
};








exports.get_productoDetails = async (req, res) => {
  try {
    if (isnotBodyEmpty(req, res)) {
      console.log(req.body.id);
      //return res;
      //res.json(await Product.get_producto(req.body.id))
    } else {
      console.log("soli vacia");
      return;
    }


    if (!req.body.id) {
      return res.json({
        message: 'ID de producto no proporcionado'
      });
    }



    const isValidResult = await exports.isvalid(req.body.id);
    console.log("[get_productoDetails] ", isValidResult);

    if (isValidResult.message !== 'valido') {
      return res.json({
        message: 'Producto invalido'
      });
    } else {
      /*return res.json({
        message: 'Producto valido'
      });*/
      console.log("[get_productoDetails] enviando view");
    }


    res.render('detail');

    //res.json(await Product.get_producto(req.body.id))



  } catch (error) {

    console.error('Error getting view prod', error);
  }

};










exports.create_categoria = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'No autenticado' });
        }

        const credencial = await administation.getValid_acceso(req.session.user.id);
        if (credencial !== "admin" && credencial !== "personal") {
            return res.status(403).json({ success: false, message: 'Acceso no autorizado' });
        }

        if (!req.body.nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es un campo requerido'
            });
        }

        let img_default = 0;

        // Manejar la imagen si se subió
        if (req.files && req.files.imagen) {
            const uploadDir = path.join(__dirname, '../../uploads');

            try {
                await fs.mkdir(uploadDir, { recursive: true });
            } catch (err) {
                if (err.code !== 'EEXIST') throw err;
            }

            // Obtener el último número de archivo
            const existingFiles = await fs.readdir(uploadDir);
            const jpgFiles = existingFiles.filter(file => file.endsWith('.png'));
            const lastNumber = jpgFiles.length > 0 ?
                Math.max(...jpgFiles.map(f => parseInt(f.split('.')[0]) || 0)) : 0;

            const newNumber = lastNumber + 1;
            const newFilename = `${newNumber}.png`;
            const filePath = path.join(uploadDir, newFilename);

            // Mover el archivo subido
            await fs.rename(req.files.imagen.tempFilePath || req.files.imagen.path, filePath);
            img_default = newNumber;
        }

        const categoriaData = {
            nombre: req.body.nombre,
            estado: parseInt(req.body.estado) || 1,
            img_default: img_default
        };

        console.log('Datos de categoría:', categoriaData);
        
        // Llamar al modelo para crear la categoría
        const idCategoria = await Product.create_categoria(categoriaData);

        return res.status(201).json({
            success: true,
            id: idCategoria,
            message: 'Categoría creada exitosamente'
        });

    } catch (error) {
        console.error('Error al crear categoría:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};






//EDITAR PRODUCTO

exports.update_producto = async (req, res) => {
    try {
        const datosActualizados = req.body;

        // Validar si el cuerpo de la solicitud está vacío o si le falta el ID
        if (!datosActualizados || Object.keys(datosActualizados).length === 0 || !datosActualizados.id) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se recibieron datos o el ID del producto es inválido.' 
            });
        }
        
        // Llamar al método del modelo para actualizar el producto
        const resultado = await Product.Update_producto(datosActualizados);

        // Enviar una respuesta de éxito al cliente
        res.status(200).json({
            success: true,
            message: 'Producto actualizado con éxito.'
        });
        
    } catch (error) {
        // Enviar una respuesta de error al cliente en caso de fallo
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ocurrió un error en el servidor al actualizar el producto.' 
        });
    }
};

