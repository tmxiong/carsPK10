/**
 * 某品牌某型号汽车详情页
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    FlatList,
    Linking
} from 'react-native';

import NavBar from '../../component/NavBar';
import cfn from '../../tools/commonFun'
import config from '../../config/config'
import fetchp from '../../tools/fetch-polyfill';
import urls from '../../config/urls';
import ShopItem from '../../component/shopItem'
import Global from '../../global/global'
export default class jieshaoPage extends Component {

    static defaultProps={

    };
    constructor(props) {
        super(props);

        this.id = this.props.navigation.state.params.id;
        // this.name = this.props.navigation.state.params.name;
        // this.img = this.props.navigation.state.params.img;
        this.state={
            data:[],
            isError:false,
            isLoading:true,
            collectData:[],
        }
    }

    componentDidMount() {
        this.collectShops();
        this.getData();
    }

    goBack() {
        this.props.navigation.goBack();
    }

    getData() {
        fetchp(urls.getShop(this.id),{timeout:5*1000})
            .then((res)=>res.json())
            .then((data)=>this.setData(data))
            .catch((err)=>this.setError(err))
    }

    reload() {
        if(this.state.isError) {
            this.setState({
                isError:false,
                isLoading:true,
            },()=>this.getData());
        }
    }

    setData(data) {

        this.setState({
            data:data.result.dealerlist,
            isError:false,
            isLoading:false,
        })

    }
    setError(err) {
        this.setState({
            isError:true,
            isLoading:false
        })
    }

    collectShops(type,data) {
        if(type == 'delete') {
            Global.storage.remove({
                key: 'collectShops',
                id: data.id
            });
        } else if(type == 'save'){
            Global.storage.save({
                key: 'collectShops',  // 注意:请不要在key中使用_下划线符号!
                id: data.id, //获取所有数据时，id 必须写
                data: data,

                // 如果不指定过期时间，则会使用defaultExpires参数
                // 如果设为null，则永不过期
                expires: null
            }).then(()=>{});
        } else {
            Global.storage.getAllDataForKey('collectShops')
                .then((data)=>this.setState({collectData:data}));
        }
    }

    getIsSelected(id) {
        let isSelected = false;

        let data = this.state.collectData;
        for(let i = 0; i < data.length; i++) {
            if(data[i].id == id) {
                isSelected = true;
                break;
            }
        }

        return isSelected;
    }

    _keyExtractor=(item, index)=> item.id;

    renderItem({item, index}) {
        return<ShopItem
            item={item}
            name={item.name}
            address={item.address}
            newstitle={item.newstitle}
            phone={item.phone}
            price={item.price}
            isSelected={this.getIsSelected(item.id)}
            collectShops={this.collectShops.bind(this)}
        />;
    }

    render() {
        return(
            <Image style={styles.bg} source={require('../../imgs/pageBg/page_bg_2.png')}>
                <View style={styles.container}>
                    <NavBar
                        middleText={"汽车商店"}
                        leftFn={this.goBack.bind(this)}
                    />



                    <FlatList
                        data={this.state.data}
                        keyExtractor={this._keyExtractor}
                        renderItem={this.renderItem.bind(this)}
                        ListEmptyComponent={
                            <TouchableOpacity
                                style={{marginTop:cfn.deviceHeight()/3}}
                                onPress={()=>this.reload()}
                                activeOpacity={0.8}>
                                <Text style={{color:'#ddd'}}>{this.state.isError ? '加载错误，点击重试' : '正在加载...'}</Text>
                            </TouchableOpacity>
                        }
                        ItemSeparatorComponent={()=><View style={{width:cfn.deviceWidth(),height:1,backgroundColor:'#ddd'}}/>}
                    />
                </View>
            </Image>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#rgba(0,0,0,0.5)',
        alignItems:'center',
        width:cfn.deviceWidth(),
        height:cfn.deviceHeight(),
    },
    bg: {
        width:cfn.deviceWidth(),
        height:cfn.deviceHeight(),
        resizeMode:'stretch'
    },

});