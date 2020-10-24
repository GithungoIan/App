import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import styles from '../../../styles/StyleSheet';
import ChatSwitcherOptionPropTypes from './ChatSwitcherOptionPropTypes';

const propTypes = {
    // The index of the option that is currently in focus
    focusedIndex: PropTypes.number.isRequired,

    // An array of options to allow the user to choose from
    options: PropTypes.arrayOf(ChatSwitcherOptionPropTypes),

    // A function that is called when an option is selected. Selected option is passed as a param
    onSelectRow: PropTypes.func.isRequired,

    // Callback that adds a user to the pending list of Group DM users
    onAddToGroup: PropTypes.func.isRequired,
};
const defaultProps = {
    options: [],
};

const ChatSwitcherList = ({
    focusedIndex,
    options,
    onSelectRow,
    onAddToGroup,
}) => (
    <View style={[styles.chatSwitcherItemList]}>
        {options.length > 0 && _.map(options, (option, i) => {
            const optionIsFocused = i === focusedIndex;
            const isUserRow = option.type === 'user';
            const textStyle = optionIsFocused
                ? styles.sidebarLinkActiveText
                : styles.sidebarLinkText;
            return (
                <View
                    key={option.alternateText}
                    style={[
                        styles.flexRow,
                        styles.alignItemsCenter,
                        styles.flexJustifyCenter,
                        optionIsFocused ? styles.chatSwitcherItemFocused : null
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => onSelectRow(option)}
                    >
                        <View
                            style={[
                                styles.flexRow,
                                styles.mb2,
                                styles.alignItemsCenter,
                                styles.chatSwitcherItem,
                                isUserRow ? styles.chatSwitcherItemLeft : null,
                            ]}
                        >
                            {
                                option.icon
                                && (
                                    <View style={[styles.chatSwitcherAvatar, styles.mr2]}>
                                        <Image
                                            source={{uri: option.icon}}
                                            style={[styles.chatSwitcherAvatarImage]}
                                        />
                                    </View>
                                )
                            }
                            <View style={[styles.flex1]}>
                                {option.text === option.alternateText ? (
                                    <Text style={[textStyle, styles.h3]} numberOfLines={1}>
                                        {option.alternateText}
                                    </Text>
                                ) : (
                                    <>
                                        <Text style={[textStyle, styles.h3]} numberOfLines={1}>
                                            {option.text}
                                        </Text>
                                        <Text style={[textStyle, styles.textMicro]} numberOfLines={1}>
                                            {option.alternateText}
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                    {isUserRow && (
                        <View>
                            <TouchableOpacity
                                style={[styles.chatSwitcherItemButton]}
                                onPress={() => onAddToGroup(option)}
                            >
                                <Text
                                    style={[styles.chatSwitcherItemButtonText]}
                                    numberOfLines={1}
                                >
                                    Add
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            );
        })}
    </View>
);

ChatSwitcherList.propTypes = propTypes;
ChatSwitcherList.defaultProps = defaultProps;
ChatSwitcherList.displayName = 'ChatSwitcherList';

export default ChatSwitcherList;
