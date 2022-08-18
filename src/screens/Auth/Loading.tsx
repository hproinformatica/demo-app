import { setServerIPAddress } from '@hproinformatica/react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext, useEffect } from 'react'
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native'
import appContext from '../../context'
import AppStorage from '../../storage/AppStorage'

const Loading = ({ navigation }: HPro.Props<HPro.AuthStack, 'AuthLoading'>) => {
	/* Styles */
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: 'center'
		}
	})

	const { setGerContext } = useContext(appContext)

	/* Hooks */
	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				return true
			}

			return () =>
				BackHandler.addEventListener('hardwareBackPress', onBackPress)
		}, [])
	)

	useEffect(() => {
		const applicationLoader = async () => {

			//setServerIPAddress('192.168.0.18', '9000')
			setServerIPAddress('187.32.116.191', '12103')

			const userInfo = await AppStorage.loadUserInfo()
			if (userInfo) {
				setGerContext(userInfo.ger)
				navigation.navigate('Sales')
			} else {
				navigation.navigate('AuthLogin')
			}

		}
		applicationLoader()
	}, [])

	return (
		<View style={styles.container}>
			<ActivityIndicator size='large' />
		</View>
	)
}

export default Loading
