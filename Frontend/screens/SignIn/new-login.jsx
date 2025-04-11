import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./login-styles";
import { COLORS } from "../../common/theme";
import illustration from "../../assets/Currency-rafiki.png"
import { Fontisto } from "@expo/vector-icons";
import { useSSO } from "@clerk/clerk-expo";
import { BASE_URL } from "@env"
import { useAuth  } from "@clerk/clerk-expo";
import axios from "axios";
export const NewLogin = ({ navigation }) => {
  const { startSSOFlow } = useSSO();

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
        await onboardUser(token);
      }
    } catch (error) {
      console.log("OAuth Error: ", error);
    }
  };
  
  const onboardUser = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/onboard/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const userData = res.data;
      console.log("User onboarded:", userData);
      // need to store the data
  
    } catch (err) {
      console.error("Onboarding error:", err);
      // maybe show fail ui
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
          smart budgeting for a borderless world
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
