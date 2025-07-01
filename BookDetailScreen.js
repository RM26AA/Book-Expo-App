import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };

export default function BookDetailScreen({ route, navigation }) {
  const { workKey } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'overview', title: 'Overview' },
    { key: 'details', title: 'Details' },
    { key: 'editions', title: 'Editions' },
  ]);

  useEffect(() => {
    fetchBookDetail();
  }, []);

  const fetchBookDetail = async () => {
    try {
      const res = await fetch(`https://openlibrary.org/works/${workKey}.json`);
      const json = await res.json();
      setBook(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const OverviewRoute = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <DetailRow icon="account" label="Author" value={book?.authors?.[0]?.name || 'Unknown'} />
      <DetailRow icon="calendar" label="First Published" value={book.first_publish_date || 'N/A'} />
      <DetailRow
        icon="file-document-outline"
        label="Description"
        value={
          typeof book.description === 'object'
            ? book.description.value
            : book.description || 'No description.'
        }
      />
    </ScrollView>
  );

  const DetailsRoute = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <DetailRow icon="tag-multiple" label="Subjects" value={book.subjects?.join(', ') || 'N/A'} />
      <DetailRow
        icon="book-open-page-variant"
        label="Number of Pages"
        value={book.number_of_pages || 'N/A'}
      />
      <DetailRow icon="domain" label="Publishers" value={book.publishers?.join(', ') || 'N/A'} />
      <DetailRow icon="book-multiple" label="Series" value={book.series?.join(', ') || 'N/A'} />
    </ScrollView>
  );

  const EditionsRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.tableHeader}>Sample Editions</Text>
      {book.edition_count ? (
        <Text style={styles.editionNote}>
          This book has {book.edition_count} editions. Showing a sample:
        </Text>
      ) : null}
      <FlatList
        data={book?.covers?.slice(0, 5)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.editionRow}>
            <Image
              source={{ uri: `https://covers.openlibrary.org/b/id/${item}-S.jpg` }}
              style={styles.editionImage}
            />
            <Text style={styles.editionText}>Cover ID: {item}</Text>
          </View>
        )}
      />
    </ScrollView>
  );

  const renderScene = SceneMap({
    overview: OverviewRoute,
    details: DetailsRoute,
    editions: EditionsRoute,
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const coverId = book?.covers?.[0];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require('../assets/logo3.png')} style={styles.logo} />

      {/* Book Title */}
      <Text style={styles.title}>{book.title}</Text>

      {/* Book Cover */}
      {coverId && (
        <Image
          source={{ uri: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` }}
          style={styles.cover}
        />
      )}

      {/* Tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#4CAF50' }}
            style={{ backgroundColor: '#fff' }}
            renderLabel={({ route, focused }) => (
              <Text style={{ color: focused ? '#4CAF50' : '#555', fontWeight: '600' }}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <MaterialCommunityIcons name={icon} size={22} color="#4CAF50" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  logo: {
    width: 170,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  cover: {
    width: 150,
    height: 230,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  tabContent: {
    padding: 16,
    backgroundColor: '#fff',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detailValue: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  editionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  editionImage: {
    width: 50,
    height: 70,
    marginRight: 10,
  },
  editionText: {
    fontSize: 14,
    color: '#333',
  },
  editionNote: {
    marginBottom: 8,
    fontSize: 13,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 15,
    zIndex: 10,
  },
});

