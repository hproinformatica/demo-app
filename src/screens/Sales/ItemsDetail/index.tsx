import { dtoc, formatCurrency, formatValue, toValue, transform } from '@hproinformatica/functions'
import { delayedAlert, Edit, executeSqlAsync, Loader, Picker, toView } from '@hproinformatica/react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Appbar, Card, useTheme } from 'react-native-paper'
import HPro from '../../../@types'
import appContext from '../../../context'
import { isObject } from '../../../utils'

const ItemsDetail = ({ navigation, route }: HPro.Props<HPro.SalesStack, 'ItemsDetail'>) => {

	const { pev, ive: item } = route.params

	const { matContext, setMatContext, repContext, setRepContext } = useContext(appContext)

	const { colors } = useTheme()
	const styles = StyleSheet.create({
		card: {
			height: 50,
			paddingTop: 8,
			paddingBottom: 8,
			paddingRight: 16,
		},
		cardTitle: {
			fontSize: 14,
			maxHeight: 100,
		},
		freteStyle: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			marginLeft: 5,
			marginRight: 5,
			borderRadius: 10
		},
		fab: {
			position: 'absolute',
			right: 16,
			bottom: 32,
			backgroundColor: colors.primary,
		},
	})

	const [loading, setLoading] = useState<boolean>(true)
	const [visible, setVisible] = useState<boolean>(false)
	const [dscTitle, setDscTitle] = useState<string>('Desconto %')
	const [qtd, setQtd] = useState<string>('0,00')
	const [pre, setPre] = useState<string>('0,000000')
	const [com, setCom] = useState<string>('0,00')
	const [cre, setCre] = useState<string>('0,00')
	const [dat, setDat] = useState<string>(dtoc())
	const [ive, setIve] = useState<HPro.salesItemType>()

	useEffect(() => {
		if (pev.new == 1) {
			matSelect(route.params.matcod)
		}
	}, [route.params.matcod])

	useEffect(() => {

		if (item) {
			editIve()
		} else {
			appendIve()
		}

		setLoading(false)
	}, [item])

	const editIve = async () => {
		setIve({ ...item, est: 0 })
		setQtd(formatValue(item.qtd))
		setPre(formatValue(item.pre, 6))
		setCom(formatValue(item.com))
		setCre(formatValue(item.comrep))
		setDat(item.den)

		setMatContext(`${item.mat} - ${item.des}`)

		calculateItem(true)

		await executeSqlAsync('select cod,raz from hrep where cod=?', [item.rep])
			.then((result) => {
				setRepContext(result.rows._array[0] ? `${result.rows._array[0].cod} - ${result.rows._array[0].raz}` : '')
			})
	}

	const appendIve = async () => {
		setIve({
			num: pev.num,
			seq: 0,
			mat: 0,
			des: '',
			uni: '',
			ref: '',
			den: dtoc(),
			qtd: 0,
			tab: 0,
			pre: 0,
			dsc: 0,
			com: 0,
			comrep: 0,
			rep: 0,
			tot: 0,
			est: 0,
			flg: 1,
			new: 1
		})
		setMatContext('')
		setRepContext('')
	}

	const postIve = async () => {
		Keyboard.dismiss()

		if (!ive.tab) {
			delayedAlert('Atenção', 'O item NÃO possui preço informado na tabela de preços, não é possível incluí-lo na venda!')
			return
		}

		if (!matContext) {
			delayedAlert('Atenção', 'É obrigatório informar o material antes de gravar o item!')
			return
		}

		if (!toValue(qtd)) {
			delayedAlert('Atenção', 'É obrigatório informar a quantidade antes de gravar o item!')
			return
		}

		if (!toValue(pre)) {
			delayedAlert('Atenção', 'É obrigatório informar o preço antes de gravar o item!')
			return
		}

		// if (!toValue(com)) {
		// 	delayedAlert('Atenção', 'É obrigatório informar a comissão do vendedor antes de gravar o item!')
		// 	return
		// }

		// Se o total não tiver sido calculado antes.
		let nQtdAux = 0
		let nPreAux = 0

		if (qtd.includes(',')) {
			nQtdAux = toValue(qtd)
		} else {
			nQtdAux = Number(qtd)
		}

		if (pre.includes(',')) {
			nPreAux = toValue(pre)
		} else {
			nPreAux = Number(pre)
		}

		const nQtd = toValue(formatValue(nQtdAux, 2))
		const nPre = toValue(formatValue(nPreAux, 6))
		const nTot = nQtd * nPre
		//

		// teclado com .
		let nComAux = 0
		if (com.includes(',')) {
			nComAux = toValue(com)
		} else {
			nComAux = Number(com)
		}

		let nCreAux = 0
		if (cre.includes(',')) {
			nCreAux = toValue(cre)
		} else {
			nCreAux = Number(cre)
		}
		//

		setLoading(true)
		if (ive.seq) {
			await executeSqlAsync('update hive set mat=?, des=?, uni=?, ref=?, den=?, qtd=?, tab=?, pre=?, dsc=?, com=?, comrep=?, rep=?, tot=? where num=? and seq=?',
				[toView(matContext), ive.des, ive.uni, ive.ref, dat, nQtdAux, ive.tab, nPreAux, ive.dsc, nComAux, nCreAux, toView(repContext), nTot, pev.num, ive.seq])
				.then(() => {
					calculateSales()
				})
				.catch((error) => delayedAlert('Atenção', error.message))
				.finally(() => setLoading(false))
		} else {
			await executeSqlAsync('insert into hive (num,mat,des,uni,ref,den,qtd,tab,pre,dsc,com,comrep,rep,tot,new) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				[pev.num, toView(matContext), ive.des, ive.uni, ive.ref, dat, nQtdAux, ive.tab, nPreAux, ive.dsc, nComAux, nCreAux, toView(repContext), nTot, '1'])
				.then(() => {
					calculateSales()
				})
				.catch((error) => delayedAlert('Atenção', error.message))
				.finally(() => setLoading(false))
		}
	}

	const calculateSales = async () => {
		await executeSqlAsync('select sum(tot) as totpev from hive where num=?', [pev.num])
			.then(({ rows }) => {
				executeSqlAsync('update hpev set tot=? where num=?', [rows._array[0].totpev, pev.num])
			})
			.catch((error) => delayedAlert('Atenção', error.message))
			.finally(() => navigation.goBack())
	}

	const creExit = () => {
		if (!toValue(cre)) {
			setRepContext('')
		}
	}

	const matSelect = async (value?: HPro.materialType | HPro.materialType['cod']) => {
		if (!value) return

		let cod = ''
		if (isObject(value)) {
			cod = value?.cod
		} else {
			cod = value
		}

		await executeSqlAsync(`select hpma.pve as pve, hmat.* from hmat
		 											 left join hpma on (hpma.tab=? and hpma.mat = hmat.cod)
													 where hmat.cod=?`
			, [pev.tab, cod])
			.then(({ rows }) => {
				setIve(prev => ({
					...prev,
					tab: toValue(rows._array[0].pve),
					uni: rows._array[0].uni,
					des: rows._array[0].des,
					ref: rows._array[0].ref,
					est: rows._array[0].est
				}))
			})
	}

	const calculateItem = (open: boolean = false) => {

		let nDsc = 0
		let nTot = 0
		let nQtd = 0
		let nPre = 0
		let nTab = 0
		let nQtdAux = 0
		let nPreAux = 0

		if (open) {
			nQtd = item.qtd
			nPre = item.pre
			nTab = item.tab
		} else {

			if (qtd.includes(',')) {
				nQtdAux = toValue(qtd)
			} else {
				nQtdAux = Number(qtd)
			}

			if (pre.includes(',')) {
				nPreAux = toValue(pre)
			} else {
				nPreAux = Number(pre)
			}

			nQtd = toValue(formatValue(nQtdAux, 2))
			nPre = toValue(formatValue(nPreAux, 6))
			nTab = ive.tab
		}

		nTot = nQtd * nPre

		if (nPre && nTab) {
			if (nPre > nTab) {
				nDsc = toValue(formatValue((nPre * 100 / nTab) - 100, 2))
				setDscTitle('Acréscimo %')
			} else {
				nDsc = toValue(formatValue(100 - (nPre * 100 / nTab), 2))
				setDscTitle('Desconto %')
			}
		}

		setIve(prev => ({ ...prev, tot: nTot, dsc: nDsc }))
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.select({ android: undefined, ios: 'padding' })}
		>
			<Appbar.Header>
				<Appbar.Action
					color={colors.accent}
					icon={'arrow-left'}
					onPress={() => navigation.goBack()} />
				<Appbar.Content
					color={colors.accent}
					title="Item da venda"
					subtitle={`Nº Pedido: ${transform(pev.num, 'XX/######')}`}
				/>
				{
					ive?.new == 1 ?
						<Appbar.Action
							color={colors.accent}
							icon={'check'}
							onPress={() => postIve()} />
						: null
				}
			</Appbar.Header>
			<Loader.Circle visible={loading} />
			<View
				style={{ flex: 1 }}
			>
				{
					ive ?
						<>
							<ScrollView
								//style={{ flex: 1 }}
								contentContainerStyle={{ paddingBottom: 150 }}
								keyboardShouldPersistTaps={'handled'}
							>
								<Edit.View
									label='Material'
									field={matContext}
									setField={setMatContext}
									screen='MaterialView'
									navigation={navigation}
									onSelect={matSelect}
									valid={`select cod, des as str from hmat where cod=${toView(matContext)}`}
									disabled={ive?.new !== 1 ? true : false}
								/>
								<Card.Title
									style={styles.card}
									title={'Unidade'}
									titleStyle={styles.cardTitle}
									right={(props) =>
										<Text style={styles.cardTitle}>{ive.uni}</Text>
									}
								/>
								{
									ive.new == 1 &&
									<Card.Title
										style={styles.card}
										title={'Estoque'}
										titleStyle={styles.cardTitle}
										right={(props) =>
											<Text style={styles.cardTitle}>{formatValue(ive?.est, 2)}</Text>
										}
									/>
								}
								<Card.Title
									style={styles.card}
									title={'Preço tabela'}
									titleStyle={styles.cardTitle}
									right={(props) =>
										<Text style={styles.cardTitle}>{formatCurrency(ive.tab)}</Text>
									}
								/>
								<View style={{ flexDirection: 'row' }}>
									<Edit.Number
										label="Quantidade"
										field={qtd}
										setField={setQtd}
										disabled={ive?.new !== 1 ? true : false}
										onExit={calculateItem}
									/>
									<Edit.Number
										label="Preço praticado"
										field={pre}
										setField={setPre}
										disabled={ive?.new !== 1 ? true : false}
										onExit={calculateItem}
										decimal={6}
									/>
								</View>
								<Card.Title
									style={styles.card}
									title={dscTitle}
									titleStyle={styles.cardTitle}
									right={(props) =>
										<Text style={styles.cardTitle}>{formatValue(ive.dsc)}</Text>
									}
								/>
								<Card.Title
									style={styles.card}
									title={'Total'}
									titleStyle={styles.cardTitle}
									right={(props) =>
										<Text style={styles.cardTitle}>{formatCurrency(ive.tot)}</Text>
									}
								/>
								{
									pev.new == 1 ?
										<View style={{ padding: 15 }}>
											<Text style={{ fontWeight: 'bold', color: colors.primary }}>Data da entrega</Text>
											<Picker.Date
												tip=""
												visible={visible}
												setVisible={setVisible}
												selectedDate={dat}
												setSelectedDate={setDat}
											/>
										</View>
										:
										<Card.Title
											style={styles.card}
											title={'Data da entrega'}
											titleStyle={styles.cardTitle}
											right={(props) =>
												<Text style={styles.cardTitle}>{dat}</Text>
											}
										/>
								}
								<View style={{ flexDirection: 'row' }}>
									<Edit.Number
										label="Comissão %"
										field={com}
										setField={setCom}
										disabled={ive?.new !== 1 ? true : false}
									/>
									<Edit.Number
										label="Comissão rep. %"
										field={cre}
										setField={setCre}
										onExit={creExit}
										disabled={ive?.new !== 1 ? true : false}
									/>
								</View>
								<Edit.View
									label='Representante'
									field={repContext}
									setField={setRepContext}
									screen='RepresentativeView'
									rootScreen='ItemsDetail'
									navigation={navigation}
									valid={`select cod, raz as str from hrep where cod=${toView(repContext)}`}
									disabled={ive?.new !== 1 || cre == '0,00' ? true : false}
								/>
							</ScrollView>
						</>
						: null
				}
			</View>
		</KeyboardAvoidingView>
	)
}

export default ItemsDetail
