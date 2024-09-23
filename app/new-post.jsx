import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  Image,
  SafeAreaView,useColorScheme,
} from 'react-native';
const user = {
  id: '1234',
  username: 'dms_global',
  name: 'DMS Global',
  image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&s',
};

export default function NewPost() {
  const [text, setText] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Link href="../" style={{ fontSize: 18,  color: colorScheme === 'dark' ? 'white' : 'black' }}>
            Cancel
          </Link>
          <Pressable onPress={()=> router.back()} style={styles.button}>
            <Text style={styles.buttonText}>Post</Text>
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1C9BF0',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop:30,
    borderWidth:1,padding:12,borderRadius:20

  },
  image: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
    marginRight: 10,
  },
});
