import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 
const CARD_DATA = [
  {
    id: '1',
    name: "Work Essentials",
    bg: "https://images.dailyobjects.com/marche/assets/images/homepage/desktop/shop_by_category_work_essentials-2.jpeg?tr=cm-pad_resize,v-3,w-3840",
    views: "20.5K",
    isPremium: true
  },
  {
    id: '2',
    name: "Bags & Wallets",
    bg: "https://images.dailyobjects.com/marche/assets/images/homepage/desktop/shop_by_category_bags_wallets-2.jpeg?tr=cm-pad_resize,v-3,w-3840",
    views: "15.2K",
    isPremium: false
  },
  {
    id: '3',
    name: "Tech Accessories",
    bg: "https://images.dailyobjects.com/marche/assets/images/homepage/desktop/shop_by_category_tech-2.jpeg?tr=cm-pad_resize,v-3,w-3840",
    views: "32.1K",
    isPremium: true
  },
  {
    id: '4',
    name: "Office Setup",
    bg: "https://images.dailyobjects.com/marche/assets/images/homepage/desktop/shop_by_category_work_essentials-2.jpeg?tr=cm-pad_resize,v-3,w-3840",
    views: "10.5K",
    isPremium: false
  },
  {
    id: '5',
    name: "Travel Gear",
    bg: "https://images.dailyobjects.com/marche/assets/images/homepage/desktop/shop_by_category_bags_wallets-2.jpeg?tr=cm-pad_resize,v-3,w-3840",
    views: "8.9K",
    isPremium: true
  },
  {
    id: '6',
    name: "Gadget Zone",
    bg: "https://images.dailyobjects.com/marche/assets/images/homepage/desktop/shop_by_category_tech-2.jpeg?tr=cm-pad_resize,v-3,w-3840",
    views: "45K",
    isPremium: true
  },
];
export default function TrendingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
     <View className="px-4">
      <SectionTitle title="Stories" />
     <View>
        <FlatList
          data={CARD_DATA}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 0, gap: 8}} // Gap creates space between cards
          renderItem={({ item }) => (
            <View> {/* Fixed width for consistent horizontal scrolling */}
              <CardBox 
                isPremium={item.isPremium} 
                avatarUrl="https://sm.ign.com/t/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.1200.jpg" 
                name={item.name} 
                bgImage={item.bg} 
                viewCount={item.views} 
              />
        </View>
  )}
/>
     </View>
     </View>
    </SafeAreaView>
  );
}


const SectionTitle = ({title}: {title: string}) => {
  return (
    <View className="mb-2">
      <Text className="font-semibold text-lg text-black">{title}</Text>
    </View>
  )
}

const CardBox = ({isPremium, bgImage, avatarUrl, name, viewCount}: {isPremium: boolean, avatarUrl: string, name: string; bgImage: string; viewCount: string}) => {
  return ( 
    <View className="relative rounded-[8px] w-[130px] h-[180px]">
      <View className=" p-2 flex flex-col justify-between z-[1] h-full">  
      {/* background image */}
      

        {/* card header */}
        <View className="flex flex-row items-center gap-2">
          <View className={`bg-black rounded-[20px] ${isPremium ? 'bg-yellow-500' : 'bg-black'}`}>
             <Text className="text-white font-medium px-2 py-1 text-[11px]">{isPremium ? 'Premium' : 'Live'}</Text>
          </View>
          <Text className="text-white font-medium text-[12px]">{viewCount}</Text>
        </View>

        {/* card foooter */}
        <View className="flex flex-row items-center gap-2">
          <View className="w-7 h-7 bg-blue-500 rounded-full">
            <Image source={{uri: avatarUrl}} className="w-full h-full rounded-full" />
          </View>
          <Text className="text-white font-medium text-[12px]">{name}</Text>
        </View>
      </View>

      <Image source={{uri: bgImage}} className="absolute top-0 left-0 w-full h-full rounded-[8px] z-[-2]" />

      {/* overlay */}
      <View className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-[-1] rounded-[8px]" />
      </View> 
  )
}