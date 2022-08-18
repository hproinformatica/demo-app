/* Dependencies */
import React, { useEffect, useRef, useState, useContext } from 'react'
import appContext from '../../context'
import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { backendRequest, delayedAlert, Loader } from '@hproinformatica/react-native'
import { Button, TextInput } from 'react-native-paper'
import { resetDatabaseStructure } from '../../sync'

/* Storage */
import AppStorage from '../../storage/AppStorage'

const Login = ({ navigation }: HPro.Props<HPro.AuthStack, 'AuthLogin'>) => {

	//const { colors } = useTheme()
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			padding: 10,
		},
		logoContainer: {
			flexGrow: 2,
		},
		logo: {
			flex: 1,
			height: undefined,
			width: undefined,
		},
		logohpro: {
			height: 200,
			width: 200,
			alignSelf: 'center',
			marginBottom: 20
		},
		inputContainer: {
			flexGrow: 1,
		},
		inputStyle: {
			margin: 5,
		},
		authButtonStyle: {
			marginTop: 10,
			marginLeft: 5,
			marginRight: 5,
		},
	})

	const [loading, setLoading] = useState<boolean>(false)
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const passwordRef = useRef(null)

	const { setGerContext } = useContext(appContext)

	useEffect(() => {
		const clearFields = navigation.addListener('focus', () => {
			setUsername('')
			setPassword('')
		})
		return clearFields
	}, [navigation])

	const authenticate = async () => {
		const parameters = {
			usr: username,
			psw: password
		}

		setLoading(true)
		backendRequest('authenticate', parameters, {
			successFunction: async (content) => {
				await AppStorage.saveUserInfo(content.user)
				setGerContext(content.user.ger)
				resetDatabaseStructure()
				await AppStorage.clearParamsInfo()
				await AppStorage.clearSyncInfo()
				navigation.navigate('Sales')
			},
			errorFunction: (error) => delayedAlert('Atenção', error.message)
		})
			.finally(() => setLoading(false))
	}

	return (
		<>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.select({ android: undefined, ios: 'padding' })}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
					<View
						style={styles.container}
					>
						<Loader.Circle visible={loading} />
						<View style={styles.logoContainer}>
							<Image source={require('../../../assets/images/logo.png')} resizeMode="contain" style={styles.logo} />
						</View>
						<View style={styles.inputContainer}>
							<TextInput
								mode="flat"
								style={styles.inputStyle}
								label="Usuário"
								value={username}
								onChangeText={userName => setUsername(userName)}
								returnKeyType={"next"}
								onSubmitEditing={() => passwordRef.current.focus()}
								blurOnSubmit={false}
							/>
							<TextInput
								mode="flat"
								secureTextEntry={true}
								style={styles.inputStyle}
								label="Senha"
								value={password}
								onChangeText={userPassword => setPassword(userPassword)}
								ref={passwordRef}
							/>
							<Button
								mode="contained"
								icon="key"
								onPress={authenticate}
								style={styles.authButtonStyle}
							>
								Autenticar usuário
							</Button>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView >
		</>
	)
}

export default Login
