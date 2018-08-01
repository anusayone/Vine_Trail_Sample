import React, {Component} from "react";
import {Image, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";

export default class ClusterMarker extends Component {
    render() {
        return (
            <View style={{width: 70, height: 70, margin: 10, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{
                    width: 45,
                    height: 45,
                    backgroundColor: 'transparent',
                    borderRadius: 30,
                    borderColor: '#e57e3977',
                    borderWidth: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        backgroundColor: 'transparent',
                        borderRadius: 30,
                        borderColor: '#e57e3999',
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            width: 35,
                            height: 35,
                            backgroundColor: 'transparent',
                            borderRadius: 30,
                            borderColor: '#e57e39aa',
                            borderWidth: 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                width: 28,
                                height: 28,
                                backgroundColor: '#e57e39',
                                borderRadius: 30,
                                borderColor: '#e57e39',
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}