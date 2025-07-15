
import { useLocalSearchParams, useRouter } from "expo-router";

import { Pressable, Text, View } from "react-native";

interface DashboardQueryParams {
  userToken?: string;
  username?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { token, username } = useLocalSearchParams();
  

  return (
    <View className ="flex-1 justify-start items-center pt-20">
      <Text className ="text-5xl text-purple-500 font-bold">Dashboard</Text>

      <Pressable onPress ={() => router.push('/changeattributes?token=${token}&username=${username}')}>
        <Text className = "text-2xl text-black-500 font-semibold">
          Gestão de Contas
        </Text>
      </Pressable>
      
      <Pressable onPress ={() => router.push('/changepassword?token=${token}&username=${username}')}>
        <Text className = "text-2xl text-black-500 font-semibold">
          Gestão de Worksheets
        </Text>
      </Pressable> 
    </View>
  );
}
