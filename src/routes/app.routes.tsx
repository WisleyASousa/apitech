import { useTheme } from "native-base";

import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ApiarySvg from "../assets/hive.svg";
import HomeSvg from "../assets/home.svg";
import ProfileSvg from "../assets/profile.svg";


import { Platform, useWindowDimensions } from "react-native";
import { AddApiary } from "../screens/AddApiary";
import { Apiary } from "../screens/Apiary";
import { ApiaryDetails } from "../screens/ApiaryDetails";
import { ApiaryHistory } from "../screens/ApiaryHistory";
import { Hive } from '../screens/Hive';
import { Home } from "../screens/Home";
import { Profile } from "../screens/Profile";


type AppRoutes = {
  Início: undefined;
  Perfil: undefined;
  Apiário: undefined;
  Apiario_Detalhes:  {
    apiaryID: number;
  };
  Apiario_History:  {
    hiveID: number;
  };
  Hive: {
    hiveID: number;
  };
  Adicionando_Apiario:  {
    usuarioId: number;
  };
}
//sao as propriedades das rotas de navegacao da aplicacao.
export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();


export function AppRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[10];

  const windowDimensions = useWindowDimensions();
  const isVertical = windowDimensions.height > windowDimensions.width; // Verifica se a orientação é vertical

  const sizeTabIOS = isVertical ? 95 : 65;
  const sizeTabAndroid = isVertical ? 80 : 60;

  return(
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.gray[50],

        tabBarStyle: {
          backgroundColor: "#A8D672",
          height: Platform.OS === "android" ? sizeTabAndroid : sizeTabIOS,
          paddingBottom: sizes[4],
          paddingTop: sizes[4],
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}
    >
      <Screen
        name="Início"
        component={Home}
        options={{
          tabBarIcon: (({ color }) => (
            <HomeSvg width={iconSize} height={iconSize} fill={color} />
          ))
        }}
      />
      <Screen
        name="Apiário"
        component={Apiary}
        options={{
          tabBarIcon: (({ color }) => (
            <ApiarySvg width={iconSize} height={iconSize} fill={color} />
          ))
        }}
      />
      <Screen
        name="Perfil"
        component={Profile}
        options={{
          tabBarIcon: (({ color }) => (
            <ProfileSvg width={iconSize} height={iconSize} fill={color} />
          ))
        }}
      />
      <Screen 
        name= "Apiario_Detalhes"
        component={ApiaryDetails}
        options={{
          tabBarButton: () => null
        }}
      />
      <Screen 
        name= "Hive"
        component={Hive}
        options={{
          tabBarButton: () => null
        }}
      />
      <Screen 
        name= "Adicionando_Apiario"
        component={AddApiary}
        options={{
          tabBarButton: () => null
        }}
      />
      <Screen 
        name= "Apiario_History"
        component={ApiaryHistory}
        options={{
          tabBarButton: () => null
        }}
      />
    </Navigator>
    )
}