import { useToast } from "native-base";
import { createContext, useEffect, useState } from "react";

import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "../storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "../storage/storageUser";

import { ApiaryDTO } from "../dtos/ApiaryDTO";
import { HiveDTO } from "../dtos/HiveDTO";
import { UserDTO } from "../dtos/UserDTO";
import { api } from "../services/api";

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => Promise<void>;
  singOut: () => Promise<void>;
  isLoading: boolean;
  isLoadingUserStorageData: boolean;
  apiarys: ApiaryDTO[];
  hive: HiveDTO[];
  setHive: React.Dispatch<React.SetStateAction<HiveDTO[]>>;
  fetchApiarys: () => Promise<void>;
  setApiarys: React.Dispatch<React.SetStateAction<ApiaryDTO[]>>;
  isLoadingApiarys: boolean;
  handleDeleteUser: () => Promise<void>;
  updateUserProfile: (userUpdate: UserDTO) => Promise<void>;
  fetchApiaryDetails: (apiaryID: number) => Promise<void>;
  isLoadingHives: boolean;
  setIsLoadingHives: React.Dispatch<React.SetStateAction<boolean>>;
  hiveDataHistory: [];
  fetchHiveHistory: (hiveID: number) => Promise<void>;
}

type AuthContextProviderProps = {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApiarys, setIsLoadingApiarys] = useState(true);
  const [isLoadingHives, setIsLoadingHives] = useState(true);
  const [apiarys, setApiarys] = useState<ApiaryDTO[]>([]);
  const [hive, setHive] = useState<HiveDTO[]>([])
  const [hiveDataHistory, setHiveDataHistory] = useState<[]>([]) as any;


  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);
  
  async function userAndTokenUpdate(userData: UserDTO, token: string) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      setUser(userData);
  }

  async function storageUserAndToken(userData: UserDTO, token: string) {
    try{
      await storageAuthTokenSave(token);
      await storageUserSave(userData);
    } catch (error) {
      throw error;
    }
  }
  
  
  async function getUserDataWithToken(token: string) {
    try {
      const response = await api.get('/usuarios', { headers: { authorization: `Bearer ${token}` } });
      return response.data; 
    } catch (error) {
      throw error;
    }
  }

  async function singIn(email: string, password: string) {
    try {
      setIsLoading(true);
      const response = await api.post('/login', { email, senha: password });

      if (response.status === 200 && response.data.token) {
        const token = response.data.token;
        const userDataResponse = await api.get('/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        userAndTokenUpdate(userDataResponse.data, token);
        await getUserDataWithToken(token);
        await storageUserAndToken(userDataResponse.data, token);
        setIsLoading(false);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.mensagem) {
        setIsLoading(false);

        toast.show({
          title: error.response.data.mensagem,
          placement: 'top',
          bgColor: 'red.500',
        });
      } else {
        setIsLoading(false);

        toast.show({
          title: 'Ocorreu um erro no servidor.',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    }
  }

  const handleDeleteUser = async () => {
    try {
      const token = await storageAuthTokenGet();
      const headers = { Authorization: `Bearer ${token}` };
      

      const response = await api.delete('/usuarios', { headers });

      if (response.status === 200) {
        setIsLoadingUserStorageData(true);
        setUser({} as UserDTO); // definir usuario
        await storageUserRemove();
        await storageAuthTokenRemove();
        
        toast.show({
          title: response.data.mensagem,
          placement: 'top',
          bgColor: 'green.500',
        });
        setIsLoadingUserStorageData(false);
      }
    } catch (error: any){
      if (error.response && error.response.data && error.response.data.mensagem) {
        setIsLoading(false);

        toast.show({
          title: error.response.data.mensagem,
          placement: 'top',
          bgColor: 'red.500',
        });
      } else {
        setIsLoading(false);

        toast.show({
          title: 'Ocorreu um erro no servidor.',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };
  
  async function singOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
      setIsLoading(false);


    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(userUpdate: UserDTO) {
    try {
      setUser(userUpdate);
      await storageUserSave(userUpdate);
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if (token && userLogged) {
        const userData = await getUserDataWithToken(token);
        if (userData) {
          userAndTokenUpdate(userLogged, token);
        }
        setIsLoadingUserStorageData(false);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);



  async function fetchApiarys() {
    try {
      setIsLoadingApiarys(true);

      const response = await api.get('/apiarios');
      setApiarys(response.data);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.mensagem) {

        toast.show({
          title: error.response.data.mensagem,
          placement: 'top',
          bgColor: 'yellow.700',
        });
      } else {

        toast.show({
          title: 'Ocorreu um erro no servidor.',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    } finally {
      setIsLoadingApiarys(false);
    }
  }

  async function fetchApiaryDetails(apiaryID: number) {
    try {
      setIsLoadingHives(true);
      const response = await api.get(`/colmeias?apiarioId=${apiaryID}`);
      setHive(response.data);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.mensagem) {

        toast.show({
          title: error.response.data.mensagem,
          placement: 'top',
          bgColor: 'yellow.700',
        });
      } else {

        toast.show({
          title: 'Ocorreu um erro no servidor.',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    } finally {
      setIsLoadingHives(false);
    }
  }

  async function fetchHiveHistory(hiveID: number) {
    api.get(`/colmeias/${hiveID}/historico`)
      .then(async response => {
        const data = await response.data;
        const parsedData = data.map((item: any) => parseEmptyStringsToObjects(item));
        setHiveDataHistory(parsedData);

      }).catch(error => {
        console.error('Erro ao buscar histórico da colmeia:', error);
      }
    );
  }

  function parseEmptyStringsToObjects(data: any): any {
    const parsedData = { ...data };
    const nestedKeys = [
      'estadoCriaNova',
      'estadoCriaMadura',
      'estadoMel',
      'estadoPolen',
      'estadoRainha'
    ];
  
    nestedKeys.forEach(key => {
      if (parsedData[key] && typeof parsedData[key] === 'string' && parsedData[key].trim() === '') {
        parsedData[key] = {};
      } else if (parsedData[key]) {
        try {
          parsedData[key] = JSON.parse(parsedData[key]);
        } catch (error) {
          // console.error('Erro ao fazer o parsing do JSON:', error);
        }
      }
    });
  
    return parsedData;
  }




  

  return (
    <AuthContext.Provider value={{ user, singIn, isLoading, isLoadingUserStorageData, singOut, apiarys, hive, setHive, fetchApiarys, setApiarys, isLoadingApiarys, handleDeleteUser, updateUserProfile, fetchApiaryDetails, isLoadingHives, setIsLoadingHives, hiveDataHistory, fetchHiveHistory }}>
      {children}
    </AuthContext.Provider>
  )
}