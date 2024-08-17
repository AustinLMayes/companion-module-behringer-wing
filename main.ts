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

// variable used to define if we're writing data to the file
var writeData = false

export class ModuleInstance extends InstanceBase<any> {
	oscClient: typeof UDPPort = null
	needStats = false
	mixerState: MixerState = new MixerState(this)
	runningFades: any = {}
	pendingOscRequests: any = {}
	pendingTreeSearches: any = []
	fileContents: string = ""
	dataGatherIntervalId: any = null
	seenWing: boolean = false
	
	constructor(internal: any) {
		super(internal)
		this.log('debug', 'ok')
		this.log('debug', 'ok')
	}

	async init(config: any) {
		var actions: CompanionActionDefinitions = {}
		var variables: CompanionVariableDefinition[] = []
		var feedbacks: CompanionFeedbackDefinitions = {}
		
		this.log('debug', 'go')
		this.log('debug', 'go')
		setupIO(this, actions, variables, feedbacks)
		setupChannels(this, actions, variables, feedbacks)
		setupBusses(this, actions, variables, feedbacks)
		setupMains(this, actions, variables, feedbacks)
		setupMatricies(this, actions, variables, feedbacks)
		setupMuteGroups(this, actions, variables, feedbacks)

		actions["request_data"] = {
			name: "Request data",
			description: "Request data from the mixer and update variables",
			options: [{
				type: 'textinput',
				label: 'Path',
				id: 'path',
				default: '/ch/1/name'
			}],
			callback: function (action) {
				const path = action.options.path as string
				this.sendOSC(path.toLowerCase(), [])
			}
		}

		this.setActionDefinitions(actions)
		this.setVariableDefinitions(variables)
		this.setFeedbackDefinitions(feedbacks)
		this.connect(config) // connect to device

		// this.log('info', 'Parsing JSON schema')
		// this.mixerState.fromJson(fs.readFileSync("/Users/austinmayes/Desktop/Snapshot.snap", "utf8"))
		// this.log('info', 'Parsed JSON schema')

		setInterval(this.updateFades.bind(this), 100)

		if (writeData) {
			this.traverseWingTree("/")
		}

		setInterval(() => {
			for (var i = 0; i < 10; i++) {
				if (this.pendingTreeSearches.length == 0) {
					break
				}
				var path = this.pendingTreeSearches.shift()
				this.traverseWingTree(path)
			}
		}, 200)

		if (writeData) {
			// Write and flush contents to file every 5 seconds
			setInterval(() => {
				var stateFile = "/Users/austinlmayes/Desktop/test.txt"
				var contents = this.fileContents
				this.fileContents = ""
				fs.appendFileSync(stateFile, contents)
			}, 5 * 1000)
		}
	}

	private gatherData() {
		var requests: string[] = []

		// Gather some initial data for variables/feedbacks

		requests.push("/io/altsw")
		// Channels 1-40
		for (var i = 1; i <= 40; i++) {
			requests.push("/ch/" + i + "/name")
			requests.push("/ch/" + i + "/mute")
			requests.push("/ch/" + i + "/fdr")
		}

		// Aux 1-8
		for (var i = 1; i <= 8; i++) {
			requests.push("/aux/" + i + "/name")
			requests.push("/aux/" + i + "/mute")
			requests.push("/aux/" + i + "/fdr")
		}

		// bus 1-16
		for (var i = 1; i <= 16; i++) {
			requests.push("/bus/" + i + "/name")
			requests.push("/bus/" + i + "/mute")
			requests.push("/bus/" + i + "/fdr")
		}

		// main 1-4
		for (var i = 1; i <= 4; i++) {
			requests.push("/main/" + i + "/name")
			requests.push("/main/" + i + "/mute")
			requests.push("/main/" + i + "/fdr")
		}

		// matrix 1-8
		for (var i = 1; i <= 8; i++) {
			requests.push("/mtx/" + i + "/name")
			requests.push("/mtx/" + i + "/mute")
			requests.push("/mtx/" + i + "/fdr")
		}

		// dca 1-16
		for (var i = 1; i <= 16; i++) {
			requests.push("/dca/" + i + "/name")
			requests.push("/dca/" + i + "/mute")
			requests.push("/dca/" + i + "/fdr")
		}

		for (var i = 1; i <= 8; i++) {
			requests.push("/mgrp/" + i + "/name")
			requests.push("/mgrp/" + i + "/mute")
		}

		this.dataGatherIntervalId = setInterval(() => {
			if (requests.length == 0) {
				clearInterval(this.dataGatherIntervalId)
				this.updateStatus(InstanceStatus.Ok)
				this.subscribe()
				setInterval(this.subscribe.bind(this), 7 * 1000)
				return
			}
			// do 10 per second
			for (var i = 0; i < 10; i++) {
				if (requests.length == 0) {
					break
				}
				var path = requests.shift()
				this.sendOSC(path, [])
			}
		}, 500)
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

	reconnectTaskId: any = null

	connect(config: any) {
		this.log('debug', 'connect')
		if (this.dataGatherIntervalId) {
			clearInterval(this.dataGatherIntervalId)
			this.dataGatherIntervalId = null
		}
		if (this.reconnectTaskId) {
			clearInterval(this.reconnectTaskId)
			this.reconnectTaskId = null
		}
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
		var startTime = Date.now()
		this.reconnectTaskId = setInterval(() => {
			if (Date.now() - startTime >= 10000 && !this.seenWing) {
				clearInterval(this.reconnectTaskId)
				this.reconnectTaskId = null
				this.log('error', 'Failed to connect')
				this.updateStatus(InstanceStatus.ConnectionFailure, 'Failed to connect')
				this.connect(config)
				return
			}
		}, 1000)
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
			this.requestOSCValue("/?", (args) => {
				this.seenWing = true
				this.gatherData()
				clearInterval(this.reconnectTaskId)
			})
		})
		this.oscClient.on('error', (err: Error) => {
			this.log('error', "Error: " + err.message)
			this.updateStatus(InstanceStatus.UnknownError, err.message)
		})
		this.oscClient.on('message', (oscMessage) => {
			this.onOscMessage(oscMessage.address, oscMessage.args)
		});
		this.oscClient.on('message', (oscMessage) => {
			this.onOscMessage(oscMessage.address, oscMessage.args)
		});
		this.oscClient.open()
	}

	onOscMessage(address: string, args: OSCArgument[]) {
		address = address.toLowerCase()
		if (this.pendingOscRequests[address]) {
			var callback = this.pendingOscRequests[address]
			delete this.pendingOscRequests[address]
			callback(args)
		}
		var arg = args[0]
		this.log('info', 'OSC message: ' + address + ' ' + args.map((arg) => arg.value).join(' - '))
		this.mixerState.set(address, arg.value);
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
	}

	sendOSCFloatingPoint(address: string, args: number) {
		this.sendOSC(address, [{type: 'f', value: args}])
		this.sendOSC(address, [{type: 'f', value: args}])
	}

	sendOSCInteger(address: string, args: number) {
		this.sendOSC(address, [{type: 'i', value: args}])
		this.sendOSC(address, [{type: 'i', value: args}])
	}

	sendOSCString(address: string, args: string) {
		this.sendOSC(address, [{type: 's', value: args}])
		this.sendOSC(address, [{type: 's', value: args}])
	}
	
	sendOSCBoolean(address: string, args: boolean) {
		this.sendOSC(address, [{type: 'i', value: args ? 1 : 0}])
	}

	requestOSCValue(address: string, callback: (value: OSCArgument[]) => void = null) {
		address = address.toLowerCase()
		this.sendOSC(address, [])
		// Weird hack because the wing doesn't respond to /? with the correct address
		address = address == '/?' ? '/*' : address
		this.pendingOscRequests[address] = callback
	}

	fadeValueTo(address: string, value: number, duration: number, ramp: boolean = true) {
		if (duration <= 0) {
			this.sendOSCFloatingPoint(address, value)
			return
		}
		this.requestOSCValue(address, (args) => {
			var current = args[0].value
			this.runningFades[address] = {current: current, target: value, duration: duration * 1000, startTime: Date.now(), ramp: ramp}
		})	
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
				// if (fade.ramp) {
				// 	var rampProgress = Math.pow(progress, 2)
				// 	value = fade.current + (fade.target - fade.current) * rampProgress
				// }
				this.sendOSCFloatingPoint(address, value)
			}
		}
	}

	ignored = ["cfg" ,"$", "eq", "dyn", "gate", "flt", "tag", "col", "grp", "srcauto"]

	private traverseWingTree(path: string): void {
		for (var i = 0; i < this.ignored.length; i++) {
			if (path.includes(this.ignored[i])) {
				this.log('info', 'Ignoring ' + path)
				return
			}
		}

		this.requestOSCValue(path, (args) => {
			if (args.length > 1) {
				for (var i = 0; i < args.length; i++) {
					if (args[i].type != 's') {
						this.fileContents += path + "\n"
						return
					}
				}
				for (var i = 0; i < args.length; i++) {
					if (this.ignored.includes(args[i].value)) {
						continue
					}
					var subPath = path + "/" + args[i].value
					subPath = subPath.replace(/\/\//g, '/')
					this.pendingTreeSearches.push(subPath)
				}
			} else {
				this.fileContents += path + "\n"
			}
		})
	}
}

runEntrypoint(ModuleInstance, [])
