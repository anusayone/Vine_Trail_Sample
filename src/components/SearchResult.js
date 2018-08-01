import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,Keyboard
} from "react-native";
import {responsiveHeight,responsiveFontSize, responsiveWidth} from "../helpers/Responsive";
const styles = StyleSheet.create({});

export default class SearchResult extends React.PureComponent {

    constructor() {
        super();
    }

    render() {
        const {searchResults, onSelectedItem} = this.props;
        let noResults = [{id: -1, title: 'No results'}];
        return (
            <View
                style={{
                    marginTop: 0,
                    width: responsiveWidth(90),
                    minHeight: 40,
                    maxHeight: responsiveHeight(45),
                    backgroundColor: '#fff',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,
                    elevation: 2,

                }}>
                <FlatList
                    data={searchResults.length > 0 ? searchResults : noResults}
                    renderItem={({item}) =>
                        <TouchableOpacity
                            onPress={() => {
                            onSelectedItem(item)
                            Keyboard.dismiss();}
                            }
                            >
                            <View
                                style={{
                                    //borderColor:'#dd0000',borderWidth:2,
                                    height: responsiveHeight(8),
                                    justifyContent: 'center',
                                    borderTopColor: '#eee',
                                    borderTopWidth: 1,
                                    padding: 5,
                                    paddingLeft:responsiveWidth(5),
                                }}>
                                <Text style={{
                                    fontSize:responsiveFontSize(1.9),
                                    color:'#949494'
                                }}>
                                    {item.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                    keyboardShouldPersistTaps={'handled'}
                    keyExtractor={(item, index) => index}
                />
            </View>
        )
    }
}