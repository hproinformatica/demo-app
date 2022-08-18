import React from 'react'
import { backendRequest, delayedAlert, transactionAsync, executeSqlAsync } from '@hproinformatica/react-native'
import { dtoc, formatTime } from '@hproinformatica/functions'
import AppStorage from '../storage/AppStorage'

export async function syncApp({ setLoading, _refresh }:
{
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
	_refresh: () => {}
} ) {
	await AppStorage.loadUserInfo()
	.then( async (user) => {

		await executeSqlAsync('select * from hpev where new=1')
		.then( async ({ rows }) => {

			let salesOrders = rows._array
			for (let salesOrder of salesOrders) {
				let resultSet = await executeSqlAsync(
					'select * from hive where num=?',
					[salesOrder.num])
				salesOrder.items = resultSet.rows._array
			}

			return JSON.stringify(salesOrders)
		})
		.then((hpevEnv) => {

			setLoading(true)

			backendRequest('sync', { cod: user.cod, usr: user.nom, emp: user.empcod, hpevEnv: hpevEnv })
			.then(async (content) => {
				if (content) {
					await resetDatabaseStructure()

					await transactionAsync(transaction => {

							for (let hcli of content.hcli) {
									transaction.executeSql(
											'insert into hcli (cod, raz, fan, cpf, cpj, end, nue, coe, bai, cid, est, cep, tel, cel, cpx) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
											[hcli.cod, hcli.raz, hcli.fan, hcli.cpf, hcli.cpj, hcli.end, hcli.nue, hcli.coe, hcli.bai, hcli.cid, hcli.est, hcli.cep, hcli.tel, hcli.cel, hcli.cpx]
									)
							}

							for (let hrep of content.hrep) {
								transaction.executeSql(
										'insert into hrep (cod, raz) values (?, ?)',
										[hrep.cod, hrep.raz]
								)
						}

							for (let hmat of content.hmat) {
									transaction.executeSql(
											'insert into hmat (cod, des, ref, uni, est) values (?, ?, ?, ?, ?)',
											[hmat.cod, hmat.des, hmat.ref, hmat.uni, hmat.est]
									)
							}

							for (let htab of content.htab) {
								transaction.executeSql(
										'insert into htab (emp,cod,des,est) values (?, ?, ?, ?)',
										[htab.emp, htab.cod, htab.des, htab.est]
								)
							}
							for (let hpma of content.hpma) {
								transaction.executeSql(
										'insert into hpma (emp,tab,mat,des,ref,pve) values (?, ?, ?, ?, ?, ?)',
										[hpma.emp, hpma.tab, hpma.mat, hpma.des, hpma.ref, hpma.pve]
								)
							}
							for (let hcpa of content.hcpa) {
								transaction.executeSql(
										'insert into hcpa (cod,des,num,d01,d02,d03,d04,d05,d06,d07,d08,d09,d10,d11,d12) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
										[hcpa.cod, hcpa.des, hcpa.num, hcpa.d01, hcpa.d02, hcpa.d03, hcpa.d04, hcpa.d05, hcpa.d06, hcpa.d07, hcpa.d08, hcpa.d09, hcpa.d10, hcpa.d11, hcpa.d12]
								)
							}

							for (let hpev of content.hpev) {
								transaction.executeSql(
									'insert into hpev (num, dat, hor, dav, den, cli, ven, tot, cpa, tab, fco, vce, obs, sit, ori) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
									[hpev.num, hpev.dat, hpev.hor, hpev.dav, hpev.den, hpev.cli, hpev.ven, hpev.tot, hpev.cpa, hpev.tab, hpev.fco, hpev.vce, hpev.obs, hpev.sit, hpev.ori]
								)
							}

							for (let hive of content.hive) {
								transaction.executeSql(
									'insert into hive (num, seq, mat, des, uni, ref, den, qtd, tab, pre, dsc, com, comrep, rep, tot) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
									[hive.num, hive.seq, hive.mat, hive.des, hive.uni, hive.ref, hive.den, hive.qtd, hive.tab, hive.pre, hive.dsc, hive.com, hive.comrep, hive.rep, hive.tot]
								)
							}
					})

					await AppStorage.saveParamsInfo({
						diaven: content.diaven,
						cpaesp: content.cpaesp,
						obspad: content.obspad,
						tabpad: content.tabpad,
					})
					await AppStorage.saveSyncInfo({ dat: dtoc(), hor: formatTime()})

					_refresh()

					delayedAlert('Aplicativo sincronizado com sucesso!')
				}
			})
			.finally(() => setLoading(false))
		})
	})
	.catch((error) => delayedAlert('Atenção', error.message))
}

export async function resetDatabaseStructure() {
	await transactionAsync(transaction => {
			transaction.executeSql('drop table if exists hcli')
			transaction.executeSql('create table if not exists hcli (cod integer primary key, raz varchar(40), fan varchar(40), cpf varchar(14), cpj varchar(20), end varchar(40), nue varchar(10), coe varchar(10), bai varchar(30), cid varchar(32), est varchar(2), cep varchar(10), tel varchar(30), cel varchar(30), cpx varchar(20))')

			transaction.executeSql('drop table if exists hrep')
			transaction.executeSql('create table if not exists hrep (cod integer primary key, raz varchar(40))')

			transaction.executeSql('drop table if exists hmat')
			transaction.executeSql("create table if not exists hmat (cod integer, des varchar(40), ref varchar(20) default '', uni varchar(2), est decimal(9,2))")

			transaction.executeSql('drop table if exists htab')
			transaction.executeSql('create table if not exists htab (emp integer, cod integer, des varchar(40), est varchar(80), primary key(emp,cod))')

			transaction.executeSql('drop table if exists hpma')
			transaction.executeSql('create table if not exists hpma (emp integer, tab integer, mat integer, des varchar(40), ref varchar(20), pve decimal(9,2), primary key(emp,tab,mat))')

			transaction.executeSql('drop table if exists hcpa')
			transaction.executeSql('create table if not exists hcpa (cod integer primary key, des varchar(40), num integer, d01 integer, d02 integer, d03 integer, d04 integer, d05 integer, d06 integer, d07 integer, d08 integer, d09 integer, d10 integer, d11 integer, d12 integer)')

			transaction.executeSql('drop table if exists hpev')
			transaction.executeSql("create table if not exists hpev (num varchar(9) default 'appkey', dat varchar(10), hor varchar(5), dav varchar(10), den varchar(10), cli integer, ven integer, tot decimal(9,2), cpa integer, tab integer, fco varchar(3), vce varchar(150), ori varchar(8), obs text, sit varchar(9), flg integer default 0, new integer default 0)")
			transaction.executeSql("create trigger hpev_appkey after insert on hpev begin update hpev set num = ('PV' || substr('000000', 1, 6 - length((select count(*) from hpev where new = 1))) || (select count(*) from hpev where new = 1)) where (num = 'appkey') and (new = 1); end;")

			transaction.executeSql('drop table if exists hive')
			transaction.executeSql('create table if not exists hive (num varchar(9), seq integer default 0, mat integer, des varchar(40), uni varchar(3), ref varchar(20), den varchar(10), qtd decimal(7, 4), tab decimal(9, 4), pre decimal(9, 4), dsc decimal(5, 2), com decimal(5, 2), comrep decimal(5, 2), rep integer, tot decimal(9, 2), flg integer default 0, new integer default 0)')
			transaction.executeSql('create trigger hive_increment after insert on hive begin update hive set seq = (select max(seq) from hive where num = new.num) + 1 where num = new.num and seq = 0; end;')
	})
}
