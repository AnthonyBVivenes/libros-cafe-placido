const Buscar = require('../models/buscador');

exports.getSearch = async (req, res) => {
  try {


    if (!req.body) {
      return res.status(400).json({ error: 'Cuerpo de solicitud vacío' });
    }
console.log(req.body);

    const { txt } = req.body;

    if (!txt) {
      return req.status(400).json({
        error: 'Faltan campos requeridos',
        missing: {
          txt: !txt,
        }
      });
    }

    //res.json({ user: req.session.user });




    const BuscarObj = await Buscar.getSearch(req.body.txt);
    res.json(BuscarObj);
    return res;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


exports.getA33ll_categoriasData = async (req, res) => {
  try {
    const products = await Product.getAll_CategoriasData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


