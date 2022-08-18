/* Libraries */
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native'
import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper'

export default {
	...NavigationDefaultTheme,
	...PaperDefaultTheme,
	colors: {
		...NavigationDefaultTheme.colors,
		...PaperDefaultTheme.colors,
		accent: '#f9f9f9',
		background: '#ffffff',
		primary: '#00a099',
		// surface: '#00a099',
		surface: '#ffffff',
		text: '#000000',
		onSurface: '#00a099',
		notification: '#ff5555'
	}
}
