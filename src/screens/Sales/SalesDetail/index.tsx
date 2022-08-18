import React, { useEffect, useState, useContext } from 'react'
import appContext from '../../../context'
import { StyleSheet, View, Text, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Appbar, FAB, useTheme, Card, Modal, TouchableRipple, TextInput, Dialog, Button } from 'react-native-paper'
import { formatCurrency, formatTime, transform, dtoc } from '@hproinformatica/functions'
import { Edit, toView, delayedAlert, executeSqlAsync, Loader, backendRequest } from '@hproinformatica/react-native'
import AppStorage from '../../../storage/AppStorage'
import * as FileSystem from 'expo-file-system'

const SalesDetail = ({ navigation, route }: HPro.Props<HPro.SalesStack, 'SalesDetail'>) => {

	const item = route.params

	const { cliContext, setCliContext, tabContext, setTabContext, cpaContext, setCpaContext } = useContext(appContext)

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
		condEsp: {
			flex: 1,
			margin: 10,
			backgroundColor: colors.primary,
			height: 40,
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: 10
		}
	})

	const [loading, setLoading] = useState<boolean>(true)
	const [visible, setVisible] = useState<boolean>(false)
	const [confirm, setConfirm] = useState<boolean>(false)
	const [pev, setPev] = useState<HPro.salesType>()
	const [sys, setSys] = useState<HPro.Params>()
	const [ive, setIve] = useState<number>(0)

	useEffect(() => {
		const refresh = navigation.addListener('focus', async () => {
			if (pev) {
				if (pev.num && pev.new != '2') {
					await executeSqlAsync('select tot,vce from hpev where num=?', [pev.num])
						.then(async ({ rows }) => {
							setPev(prev => ({
								...prev,
								tot: rows._array[0].tot,
								vce: rows._array[0].vce,
							}))

							await executeSqlAsync('select * from hive where num=?', [pev.num])
								.then(({ rows }) => {
									setIve(rows._array.length)
								})
						})
				}
			}
		})
		return refresh
	}, [pev])

	useEffect(() => {

		if (item) {
			editPev()
		} else {
			appendPev()
		}

		setLoading(false)
	}, [item])

	const editPev = async () => {
		setPev(item)

		// Parâmetros
		await AppStorage.loadParamsInfo()
			.then((params) => {
				setSys(params)
			})

		// Preenche os views
		setCliContext(`${item.cli} - ${item.cliraz}`)
		await executeSqlAsync('select cod,des from htab where cod=?', [item.tab.toString()])
			.then((result) => {
				setTabContext(result.rows._array[0] ? `${result.rows._array[0].cod} - ${result.rows._array[0].des}` : '')
			})
			.then(async () => {
				await executeSqlAsync('select cod,des from hcpa where cod=?', [item.cpa.toString()])
					.then((result) => {
						setCpaContext(result.rows._array[0] ? `${result.rows._array[0].cod} - ${result.rows._array[0].des}` : '')
					})
			})
			.catch((error) => delayedAlert('Atenção', error.message))
			.finally(() => setLoading(false))
	}

	const appendPev = async () => {
		let date = new Date

		await AppStorage.loadParamsInfo()
			.then(async (params) => {
				await AppStorage.loadUserInfo()
					.then((user) => {
						setSys(params)
						setPev({
							num: '',
							dat: dtoc(new Date),
							hor: formatTime(new Date).substring(0, 5),
							dav: dtoc(new Date(date.setDate(date.getDate() + params.diaven))),
							den: '',
							cli: 0,
							ven: user.cod,
							tot: 0,
							cpa: 0,
							tab: 0,
							fco: 'FOB',
							vce: '',
							obs: params.obspad,
							flg: 1,
							new: 1,
							ori: 'Internet',
							sit: 'Pendente',
							cliraz: '',
						})

						// Tela de preço padrão
						setTabContext(params.tabpad ? params.tabpad : '')
						setCliContext('')
						setCpaContext('')
					})
			})
	}

	const validaEstado = async (): Promise<boolean> => {

		const cliEst = await (await executeSqlAsync('select est from hcli where cod=?', [toView(cliContext)])).rows.item(0)
		const tabEst = await (await executeSqlAsync('select est from htab where cod=?', [toView(tabContext)])).rows.item(0)

		if (cliEst && tabEst) {
			return (tabEst.est.includes(cliEst.est))
		} else {
			return false
		}
	}

	const postPev = async () => {
		Keyboard.dismiss()

		if (!cliContext) {
			delayedAlert('Atenção', 'É obrigatório informar o cliente antes de gravar o pedido!')
			return
		}

		if (!tabContext) {
			delayedAlert('Atenção', 'É obrigatório informar a tabela de preço antes de gravar o pedido!')
			return
		}

		if (!cpaContext) {
			delayedAlert('Atenção', 'É obrigatório informar a condição de pagamento antes de gravar o pedido!')
			return
		}

		validaEstado()
			.then(async (res) => {
				console.log(res)
				if (res) {
					setLoading(true)
					if (pev.num) {
						await executeSqlAsync('update hpev set cli=?, cpa=?, tab=?, fco=?, vce=?, obs=? where num=?',
							[toView(cliContext), toView(cpaContext), toView(tabContext), pev.fco, pev.vce, pev.obs, pev.num])
							.then(() => {
								navigation.goBack()
							})
							.catch((error) => delayedAlert('Atenção', error.message))
							.finally(() => setLoading(false))
					} else {
						await executeSqlAsync('insert into hpev (dat,hor,dav,cli,tot,cpa,tab,fco,vce,obs,ori,ven,new) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
							[pev.dat, pev.hor, pev.dav, toView(cliContext), 0, toView(cpaContext), toView(tabContext), pev.fco, pev.vce, pev.obs, pev.ori, pev.ven, pev.new.toString()])
							.then(async (result) => {
								await executeSqlAsync('select * from hpev where rowid=?', [result.insertId.toString()])
									.then((result) => {
										setPev(prev => ({
											...prev,
											num: result.rows._array[0].num,
											cli: result.rows._array[0].cli,
											tab: result.rows._array[0].tab,
											cpa: result.rows._array[0].cpa,
											fco: result.rows._array[0].fco
										}))
									})
							})
							.catch((error) => delayedAlert('Atenção', error.message))
							.finally(() => setLoading(false))
					}
				} else {
					delayedAlert('Atenção', 'Estado do cliente não pertence a tabela de preços informada!')
					return
				}
			})
	}

	const generatePDF = async () => {
		setConfirm(false)

		if (!pev.num) {
			delayedAlert('Atenção', 'É necessário gravar o pedido para gerar o PDF')
			return
		}

		setLoading(true)
		await AppStorage.loadUserInfo()
			.then(async (user) => {
				await executeSqlAsync('select * from hive where num=?', [pev.num])
					.then(({ rows }) => {
						return JSON.stringify(rows._array)
					})
					.then(async (result) => {
						await backendRequest('pdf_vendas', { ...pev, ive: result, emp: user.empcod })
							.then((content) => {
								FileSystem.downloadAsync(
									`http://187.32.116.191:12103/temp/${content.nom}`,
									//`http://192.168.0.18:9000/temp/${content.nom}`,
									FileSystem.documentDirectory + pev.num + '.pdf'
								)
									.then(({ uri }) => {
										navigation.navigate('PDF', { fileName: uri })
									})
							})
					})
			})
			.catch((error) => delayedAlert('Atenção', error.message))
			.finally(() => setLoading(false))
	}

	const ConfirmDialog = () => {
		return (
			<Dialog visible={confirm} onDismiss={() => setConfirm(false)}>
				<Dialog.Title>Atenção</Dialog.Title>
				<Dialog.Content>
					<Text>Deseja realmente gerar o PDF deste pedido?</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => generatePDF()}>Sim</Button>
					<Button onPress={() => setConfirm(false)}>Não</Button>
				</Dialog.Actions>
			</Dialog>
		)
	}

	const FretePanel = ({ fco }) => {
		return (
			<TouchableRipple
				style={{ ...styles.freteStyle, backgroundColor: pev.fco === fco ? colors.primary : 'white' }}
				onPress={() => pev?.new == 1 && setPev(prev => ({ ...prev, fco: fco }))}
			>
				<Text style={{ fontWeight: 'bold', color: pev.fco === fco ? 'white' : 'black' }}>{fco}</Text>
			</TouchableRipple>
		)
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.Action
					color={colors.accent}
					icon={'arrow-left'}
					onPress={() => navigation.goBack()} />
				<Appbar.Content
					color={colors.accent}
					title="Pedido de venda" />
				<Appbar.Action
					color={colors.accent}
					icon={'eye'}
					onPress={() => setVisible(true)} />
				{
					pev?.new != 2 &&
					<Appbar.Action
						color={colors.accent}
						icon={'file-pdf-box'}
						onPress={() => {
							setConfirm(true)
						}} />
				}
				{
					pev?.new == 1 ?
						<Appbar.Action
							color={colors.accent}
							icon={'check'}
							onPress={() => postPev()} />
						: null
				}
			</Appbar.Header>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.select({ android: undefined, ios: 'padding' })}
			>
				<Loader.Circle visible={loading} />
				<View style={{ flex: 1 }}>
					{
						pev ?
							<ScrollView
								//style={{ backgroundColor: 'blue' }}
								contentContainerStyle={{ paddingBottom: 100 }}
								keyboardShouldPersistTaps={'handled'}
							>
								<Card.Title
									style={styles.card}
									title={'Pedido Nº'}
									titleStyle={styles.cardTitle}
									right={(props) =>
										<Text style={styles.cardTitle}>{pev.num && transform(pev.num, 'XX/######')}</Text>
									}
								/>
								<Card.Title
									style={styles.card}
									title={'Data - Hora'}
									titleStyle={styles.cardTitle}
									right={(props) =>
										<Text style={styles.cardTitle}>{pev.dat} - {pev.hor}</Text>
									}
								/>
								<Card.Title
									style={styles.card}
									title={'Validade'}
									titleStyle={styles.cardTitle}
									right={(props) =>
										<Text style={styles.cardTitle}>{pev.dav}</Text>
									}
								/>
								<Edit.View
									label='Tabela de preço'
									field={tabContext}
									setField={setTabContext}
									screen='PriceView'
									navigation={navigation}
									valid={`select cod, des as str from htab where cod=${toView(tabContext)}`}
									disabled={sys?.tabpad || pev?.new !== 1 || ive > 0 ? true : false}
								/>
								<Edit.View
									label='Cliente'
									field={cliContext}
									setField={setCliContext}
									screen='ClientView'
									navigation={navigation}
									valid={`select cod, raz as str from hcli where cod=${toView(cliContext)}`}
									disabled={pev?.new !== 1}
								/>
								<Edit.View
									label='Condição de pagamento'
									field={cpaContext}
									setField={setCpaContext}
									screen='CondView'
									navigation={navigation}
									valid={`select cod, des as str from hcpa where cod=${toView(cpaContext)}`}
									disabled={pev?.new !== 1}
								/>
								{
									toView(cpaContext) == sys?.cpaesp &&
									<TouchableRipple
										onPress={() =>
											pev.num
												?
												navigation.navigate('Dates', pev)
												:
												delayedAlert('Atenção', 'É necessário gravar o pedido para incluir os pagamentos')}
										style={styles.condEsp}
									>
										<Text style={{ color: colors.surface, fontWeight: 'bold' }}>Condição de pagamento especial</Text>
									</TouchableRipple>
								}
								<Text style={{ marginTop: 15, marginLeft: 15, fontWeight: 'bold', fontSize: 16 }}>Frete</Text>
								<View style={{ height: 60, flexDirection: 'row', padding: 10 }}>
									<FretePanel fco='CIF' />
									<FretePanel fco='FOB' />
									<FretePanel fco='Não' />
								</View>
								<Card.Title
									style={styles.card}
									title={'Total'}
									titleStyle={styles.cardTitle}
									right={(props) =>
										<Text style={styles.cardTitle}>{formatCurrency(pev.tot)}</Text>
									}
								/>
								<View style={{ height: 80 }} />
							</ScrollView>
							: null
					}
				</View>
				<Modal style={{ marginLeft: 10, marginRight: 10 }} visible={visible} onDismiss={() => setVisible(false)}>
					<TextInput
						value={pev?.obs}
						onChangeText={(e) => setPev(prev => ({ ...prev, obs: e }))}
						editable={pev?.new == 1}
						multiline
						numberOfLines={20}
					/>
				</Modal>
				<ConfirmDialog />
				<FAB
					style={styles.fab}
					icon="grid"
					onPress={() =>
						pev.num
							?
							navigation.navigate('Items', pev)
							:
							delayedAlert('Atenção', 'É necessário gravar o pedido para incluir os itens')}
				/>
			</KeyboardAvoidingView>
		</>
	)
}

export default SalesDetail
