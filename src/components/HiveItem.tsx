import { Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AlertDialog, Button, HStack, Heading, Icon, Text, useToast } from "native-base";
import React, { useRef, useState } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { HiveDTO } from "../dtos/HiveDTO";
import { useAuth } from "../hooks/useAuth";
import { AppNavigatorRoutesProps } from '../routes/app.routes';
import { api } from "../services/api";



type Props = TouchableOpacityProps & {
  data: HiveDTO;
}


export function HiveItem({ data, ...rest }: Props) {
  const { fetchApiaryDetails } = useAuth();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  async function handleDeleteHive(id: number) {
    try {
      const response = await api.delete(`/colmeias/${id}`);
      if (response.status === 200) {
        fetchApiaryDetails(data.apiarioId);
        toast.show({
          title: `Colmeia ${data.numero} excluída com sucesso!`,
          placement: 'top',
          bgColor: 'green.500',
        });

      }
    }
    catch (error) {
      console.log(error);
      toast.show({
        title: `Erro ao excluir a Colmeia ${data.numero}`,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    finally {
      fetchApiaryDetails(data.apiarioId);
    }
  }

  

  const onClose = () => {
    setIsOpen(false)
    handleDeleteHive(data.id)
  };
  const onCloseCancel = () => {
    setIsOpen(false)
  };

  const cancelRef = useRef(null);

  function deleteHive() {
    setIsOpen(!isOpen)
  }
  
  return (
    <>
      <HStack
        alignItems={'center'}
        justifyContent={'space-around'}
        marginX={4}
      >
        <TouchableOpacity
          onPress={deleteHive}
          style={{
            padding: 16,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Icon
            as={<Entypo name="trash" />}
            size="sm"
            color="RED_MID"
          />
        </TouchableOpacity>


        <TouchableOpacity {...rest} style={{
          width: '75%',
          alignItems: 'center',
          borderRadius: 10,
          paddingVertical: 8,
          paddingHorizontal: 4,
          
          marginVertical: 5,
          backgroundColor: '#2e2d2d',
        }}>
          <HStack px={3} py={2} width="100%" justifyContent="space-evenly" alignItems="center">
            <Text fontSize="xl" color="gray.100" mr={4}>
              Colmeia
            </Text>
            <Heading fontSize="xxl" color="gray.100"> N°: 0{data.numero}</Heading>
            <Icon
              as={<Entypo name="chevron-right" />}
              size="lg"
              color="gray.100"
            />
          </HStack>
        </TouchableOpacity>
        
        
      </HStack>
      {
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onCloseCancel}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Cancelar</AlertDialog.Header>
            <AlertDialog.Body flex={1} px={4} alignItems="center">
              <Text style={{ textAlign: "center", fontSize: 22 }}>
                Deseja realmente
                {" "}
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  Apagar
                </Text>
                {" "}
                Colmeia Permanentemente?
              </Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2} flex={1} alignItems="center" justifyContent="space-around">
                <Button variant="unstyled" py={4} borderWidth={1} flex={1} colorScheme="coolGray" onPress={onCloseCancel} ref={cancelRef}>
                  <Text style={{ fontSize: 22 }}>
                    Cancelar
                  </Text>
                </Button>
                <Button colorScheme="danger" py={4} flex={1} onPress={onClose}>
                  <Text style={{ color: "white", fontSize: 22 }}>
                    Apagar
                  </Text>
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      }
    </>

  );
}
