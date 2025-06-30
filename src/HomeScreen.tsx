import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, increment, decrement, incrementByAmount } from './store/store';
import { Button, Text, Icon } from './ui';

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
        <Text variant="h1" weight="bold" align="center" color="primary" style={{ marginBottom: 8 }}>
          Home
        </Text>
        <Button
          title="Go to Settings"
          icon={<Icon name="settings" type="Feather" color="#fff" size={20} />}
          onPress={() => navigation.navigate('Settings')}
          style={{ marginBottom: 24 }}
        />
        <Text variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
          Redux Counter
        </Text>
        <View style={{ backgroundColor: '#F3F4F6', borderRadius: 12, padding: 24, alignItems: 'center' }}>
          <Text variant="h2" weight="bold" color="primary" style={{ marginBottom: 16 }}>
            {count}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <Button title="Increment" onPress={() => dispatch(increment())} variant="primary" size="sm" />
            <Button title="Decrement" onPress={() => dispatch(decrement())} variant="secondary" size="sm" />
          </View>
          <Button title="+5" onPress={() => dispatch(incrementByAmount(5))} variant="outline" size="sm" />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen; 