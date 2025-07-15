
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Dashboard() {

  return (
    <View className ="flex-1 justify-start items-center pt-20">
      <Text className ="text-5xl text-purple-500 font-bold">Dashboard</Text>

      <Link href="/changeattributes" push asChild className = "mt-20"> 
        <Text className = "text-2xl text-black-500 font-semibold">
          Gestão de Contas
        </Text>
      </Link>
      
      <Link href="/changepassword" className = "mt-20" push asChild>
        <Text className = "text-2xl text-black-500 font-semibold">
          Gestão de Worksheets
        </Text>
      </Link> 
    </View>
  );
}
