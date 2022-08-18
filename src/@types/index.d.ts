export = HPro
export as namespace HPro

import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack'

declare namespace HPro {

	interface User {
		nom: string
		cod: string
		raz: string
		ger: boolean
		empcod: string
		empraz: string
	}

	interface Sync {
		dat: string;
		hor: string;
	}

	interface Params {
		diaven?: integer
		cpaesp?: integer
		obspad?: string
		tabpad?: string
	}

	interface salesType {
		num: string
		dat: string
		hor: string
		dav: string
		den?: string
		cli: integer
		ven: integer
		tot?: number
		cpa?: integer
		tab?: integer
		fco: string
		vce?: string
		obs?: string
		flg?: integer
		new?: integer
		ori: string
		sit: string
		cliraz?: string
		venraz?: string
	}

	interface salesItemType {
		num: string
		seq: integer
		mat: integer
		des: string
		uni?: string
		ref?: string
		den?: string
		qtd: number
		tab: number
		pre: number
		dsc?: number
		com?: number
		comrep?: number
		rep?: integer
		tot: number
		est?: number
		flg?: integer
		new?: integer
	}

	interface clientType {
		cod: string
		raz: string
		fan?: string
		cpf?: string
		cpj?: string
		end?: string
		nue?: string
		coe?: string
		bai?: string
		cid?: string
		est?: string
		cep?: string
		tel?: string
		cel?: string
		cpx?: string
	}

	interface representativeType {
		cod: string
		raz: string
	}

	interface materialType {
		cod: string
		des: string
		ref?: string
		uni?: string
		est?: number
	}

	interface condType {
		cod: integer
		des: string
		num?: integer
		d01?: integer
		d02?: integer
		d03?: integer
		d04?: integer
		d05?: integer
		d06?: integer
		d07?: integer
		d08?: integer
		d09?: integer
		d10?: integer
		d11?: integer
		d12?: integer
	}

	interface priceType {
		emp: integer
		cod: integer
		des: string
		est?: string
	}

	interface priceItemType {
		emp: integer
		tab: integer
		mat: integer
		des?: string
		ref?: string
		pve?: number
	}

	/* Navigation */
	type Props<T, P extends keyof T = string> =
		StackScreenProps<T, P>

		type AuthStack = {
			Sales: undefined
			AuthLogin: undefined
			AuthLoading: undefined
		}

		type MainStack = {
			Sales: undefined
			Auth: undefined
			Sync: undefined
			Clients: undefined
		}

		type SalesStack = {
			Sales: undefined
			SalesDetail?: salesType
			Items: salesType
			ItemsDetail: {
				pev: salesType
				ive?: salesItemType
				matcod?: materialType['cod']
			}
			Dates: salesType
			ClientView: undefined
			PriceView: undefined
			CondView: undefined
			MaterialView: undefined
			RepresentativeView: undefined
			PDF: {
				fileName: string
			}
		}

		type LiberationStack = {
			Liberation: undefined
			SalesDetail?: salesType
			Items: salesType
			ItemsDetail: {
				pev: salesType
				ive?: salesItemType
				matcod?: materialType['cod']
			}
			Dates: salesType
			PDF: {
				fileName: string
			}
		}

		type ClientsStack = {
			Clients: undefined
			ClientsDetail: clientType
		}

		type MaterialsStack = {
			Materials: undefined
			MaterialsDetail: materialType
		}

		type CondStack = {
			Cond: undefined
			CondDetail: condType
		}

		type PriceStack = {
			Price: undefined
			PriceDetail: priceType
		}

		type SyncStack = {
			Sync: undefined
		}

		type AppDrawer = {
			SalesStack: undefined
			LiberationStack: undefined
			SyncStack: undefined
			ClientsStack: undefined
			MaterialsStack: undefined
			CondStack: undefined
			PriceStack: undefined
		}

}
