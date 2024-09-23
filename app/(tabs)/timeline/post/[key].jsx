import { Text } from 'react-native';
import Post from '../../../../components/Post';
import { useLocalSearchParams } from 'expo-router';

export default function TimelineScreen() {
    const { data } = useLocalSearchParams();

    if (data) {
        const postData = JSON.parse(data);
        return <Post data={postData} detail={true} />;
    } else {
        return <Text>TimelineScreen not found!</Text>;
    }
}
