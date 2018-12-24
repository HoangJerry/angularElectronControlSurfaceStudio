export class Mode {
  id: number;
  type: object;
  name: string;
  parent_id: number;
  level: number = 0;
  has_child: number = 0;
  icon: string;
 //  control_type: string = "Absolute";
 //  control_type_takeover_mode : string = "None";
 //  control_type_on: number = 127;
 //  control_type_off: number =0;
 //  control_type_first: number =1;
 //  control_type_last: number=127;
 //  control_type_reverse_mode: string='off';
 //  control_type_left:number=1;
	// control_type_right:number=127;
	// control_type_steps:number=20;
 //  // Track Selector
 //  track_type: string = "track";
 //  track_include_folded: boolean = true;
 //  track_number: number = 1;
 //  track_relative_to_session: boolean = true;
 //  // device selector
 //  device_selector: string = "number"
 //  device_selector_input: string;
 //  device_selector_chain_targeting: object = [];
 //  // Session Box
 //  session_box_width: number = 4;
 //  session_box_height: number = 2;
 //  session_box_clips: any = [];
 //  session_box_scenes: any = [];
 //  session_box_stops: any = [];
 //  session_box_stop_all: string;
 //  // Volume, pan, send, param, tempo
 //  minimum: number;
 //  maximum: number;
 //  // Highlight Navigation & Session Box Navigation
 //  nav_tracks_or_scenes: string = "tracks";
 //  highlight_navigation_type: string = "Select Device Number";
 //  highlight_number: number = 1;
}