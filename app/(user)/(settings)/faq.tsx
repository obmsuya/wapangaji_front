import React from 'react';
import { View, ScrollView, Linking, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Share } from 'react-native';
import BackButton from '@/components/back-button';

const FAQ = () => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Check out Wapangaji App - The best way to manage your rental properties!',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSupport = (email: string) => {
        Linking.openURL(`mailto:${email}`);
    };

    return (
        <ScrollView style={styles.container} className="px-6 py-12">
            <View />
            <BackButton />
            <View className="py-2"/>
            <View style={styles.section}>
                <Text variant="large" className="font-bold mb-4">Recommend to friends</Text>
                <Text className="text-gray-600 mb-2">Refer to friend</Text>
                <Button onPress={handleShare} variant="outline">
                    Share App
                </Button>
            </View>

            <View style={styles.section}>
                <Text variant="large" className="font-bold mb-4">Tutorial</Text>
                <Text className="text-gray-600">View/download app tutorial</Text>
            </View>

            <View style={styles.section}>
                <Text variant="large" className="font-bold mb-4">FAQ</Text>

                <View style={styles.faqItem}>
                    <Text className="font-semibold mb-2">Is there a free trial available?</Text>
                    <Text className="text-gray-600">
                        Yes, you can try Wapangaji Kiganjani by getting started with adding one property for free.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text className="font-semibold mb-2">Is it a one-time payment?</Text>
                    <Text className="text-gray-600">
                        Wapangaji Kiganjani premium payment is done after every 30 days.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text className="font-semibold mb-2">Who can I contact for support?</Text>
                    <Text className="text-gray-600">
                        You can reach us via email at{' '}
                        <Text
                            className="text-blue-500"
                            onPress={() => handleSupport('support@wapangaji.com')}
                        >
                            support@wapangaji.com
                        </Text>
                        {' '}and{' '}
                        <Text
                            className="text-blue-500"
                            onPress={() => handleSupport('info@wapangaji.com')}
                        >
                            info@wapangaji.com
                        </Text>
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    section: {
        marginBottom: 32,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    faqItem: {
        marginBottom: 16,
    },
});

export default FAQ;