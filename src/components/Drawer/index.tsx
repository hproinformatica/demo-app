/* Dependencies */
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

/* Libraries */
import { DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

/* Storage */
import AppStorage from '../../storage/AppStorage'

const CustomDrawerContent = (props: DrawerContentComponentProps<DrawerContentOptions>) => {
	/* Styles */
	const { colors } = useTheme()
	const styles = StyleSheet.create({
		container: {
			backgroundColor: colors.primary,
			flex: 1
		},
		safeArea: {
			marginHorizontal: 10,
			marginTop: 20
		},
		header: {
			height: 80,
			justifyContent: 'center',
			backgroundColor: colors.primary,
		},
		headerText: {
			paddingLeft: 16,
			justifyContent: 'center'
		},
		userNameText: {
			fontWeight: 'bold',
			fontSize: 16,
			color: 'white',
		},
		companyNameText: {
			fontSize: 14,
			color: 'white',
		},
		drawer: {
			backgroundColor: colors.background,
			flex: 1
		},
		drawerContent: {
			flex: 1,
			paddingTop: 10
		}
	})

	const [user, setUser] = useState<HPro.User>()

	useEffect(() => {
		getInfos()
	}, [props])

	const getInfos = () => {
		AppStorage.loadUserInfo()
			.then((usr) => {
				setUser(usr)
			})
	}

	const handleLogout = async () => {
		AppStorage.clearUserInfo()
			.then(() => {
				props.navigation.navigate('AuthLogin')
			})
	}

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<View style={styles.headerText}>
						<Text style={styles.userNameText}>{user?.raz ?? 'Carregando...'}</Text>
						<Text style={styles.companyNameText}>{user?.empraz ?? 'Carregando...'}</Text>
					</View >
				</View>
			</SafeAreaView>
			<View style={styles.drawer}>
				<DrawerContentScrollView
					contentContainerStyle={styles.drawerContent}
					{...props}>
					<DrawerItemList labelStyle={{ fontWeight: 'bold' }} {...props} {...user} />
					<DrawerItem
						icon={({ color, size }) =>
							<Icon
								color={color}
								name={'logout'}
								size={22} />}
						labelStyle={{ fontWeight: 'bold' }}
						label={'Sair'}
						onPress={handleLogout} />
				</DrawerContentScrollView>
			</View>
		</View>
	)
}

export default CustomDrawerContent
