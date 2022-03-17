import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function App() {

  const baseUrl = "https://localhost:7062/api/AlunosCrontroller";

  const [data, setData]=useState([]);

  const [modalIncluir, setModalIncluir]=useState(false);
  const abrirFecharModal=()=>{
    setModalIncluir(!modalIncluir);
  }

  const [modalEditar, setModalEditar]=useState(false);

  const abrirFecharEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const [modalExcluir, setModalExcluir]=useState(false);
  const abrirFecharExcluir=()=>{
    setModalExcluir(!modalExcluir);
  }

  const [updateData, setUpdateData] = useState(true);


  const selectAluno=(aluno, opcao)=>{
    setAlunoSelect(aluno);
      (opcao==="Editar") ?
        abrirFecharEditar(): abrirFecharExcluir();
  }

  const [alunoSelect, setAlunoSelect]= useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  })

  const handleChange=e=>{
    const {name,value}=e.target;
    setAlunoSelect({
      ...alunoSelect,
      [name]:value
    });
    console.log(alunoSelect);
  }

  const pedidoGet=async()=>{
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const pedidoPost=async()=>{
    delete alunoSelect.id;
    alunoSelect.idade=parseInt(alunoSelect.idade);
      await axios.post(baseUrl, alunoSelect)
    .then(response=>{
      setData(data.concat(response.data));
      setUpdateData(true);
      abrirFecharModal();
    }).catch(error=>{
      console.log(error);
    })
  }

  const pedidoPut=async()=>{
    alunoSelect.idade=parseInt(alunoSelect.idade);
    await axios.put(baseUrl+"/"+alunoSelect.id, alunoSelect)
    .then(response=>{
      var resposta = response.data;
      var dadosAuxiliar=data;
      dadosAuxiliar.map(aluno=>{
        if(aluno.id===alunoSelect.id){
          aluno.nome=resposta.nome;
          aluno.email=resposta.email;
          aluno.idade=resposta.idade;
        }
      });
      setUpdateData(true);
      abrirFecharEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const pedidoDelete=async()=>{
    await axios.delete(baseUrl+"/"+alunoSelect.id, alunoSelect)
    .then(response=>{
      setData(data.filter(aluno=> aluno.id !== response.data));
      setUpdateData(true);
      abrirFecharExcluir();
    }).catch(error=>{
      console.log(error);
    })
  }

  useEffect(()=>{
    if(updateData){
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData])


  return (
    <div className="App">
      <br/>
      <h3>Cadastro de Alunos</h3>
      <header>
        <button className='btn btn-success' onClick={()=>abrirFecharModal()}>Incluir Novo Aluno</button>        
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operacao</th>
          </tr>
        </thead>
        <tbody>
          {/* exibir os dados */
          data.map(aluno=>(
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className='btn btn-primary' onClick={()=>selectAluno(aluno, "Editar")}>editar</button> {" "}
                <button className='btn btn-danger' onClick={()=>selectAluno(aluno, "Excluir")}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
      <ModalHeader>
        Incluir Alunos
      </ModalHeader>
      <ModalBody>
      <div className='form-group'>
        <label>Nome</label>
        <input type="text" className='form-control' name="nome" onChange={handleChange} />
        <label>Email</label>
        <input type="text" className='form-control' name="email" onChange={handleChange} />
        <label>Idade</label>
        <input type="text" className='form-control' name="idade" onChange={handleChange} />
      </div>
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-primary' onClick={()=>pedidoPost()}>Incluir</button> {" "}
        <button className='btn btn-danger' onClick={()=>abrirFecharModal()} >Cancelar</button>
      </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
      <ModalHeader>
        Editar Alunos
      </ModalHeader>
      <ModalBody>
      <div className='form-group'>
        <label>Id:</label>
        <input type="text" className='form-control' readOnly value={alunoSelect && alunoSelect.id} />
        <label>Nome</label>
        <input type="text" className='form-control' name="nome" onChange={handleChange} 
            value={alunoSelect && alunoSelect.nome}/>
        <label>Email</label>
        <input type="text" className='form-control' name="email" onChange={handleChange} 
            value={alunoSelect && alunoSelect.email}/>
        <label>Idade</label>
        <input type="text" className='form-control' name="idade" onChange={handleChange} 
            value={alunoSelect && alunoSelect.idade}/>
      </div>
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-primary' onClick={()=>pedidoPut()}>Atualizar</button> {" "}
        <button className='btn btn-danger' onClick={()=>abrirFecharEditar()} >Cancelar</button>
      </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirmar a exclusao deste(a) aluno(a) : {alunoSelect && alunoSelect.nome} ?
        </ModalBody>

        <ModalFooter>
          <button className='btn btn-danger' onClick={()=>pedidoDelete()}>Sim</button>
          <button className='btn btn-secondary' onClick={()=>abrirFecharExcluir()}>Nao</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
