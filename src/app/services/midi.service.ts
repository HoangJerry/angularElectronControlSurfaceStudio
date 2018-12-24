import { Injectable,EventEmitter } from '@angular/core';
import {forkJoin} from 'rxjs'; 
//import WebMidi from 'webmidi';
//declare var $ :any;
// const navigator = require('web-midi-api');
var midi;
var names = [];
var outputs;
var self = this;
var inputs;
var data;
@Injectable({
  providedIn: 'root'
})
export class MidiService {
langUpdated:EventEmitter<string> = new EventEmitter();
model :any ={};
  constructor() { }

  turnMidiOn = () => {
		// need to assign navigator to a variable of type any,
		// prevents an error occurring when building the app
		let newNavigator: any;
		newNavigator = window.navigator;

		if (newNavigator && newNavigator.requestMIDIAccess) {

	    newNavigator.requestMIDIAccess({
	        sysex: false // this defaults to 'false' and we won't be covering sysex in this article. 
	    }).then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));

		} else {
		    console.log("No MIDI support in your browser.");
		}
  }
 
	getMidiData = () => {
		if(data){
			this.model.data = data;
		}
		this.langUpdated.emit(this.model);
	}

	onMIDISuccess = (midiAccess) => {
    midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
    var inputs = midi.inputs.values();

    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = this.onMIDIMessage;
        
    }

    midi.onstatechange = this.onStateChange;
	}

	onStateChange = (Event) => {
		this.model.inputs = names;
		this.langUpdated.emit(this.model);
		var port = Event.port, state = port.state, name = port.name, type = port.type;
    if(type == "input") {
    	if(state == "connected") {
    		 if(names.indexOf(name) == -1){
        	names.push(name);
        	// need to re-initialise so that onmidimessage is applied again
        	this.turnMidiOn();
        }
    	}
    	else if(state == "disconnected") {
    		var idx = names.indexOf(name);
    		names.splice(idx, 1);
    		// need to re-initialise so that onmidimessage is applied again
    		this.turnMidiOn();
    	}
    }
	}

	onMIDIMessage = (message) => {
   	data = message.data; // this gives us our [command/channel, note, velocity] data. 
  	this.getMidiData();		
	}

	onMIDIFailure = (error) => {
	  // when we get a failed response, run this code
	  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
	}
}
