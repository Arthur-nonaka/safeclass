import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface BottomTabBarProps {
    activeTab: 'classes' | 'students' | 'medical-conditions';
    onTabPress: (tab: 'classes' | 'students' | 'medical-conditions') => void;
}

export default function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'classes' && styles.activeTab]}
                onPress={() => onTabPress('classes')}
            >
                <Image
                    source={require('../assets/images/presentation.png')}
                    style={[
                        styles.icon,
                        { tintColor: activeTab === 'classes' ? '#FFF' : '#666' }
                    ]}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'students' && styles.activeTab]}
                onPress={() => onTabPress('students')}
            >
                <Image
                    source={require('../assets/images/reading.png')}
                    style={[
                        styles.icon,
                        { tintColor: activeTab === 'students' ? '#FFF' : '#666' }
                    ]}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'medical-conditions' && styles.activeTab]}
                onPress={() => onTabPress('medical-conditions')}
            >
                <Image
                    source={require('../assets/images/file.png')}
                    style={[
                        styles.icon,
                        { tintColor: activeTab === 'medical-conditions' ? '#FFF' : '#666' }
                    ]}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    tab: {
        padding: 12,
        borderRadius: 25,
        backgroundColor: 'transparent',
    },
    activeTab: {
        backgroundColor: '#2684FE',
    },
    icon: {
        width: 24,
        height: 24,
    },
});
