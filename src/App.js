import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl="http://localhost/apiAlejandroFiguras/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado]=useState({
    id: '',
    angulo: '',
    lado: '',
    vertice: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setFrameworkSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("angulo", frameworkSeleccionado.angulo);
    f.append("lado", frameworkSeleccionado.lado);
    f.append("vertice", frameworkSeleccionado.vertice);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("angulo", frameworkSeleccionado.angulo);
    f.append("lado", frameworkSeleccionado.lado);
    f.append("vertice", frameworkSeleccionado.vertice);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(framework=>{
        if(framework.id===frameworkSeleccionado.id){
          framework.angulo=frameworkSeleccionado.angulo;
          framework.lado=frameworkSeleccionado.lado;
          framework.vertice=frameworkSeleccionado.vertice;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      setData(data.filter(framework=>framework.id!==frameworkSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarFramework=(framework, caso)=>{
    setFrameworkSeleccionado(framework);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
<div style={{textAlign: 'center'}}>
<br/>
      <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Agregar</button>
      <br /><br />
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Angulo</th>
          <th>Lado</th>
          <th>Vertice</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(framework=>(
          <tr key={framework.id}>
            <td>{framework.id}</td>
            <td>{framework.angulo}</td>
            <td>{framework.lado}</td>
            <td>{framework.vertice}</td>
          <td>
          <button className="btn btn-primary" onClick={()=>seleccionarFramework(framework, "Editar")}>Editar</button> {"  "}
          <button className="btn btn-danger" onClick={()=>seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
          </td>
          </tr>
        ))}

      </tbody> 

    </table>

    <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar Figura</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Angulo: </label>
          <br />
          <input type="text" className="form-control" name="angulo" onChange={handleChange}/>
          <br />
          <label>Lado: </label>
          <br />
          <input type="text" className="form-control" name="lado" onChange={handleChange}/>
          <br />
          <label>Vertice: </label>
          <br />
          <input type="text" className="form-control" name="vertice" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>
    
    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Figura</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Angulo: </label>
          <br />
          <input type="text" className="form-control" name="angulo" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.angulo}/>
          <br />
          <label>Lado: </label>
          <br />
          <input type="text" className="form-control" name="lado" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.lado}/>
          <br />
          <label>Vertice: </label>
          <br />
          <input type="text" className="form-control" name="vertice" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.vertice}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar la Figura {frameworkSeleccionado && frameworkSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;

