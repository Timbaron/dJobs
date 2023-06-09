import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useCallback, useState } from "react";

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";

import { COLORS, SIZES, icons, images } from "../../constants";
import useFetch from "../../hook/useFetch";

const tabs = ["About", 'Qualifications', "Responsibilities"];

const JobDetails = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const params = useSearchParams();
  const router = useRouter();
  
  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: params.id,
  });

  const [refreshing, setRefreshing] = useState(false);
  /**
   * OnRefresh is a function that sets the refreshing state to true, refetches the data, and then sets
   * the refreshing state to false.
   */
  const onRefresh = () => useCallback(() => {
    setRefreshing(true)
    refetch();
    setRefreshing(false);
  },[]);

  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return <Specifics title="Qualifications" points={data[0].job_highlights?.Qualifications ?? ['N/A'] } />
      case "About":
        return <JobAbout 
          info={data[0].job_description ?? "No Data Available"}
        />
      case "Responsibilities":
        return <Specifics title="Responsibilites" points={data[0].job_highlights?.Responsibilities ?? ['N/A'] } />
      default: 
        break;
    }
  }
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
        `Hey, check out this amazing job opportunity I found on Djobs! The job title is ${data[0].job_title}, and it's a perfect match for your skills and experience. Apply now and take the next step in your career! ${data[0]?.job_google_link ?? 'https://careers.google.com/jobs/results'}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log(result.activityType)
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" handlePress={() => onShare()}/>
          ),
          headerTitle: "",
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : data.length === 0 ? (
            <Text>No Data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
              />
              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        <JobFooter url={data[0]?.job_google_link ?? 'https://careers.google.com/jobs/results'}/>
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
