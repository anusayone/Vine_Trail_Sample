import React from "react";
import {
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity
} from "react-native";
import GridView from "react-native-super-grid";
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "../helpers/Responsive";

const styles = StyleSheet.create({
    buttonLoginContainerView: {
        width: '100%',
        alignItems: 'center',
        marginBottom: responsiveHeight(3),
        marginTop: responsiveHeight(4)
    },
    buttonLoginBackgroundImage: {
        height: responsiveWidth(14),
        width: responsiveHeight(43),
        resizeMode: 'contain'
    },
    buttonLoginTouchableView: {
        width: responsiveHeight(43),
        height: responsiveWidth(14),
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});

export default class MapLegend extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            selectedCategories: [],
            deleted: false,
            categories: []
        }
    }

    setCategories(item, callback) {
        let addCategory = true;
        let selectedCategories = [];
        if (item.id !== -1) {
            // console.log(this.state.selectedCategories);
            Object.assign(selectedCategories, this.state.selectedCategories);
            if (this.state.selectedCategories !== item) {
                selectedCategories = item;
            } else {
                addCategory = false;
                selectedCategories = []
            }
            // this.state.selectedCategories.map((element, index) => {
            //     if (element.id === item.id) {
            //         selectedCategories.splice(index, 1);
            //         addCategory = false;
            //     }
            // });
            if (addCategory) {
                selectedCategories = item;
            }
            console.log(selectedCategories)
        }
        if (item == '') {
            selectedCategories = [];
            callback(selectedCategories);
            this.setState({selectedCategories: selectedCategories});
        } else {
            callback(selectedCategories);
            this.setState({selectedCategories: selectedCategories});
        }

    }

    isItemSelected(item) {
        let flag = false;
        if (this.state.selectedCategories.id === item.id) {
            flag = true;
        }
        // if (this.state.selectedCategories.length === 0 && item.id === -1) {
        //     flag = true;
        // } else {
        //     this.state.selectedCategories.map((element) => {
        //         if (element.id === item.id) {
        //             flag = true;
        //         }
        //     });
        // }
        return flag;
    }

    componentWillUnmount() {
        console.log("componentWillUnmount() of maplegend");
    }

    render() {
        const {categories, onCategorySelect} = this.props;
        //this.setState({categories: categories});
        let newCategories = [{id: -1, category: "All"}].concat(categories);
        return (
            <View style={{
                height: responsiveHeight(47.4),
                width: responsiveWidth(100),
                marginTop: 0,
                paddingRight: 5,
                backgroundColor: '#fff',
                position: 'absolute',
            }}>
                <Image
                    style={{width: responsiveWidth(100), height: responsiveHeight(0.25)}}
                    source={require('../../assets/images/map_legend_colorfull_line.png')}
                />
                <View style={{
                    paddingLeft: responsiveWidth(4.5),
                    paddingTop: responsiveWidth(6),
                    paddingBottom: responsiveWidth(4),
                    flexDirection:'row'
                }}>
                    <Text style={{
                        fontSize: responsiveFontSize(1.8),
                        fontFamily: "Roboto-Medium",
                        color: '#333333'
                    }}>Filter</Text>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setCategories('', onCategorySelect)
                        }}>
                        <View style={{
                            position:'absolute',
                            right:responsiveWidth(5),
                            paddingTop: responsiveWidth(6),
                            paddingBottom: responsiveWidth(4),}}>
                            <Text style={{
                                fontSize: responsiveFontSize(1.8),
                                fontFamily: "Roboto-Medium",
                                color: '#333333',
                            }}>Clear Filter</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView
                    scrollEnabled={true}
                    bounces={false}>
                    <View
                        style={{paddingLeft: responsiveWidth(3), paddingRight: responsiveWidth(3),paddingBottom:responsiveWidth(3),
                        }}>
                        <GridView
                            itemDimension={90}
                            items={categories}
                            spacing={0}
                            renderItem={(item) => {
                            //console.log(item);
                            return(
                            <TouchableOpacity
                                onPress={() => this.setCategories(item, onCategorySelect)}>
                                <View
                                    style={{
                                    height: responsiveHeight(14),
                                    marginLeft: responsiveWidth(1),
                                    marginTop: responsiveWidth(1),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    //borderColor:'#dd0000',borderWidth:2,
                                    backgroundColor: this.isItemSelected(item) ? '#dfdfdf' : '#f2f2f2',
                                    }}>
                                <View style={{
                                    width: responsiveWidth(10),
                                    height: responsiveHeight(6),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <Image
                                style={{
                                    resizeMode: 'contain',
                                    width: responsiveWidth(10),
                                    height: responsiveHeight(6),
                                    }}
                                source={
                                    item.id == -1
                                    ? require('../../assets/images/all_icon.png')
                                    : {uri: item.category_icon}}
                                />
                                </View>
                                <Text style={{
                                    textAlign: 'center', fontSize: responsiveFontSize(1.7)
                                }}>
                                    {item.category}
                                </Text>
                                </View>
                                </TouchableOpacity>
                            )

                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}
