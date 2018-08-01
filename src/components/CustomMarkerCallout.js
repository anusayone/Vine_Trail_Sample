import React from "react";
import {
    Image,
    ImageEditor,
    ImageStore,
    StyleSheet,
    Text,
    View,
    WebView,
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native";
import {responsiveHeight,responsiveFontSize, responsiveWidth} from "../helpers/Responsive";
const styles = StyleSheet.create({});
const globeIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAw5JREFUeNrsWb112zAQphgtwJQq5RGoMiU1AjUCOQJZupRGENt0xghG604YIWxVcgT5Tj4mF5ggDpASP+fl3sMjBeLnw/3jlCR3pjzP1yHjL5eLty0igWTwqPAV2mCMqam/gMcztBr6Oupr4IH9GpqC/t4G6aNFIDgEhZuW1DVAe4CNBwL+A1pG/VvoNzQP+0cOI9gDfNJSkMsAzu2Je5xws4He9wQwoSf+3tLvmjicEFcLWBNBttDMzZwkET4xACOhmL9aYraJi/2ZAP62Bh70dDod5jCkHoAVbZ5NfOYLN44leL+a+H7l+GazOUaBBIA4cW5yx/S0cIxZ00ET4mjvGFfNAU0dAJsJ/eOkmC6WHo0pPNz0Ak0nAJak9HOk2bsPZEmG5wM5Am1mQdJiR4HBK2YwEuc9ityQscwR6mg+x8m9w0g4GSbqQupiHVJw0XESJIWzSrCAceibVC+N5FDAzWrKmZfCU2qmGoNwzpUJFBK1cE4eFRb/BEnCYpp8AlqwyJJJJoDIDsyy84C9BhYixfthyFwGWPXPDIbpcBUAUo9RigyplEwCA1IpWXUWIYX1DeNNyLw0YrNYit0nDzUc/RGG8yms+58EmX8UyCFgfHbDXkPkPJOON7q/sKmJtPR+ye4rElH2lqVnkSDFiQlEnP5/gnHXBMMqh/ioAzVWlE8+BezVov7T7XIvUS0QdW0nvUY42Yy3RQIqckvMQAshM+p34qbajESZi4gwqQMtG7nYuXSyFriWnF1RTQTIIC6+A0l3kFawSEnjldBfKlbt8HESa0N61rope+7uVJW4cpHVJH2JrgKArcgFUVG0E1YlOgkXBSCNLWavn5QAZVarBfeauWoHHmQLXByCnTkBbR16x2s2rvqipDzYAridCyDSF5/Gn8/nl9VqpYkLnBMZ9MPns4HWw/s363sPh9wxLj5O5AEI7vtdwqJ5Iywt7yy30zDdtN1X7eAigsMK8MNYNxeHxaDM982VlGTlit3FKyo2tVZfk/z690GHJhg3E+NkwkTr/D6VBfnaqwADALPahpBsROOFAAAAAElFTkSuQmCC';
const callIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAqCAYAAAAu9HJYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgdJREFUeNrMmIuRgkAMhpWhAa8ELUFL0BK4ErSEowQpQUqQEtwS3BK0hKMETJzgMMwtmyxclswwzJ2sfP55bLLLpmkWc7dljJduweB2pD8tXOZ+vz/nBvmA27r37xphCdoCtIkGCYCo4IX5OIKWaQQhM8Gze7wSZRX39GKRJTNWUT9xQEVMlEfI2mTuKmpD/gSuqxMlV2PZWQUut1pKHkestdrZPV93gxUj1hrNEoRNxU0YmzXs4V9q7rZgcNtQA8FWUX3HAc4arh02DbOF7MCemKBVNMhOhzNkJcRjHQ2Sivuao2KspndFjcZQluM4cYjVqi2oK/eVoTJaP0lu9nVDqGIVBZKK+Tlkd0oU4/DKcXN3SlSDJMAbI5ux3OR/fZAKYwm/qKAtTgK4ZTz+3dZF9oxDM8mRrlXvF29wi2PE4JWh4DsOATB3fZg6xs6hLGzV2XmUPzM7HjME+FGS3JLRHLJmhltJe3DfvRfB0IVhc3C5+QMp/NV9ywG0CFAPDQ+odj7AFvIhUM9V1zLhd6CCJ0xAztHjFGdB0lH17WJf4vXrpFHcGSspYKvkUwnwE79SSxWUfFL8Bb+nLUG/I04YfElVDLlXkjhmzIGSY4BC9SYJpbSTcdlEcMUY1/ogg49BqJMup1LO2WBAXDbCZKho5q/GAEiLee7onA2pZQnO/pdiLnsJMABg7c2LSbWfkwAAAABJRU5ErkJggg==';
const clockIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAitJREFUeNrUmYGRgjAQRSNzDdgCV0JSAleClmBKgBKkBCxBStASSAmXFq4Eb/dm9QJDhIRE4s5kZEbE5+5m92/cMA/jnG/h5YCXsApY24mPXGm1SiltvnG73Sa/b+MIl8NLSYC+hrA1wF6DQpLnSlqhDCH3Xdf9LIYEQAxnAytn4Q0BJYC2z27KJgAxrJdIgIxy+SyEOHp5kgAb9jo7gUflbE+uAIh2sHl0Y8nBi0duVbD0IJRHj1TBHD1ZIWkXdx4PvkJJ+Rr5wSWBuv5gAaDaFu4y4iZx2UzNaE4ahToFKyA/d2OeTAXwsZF6kEYvTsnQm9z0ZGqAd9uZkPwdIItEIXMIeZ7Rrt6ydC3PEqiLk0IsY29gsSE1tbl0IaGfo5jFnq5S9iSCKgKtl0DqEMlNVcIG+gMLpdzeI/wqG46YC5RLR2J5KvzCNa8zY3ILIrEAtCEtYK17LoCoK0NCmuoFvcoto/HZcex9bJw2dJcg0KH8axy7W9sbH+CB53tDD2zoDUnPPjqG+hMvPsyRMhIkipdvj8/VtkEsljedyyt4UdiKuQzRxgKYtHYcLLrDG1awCryonrZFKrjVSoB41FJPnmAY+dm8ePbp5eEsgQEelUtEgYcHhZcKIlEQezNVttO0yXAPQp9Ttwg5sOHmkMNN4g1pwBZ00rEEFlUXnpn/nZwFP9g3xSMV/d1MVaPZ/78PPTETDXJE2XDLAQOGUj/TrLMg59y0tv0KMADxBcyvn/RXzgAAAABJRU5ErkJggg==';
const directionIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAVCAYAAADID4fUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAO5JREFUeNrEloERgyAMRQ3nAqzQFdoVHKEdgRXaEVxBV+kMruAIdgNopMipB7SFnMldjtPLhWeSyxeMMRW3idIEABB1/MC7+Vgbi7E2V6LEU6a1NivvQjE2x4EQFgRd7iGgdCZ8SSMQgdcDeiOEeC0QgmEOz+jPdUVqR3PC45qTEZOVgNzwHMH1dsIHyVCVuSXNAsG5LEZR8ZvkhrDtqBMBD4JL2q/zADBEZwJSC6BsT2x2Bdee2CwrEgErBTgaosfLL3sALyABoTFEAta5fNEB9SoagFAUEL9YDEJRSXkuhKL8n/gXYsoBoIJ4CzAA+wD4zdVMbK4AAAAASUVORK5CYII=';

export default class CustomMarkerCallout extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            parentProps: '',
            distance:'',
            duration:''
        }
    }
    componentDidMount(){
        console.log("componentDidMount of CustomMarkerCallout");
    }

    render() {
        const {poi,parentProps,distance,duration} = this.props;
        return (
            <View style={{marginTop:5,
                //borderColor:'#DD0000',borderWidth:2,
                width:responsiveWidth(80),
                padding: responsiveWidth(2)
            }}>
                <Text style={{
                    marginTop:responsiveHeight(2),
                    fontFamily: 'Roboto-Bold',
                    fontSize: responsiveFontSize(2.5),
                    color: '#333333'
                }}>{poi.title}</Text>
                <Text style={{
                    marginTop:responsiveWidth(1),
                    fontSize: responsiveFontSize(1.5),
                    color: '#333333'
                }}>{}
                </Text>
                {/*<View style={{*/}
                    {/*borderColor:'#DD0000',borderWidth:2,*/}
                        {/*width: '100%',*/}
                    {/*}}>*/}
                    {/*<View style={{*/}
                        {/*flexDirection: 'row',*/}
                        {/*width: '100%',*/}
                    {/*}}>*/}
                        {/*<View style={{*/}
                                {/*width: 20,*/}
                                {/*height: 20,*/}
                            {/*}}>*/}
                            {/*<WebView*/}
                                {/*bounces={false}*/}
                                {/*scrollEnabled={false}*/}
                                {/*style={{*/}
                                    {/*width: 20,*/}
                                    {/*height: 20,*/}
                                    {/*flex: 1,*/}
                                    {/*marginLeft: -5,*/}
                                    {/*marginTop:-2.5,*/}
                                    {/*backgroundColor: 'transparent',*/}
                                {/*}}*/}
                                {/*source={{html: '<img src="' + globeIcon + '" style="width:10px; height:10px;"/>'}}*/}
                            {/*/>*/}
                        {/*</View>*/}
                        {/*<View style={{*/}
                                {/*flex:1,*/}
                                {/*justifyContent:'center',*/}
                            {/*}}>*/}
                            {/*<Text style={{*/}
                                    {/*fontSize: responsiveFontSize(1.3),*/}
                                    {/*color: '#333333',*/}
                                    {/*//flex: 1,*/}
                                    {/*textAlignVertical: 'bottom',*/}
                        {/*}}>{poi.website}*/}
                            {/*</Text>*/}
                        {/*</View>*/}

                    {/*</View>*/}

                    {/*<View style={{*/}
                        {/*borderColor:'#DD0000',borderWidth:2,*/}
                    {/*flexDirection: 'row',*/}
                    {/*width: '100%',*/}
                {/*}}>*/}
                        {/*<View style={{*/}
                        {/*width: 20,*/}
                        {/*height: 20,*/}
                    {/*}}>*/}
                            {/*<WebView*/}
                                {/*bounces={false}*/}
                                {/*scrollEnabled={false}*/}
                                {/*style={{*/}
                                    {/*width: 20,*/}
                                    {/*height: 20,*/}
                                    {/*flex: 1,*/}
                                    {/*marginLeft: -5,*/}
                                    {/*marginTop:-2.5,*/}
                                    {/*backgroundColor: 'transparent',*/}
                            {/*}}*/}
                                {/*source={{html: '<img src="' + callIcon + '" style="width:10px; height:10px;"/>'}}*/}
                            {/*/>*/}
                        {/*</View>*/}
                        {/*<View style={{*/}
                            {/*flex:1,*/}
                            {/*justifyContent:'center',*/}
                        {/*}}>*/}
                            {/*<Text style={{*/}
                                {/*fontSize: responsiveFontSize(1.3),*/}
                                {/*color: '#333333',*/}
                                {/*//flex: 1,*/}
                                {/*textAlignVertical: 'bottom',*/}
                            {/*}}>*/}
                                {/*{poi.phone}*/}
                            {/*</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}

                    {/*<View style={{*/}
                        {/*flexDirection: 'row',*/}
                        {/*width: '100%',*/}
                    {/*}}>*/}
                        {/*<View style={{*/}
                            {/*width: 20,*/}
                            {/*height: 20,*/}
                            {/*}}>*/}
                            {/*<WebView*/}
                                {/*bounces={false}*/}
                                {/*scrollEnabled={false}*/}
                                {/*style={{*/}
                                    {/*width: 20,*/}
                                    {/*height: 20,*/}
                                    {/*flex: 1,*/}
                                    {/*marginLeft: -5,*/}
                                    {/*marginTop:-2.5,*/}
                                    {/*backgroundColor: 'transparent',*/}
                                {/*}}*/}
                                {/*source={{html: '<img src="' + clockIcon + '" style="width:10px; height:10px;"/>'}}*/}
                            {/*/>*/}
                        {/*</View>*/}
                        {/*<View style={{*/}
                            {/*flex:1,*/}
                            {/*justifyContent:'center',*/}
                        {/*}}>*/}
                           {/*<Text style={{*/}
                                {/*fontSize: responsiveFontSize(1.3),*/}
                                {/*color: '#333333',*/}
                                {/*//flex: 1,*/}
                                {/*textAlignVertical: 'bottom',*/}
                                {/*}}>{poi.opening_status}*/}
                           {/*</Text>*/}
                        {/*</View>*/}

                    {/*</View>*/}
                {/*</View>*/}



                <View style={{
                    height: 1,
                    borderBottomColor: '#eee',
                    borderBottomWidth: 1,
                    marginTop: 10,
                    marginBottom: responsiveWidth(2)
                }}/>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        alignItems:'center',
                        flex: 1,
                        marginTop:10
                    }}>
                        <Text style={{
                            fontSize: 10,
                            color: '#333333'
                        }}>Distance</Text>
                        {(distance=='')?<Text style={{
                            fontFamily: 'Roboto-Regular',
                            fontSize: 17,
                            color: '#333333'
                        }}>{"Not Available"}</Text>
                        :<Text style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 17,
                            color: '#333333'
                        }}>{distance}</Text>}

                    </View>
                    <View style={{
                        alignItems:'center',
                        flex: 1,
                        marginTop:10
                    }}>
                        <Text style={{
                            fontSize: 10,
                            color: '#333333'
                        }}>Time</Text>
                        {(duration=='')?<Text style={{
                            fontFamily: 'Roboto-Regular',
                            fontSize: 17,
                            color: '#333333'
                        }}>{"Not Available"}</Text>
                            :<Text style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 17,
                            color: '#333333'
                        }}>{duration}</Text>}
                    </View>
                </View>
            </View>
        )
    }
}