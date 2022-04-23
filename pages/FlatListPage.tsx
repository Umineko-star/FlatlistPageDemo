/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  View,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
const Colum = 3;
const WIDTH = (Dimensions.get('window').width * 0.7) / Colum - Colum * 4;
const HEIGHT = 80;
let START = 0,
  END = 0;
let totalDish = 0;
import React, {Component} from 'react';
export class FlatListPage extends Component<any, any> {
  allData: any[];
  flatListRef: any;
  /** 选中分类*/
  selectedType: any;
  _type = 9;
  dishNum = 10000;
  constructor(props: any) {
    super(props);
    START = new Date().getTime();
    console.log(`初始化start：${START}`);
    this.props.navigation.setOptions({
      title: 'FlatListPage',
      headerRight: () => {
        return (
          <Button
            onPress={() => {
              Alert.alert('click');
            }}
            title="Update count"
          />
        );
      },
    });
    let typeArr: any = [],
      dishNumArr: any[] = [];
    for (let i = 0; i < this._type; i++) {
      let typeObj = {type: `种类${i + 1}`, name: `种类${i + 1}`, count: 0};
      typeArr.push(typeObj);
      for (let j = 0; j < this.dishNum; j++) {
        dishNumArr.push({
          type: typeObj.type,
          name: `种类${i + 1}第${j + 1}个`,
          id: String(i + 1) + String(j + 1),
          count: 0,
          price: j + 1,
        });
      }
    }
    this.allData = dishNumArr;
    this.state = {
      typeArr,
      showArr: dishNumArr,
      orderDishArr: [],
    };
  }
  componentDidMount() {
    END = new Date().getTime();
    console.log(`渲染完成end：${END} 耗时 ${END - START}毫秒`);
  }
  renderOrder = ({item}: {item: any}) => {
    return (
      <View style={styles.orderContainer}>
        <Text>{item?.name}</Text>
        <Text>{item?.count}</Text>
        <Text>{item?.price}</Text>
      </View>
    );
  };
  renderItem = ({item}: {item: any}) => {
    return item?.name ? (
      <TouchableOpacity style={styles.item} onPress={() => this.addDish(item)}>
        <Text>{item?.name}</Text>
        <Text>{item?.price}</Text>
        {Boolean(item?.count) && (
          <View style={styles.count}>
            <Text style={styles.countText}>{item?.count}</Text>
          </View>
        )}
      </TouchableOpacity>
    ) : (
      <View style={styles._item} />
    );
  };
  /** 加菜 */
  addDish = (item: any) => {
    let flag = false;
    let typeList = this.state.typeArr?.map((c: any) => {
      if (c?.type === item?.type) {
        return {
          ...c,
          count: c?.count + 1,
        };
      } else {
        return {...c};
      }
    });
    let list = this.state.orderDishArr?.map((val: any) => {
      if (val?.id === item?.id) {
        flag = true;
        return {
          ...val,
          count: val?.count + 1,
        };
      } else {
        return {
          ...val,
        };
      }
    });
    if (!flag) {
      list?.push({...item, count: 1});
    }
    ++item.count;
    this.setState({
      ...this.state,
      typeArr: typeList,
      orderDishArr: list,
    });
  };

  getData = (type?: any) => {
    if (!type) {
      this.setState({
        showArr: this.allData,
      });
      return;
    }
    for (let i = 0, len = this.state.typeArr?.length; i < len; i++) {
      if (this.state.typeArr[i]?.type === type) {
        let list = this.allData?.filter(item => item?.type === type);
        this.setState(
          {
            showArr: list,
          },
          () => {
            END = new Date().getTime();
            console.log(`渲染完成getData：${END} 耗时 ${END - START}毫秒`);
          },
        );
        break;
      }
    }
  };
  renderHeader = () => {
    let items = this.state.typeArr?.map((item: any) => (
      <TouchableOpacity
        key={item?.name}
        style={{
          ...styles.headerItem,
          backgroundColor:
            item?.type === this.selectedType ? '#E7BF6D' : '#fff',
        }}
        onPress={() => {
          START = new Date().getTime();
          console.log(`初始化renderHeader onPress：${START}`);
          if (this.selectedType !== item?.type) {
            this.getData(item?.type);
            this.selectedType = item?.type;
          }
        }}>
        <Text>{item?.name}</Text>
        {Boolean(item?.count) && (
          <View style={styles.count}>
            <Text style={styles.countText}>{item?.count}</Text>
          </View>
        )}
      </TouchableOpacity>
    ));
    END = new Date().getTime();
    console.log(`渲染完成renderHeader：${END} 耗时 ${END - START}毫秒`);
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            ...styles.headerItem,
            backgroundColor: this.selectedType ? '#fff' : '#E7BF6D',
          }}
          onPress={() => {
            if (this.selectedType) {
              this.getData();
              this.selectedType = '';
            }
          }}>
          <Text>全部</Text>
        </TouchableOpacity>
        {items}
        <View>
          <Text> {`菜品总共${this.state.showArr?.length}个`}</Text>
        </View>
      </View>
    );
  };
  renderAlign = (data: any[]) => {
    if (data?.length % Colum !== 0) {
      let num = data?.length % Colum;
      for (let i = num; i < Colum; i++) {
        data?.push({
          id: i?.toString(),
        });
      }
      return data;
    } else {
      return data;
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{width: '30%'}}>
          <FlatList
            data={this.state.orderDishArr}
            renderItem={this.renderOrder}
            keyExtractor={item => item?.id?.toString()}
          />
        </View>
        <FlatList
          ref={ref => {
            this.flatListRef = ref;
          }}
          data={this.renderAlign(this.state.showArr) ?? []}
          ListHeaderComponent={this.renderHeader}
          horizontal={false}
          renderItem={this.renderItem}
          numColumns={Colum}
          columnWrapperStyle={styles.columnWrapper}
          keyExtractor={item => item?.id?.toString()}
          getItemLayout={(data, index) => ({
            length: HEIGHT + 10,
            offset: (HEIGHT + 10) * index,
            index,
          })}
          removeClippedSubviews={false}
          initialNumToRender={10}
          onEndReached={info => {
            console.log('info', info);
          }}
          onEndReachedThreshold={0.9}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    position: 'relative',
    width: WIDTH,
    height: HEIGHT,
    borderWidth: 0.5,
    borderColor: '#8BC34A',
    borderRadius: 9,
    justifyContent: 'space-between',
    padding: 9,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  _item: {
    position: 'relative',
    width: WIDTH,
    height: HEIGHT,
    justifyContent: 'space-between',
    padding: 9,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dline: {
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  header: {
    padding: 9,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerItem: {
    margin: 3,
    width: WIDTH,
    height: 40,
    borderColor: '#C4DCFD',
    borderRadius: 6,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 15,
    borderRadius: 15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
  },
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    height: 40,
    borderRadius: 5,
    borderColor: '#3871E0',
    borderWidth: 0.5,
  },
});
