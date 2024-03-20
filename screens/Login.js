import { View, Text, Image, Alert,StyleSheet } from 'react-native'
import React, { useCallback, useReducer, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { FONTS, SIZES, images } from '../constants'
import { COLORS } from '../constants'
import Input from '../components/Input'
import Button from '../components/Button'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirebaseApp } from '../utils/firebaseHelper'
import { useTheme } from '../themes/ThemeProvider'

const initialState = {
    inputValues: {
        email: '',
        password: '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const Login = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const { colors } = useTheme()

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    const loginHandler = async () => {
        const app = getFirebaseApp()
        const auth = getAuth(app)
        setIsLoading(true)

        try {
            const result = await signInWithEmailAndPassword(
                auth,
                formState.inputValues.email,
                formState.inputValues.password
            )

            if (result) {
                setIsLoading(false)
                navigation.navigate('BottomTabNavigation')
            }
        } catch (error) {
            const errorCode = error.code
            let message = 'Something went wrong'

            if (
                errorCode === 'auth/wrong-password' ||
                errorCode === 'auth/user-not-found'
            ) {
                message = 'Wrong email or password'
            }

            setError(message)
            setIsLoading(false)
        }
    }

    // handle errors
    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred', error)
        }
    }, [error])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <PageContainer>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 22,
                    }}
                >
                    <Image
                        source={images.logo}
                        style={{
                            height: 140,
                            width: 140,
                            marginBottom: 5,
                        }}
                    />

                    <Text
                        style={{
                            ...FONTS.h4,
                            color: colors.text,
                            marginVertical: 8,
                        }}
                    >
                        Login to your account
                    </Text>

                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        id="email"
                        placeholder="Enter your email"
                        placeholderTextColor={colors.white}
                    />

                    <Input 
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['password']}
                        id="password"
                        placeholder="Enter your password"
                        placeholderTextColor={colors.white}
                        secureTextEntry
                    />

                    <Button
                        title="Login"
                        filled
                        isLoading={isLoading}
                        onPress={loginHandler}
                        style={{
                            width: SIZES.width - 44,
                            marginBottom: SIZES.padding,
                            marginVertical: 8,
                        }}
                    />
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Login
