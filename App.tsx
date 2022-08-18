import React, { useState, useContext } from 'react'
import appContext from './src/context'
import { StatusBar, StyleSheet, View } from 'react-native'
import { useFonts } from 'expo-font'

// Navigator
import CustomDrawerContent from './src/components/Drawer'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

// Styles
import { Provider } from 'react-native-paper'
import IconAwesome from 'react-native-vector-icons/FontAwesome'
import theme from './src/themes'

// Screens
import Auth from './src/screens/Auth'
import AuthLoading from './src/screens/Auth/Loading'
import Sync from './src/screens/Sync'
import Clients from './src/screens/Clients'
import ClientsDetail from './src/screens/Clients/ClientsDetail'
import Materials from './src/screens/Materials'
import MaterialsDetail from './src/screens/Materials/MaterialsDetail'
import Cond from './src/screens/Cond'
import CondDetail from './src/screens/Cond/CondDetail'
import Price from './src/screens/Price'
import PriceDetail from './src/screens/Price/PriceDetail'
import Sales from './src/screens/Sales'
import SalesDetail from './src/screens/Sales/SalesDetail'
import Items from './src/screens/Sales/Items'
import ItemsDetail from './src/screens/Sales/ItemsDetail'
import Dates from './src/screens/Sales/Dates'
import Liberation from './src/screens/Liberation'
import PDF from './src/screens/Sales/PDF'

// Views
import ClientView from './src/views/Clients'
import CondView from './src/views/Cond'
import PriceView from './src/views/Price'
import MaterialView from './src/views/Materials'
import RepresentativeView from './src/views/Representatives'

const AppDrawer = () => {

	const { gerContext } = useContext(appContext)

	/* Drawers */
	const Drawer = createDrawerNavigator<HPro.AppDrawer>()

	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			initialRouteName={'SalesStack'}>
			<Drawer.Screen
				component={SalesStack}
				name={'SalesStack'}
				options={{
					drawerIcon: ({ color }) => (
						<IconAwesome
							color={color}
							name={'clipboard'}
							size={22} />
					),
					drawerLabel: 'Pedidos de venda',
				}} />
			{
				gerContext &&
				<Drawer.Screen
					component={LiberationStack}
					name={'LiberationStack'}
					options={{
						drawerIcon: ({ color }) => (
							<IconAwesome
								color={color}
								name={'check-square-o'}
								size={22} />
						),
						drawerLabel: 'Liberação',
					}} />
			}

			<Drawer.Screen
				component={ClientsStack}
				name={'ClientsStack'}
				options={{
					drawerIcon: ({ color }) => (
						<IconAwesome
							color={color}
							name={'users'}
							size={22} />
					),
					drawerLabel: 'Clientes',
				}} />
			<Drawer.Screen
				component={MaterialsStack}
				name={'MaterialsStack'}
				options={{
					drawerIcon: ({ color }) => (
						<IconAwesome
							color={color}
							name={'truck'}
							size={22} />
					),
					drawerLabel: 'Materiais',
				}} />
			<Drawer.Screen
				component={PriceStack}
				name={'PriceStack'}
				options={{
					drawerIcon: ({ color }) => (
						<IconAwesome
							color={color}
							name={'table'}
							size={22} />
					),
					drawerLabel: 'Tabelas de preço',
				}} />
			<Drawer.Screen
				component={CondStack}
				name={'CondStack'}
				options={{
					drawerIcon: ({ color }) => (
						<IconAwesome
							color={color}
							name={'dollar'}
							size={22} />
					),
					drawerLabel: 'Cond. pagamento',
				}} />
			<Drawer.Screen
				component={SyncStack}
				name={'SyncStack'}
				options={{
					drawerIcon: ({ color }) => (
						<IconAwesome
							color={color}
							name={'gears'}
							size={22} />
					),
					drawerLabel: 'Configurações',
				}} />

		</Drawer.Navigator>
	)
}

const AuthStack = () => {
	const Stack = createStackNavigator<HPro.AuthStack>()

	return (
		<Stack.Navigator
			headerMode={'none'}
			initialRouteName={'AuthLoading'}>
			<Stack.Screen
				component={Auth}
				name={'AuthLogin'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={AuthLoading}
				name={'AuthLoading'}
				options={{ gestureEnabled: false }} />
		</Stack.Navigator>
	)
}

const SalesStack = () => {
	const Stack = createStackNavigator<HPro.SalesStack>()

	return (
		<Stack.Navigator
			headerMode={'none'}
			initialRouteName={'Sales'}>
			<Stack.Screen
				component={Sales}
				name={'Sales'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={SalesDetail}
				name={'SalesDetail'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={Items}
				name={'Items'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={ItemsDetail}
				name={'ItemsDetail'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={Dates}
				name={'Dates'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={PDF}
				name={'PDF'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={ClientView}
				name={'ClientView'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={CondView}
				name={'CondView'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={PriceView}
				name={'PriceView'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={MaterialView}
				name={'MaterialView'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={RepresentativeView}
				name={'RepresentativeView'}
				options={{ gestureEnabled: false }} />

		</Stack.Navigator>
	)
}

const LiberationStack = () => {
	const Stack = createStackNavigator<HPro.LiberationStack>()

	return (
		<Stack.Navigator
			headerMode={'none'}
			initialRouteName={'Liberation'}>
			<Stack.Screen
				component={Liberation}
				name={'Liberation'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={SalesDetail}
				name={'SalesDetail'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={Items}
				name={'Items'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={ItemsDetail}
				name={'ItemsDetail'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={Dates}
				name={'Dates'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={PDF}
				name={'PDF'}
				options={{ gestureEnabled: false }} />
		</Stack.Navigator>
	)
}

const ClientsStack = () => {
	const Stack = createStackNavigator<HPro.ClientsStack>()

	return (
		<Stack.Navigator
			headerMode={'none'}
			initialRouteName={'Clients'}>
			<Stack.Screen
				component={Clients}
				name={'Clients'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={ClientsDetail}
				name={'ClientsDetail'}
				options={{ gestureEnabled: false }} />
		</Stack.Navigator>
	)
}

const MaterialsStack = () => {
	const Stack = createStackNavigator<HPro.MaterialsStack>()

	return (
		<Stack.Navigator
			headerMode={'none'}
			initialRouteName={'Materials'}>
			<Stack.Screen
				component={Materials}
				name={'Materials'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={MaterialsDetail}
				name={'MaterialsDetail'}
				options={{ gestureEnabled: false }} />
		</Stack.Navigator>
	)
}

const PriceStack = () => {
	const Stack = createStackNavigator<HPro.PriceStack>()

	return (
		<Stack.Navigator
			headerMode={'none'}
			initialRouteName={'Price'}>
			<Stack.Screen
				component={Price}
				name={'Price'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={PriceDetail}
				name={'PriceDetail'}
				options={{ gestureEnabled: false }} />
		</Stack.Navigator>
	)
}

const CondStack = () => {
	const Stack = createStackNavigator<HPro.CondStack>()

	return (
		<Stack.Navigator
			headerMode={'none'}
			initialRouteName={'Cond'}>
			<Stack.Screen
				component={Cond}
				name={'Cond'}
				options={{ gestureEnabled: false }} />
			<Stack.Screen
				component={CondDetail}
				name={'CondDetail'}
				options={{ gestureEnabled: false }} />
		</Stack.Navigator>
	)
}

const SyncStack = () => {
	const Stack = createStackNavigator<HPro.SyncStack>()

	return (
		<Stack.Navigator
			headerMode={'none'}
			initialRouteName={'Sync'}>
			<Stack.Screen
				component={Sync}
				name={'Sync'} />
		</Stack.Navigator>
	)
}

export default function App() {
	/* Styles */
	const styles = StyleSheet.create({
		container: {
			backgroundColor: theme.colors.background,
			flex: 1
		}
	})

	const [cliContext, setCliContext] = useState<string>('')
	const [tabContext, setTabContext] = useState<string>('')
	const [cpaContext, setCpaContext] = useState<string>('')
	const [matContext, setMatContext] = useState<string>('')
	const [repContext, setRepContext] = useState<string>('')
	const [gerContext, setGerContext] = useState<boolean>(false)

	const [loaded] = useFonts({
		roboto: require('./assets/fonts/RobotoMono-Regular.ttf'),
		openSans: require('./assets/fonts/OpenSans-Regular.ttf'),
		openSansSb: require('./assets/fonts/OpenSans-SemiBold.ttf'),
	})

	if (!loaded) {
		return null
	}

	const Stack = createStackNavigator<HPro.MainStack>()

	return (
		<appContext.Provider value={{
			cliContext, setCliContext,
			tabContext, setTabContext,
			cpaContext, setCpaContext,
			matContext, setMatContext,
			repContext, setRepContext,
			gerContext, setGerContext
		}}>
			<Provider theme={theme}>
				<View style={styles.container}>
					<StatusBar backgroundColor={'#006867d5'} />
					<NavigationContainer theme={theme}>
						<Stack.Navigator
							headerMode={'none'}
							initialRouteName={'Auth'}>
							<Stack.Screen
								component={AuthStack}
								name={'Auth'}
								options={{ gestureEnabled: false }} />
							<Stack.Screen
								component={AppDrawer}
								name={'Sales'}
								options={{ gestureEnabled: false }} />
						</Stack.Navigator>
					</NavigationContainer>
				</View>
			</Provider>
		</appContext.Provider>
	)
}
