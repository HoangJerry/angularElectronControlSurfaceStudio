export class Script {
  id : number = 0;
  script_id: number;
  type: string = 'script';
  name: string;
  controller_input: string;
  controller_id: number;
  has_child: number;
  file_name: string;
}