import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  Text,
} from 'react-native';
import Post from '../../../components/Post';
import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { getTimeline } from '../../../utils/timelineApi';

const ITEMS_PER_PAGE = 10;
const CACHE_SIZE = 100;
const FETCH_THRESHOLD = 0.7;

export default function PostScreen() {
  const colorScheme = useColorScheme();

  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true);

  const currentPage = useRef(1);
  const isFetching = useRef(false);
  const flatListRef = useRef(null);

  const cache = useRef(new Map());

  const _fetchTimeline = useCallback(async () => {
    if (isFetching.current || !hasMoreData) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const response = await getTimeline(currentPage.current);
      const newTweets = response?.data?.data || [];

      if (newTweets.length > 0) {
        setTweets(prevTweets => {
          const updatedTweets = [...prevTweets, ...newTweets];
          newTweets.forEach(tweet => cache.current.set(tweet.id, tweet));
          if (cache.current.size > CACHE_SIZE) {
            const keysToDelete = Array.from(cache.current.keys()).slice(0, cache.current.size - CACHE_SIZE);
            keysToDelete.forEach(key => cache.current.delete(key));
          }
          return updatedTweets.slice(-CACHE_SIZE);
        });
        currentPage.current += 1;
        setHasMoreData(newTweets.length === ITEMS_PER_PAGE);
      } else {
        setHasMoreData(false);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [hasMoreData]);

  useEffect(() => {
    _fetchTimeline();
  }, [_fetchTimeline]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={styles.loader} />;
  };

  const renderItem = useCallback(({ item }) => <Post data={item} />, []);

  const keyExtractor = useCallback((item) => item?.id?.toString(), []);

  const _handleScroll = useCallback(({ nativeEvent }) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const distanceFromEnd = contentSize.height - layoutMeasurement.height - contentOffset.y;
    const threshold = contentSize.height * (1 - FETCH_THRESHOLD);

    if (distanceFromEnd < threshold && !isFetching.current && hasMoreData) {
      _fetchTimeline();
    }
  }, [_fetchTimeline, hasMoreData]);

  const refreshTimeline = useCallback(() => {
    currentPage.current = 1;
    cache.current.clear();
    setTweets([]);
    setHasMoreData(true);
    _fetchTimeline();
  }, [_fetchTimeline]);

  if (error) {
    return <Text style={styles.errorText}>{error.message}</Text>;
  }

  return (
      <View
          style={[
            styles.page,
            { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' },
          ]}
      >
        <FlatList
            ref={flatListRef}
            data={tweets}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onScroll={_handleScroll}
            scrollEventThrottle={16}
            ListFooterComponent={renderFooter}
            initialNumToRender={ITEMS_PER_PAGE}
            maxToRenderPerBatch={ITEMS_PER_PAGE}
            windowSize={5}
            onRefresh={refreshTimeline}
            refreshing={isLoading}
            removeClippedSubviews={true}
        />

        <Link href="/new-post" asChild>
          <Entypo
              name="plus"
              size={24}
              color="white"
              style={styles.floatingButton}
          />
        </Link>
      </View>
  );
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  floatingButton: {
    backgroundColor: '#1C9BF0',
    borderRadius: 40,
    padding: 15,
    position: 'absolute',
    right: 15,
    bottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
});