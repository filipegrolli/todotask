import { useState, useEffect, FormEvent, ChangeEvent  } from "react";
import { updateDoc, doc, addDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../../FirebaseConnection";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./admin.css";
import { useTaskStore } from "../../store";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  createdAt: Date;
  uid: string;
  attachments?: string[];
}

interface EditState {
  id?: string;
  task?: Partial<Task>;
}

export default function Admin(): JSX.Element {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<string>("Low");
  const [status, setStatus] = useState<string>("To Do");
  const [edit, setEdit] = useState<EditState>({});
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterDueDate, setFilterDueDate] = useState<string>("");
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const { tasks, setTasks, addTask, updateTask, deleteTask } = useTaskStore();

  useEffect(() => {
    async function loadTasks() {
      if (!user) return;

      const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const tasksList: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksList);
    }

    loadTasks();
  }, [user, setTasks]);

  async function handleRegister(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (title === "" || description === "" || dueDate === "") {
      toast.warn("Por favor, preencha todos os campos");
      return;
    }

    if (Object.keys(edit).length > 0) {
      handleUpdateTask();
      return;
    }

    handleCreateTask();
  }

  async function handleCreateTask(): Promise<void> {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title,
        description,
        dueDate,
        priority,
        status,
        createdAt: new Date(),
        uid: user.uid,
      });

      const attachmentUrls = await uploadAttachments(docRef.id);

      await updateDoc(docRef, {
        attachments: attachmentUrls,
      });
      
      addTask({ id: docRef.id, title, description, dueDate, priority, status, createdAt: new Date(), uid: user.uid, attachments: attachmentUrls  });
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Low");
      setStatus("To Do");
      setAttachments(null);
      toast.success("Tarefa criada com sucesso!");
    } catch (error) {
      toast.error("Falha ao criar tarefa!");
    }
  }

  async function handleUpdateTask(): Promise<void> {
    if (!edit.id) return;

    const docRef = doc(db, "tasks", edit.id);
    const attachmentUrls = await uploadAttachments(edit.id);
    await updateDoc(docRef, {
      title,
      description,
      dueDate,
      priority,
      status,
      updatedAt: new Date(),
      uid: user?.uid,
      attachments: attachmentUrls,
    })
      .then(() => {
        updateTask(edit.id!, { title, description, dueDate, priority, status });
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("Low");
        setStatus("To Do");
        setAttachments(null);
        setEdit({});
        toast.success("Tarefa atualizada com sucesso!");
      })
      .catch(() => {
        toast.error("Falha ao atualizar tarefa!");
      });
  }

  async function handleDeleteTask(id: string): Promise<void> {
    const isConfirmed = window.confirm("Tem certeza de que deseja deletar esta tarefa?");
    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, "tasks", id));
        deleteTask(id);
        toast.success("Tarefa deletada com sucesso!");
      } catch (error) {
        toast.error("Falha ao deletar tarefa!");
      }
    }
  }

  const filteredTasks = tasks.filter(task => {
    return (
      (filterStatus === "" || task.status === filterStatus) &&
      (filterPriority === "" || task.priority === filterPriority) &&
      (filterDueDate === "" || task.dueDate === filterDueDate)
    );
  });

  function handleEditTask(task: Task): void {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
    setEdit({ id: task.id, task });
  }

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  async function handleLogout(): Promise<void> {
    try {
      await signOut(auth);
      navigate("/");
      toast.success("Deslogado com sucesso!");
    } catch (error) {
      toast.error("Falha ao deslogar!");
    }
  }  

  function formatDate(dateString: string): string {
    // Converte a string para um objeto Date
    const date = new Date(dateString);
  
    // Adiciona 3 horas à data
    date.setHours(date.getHours() + 3);
  
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }
  
    // Formata a data para o formato dd/mm/aaaa usando o fuso horário local
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do 0, então somamos 1
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

  async function uploadAttachments(taskId: string): Promise<string[]> {
    if (!attachments) return [];

    const attachmentUrls: string[] = [];
    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];
      const storageRef = ref(storage, `tasks/${taskId}/${attachment.name}`);
      await uploadBytes(storageRef, attachment);
      const downloadURL = await getDownloadURL(storageRef);
      attachmentUrls.push(downloadURL);
    }
    return attachmentUrls;
  }

  return (
    <div className="admin-container">
      <ToastContainer autoClose={3000} />
      <div className="header"> 
        <h5>{user?.email}</h5>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
      <form className="form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <span className="inputs">Data Vencimento</span>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <span className="inputs">Prioridade</span>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="Low">Baixa</option>
          <option value="Medium">Média</option>
          <option value="High">Alta</option>
        </select>
        <span className="inputs">Status</span>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="To Do">A fazer</option>
          <option value="In Progress">Em progresso</option>
          <option value="Completed">Finalizada</option>
        </select>
        {/*
        <span className="attach">
          <input
            type="file"
            multiple
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAttachments(e.target.files)}
          />
        </span>
        */}

        {Object.keys(edit).length > 0 ? (
          <button className="btn-register" type="submit">
            Atualizar Tarefa
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Criar Tarefa
          </button>
        )}
      </form>

      <h2>Filtrar Tarefas</h2>
      <div className="filters">
        <span className="inputs">Status</span>
        <select className="filters-item" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="To Do">A Fazer</option>
          <option value="In Progress">Em progresso</option>
          <option value="Completed">Finalizada</option>
        </select>
        <span className="inputs">Prioridade</span>
        <select className="filters-item" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">Todas</option>
          <option value="Low">Baixa</option>
          <option value="Medium">Média</option>
          <option value="High">Alta</option>
        </select>
        <span className="inputs">Data Vencimento</span>
        <input
          className="filters-item"
          type="date"
          value={filterDueDate}
          onChange={e => setFilterDueDate(e.target.value)}
        />
      </div>

      <h2>{Object.keys(groupedTasks).length > 0 ? `Suas Tarefas` : `Você ainda não possui tarefas`}</h2>
      <div className="kanban-board">
        {Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a)).map(status => (
          <div key={status} className="kanban-column">
            <h3>{status === 'In Progress' ? `Em progresso` : status === 'Completed' ? `Concluída` : `A fazer`}</h3>
            <ul>
              {groupedTasks[status].map(task => (
                <li key={task.id}>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <p><span style={{ fontWeight: 'bold' }}>Data Vencimento:</span> {formatDate(task.dueDate)}</p>
                  <p><span style={{ fontWeight: 'bold' }}>Prioridade:</span> {task.priority === 'Low' ? `Baixa` : task.priority === 'Medium' ? `Média` : `Alta`}</p>
                  {task.attachments && task.attachments.length > 0 && (
                    <div>
                      <p><span style={{ fontWeight: 'bold' }}>Anexos:</span></p>
                      <ul>
                        {task.attachments.map((url, index) => (
                          <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">Anexo {index + 1}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button className="btn-edit" onClick={() => handleEditTask(task)}>Editar</button>
                  <button onClick={() => handleDeleteTask(task.id)}>Deletar</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}