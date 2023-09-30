import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { Regex, type SomeCompanionConfigField } from '@companion-module/base'
import osc from 'osc';
const { UDPPort } = osc
import {parseSnapshot} from './schema/parse.js'
import crypto from 'crypto'

class ModuleInstance extends InstanceBase<any> {
	oscClient: typeof UDPPort = null
	needStats = false
	mixerState = {}
	
	constructor(internal: any) {
		super(internal)
	}

	async init(config: any) {
		var schema = parseSnapshot();
		// this.log('debug', schema.toString());
		schema.channels.forEach((channelNumber, channel) => {
			this.log('debug', channelNumber + ": " + channel.toString());
		});
		schema.auxes.forEach((auxNumber, aux) => {
			this.log('debug', auxNumber + ": " + aux.toString());
		});
		schema.busses.forEach((busNumber, bus) => {
			this.log('debug', busNumber + ": " + bus.toString());
		});

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.connect(config) // connect to device
	}
	
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: any) {
		this.connect(config)
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				tooltip: 'The IP of the WING console',
				width: 6,
				regex: Regex.IP
			}
		]
	}

	updateActions() {
		
	}

	updateFeedbacks() {
		
	}

	updateVariableDefinitions() {

	}

	connect(config: any) {
		this.log('debug', 'connect')
		if (this.oscClient) {
			this.oscClient.close()
			this.oscClient = null
			this.log('debug', 'Disconnected')
			this.updateStatus(InstanceStatus.Disconnected)
		}
		this.updateStatus(InstanceStatus.Connecting)
		if (!config.host) {
			this.log('error', 'No host set')
			this.updateStatus(InstanceStatus.BadConfig, 'No host set')
			return
		}
		// Get random port so we can have multiple instances
		var port = 10024 + crypto.randomBytes(2).readUInt16LE(0)
		this.oscClient = new UDPPort({
			localAddress: '0.0.0.0',
			localPort: port,
			remoteAddress: config.host,
			remotePort: 2223,
			metadata: true
		})
		this.log('debug', 'Local port: ' + this.oscClient.options.localPort)
		this.oscClient.on('ready', () => {
			this.log('debug', 'Connected')
			this.updateStatus(InstanceStatus.Ok)
		})
		this.oscClient.on('error', (err: Error) => {
			this.log('error', "Error: " + err.message)
			this.updateStatus(InstanceStatus.UnknownError, err.message)
		})
		this.oscClient.on('message', this.onOscMessage.bind(this))
		this.oscClient.open()
	}

	onOscMessage(args: string, address: string) {
		this.log('debug', 'OSC message: ' + address + ' ' + args)
	}

}

runEntrypoint(ModuleInstance, [])
