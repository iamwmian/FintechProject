import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./login-styles";
import { COLORS } from "../../common/theme";
import illustration from "../assets/Currency-rafiki.png";
import { Fontisto } from "@expo/vector-icons";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
export const NewLogin = ({ navigation }) => {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { getToken } = useAuth();
  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (setActive && createdSessionId) {
        await setActive({ session: createdSessionId });

        // get token
        const token = await getToken();
        // then make post request to the server
        await sendTokenToBackend(token);
      }
    } catch (error) {
      console.log("OAuth Error: ", error);
    }
  };
  
  const sendTokenToBackend = async (token) => {
    try {
      // Sending the token to the Django backend API using Axios
      const BASE_URL = "http://11.21.6.221:8000"
      const temp = await axios.get(
        `${BASE_URL}/api/random-transaction/`,
        {
          headers: {
            "Content-Type": "application/json",
           
          },
        }
      );
      console.log("YOOO", temp.data, '\n');
      console.log(token);

      const response = await axios.post(
        `${BASE_URL}/api/sync-user/`, // Replace with your backend URL
        {
          someData: "value", // Include any additional data if needed
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the Clerk JWT token
          },
        }
      );

      if (response.status === 200) {
        console.log("Backend Response:", response.data);
        // Handle backend response here (e.g., store user data)
      } else {
        console.error("Backend Error:", response.data);
      }
    } catch (error) {
      console.error("Error sending token to backend:", error, error.message, "\n" ,error.config);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Fontisto name="wallet" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>Fintech App</Text>
        {/* <Text style={styles.tagline}>some sub text or something</Text> */}
        <Text style={styles.tagline}>
          Keep track of your finances all across the globe!
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={illustration}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            handleGoogleSignIn();
          }}
          activeOpacity={0.9}
        >
          <View tyle={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.background} />
          </View>

          <Text style={styles.googleButtonText}>Continue With Google</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          This application is simply a demo project
        </Text>
      </View>
    </View>
  );
};
