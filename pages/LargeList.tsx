import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
export class LargeListPage extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation?.pop();
          }}>
          <AntDesign name="arrowleft" size={25} />
        </TouchableOpacity>
      ),
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>LargeListPage</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
