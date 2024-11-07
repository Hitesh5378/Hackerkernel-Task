import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

export default function AddProduct({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    } else {
      Toast.show({
        type: "error",
        text1: "Image selection canceled or failed",
      });
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price || !image) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    }

    const newProduct = { name, price: parseFloat(price), image };

    try {
      const storedProducts = await AsyncStorage.getItem("products");
      const products = storedProducts ? JSON.parse(storedProducts) : [];

      if (products.some((product) => product.name === name)) {
        Toast.show({ type: "error", text1: "Product already exists" });
        return;
      }

      const updatedProducts = [...products, newProduct];
      await AsyncStorage.setItem("products", JSON.stringify(updatedProducts));

      Toast.show({ type: "success", text1: "Product added" });
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: "error", text1: "Error adding product" });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        )}
      </TouchableOpacity>
      <Button title="Add Product" onPress={handleAddProduct} />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  imagePickerText: { color: "#888" },
  imagePreview: { width: 100, height: 100, borderRadius: 8 },
});
