import { useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { ThemedText } from "@/presentation/theme/components/themed-text";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

import { useCameraStore } from "@/presentation/store/useCameraStore";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library/legacy";

export default function CameraScreen() {
  const { addSelectedImage } = useCameraStore();

  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [, requestMediaPermission] = MediaLibrary.usePermissions();
  const [selectedImage, setSelectedImage] = useState<string>();

  const cameraRef = useRef<CameraView>(null);

  const onRequestPermission = async () => {
    try {
      const { status: cameraPermissionStatus } =
        await requestCameraPermission();
      if (cameraPermissionStatus !== "granted") {
        Alert.alert(
          "Lo siento",
          "Necesitamos permiso a la camara para tomar fotos",
        );
        return;
      }
      const { status: mediaPermissionStatus } = await requestMediaPermission();
      if (mediaPermissionStatus !== "granted") {
        Alert.alert(
          "Lo siento",
          "Necesitamos permiso a la galeria para guardar fotos",
        );
        return;
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Algo salio mal con los permisos");
    }
  };

  if (!cameraPermission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        style={{
          ...styles.container,
          marginHorizontal: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.message}>
          Necesitamos permisos para usar la camara y la galería
        </Text>
        <TouchableOpacity onPress={onRequestPermission}>
          <ThemedText type="default">Solicitar permiso</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const onShutterButtomPress = async () => {
    if (!cameraRef.current) return;
    const picture = await cameraRef.current.takePictureAsync({
      quality: 0.8,
    });
    //console.log(picture);
    if (!picture?.uri) return;
    setSelectedImage(picture.uri);
  };

  const onPictureAccepted = async () => {
    if (!selectedImage) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync(true);

      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos permiso para guardar fotos en la galería.",
        );
        return;
      }

      await MediaLibrary.createAssetAsync(selectedImage);

      addSelectedImage(selectedImage);
      router.dismiss();
    } catch (error) {
      console.log("Error al guardar imagen:", error);
      Alert.alert("Error", "No se pudo guardar la imagen.");
    }
  };

  const onPickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      aspect: [4, 3],
      //allowsEditing: true,
      allowsMultipleSelection: true,
      selectionLimit: 4,
    });
    if (result.canceled) return;

    result.assets.forEach((asset) => {
      addSelectedImage(asset.uri);
    });
    router.dismiss();
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  const onReturnCancel = () => {
    router.dismiss();
  };

  const onRetakePhoto = () => {
    setSelectedImage(undefined);
  };

  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.camera} />
        <ConfirmImageButton onPress={onPictureAccepted} />
        <RetakeImageButton onPress={onRetakePhoto} />
        <ReturnCancelButton onPress={onReturnCancel} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <ShutterButton onPress={onShutterButtomPress} />
      <FlipCameraButton onPress={toggleCameraFacing} />
      <GalleryButton onPress={onPickImages} />

      <ReturnCancelButton onPress={onReturnCancel} />

      {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity> */}
    </View>
  );
}
// Custom Components
const ShutterButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  const primaryColor = useThemeColor({}, "primary");
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: "absolute",
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: primaryColor,
        },
      ]}
    ></TouchableOpacity>
  );
};

const FlipCameraButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.flipCameraButton}>
      <Ionicons name="camera-reverse-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};
const GalleryButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.galleryButton}>
      <Ionicons name="images-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};
const RetakeImageButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.flipCameraButton}>
      <Ionicons name="close-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const ConfirmImageButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  const primaryColor = useThemeColor({}, "primary");
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: "absolute",
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: primaryColor,
        },
      ]}
    >
      <Ionicons name="checkmark-outline" size={30} color={primaryColor} />
    </TouchableOpacity>
  );
};

const ReturnCancelButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.returnCancelButton}>
      <Ionicons name="arrow-back-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },

  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    //borderColor: "red",
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    bottom: 40,
    right: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    bottom: 40,
    left: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  returnCancelButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    top: 40,
    left: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
