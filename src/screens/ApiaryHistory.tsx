import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, Center, Divider, HStack, Heading, Icon, Radio, ScrollView, Select, Text, VStack, useToast } from "native-base";
import { useEffect, useState } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { AppNavigatorRoutesProps } from "../routes/app.routes";


type RouteParamsProps = {
  hiveID: number;
}

export function ApiaryHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchApiaryDetails, hiveDataHistory } = useAuth();
  const toast = useToast();
  const route = useRoute();
  const { hiveID } = route.params as RouteParamsProps;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const windowDimensions = useWindowDimensions();
  const isVertical = windowDimensions.height > windowDimensions.width;
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [listHistoryItem, setListHistoryItem] = useState({
    id: 0,
    colmeiaId: 0,
    data: '',
    estadoCriaNova: {
      localizada: '',
      quantidade: '',
      estado: ''
    },
    estadoCriaMadura: {
      localizada: '',
      quantidade: '',
      estado: ''
    },
    estadoMel: {
      localizada: '',
      quantidade: '',
      estado: ''
    },
    estadoPolen: {
      localizada: '',
      quantidade: ''
    },
    estadoRainha: {
      localizada: '',
      estado: '',
      aspecto: ''
    }
  });


  const [service, setService] = useState("");
  const [horaBr, setHoraBr] = useState<[]>([]) as any;


  useEffect(() => {
    if (hiveDataHistory.length > 0) {
      setIsLoading(true);
      hiveDataHistory.map((item: any) => {
        // setListHistoryItem(item);
        const dataHoraFormatada = converterDataHoraParaFormatoBrasileiro(item?.data);
        
        setHoraBr((prevHoraBr: string | string[]) => {
          // Verifica se o item já existe na lista
          if (!prevHoraBr.includes(dataHoraFormatada)) {
            // Se não existe, adiciona o novo item no início da lista
            return [dataHoraFormatada, ...prevHoraBr];
          }
          // Se já existe, retorna a lista sem modificação
          return prevHoraBr;
        });
        setListHistoryItem({
          ...item,
          data: dataHoraFormatada,
          colmeiaId: hiveID,
          id: item.id,
          estadoCriaNova: item.estadoCriaNova,
          estadoCriaMadura: item.estadoCriaMadura,
          estadoMel: item.estadoMel,
          estadoPolen: item.estadoPolen,
          estadoRainha: item.estadoRainha
        });
      }
      );

    }
    setIsLoading(false);
  }, [hiveDataHistory]);

  function converterDataHoraParaFormatoBrasileiro(dataHora: string): string {
    const dataObj = new Date(dataHora);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return dataObj.toLocaleString('pt-BR', options);
  }

  function handleGoBack(hiveID: number) {
    navigation.navigate("Hive", { hiveID });
  }
  const handlePaginationChange = (page: any) => {
    setCurrentPage(page);
  };

  const renderApiariesForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return hiveDataHistory.slice(hiveDataHistory.length, endIndex) as any[];
  };

  function handleSelectChange(selectedDate: string) {
    // Encontre o objeto correspondente em hiveDataHistory com base na data selecionada
    const selectedHistoryItem = hiveDataHistory.find((item: any)=> {
      const dataHoraFormatada = converterDataHoraParaFormatoBrasileiro(item?.data);
      return dataHoraFormatada === selectedDate;
    });

    if (selectedHistoryItem) {
      setListHistoryItem({
        ...(selectedHistoryItem as { id: number, estadoCriaNova: any, estadoCriaMadura: any, estadoMel: any, estadoPolen: any, estadoRainha: any}),
        data: selectedDate,
        colmeiaId: hiveID,
      });
    }
  }
  return (
    <VStack flex={1}>
      <HStack alignItems="center" justifyContent="center" px={6} bg="GREEN" pt={16} rounded="xl">
        <HStack
          justifyContent="space-between"
          alignItems="center"
          paddingLeft={16}
        >
          <TouchableOpacity
            onPress={() => handleGoBack(hiveID)}
            style={{

            }}
          >
            <Icon as={Feather} name="arrow-left" size={8} color="gray.700" />
          </TouchableOpacity>
        </HStack>
        <Center pb={4} pr={20} w="100%">
          <HStack>
            <Heading fontSize="lg">Historico</Heading>
            
          </HStack>
          {isLoading ? (
            <HStack space={4} flex={1} justifyContent="center" alignItems="center">
              <Text color="emerald.500" fontSize="lg">Carregando Histórico...</Text>
            </HStack>
          ) : (
            <>
            <VStack>
              {hiveDataHistory.length > 0 ? (
                <>
                  <Text fontSize="sm" textAlign="center">Criado em</Text>
                  <Text fontSize="md" fontWeight="bold">
                    {
                      listHistoryItem.data
                    }
                  </Text>
                </>
              ) : (
                <Text>Nenhum histórico disponível.</Text>
              )}
            </VStack>
            
            </>
          )}
          
        </Center>
      </HStack>
      
      <ScrollView >
        <Center py={2}>
        <HStack justifyContent={"space-around"} w={"50%"}>
          <Text>Selecione a Data</Text>
          <HStack>
            <Text>Total:</Text>
            <Text fontWeight="bold">0</Text>
            <Text fontWeight="bold">{hiveDataHistory.length}</Text>
          </HStack>
        </HStack>
              <Box maxW="300" color={"#000"}>
                <Select 
                  selectedValue={listHistoryItem.data} 
                  minWidth="200" 
                  accessibilityLabel="Choose Service" 
                  placeholder="Choose Service" 
                  _selectedItem={{
                    bg: "emerald.600",
                  }} mt={1} 
                  onValueChange={handleSelectChange}
                >
                  {horaBr.map((item: string, index: number) => (
                    <Select.Item key={index} label={item} value={item} />
                  ))}
                  {/* <Select.Item label="UX Research" value="ux" />
                  <Select.Item label="Web Development" value="web" />
                  <Select.Item label="Cross Platform Development" value="cross" />
                  <Select.Item label="UI Designing" value="ui" />
                  <Select.Item label="Backend Development" value="backend" /> */}
                </Select>
              </Box>
            </Center>
        <Box my={4} pb={2} mx={isVertical ? 2 : 20} bg="gray.100" borderWidth={1} borderColor={"GREEN"} borderBottomRadius={10}>
          <Center py={1} backgroundColor="GREEN">
            <Text fontSize="lg" fontWeight="bold" textAlign="center">Localização de Crias Novas e Ovos</Text>
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Cria Localizada:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            // converter para string
            value={listHistoryItem.estadoCriaNova?.localizada}
            name="2"
            accessibilityLabel="Localização de Crias Novas e Ovos">

            <Radio
              colorScheme="emerald"
              isDisabled
              size="lg"
              value="NÃO"
              my={1}
            >
              Não
            </Radio>
            <Radio
              colorScheme="emerald"
              isDisabled
              size="lg"
              value="SIM"
              my={1}
            >
              Sim
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="VERIFICAÇÃO NÃO POSSIVEL" my={1}>
              Verificação não possivel
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO HAVIA CRIA" my={1}>
              Não havia crias
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Quantidade de Cria:</Text>
          <Radio.Group

            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoCriaNova?.quantidade}
            name="quantidadeDeCria"
            accessibilityLabel="Quantidade de Cria Nova">
            <Radio isDisabled colorScheme="emerald" size="lg" value="SEM CRIA" my={1}>
              Sem Crias
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="POUCA CRIA" my={1}>
              Poucas Crias
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="MUITA CRIA" my={1}>
              Muitas Crias
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Estado da Cria Nova:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoCriaNova?.estado}
            name="estadoDaCriaNova"
            accessibilityLabel="Estado da Cria Nova">

            <Radio isDisabled colorScheme="emerald" size="lg" value="CRIA EM OVOS" my={1}>
              Cria em Ovos
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="CRIA EM PUPAS" my={1}>
              Cria em Pupas
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="CRIA EM OVOS E PUPAS" my={1}>
              Cria em Ovos e Pupas
            </Radio>
          </Radio.Group>
        </Box>

        <Box my={4} pb={2} mx={isVertical ? 2 : 20} bg="gray.100" borderWidth={1} borderColor={"GREEN"} borderBottomRadius={10}>
          <Center py={1} backgroundColor="GREEN">
            <Text fontSize="lg" fontWeight="bold" textAlign="center">Localização de Crias Maduras</Text>
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Cria Localizada:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoCriaMadura?.localizada}
            name="criaMadurasLocalizada"
            accessibilityLabel="Crias Maduras Localizada">

            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO" my={1}>
              Não
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="SIM" my={1}>
              Sim
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="VERIFICAÇÃO NÃO POSSIVEL" my={1}>
              Verificação não possivel
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO HAVIA CRIA" my={1}>
              Não havia crias
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Quantidade de Cria:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoCriaMadura?.quantidade}
            name="quantidadeDeCriaMaduras"
            accessibilityLabel="Quantidade de Crias Maduras">
            <Radio isDisabled colorScheme="emerald" size="lg" value="SEM CRIA" my={1}>
              Sem Crias
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="POUCA CRIA" my={1}>
              Poucas Crias
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="MUITA CRIA" my={1}>
              Muitas Crias
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Estado das Crias Maduras:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoCriaMadura?.estado}
            name="estadoDasCriasMaduras"
            accessibilityLabel="Estado das Crias Maduras:">

            <Radio isDisabled colorScheme="emerald" size="lg" value="CRIA MADURA ESCURAS" my={1}>
              Maduras Escuras
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="CRIA MADURA CLARAS" my={1}>
              Maduras Claras
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="CRIA MADURA ESCURAS E CLARAS" my={1}>
              Maduras Claras e Escuras
            </Radio>
          </Radio.Group>
        </Box>

        <Box my={4} pb={2} mx={isVertical ? 2 : 20} bg="gray.100" borderWidth={1} borderColor={"GREEN"} borderBottomRadius={10}>
          <Center py={1} backgroundColor="GREEN">
            <Text fontSize="lg" fontWeight="bold" textAlign="center">Localização de Mel no Ninho</Text>
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Mel Localizado:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoMel?.localizada}
            name="melLocalizado"
            accessibilityLabel="Mel Localizado">

            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO" my={1}>
              Não
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="SIM" my={1}>
              Sim
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="VERIFICAÇÃO NÃO POSSIVEL" my={1}>
              Verificação não possivel
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO HAVIA MEL" my={1}>
              Não havia Mel
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Quantidade de Mel:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoMel?.quantidade}
            name="quantidadeDeMel"
            accessibilityLabel="Quantidade de Mel">
            <Radio isDisabled colorScheme="emerald" size="lg" value="SEM MEL" my={1}>
              Sem Mel
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="POUCO MEL" my={1}>
              Pouco Mel
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="MUITO MEL" my={1}>
              Muito Mel
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Estado do Mel:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoMel?.estado}
            name="estadoDoMel"
            accessibilityLabel="Estado do Mel">

            <Radio isDisabled colorScheme="emerald" size="lg" value="MEL MADURO" my={1}>
              Mel Maduro
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="MEL VERDE" my={1}>
              Mel Verde
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="MEL MADURO E VERDE" my={1}>
              Mel Maduro e Verde
            </Radio>
          </Radio.Group>
        </Box>

        <Box my={4} pb={2} mx={isVertical ? 2 : 20} bg="gray.100" borderWidth={1} borderColor={"GREEN"} borderBottomRadius={10}>
          <Center py={1} backgroundColor="GREEN">
            <Text fontSize="lg" fontWeight="bold" textAlign="center">Localização de Pólen no Ninho</Text>
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Pólen Localizado:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoPolen?.localizada}
            name="polenLocalizado"
            accessibilityLabel="Pólen Localizado">

            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO" my={1}>
              Não
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="SIM" my={1}>
              Sim
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="VERIFICAÇÃO NÃO POSSIVEL" my={1}>
              Verificação não possivel
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO HAVIA POLEN" my={1}>
              Não havia Pólen
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Quantidade de Pólen:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoPolen?.quantidade}
            name="quantidadeDePolen"
            accessibilityLabel="Quantidade de Pólen">
            <Radio isDisabled colorScheme="emerald" size="lg" value="SEM POLEN" my={1}>
              Sem Pólen
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="POUCO POLEN" my={1}>
              Pouco Pólen
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="MUITO POLEN" my={1}>
              Muito Pólen
            </Radio>
          </Radio.Group>
        </Box>

        <Box my={4} pb={2} mx={isVertical ? 2 : 20} bg="gray.100" borderWidth={1} borderColor={"GREEN"} borderBottomRadius={10}>
          <Center py={1} backgroundColor="GREEN">
            <Text fontSize="lg" fontWeight="bold" textAlign="center">Localização da Rainha </Text>
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Rainha Localizada:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoRainha?.localizada}
            name="rainhaLocalizada"
            accessibilityLabel="Rainha Localizada">

            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO" my={1}>
              Não
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="SIM" my={1}>
              Sim
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="VERIFICAÇÃO NÃO POSSIVEL" my={1}>
              Verificação não possivel
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="NÃO HAVIA RAINHA" my={1}>
              Não havia Rainha
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Idade da Rainha:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoRainha?.estado}
            name="idadeDaRainha"
            accessibilityLabel="Idade da Rainha">

            <Radio isDisabled colorScheme="emerald" size="lg" value="RAINHA COM IDADE CONHECIDA" my={1}>
              Rainha com Idade Conhecida
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="RAINHA COM IDADE DESCONHECIDA" my={1}>
              Rainha com Idade Desconhecida
            </Radio>
          </Radio.Group>
          <Center px={4}>
            <Divider justifyContent="center" my={2} w="100%" bg="GREEN" />
          </Center>
          <Text fontSize="lg" fontWeight="bold" pt={2} pl={4}>Estado da Rainha:</Text>
          <Radio.Group
            style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-evenly", flexWrap: "wrap" }}
            value={listHistoryItem.estadoRainha?.aspecto}
            name="estadoDaRainha"
            accessibilityLabel="Estado da Rainha">

            <Radio isDisabled colorScheme="emerald" size="lg" value="RAINHA JOVEM SAUDÁVEL" my={1}>
              Rainha Jovem Saudável
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="RAINHA JOVEM ASPECTO MEDIANO" my={1}>
              Rainha Jovem Aspecto Mediano
            </Radio>
            <Radio isDisabled colorScheme="emerald" size="lg" value="RAINHA VELHA NÃO SAUDÁVEL" my={1}>
              Rainha Velha Aspecto Não Saudável
            </Radio>
          </Radio.Group>

        </Box>

      </ScrollView>
    </VStack>


  );
}