import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  SafeAreaView,useColorScheme,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import styles from '../assets/styles/common-styles';
import { user } from '../utils/staticContent';

export default function Comment() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Link href="../" style={{ fontSize: 18,  color: colorScheme === 'dark' ? 'white' : 'black' }}>
            Cancel
          </Link>
          <Pressable onPress={()=> router.back()} style={styles.button}>
            <Text style={styles.buttonText}>Re-Tweet</Text>
          </Pressable>
        </View>

        <View style={[styles.inputContainer, { borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}]}>
          <Image src={user.image} style={styles.image} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Anything in mind?"
            multiline
            numberOfLines={5}
            placeholderTextColor={'grey'}
            style={{ flex: 1,  color: colorScheme === 'dark' ? 'white' : 'black' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
