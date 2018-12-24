export class Mode {
  id: number;
  type: object;
  name: string;
  parent_id: number;
  level: number = 0;
  has_child: number = 0;
  icon: string;
}