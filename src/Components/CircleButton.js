import React, { Component } from 'react';
import { Text } from './Text';
import {View} from 'react-native';
import { Icon } from './Icon';

export const CircleButton = (props) => {
    return (
       <View style={{
        borderWidth: props.Width,
        width: props.size?props.size:10,
        height:props.size?props.size:10,
        borderColor:props.color,
        borderRadius:props.size?props.size:10/2,alignItems:"center",justifyContent:"center",alignContent:"center"}}>
            {props.IconName?<Icon type={props.IconType} name={props.IconName} size={props.IconSize} color={props.IconColor}/>:null}
        </View>   );
}