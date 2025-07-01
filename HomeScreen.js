import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const animateCards = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const fetchPopularBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://openlibrary.org/subjects/horror.json?limit=15');
      const json = await res.json();

      const formattedBooks = json.works.map((item) => ({
        id: item.key,
        title: item.title,
        coverId: item.cover_id,
        workKey: item.key, // keep full work key, e.g., /works/OL12345W
      }));

      setBooks(formattedBooks);
      animateCards();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
      const json = await res.json();

      const formattedBooks = json.docs.slice(0, 15).map((item) => ({
        id: item.key,
        title: item.title,
        coverId: item.cover_i,
        workKey: item.key.replace('/works/', ''),
      }));

      setBooks(formattedBooks);
      animateCards();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const workKey = item.workKey?.replace('/works/', '');
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (workKey) {
            navigation.navigate('BookDetail', { workKey });
          } else {
            alert('Book data is missing a valid key.');
          }
        }}
      >
        <Image
  source={
    item.coverId
      ? { uri: `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg` }
      : require('../assets/book2.png')
  }
  style={[
    styles.cover,
    !item.coverId && styles.noCover, // Apply this only if no coverId
  ]}
/>

        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo3.png')} style={styles.logo} />
        <Text style={styles.title}>Home</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search for books..."
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Book Grid */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={books}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 190,
    height: 110,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  grid: {
    paddingBottom: 80,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    elevation: 3,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  noCover: {
    // overrides for no cover image, e.g. smaller size, different border etc.
    width: 80,
    height: 140,
    borderRadius: 4,
    opacity: 0.7,
    resizeMode: 'contain',
    //tintColor: '#666', // if you want to tint the PNG (works on iOS & Android)
  },
});

