class NodeState {
  x = $state<number>(0);
  y = $state<number>(0);
  width = $state<number>(0);
  height = $state<number>(0);

  isMoving = $state<boolean>(false);
  isResizing = $state<boolean>(false);
  isSelected = $state<boolean>(false);

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x
    this.y = y
    this.width = width
    this.height = height
	}
}  

export default NodeState;