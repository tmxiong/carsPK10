/**
 * Created by Administrator on 2017/9/14.
 */
/**
 * Created by timxiong on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    WebView,
    FlatList,
    Platform,
    StatusBar,
    Alert,
    TouchableOpacity
} from 'react-native';
import urls from '../../config/urls';
import config from '../../config/config'
import cfn from '../../tools/commonFun'
import NavBar from '../../component/NavBar';
import Global from '../../global/global';
export default class tipsDetailPage extends Component {

    static navigationOptions = {header: null};

    constructor(props) {
        super(props);
        this.state = {
            data:[],
        };

    }

    static defaultProps = {};

    goBack() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.getReadHistory();
    }

    getReadHistory() {
        // 获取某个key下的所有数据
        Global.storage.getAllDataForKey('history').then((data) => {
            this.setState({data:data})
        });

    }
    // 删除key下的所有数据
    clearAll() {
        if(this.state.data.length == 0) {
            return Alert.alert( '提示',
                '没有阅读的文章',
                [
                    {text: '确定', onPress: ()=> {}},
                ]);
        }
        Alert.alert( '清除历史记录',
            '确定要清除历史记录？',
            [
                {text: '确定', onPress: ()=> this.clearAllOk()},
                {text: '取消', onPress: ()=> {}}
            ]);
    }
    clearAllOk() {
        Global.storage.clearMapForKey('history');
        // Global.storage.clearMapForKey('welcome');
        this.getReadHistory();
    }

    _keyExtractor = (item, index) => item.id;
    renderItem({item,index}) {
        return(
            <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                onPress={()=>this.goToDetail('tipsDetail', {
                        id: item.id,
                        title: item.title,
                        rowData: item,
                    }
                )}
                style={styles.item_container}>

                <View style={styles.item_text_container}>
                    <Text
                        style={styles.item_title}>{item.title}</Text>
                    <Text style={styles.item_source}>{config.sourceName}</Text>
                    <Text style={styles.item_time}>{new Date(item.publishTime).toLocaleString().split(' ')[0]}</Text>
                </View>
                <Image
                    style={styles.item_img}
                    source={{uri: item.imageList[0]}}/>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    leftFn={this.goBack.bind(this)}
                    middleText="阅读历史"
                    rightFn={this.clearAll.bind(this)}
                    rightText='清除'
                />
                <FlatList
                    //style={styles.flatListStyle}
                    data={this.state.data}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={this._keyExtractor}
                    getItemLayout={(data, index) => ( {
                        length: cfn.picHeight(160),
                        offset: cfn.picHeight(160) * index,
                        index
                    } )}
                />
                {this.state.data.length == 0 ? <View
                    style={{alignSelf:'center',zIndex:3,position:'absolute',bottom:cfn.deviceHeight()/2}}>
                    <Text style={{color:'#ccc',fontSize:16}}>暂无阅读记录</Text>
                </View> : null}
            </View>)
    }

}
const styles = StyleSheet.create({
    container: {
        justifyContent:'flex-start',
        width:cfn.deviceWidth(),
        height:cfn.deviceHeight(),
    },
    item_container: {
        width: cfn.deviceWidth(),
        height: cfn.picHeight(160),
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor:'#fff'
    },
    item_text_container: {
        flexWrap: 'wrap',
        width: cfn.deviceWidth() - cfn.picWidth(180 + 40),
        paddingLeft: cfn.picWidth(20),
        height: cfn.picHeight(120),
    },
    item_source: {
        fontSize: 13,
        color: '#888',
        position: 'absolute',
        left: cfn.picWidth(20),
        bottom: 0
    },
    item_time: {
        fontSize: 13,
        color: '#888',
        position: 'absolute',
        right: cfn.picWidth(20),
        bottom: 0
    },
    item_title: {
        color: '#444'
    },
    item_img: {
        width: cfn.picWidth(180),
        height: cfn.picHeight(120),
        marginLeft: cfn.picWidth(20),
    }
});