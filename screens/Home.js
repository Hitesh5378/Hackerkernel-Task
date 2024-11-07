import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { FAB, IconButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

export default function Home({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem("products");
      const productsList = storedProducts ? JSON.parse(storedProducts) : [];
      setProducts(productsList);
      setFilteredProducts(productsList); 
    } catch (error) {
      Toast.show({ type: "error", text1: "Error loading products" });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleDelete = async (productName) => {
    const updatedProducts = products.filter(
      (product) => product.name !== productName
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts); 
    await AsyncStorage.setItem("products", JSON.stringify(updatedProducts));
    Toast.show({ type: "success", text1: "Product deleted" });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filteredList = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filteredList);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <IconButton
        icon="trash-can" 
        color="red"
        size={20}
        onPress={() => handleDelete(item.name)}
        style={styles.deleteIcon}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color="#254378"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Hi-Fi Shop & Service</Text>
      <Text style={{ color: 'grey' }}>Audio shop on Rustravel Ave 5"</Text>
      <Text style={{ color: 'grey', marginTop: 7 }}>
        This shop offers both products and service
      </Text>
      <Text style={styles.protit}>Products</Text>
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      ) : (
        <Text style={styles.noProductText}>No Product Found</Text>
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("AddProduct")}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
    marginVertical: 30,
  },
  protit: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#254378",
    marginTop: 40,
  },
  grid: {
    justifyContent: "space-between",
  },
  productItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#254378",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  noProductText: {
    textAlign: "center",
    marginTop: 200,
    fontSize: 18,
    color: "#888",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3f6ebf",
    borderRadius:50,
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    
  },
});
