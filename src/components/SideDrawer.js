import React from "react";
import {
    AsyncStorage,
    BackHandler,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    StatusBar,
    View
} from "react-native";
import PropTypes from "prop-types";
import Toast from "react-native-simple-toast";
import {responsiveHeight, responsiveWidth, responsiveFontSize} from "../helpers/Responsive";
import ImagePicker from 'react-native-image-picker';
import * as Types from "../constants/types";
const styles = StyleSheet.create({
    drawerContainer: {
        width: responsiveWidth(80),
        height: '100%',
        backgroundColor: '#252f39',
        position: 'absolute',
    },
    headerContainer: {
        width: responsiveWidth(80),
        height: responsiveHeight(36),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: responsiveWidth(80),
        height: responsiveHeight(36),
    },
    headerProfilePic: {
        width: responsiveWidth(32),
        height: responsiveWidth(32),
        marginTop: responsiveHeight(4),
    },
    headerTitle: {
        fontFamily: "Roboto-Bold",
        fontSize: responsiveFontSize(2.3),
        textAlign: "center",
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.42)',
        textShadowOffset: {
            width: 0.3,
            height: 0
        },
        textShadowRadius: 0.7,
        marginBottom: responsiveHeight(1),
        marginTop: responsiveHeight(2)
    },
    headerDescription: {
        fontFamily: "Roboto-Light",
        fontSize: responsiveFontSize(1.3),
        textAlign: "center",
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.42)',
        textShadowOffset: {
            width: 0.3,
            height: 0
        },
        textShadowRadius: 0.7,
        marginBottom: 5
    },
    itemsContainer: {
        flexDirection: 'column',
        width: responsiveWidth(80),
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        width: responsiveWidth(80),
        height: 45,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    itemIcon: {
        width: 16,
        height: 16,
        margin: 17,
        resizeMode: 'contain',

    },
    itemArrowIcon: {
        width: 16,
        height: 16,
        margin: 17,
        resizeMode: 'contain',
        position: 'absolute',
        right: 0

    },
    itemText: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        textAlign: "left",
        color: "#ffffff"
    },
    buttonItemText: {
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        textAlign: "center",
        color: "#ffffff"
    },
    buttonItemIcon: {
        width: 16,
        height: 16,
        margin: 10,
        resizeMode: 'contain',
    },
    buttonLogout: {
        flexDirection: 'row',
        width: responsiveWidth(80),
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fe8e42',
    },
});

var options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class SideDrawer extends React.PureComponent {

    constructor() {
        super();
    }

    uploadImage() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};
                this.setState({
                    imageUri: response.uri,
                    avatarSource: source
                });
            }
        });
    }

    render() {
        const {user, onItemSelected} = this.props;
        return (
            <View style={styles.drawerContainer}>
                <View style={styles.headerContainer}>
                    <Image
                        style={styles.headerImage}
                        blurRadius={5}
                        source={require('../../assets/images/side_drawer_header_background.png')}/>
                    <Image
                        style={styles.headerProfilePic}
                        source={require('../../assets/images/temp_profile_pic.png')}/>
                    <View style={{
                            width:responsiveWidth(80),
                            height:responsiveHeight(4.6),
                            marginTop:-responsiveHeight(7)
                        }}>
                        <View style={{
                                height:responsiveHeight(4.5),
                                width:responsiveHeight(4.5),
                                position:'absolute',
                                right:responsiveWidth(24)
                            }}>
                            <TouchableOpacity
                                onPress={()=>{
                                        this.uploadImage();
                                    }}>
                                <Image
                                    style={{
                                           height:responsiveHeight(4.5),
                                           width:responsiveHeight(4.5),
                                           resizeMode: 'contain',
                                        }}
                                    source={require('../../assets/images/setting_page_upload_image.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.headerTitle}>{user.username}</Text>
                    <Text style={styles.headerDescription}>{user.name}</Text>
                </View>
                <View style={styles.itemsContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            Toast.show('Under Development ;-)')
                        }}>
                        <View style={styles.item}>
                            <Image
                                source={require('../../assets/images/settings_page_custom_notifications.png')}
                                style={styles.itemIcon}/>
                            <Text style={styles.itemText}>Custom Notifications</Text>
                            <Image
                                source={require('../../assets/images/side_drawer_arrow_icon.png')}
                                style={styles.itemArrowIcon}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            onItemSelected(Types.DASHBOARD);
                        }}>
                        <View style={styles.item}>
                            <Image
                                source={require('../../assets/images/settings_page_dashboard_icon.png')}
                                style={styles.itemIcon}/>
                            <Text style={styles.itemText}>Dashboard</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Toast.show('Under Development ;-)')
                        }}>
                        <View style={styles.item}>
                            <Image
                                source={require('../../assets/images/settings_page_about_us_icon.png')}
                                style={styles.itemIcon}/>
                            <Text style={styles.itemText}>About Us</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Toast.show('Under Development ;-)')
                        }}>
                        <View style={styles.item}>
                            <Image
                                source={require('../../assets/images/settings_page_faq_icon.png')}
                                style={styles.itemIcon}/>
                            <Text style={styles.itemText}>FAQ</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Toast.show('Under Development ;-)')
                        }}>
                        <View style={styles.item}>
                            <Image
                                source={require('../../assets/images/settings_page_help_icon.png')}
                                style={styles.itemIcon}/>
                            <Text style={styles.itemText}>Help</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Toast.show('Under Development ;-)')
                        }}>
                        <View style={styles.item}>
                            <Image
                                source={require('../../assets/images/settings_page_terms_and_conditions_icon.png')}
                                style={styles.itemIcon}/>
                            <Text style={styles.itemText}>Terms and Conditions</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                       onItemSelected('');
                        }}>
                    <View style={styles.buttonLogout}>
                        <Image
                            source={require('../../assets/images/logout.png')}
                            style={styles.buttonItemIcon}/>
                        <Text style={styles.buttonItemText}>LOGOUT</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

SideDrawer.propTypes = {
    user: PropTypes.object.isRequired,
    onItemSelected: PropTypes.func.isRequired,
};