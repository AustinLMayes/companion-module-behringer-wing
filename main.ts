import { InstanceBase, runEntrypoint, InstanceStatus, type CompanionVariableDefinition, type CompanionVariableValues, type CompanionActionDefinition, type CompanionActionDefinitions, type CompanionFeedbackDefinitions, type OSCSomeArguments, type OSCMetaArgument, type OSCArgument } from '@companion-module/base'
import { Regex, type SomeCompanionConfigField } from '@companion-module/base'
import osc from 'osc';
const { UDPPort } = osc
import crypto from 'crypto'
import fs from 'fs'
import { MixerState } from './mixer_state.js';
import { setupIO } from './schema/io.js';
import { setupChannels } from './schema/channels.js';
import { setupBusses } from './schema/busses.js';
import { setupMains } from './schema/mains.js';
import { setupMatricies } from './schema/matricies.js';
import { setupMuteGroups } from './schema/mute_groups.js';

export class ModuleInstance extends InstanceBase<any> {
	oscClient: typeof UDPPort = null
	needStats = false
	mixerState: MixerState = new MixerState(this)
	runningFades: any = {}
	pendingOscRequests: any = {}
	
	constructor(internal: any) {
		super(internal)
		this.log('debug', 'ok')
	}

	async init(config: any) {
		// this.log('debug', "Finished parsing schema" + schema);

		var actions: CompanionActionDefinitions = {}
		var variables: CompanionVariableDefinition[] = []
		var feedbacks: CompanionFeedbackDefinitions = {}
		
		this.log('debug', 'go')
		setupIO(this, actions, variables, feedbacks)
		setupChannels(this, actions, variables, feedbacks)
		setupBusses(this, actions, variables, feedbacks)
		setupMains(this, actions, variables, feedbacks)
		setupMatricies(this, actions, variables, feedbacks)
		setupMuteGroups(this, actions, variables, feedbacks)

		this.setActionDefinitions(actions)
		this.setVariableDefinitions(variables)
		this.setFeedbackDefinitions(feedbacks)
		this.connect(config) // connect to device

		this.log('info', 'Parsing JSON schema')
		this.mixerState.fromJson(fs.readFileSync("/Users/austinmayes/Desktop/Snapshot.snap", "utf8"))
		this.log('info', 'Parsed JSON schema')

		setInterval(this.updateFades.bind(this), 100)

		this.requestOSCValue("/?", (args) => {})
		// this.requestOSCValue("/mtx/4/dir/1/lvl", (args) => {})
		// this.requestOSCValue("/main/3/send/mx4/lvl", (args) => {})
		// this.requestOSCValue("/mtx/5/dir/1/lvl")
		// this.requestOSCValue("/main/3/send/mx5/lvl")
		this.traverseWingTree("")

		this.subscribe()
		setInterval(this.subscribe.bind(this), 10 * 1000)
	}

	private subscribe() {
		this.sendOSCString("/*S", "")
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
		console.log('info', "Port: " + port);
		this.oscClient = new UDPPort({
			localAddress: '0.0.0.0',
			localPort: port,
			remoteAddress: config.host,
			remotePort: 2223,
			metadata: true
		})
		this.log('info', 'Local port: ' + this.oscClient.options.localPort)
		this.oscClient.on('ready', () => {
			this.log('info', 'Connected')
			this.updateStatus(InstanceStatus.Ok)
		})
		this.oscClient.on('error', (err: Error) => {
			this.log('error', "Error: " + err.message)
			this.updateStatus(InstanceStatus.UnknownError, err.message)
		})
		this.oscClient.on('message', (oscMessage) => {
			this.onOscMessage(oscMessage.address, oscMessage.args)
		});
		this.oscClient.open()
	}

	onOscMessage(address: string, args: OSCArgument[]) {
		if (this.pendingOscRequests[address]) {
			var callback = this.pendingOscRequests[address]
			delete this.pendingOscRequests[address]
			callback(args)
		}
		var arg = args[0]
		this.log('info', 'OSC message: ' + address + ' ' + arg.value)
		this.mixerState.set(address, arg.value)
	}
	
	sendOSC(address: string, args: Array<OSCMetaArgument>) {
		address = address.toLowerCase()
		this.log('info', 'Sending OSC message: ' + address + ' ' + (args.length == 0 ? "" : args[0].value))
		this.oscClient.send({
			address: address,
			args: args
		});
		if (args.length > 0) {
			if (args[0].value != null && args[0].value != undefined && args[0].value != "") {
				this.mixerState.set(address, args[0].value)
			}
		}
		this.log('info', 'Sent OSC message: ' + address + ' ' + (args.length == 0 ? "" : args[0].value))
	}

	sendOSCFloatingPoint(address: string, args: number) {
		this.sendOSC(address, [{type: 'f', value: args}])
	}

	sendOSCInteger(address: string, args: number) {
		this.sendOSC(address, [{type: 'i', value: args}])
	}

	sendOSCString(address: string, args: string) {
		this.sendOSC(address, [{type: 's', value: args}])
	}
	
	sendOSCBoolean(address: string, args: boolean) {
		this.sendOSC(address, [{type: 'i', value: args ? 1 : 0}])
	}

	requestOSCValue(address: string, callback: (value: OSCArgument[]) => void = null) {
		this.pendingOscRequests[address] = callback
		this.sendOSC(address, [])
	}

	fadeValueTo(address: string, value: number, duration: number, ramp: boolean = true) {
		if (duration <= 0) {
			this.sendOSCFloatingPoint(address, value)
			return
		}
		var current = this.mixerState.get(address)
		this.runningFades[address] = {current: current, target: value, duration: duration * 1000, startTime: Date.now(), ramp: ramp}
	}

	private updateFades() {
		var now = Date.now()
		for (var address in this.runningFades) {
			var fade = this.runningFades[address]
			var elapsed = now - fade.startTime
			if (elapsed >= fade.duration) {
				this.sendOSCFloatingPoint(address, fade.target)
				delete this.runningFades[address]
			} else {
				var progress = elapsed / fade.duration
				var value = fade.current + (fade.target - fade.current) * progress
				// if (fade.ramp) {
				// 	var rampProgress = Math.pow(progress, 2)
				// 	value = fade.current + (fade.target - fade.current) * rampProgress
				// }
				this.sendOSCFloatingPoint(address, value)
			}
		}
	}

	private traverseWingTree(path: string): void {
		this.requestOSCValue("/" + path, (args) => {
			if (args.length > 1) {
				for (var i = 0; i < args.length; i++) {
					if (args[i].type != 's') {
						return
					}
				}
				for (var i = 0; i < args.length; i++) {
					this.traverseWingTree(path + "/" + args[i].value)
				}
			}
		})
	}
}

runEntrypoint(ModuleInstance, [])
