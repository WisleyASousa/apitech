import { Entypo } from "@expo/vector-icons";
import {
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  Spinner,
  Text,
  VStack,
  useToast
} from "native-base";
import { TouchableOpacity, useWindowDimensions } from "react-native";

import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { HiveItem } from "../components/HiveItem";
import Pagination from "../components/Pagination";
import { ApiaryDTO } from "../dtos/ApiaryDTO";
import { useAuth } from "../hooks/useAuth";
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import { api } from "../services/api";

type RouteParamsProps = {
  apiaryID: number;
}

export function ApiaryDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiaryData, setApiaryData] = useState<ApiaryDTO>({} as ApiaryDTO);
  const [hideData, setHideData] = useState<ApiaryDTO>({} as ApiaryDTO);
  const [showLoading, setShowLoading] = useState(true);

  const [reload, setReload] = useState(true);

  const [hiveList, setHiveList] = useState([]) as any; // Estado para armazenar a lista de apiários
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { apiarys, hive, setApiarys, setHive, fetchApiaryDetails, isLoadingHives, setIsLoadingHives, fetchHiveHistory } = useAuth();

  const route = useRoute();
  const toast = useToast();

  const loadMoreItems = () => {
    setShowLoading(false);
  };


  const { apiaryID } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.navigate("Apiário");
  }

  
  async function createHive(data: number) {
    try {
      setIsLoadingHives(true);
      const response = await api.post(`/colmeias`, { apiarioId: data});
      if(response.status === 201) {
        setHive([ response.data, ...hive]);
        toast.show({
          title: `Colmeia Criada com sucesso!`,
          placement: 'top',
          bgColor: 'green.500',
        });
      } 


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


  function handleOpenHiveDetails(hiveID: number) {
    navigation.navigate('Hive', { hiveID });
  }



  const windowDimensions = useWindowDimensions();
  const isVertical = windowDimensions.height > windowDimensions.width; // Verifica se a orientação é vertical

  useEffect(() => {
    
    try{
      setReload(true);
      fetchApiaryDetails(apiaryID);
      setHiveList(hive);
      apiarys.forEach(apiary => {
        if (apiary.id === apiaryID) {
          setApiaryData(apiary);
        }
      })
    }
    catch (error: any) {
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
        
        setReload(false);
      }
    } finally {
      setReload(false);
    }
  }, [apiaryID]);

  const handlePaginationChange = (page: any) => {
    setCurrentPage(page);
  };

  const renderApiariesForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return hive.slice(startIndex, endIndex);
  };

  return (
    <VStack flex={1}>
      {
        isLoadingHives ? (
          <HStack space={4} flex={1} justifyContent="center" alignItems="center">
            <Spinner color="emerald.500" size="lg" />
            <Text color="emerald.500" fontSize="lg">Carregando Colmeias...</Text>
          </HStack> 
        ) : 
        <>
          <VStack px={isVertical ? 8 : 32} bg="GREEN" pt={isVertical ? 16 : 4} rounded="xl">
        <HStack alignItems="center" justifyContent="space-between">
          <TouchableOpacity onPress={handleGoBack}>
            <Icon as={Feather} name="arrow-left" size={8} color="gray.700" />
          </TouchableOpacity>
          <Heading fontFamily="heading" fontSize="xl" flexShrink={1}>
            Colmeia(s)
          </Heading>
          <Center my={4}>

            <TouchableOpacity
              onPress={() => createHive(apiaryID)}
              style={{
                borderWidth: 2,
                borderColor: "gray",
                borderRadius: 999,
                padding: 8,
                width: "auto",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HStack justifyContent="center" alignItems="center">
                <Icon as={Entypo} name="plus" color="gray.700" size={8} />
                {isVertical ? <></> : <Heading fontSize="lg">Criar Colmeia</Heading>}
              </HStack>
            </TouchableOpacity>

          </Center>
        </HStack>
        <HStack
          justifyContent="space-between"
          mt={isVertical ? 0 : -2}
          alignItems="center"
        >
          <HStack
            flex={1}
            alignItems="center"
            justifyContent="space-between"
            mb={4}
          >
            <Text textTransform="capitalize" fontSize="md">
              Apiário:{' '}
                {isLoadingHives ? (
                  <HStack space={8} flex={1} justifyContent="center" alignItems="center">
                    <Spinner color="emerald.500" size="sm" />
                  </HStack> 
                ) :
              <Text fontFamily="heading" fontSize="lg">
                {apiaryData.nome}
              </Text>
                }
            </Text>
            <Text fontSize="lg" ml={2}>
              Total Colmeias: {' '}
                {isLoadingHives ? (
                  <HStack space={8} flex={1} justifyContent="center" alignItems="center">
                    <Spinner color="emerald.500" size="sm" />
                  </HStack> 
                ) :
              <Text fontFamily="heading">
                 <Text fontFamily="heading">
                   {hive.length < 10 ? `0${hive.length}` : hive.length}
                 </Text>
              </Text>
                }
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <VStack flex={1} px={isVertical ? 0 : 20}>
      <Box m={2} backgroundColor="gray.100" rounded="md">
          <Pagination 
            // totalPages={10}
            totalPages={Math.ceil(hive.length / itemsPerPage)}
            currentPage={currentPage}
            onPageChange={handlePaginationChange}
          />
        </Box>       
        {isLoadingHives ? (
          <HStack space={4} flex={1} justifyContent="center" alignItems="center">
            <Spinner color="emerald.500" size="lg" />
            <Text color="emerald.500" fontSize="lg">Carregando...</Text>
          </HStack> 
        ) :
          <FlatList
              px={2}
              py={4}
              pb={32}
              data={renderApiariesForCurrentPage()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <HiveItem
                  onPress={() => handleOpenHiveDetails(item.id)}
                  data={item}
                  key={item.id}
                />

              )}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreItems}
              onEndReachedThreshold={0.1}
              _contentContainerStyle={{ pb: 10 }}
              contentContainerStyle={hive.length === 0 && { flex: 1, justifyContent: "center" }}
              ListFooterComponent={() => (
                showLoading ? (
                  <HStack space={2} justifyContent="center">
                    <Spinner accessibilityLabel="Loading posts" />
                    <Heading color="emerald.500" fontSize="md">
                      Carregando...
                    </Heading>
                  </HStack>
                ) : null
              )}
              ListEmptyComponent={() => (
                <Box flex={1} justifyContent="center" alignItems="center">
                  <Text fontSize="lg" color="gray.100" textAlign="center">Nenhuma Colmeia cadastrada</Text>
                </Box>
              )}
            />
        }
      </VStack>
        </>
      }
      
    </VStack>
  );
}
