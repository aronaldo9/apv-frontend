import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [cargando, setCargando] = useState(true);
  const [auth, setAuth] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCargando(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        setCargando(true);
        const { data } = await clienteAxios("/veterinarios/perfil", config);
        navigate("/admin");
        setAuth(data);
      } catch (error) {
        console.log(error.response.data.msg);
        setAuth({});
      }

      setCargando(false);
    };
    autenticarUsuario();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setAuth({});
  };

  const actualizarPerfil = async datos => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    };

    try {
        const url = `/veterinarios/perfil/${datos._id}`;
        // eslint-disable-next-line no-unused-vars
        const { data } = await clienteAxios.put(url, datos, config);
        return {
          msg: 'Almacenado correctamente'
        }
    } catch (error) {
        return {
          msg: error.response.data.msg,
          error: true,
        } 
    }
  };

  const guardarPassword = async (datos) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    };

    try {
      const url = '/veterinarios/actualizar-password';
      const { data } = await clienteAxios.put(url, datos, config);
      console.log(data);

      return {
        msg: data.msg
      };
    } catch (error) {
      return {
        msg: error.response.data.msg,
        error: true
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        setCargando,
        cerrarSesion,
        actualizarPerfil,
        guardarPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
