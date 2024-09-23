import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useColorScheme,
  Animated,
} from 'react-native';
import {Entypo, EvilIcons} from '@expo/vector-icons';
import IconButton from './IconButton';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { likePost, unlikePost } from '../utils/timelineApi';
import TimeFormat from '../utils/timeFormat';


const Post = ({ data, detail = false }) => {
  // console.log("data",data)
  const colorScheme = useColorScheme();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data?.likes_count || 0);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    _loadLikesState().then();
  }, [data.id]);

  const _loadLikesState = async () => {
    try {
      const likedPosts = await AsyncStorage.getItem('likedPosts');
      let likedPostsArray = likedPosts ? JSON.parse(likedPosts) : [];

      if (likeCount === 0) {
        if (likedPostsArray.includes(data.id)) {
          likedPostsArray = likedPostsArray.filter(id => id !== data.id);
          await AsyncStorage.setItem('likedPosts', JSON.stringify(likedPostsArray));
        }

        setIsLiked(false);
      } else {
        setIsLiked(likedPostsArray.includes(data.id));
      }
    } catch (error) {
      console.log('err in like updating statee', error);
    }
  };

  const animateIcon = (liked) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: liked ? 1.2 : 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 0.6,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const _handleLike = async () => {
    const newIsLiked = !isLiked;
    try {
      setIsLiked(newIsLiked);
      setLikeCount((prevCount) => (newIsLiked ? prevCount + 1 : prevCount - 1));

      animateIcon(newIsLiked);

      if (newIsLiked) {
        await likePost(data.id);
      } else {
        await unlikePost(data.id);
      }

      const likedPosts = await AsyncStorage.getItem('likedPosts');
      let likedPostsArray = likedPosts ? JSON.parse(likedPosts) : [];

      if (newIsLiked) {
        likedPostsArray.push(data.id);
      } else {
        likedPostsArray = likedPostsArray.filter((id) => id !== data.id);
      }

      await AsyncStorage.setItem('likedPosts', JSON.stringify(likedPostsArray));
    } catch (error) {
      console.error('err in handling like button', error.message);
      setIsLiked(!newIsLiked);
      setLikeCount((prevCount) => (newIsLiked ? prevCount - 1 : prevCount + 1));
    }
  };

  return (
      <View>
        <Pressable style={[styles.container, {borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.24)' : 'grey'}]}>
          <Image source={{ uri: data.user?.profile_image_url }} style={styles.userImage} />

          <View style={styles.mainContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                  style={[
                    styles.name,
                    { color: colorScheme === 'dark' ? 'white' : 'black' },
                  ]}
              >
                {data.user?.first_name + ' ' + data.user?.last_name}
              </Text>
              <Text style={[styles.username, { color: 'gray' }]}>
                {data.user?.company_name} · {TimeFormat(data?.created_at)}
              </Text>
              <Entypo
                  name="dots-three-horizontal"
                  size={16}
                  color="gray"
                  style={{ marginLeft: 'auto' }}
              />
            </View>

            <Link
                href={{
                  pathname: `/timeline/post/${data.id}`,
                  params: { data: JSON.stringify(data) },
                }}
            >
              <Text
                  style={[
                    styles.content,
                    { color: colorScheme === 'dark' ? 'white' : 'black' },
                  ]}
              >
                {data?.text || ''}
              </Text>
            </Link>

            {!detail &&
                <View style={styles.footer}>
                  <Link href={'/comment'}>
                    <IconButton icon="comment" text={data.replies_count || 0} />
                  </Link>
                  <Link href={'/retweet'}>
                    <IconButton icon="retweet" text={data.numberOfRetweets || 0} />
                  </Link>
                  <Pressable onPress={_handleLike} style={styles.button}>
                    <Animated.View
                        style={{
                          transform: [{ scale: scaleValue }],
                          opacity: opacityValue,
                        }}
                    >
                      {isLiked ?
                          <Entypo
                              name="heart"
                              size={18}
                              color={'red'}
                          />:
                          <EvilIcons
                              name="heart"
                              size={22}
                              style={{marginTop:-4}}
                              color={'gray'}
                          />

                      }

                    </Animated.View>
                    <Text style={styles.text}>{likeCount}</Text>
                  </Pressable>
                  <IconButton icon="share-apple" />
                </View>
            }

          </View>
        </Pressable>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mainContainer: {
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  content: {
    lineHeight: 20,
    marginTop: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  name: {
    fontWeight: '600',
  },
  username: {
    color: 'gray',
    marginLeft: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 5,
    color: 'gray',
  },
});

export default Post;
