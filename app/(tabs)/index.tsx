
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

export default function Index() {
  return (
    <View className ="flex-1 justify-start items-center pt-40">
      <Text className ="text-6xl text-green-500 font-bold">Field Sync</Text>

      <Image
        source={require("../../assets/images/logo.png")}
        style={{ marginTop: 23, width: 300, height: 300 }}
        resizeMode="contain"
      />

      <Link href="/login" className = "mt-0" push>
        <Text className = "text-2xl text-black-500 font-semibold">
          Login
        </Text>
      </Link>
      
      <Link href="/register" className = "mt-20" push asChild>
        <Text className = "text-2xl text-black-500 font-semibold">
          Registar Conta
        </Text>
      </Link> 
    </View>
  );
}
