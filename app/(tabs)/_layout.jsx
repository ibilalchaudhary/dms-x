import {Pressable, useColorScheme, Image, StyleSheet, Text} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import Colors from '../../common/Colors';
import {Entypo, Feather, Ionicons, MaterialIcons} from "@expo/vector-icons";

function Header() {
    const colorScheme = useColorScheme();

    return (
    <Pressable style={styles.mainHeader}>
      <Image
        source={require("../../assets/images/dms.png")}
        style={{ width: 40,height:40, borderRadius: 40, marginLeft: 10 }}
      />
        <Text
            style={[styles.name, { color: colorScheme === 'dark' ? 'white' : 'black' }]}
        >
            DMS Global
        </Text>
    </Pressable>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="timeline"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Entypo size={24} style={{ marginBottom: -12 }} color={color}  name={"home"}/>,
          headerLeft: () => <Header />,

        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color }) =>  <FontAwesome size={24} style={{ marginBottom: -12 }} color={color}  name={"search"}/>,
        }}
      />

        <Tabs.Screen
            name="friends"
            options={{
                title: '',
                tabBarIcon: ({ color }) =>  <Ionicons  size={24} style={{ marginBottom: -12 }} color={color}  name={"people"}/>,
            }}
        />

        <Tabs.Screen
            name="notifications"
            options={{
                title: '',
                tabBarIcon: ({ color }) =>  <Ionicons  size={24} style={{ marginBottom: -12 }} color={color}  name={"notifications"}/>,
            }}
        />

        <Tabs.Screen
            name="messages"
            options={{
                title: '',
                tabBarIcon: ({ color }) =>  <MaterialIcons  size={24} style={{ marginBottom: -12 }} color={color}  name={"email"}/>,
            }}
        />
    </Tabs>
  );
}


const styles = StyleSheet.create({
   mainHeader: {
       flexDirection:'row',alignItems:'center'
   },
    name: {
        fontWeight: '600',
        marginLeft:6
    },
});

