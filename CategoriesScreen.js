import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const CATEGORIES = [
  { name: 'SCIENCE FICTION', icon: 'rocket', subject: 'science_fiction' },
  { name: 'FANTASY', icon: 'dragon', subject: 'fantasy' },
  { name: 'ROMANCE', icon: 'heart', subject: 'romance' },
  { name: 'HISTORY', icon: 'landmark', subject: 'history' },
  { name: 'MYSTERY', icon: 'user-secret', subject: 'mystery' },
  { name: 'BIOGRAPHY', icon: 'user', subject: 'biography' },
  { name: 'CHILDREN', icon: 'child', subject: 'children' },
  { name: 'HORROR', icon: 'ghost', subject: 'horror' },
  { name: 'ART', icon: 'palette', subject: 'art' },
  { name: 'POETRY', icon: 'feather-alt', subject: 'poetry' },
];

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function CategoryScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateCards = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const fetchBooksByCategory = async (subject) => {
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=15`);
      const json = await res.json();
      const formattedBooks = json.works.map((item) => ({
        id: item.key,
        title: item.title,
        coverId: item.cover_id,
        workKey: item.key,
      }));
      setBooks(formattedBooks);
      animateCards();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksByLetter = async (letter) => {
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${letter}&limit=20`);
      const json = await res.json();
      const formattedBooks = json.docs
        .filter((item) => item.title?.toUpperCase().startsWith(letter))
        .map((item) => ({
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

  const renderBook = ({ item }) => {
    const workKey = item.workKey?.replace('/works/', '');
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (workKey) {
            navigation.navigate('BookDetail', { workKey });
          }
        }}
      >
        <Image
          source={
            item.coverId
              ? { uri: `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg` }
              : require('../assets/snack-icon.png')
          }
          style={styles.cover}
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
        <Text style={styles.title}>Book Categories</Text>
      </View>

      {/* Alphabet Index */}
      {!selectedCategory && !selectedLetter && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alphabetBar}>
          {ALPHABETS.map((letter) => (
            <TouchableOpacity key={letter} onPress={() => {
              setSelectedLetter(letter);
              fetchBooksByLetter(letter);
            }}>
              <Text style={styles.alpha}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Category List */}
      {!selectedCategory && !selectedLetter && (
        <ScrollView contentContainerStyle={styles.categoryList}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              style={styles.categoryButton}
              onPress={() => {
                setSelectedCategory(cat.name);
                fetchBooksByCategory(cat.subject);
              }}
            >
              <View style={styles.categoryContent}>
                <FontAwesome5 name={cat.icon} size={22} color="#4CAF50" style={{ marginRight: 12 }} />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Back Button */}
      {(selectedCategory || selectedLetter) && (
        <TouchableOpacity
          onPress={() => {
            setSelectedCategory(null);
            setSelectedLetter(null);
            setBooks([]);
          }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}

      {/* Book Grid */}
      {(selectedCategory || selectedLetter) && (
        <>
          <Text style={styles.subTitle}>
            {selectedCategory ? `${selectedCategory} Books` : `Books starting with "${selectedLetter}"`}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
          ) : (
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
              <FlatList
                data={books}
                renderItem={renderBook}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
              />
            </Animated.View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16 },
  header: { alignItems: 'center', marginBottom: 10 },
  logo: { width: 170, height: 100, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: '700', marginTop: 8, color: '#333' },
  subTitle: { fontSize: 20, fontWeight: '600', marginVertical: 10, textAlign: 'center', color: '#333' },
  categoryList: { paddingBottom: 20 },
  categoryButton: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
  },
  categoryContent: { flexDirection: 'row', alignItems: 'center' },
  categoryText: { fontSize: 16, color: '#2E7D32', fontWeight: '600' },
  alphabetBar: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 2,
  },
  alpha: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#4CAF50',
    fontWeight: '700',
  },
  backButton: { marginVertical: 10 },
  backText: { color: '#4CAF50', fontSize: 16, fontWeight: '600' },
  grid: { paddingBottom: 80 },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    elevation: 3,
  },
  cover: { width: 100, height: 150, borderRadius: 8, marginBottom: 8 },
  bookTitle: { fontSize: 14, fontWeight: '500', textAlign: 'center', color: '#333' },
});


