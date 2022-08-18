import {
	DEVELOPMENT_SERVER_IP, DEVELOPMENT_SERVER_PORT,
	GSA_SERVER_IP, GSA_SERVER_PORT,
	PRODUCTION_SERVER_IP, PRODUCTION_SERVER_PORT } from '@env'

const devValues = {
	ip: DEVELOPMENT_SERVER_IP,
	port: DEVELOPMENT_SERVER_PORT
}

const prodValues = {
	ip: PRODUCTION_SERVER_IP,
	port: PRODUCTION_SERVER_PORT
}

const gsaValues = {
	ip: GSA_SERVER_IP,
	port: GSA_SERVER_PORT
}

//export default __DEV__ ? devValues : prodValues
export default gsaValues
