<script lang="ts">
	import NodeState from "./state/node.svelte.ts";
	import { sharedContext } from "./state/shared-context.svelte.ts";

	type $Props = {
		node: NodeState;
		onSelect: () => void;
	};

	let {	node, onSelect }: $Props = $props();
	let pointerId = $state<number | null>(null);

	function onPointerDown(event: PointerEvent) {
		if (event.isPrimary) {
			node.isMoving = true;
			pointerId = event.pointerId;
		}
	}

	function onPointerMove(event: PointerEvent) {
		if (node.isMoving && event.pointerId === pointerId) {
			node.x += event.movementX / sharedContext.zoomLevel;
			node.y += event.movementY / sharedContext.zoomLevel;
			onSelect();
		}
	}

	function onPointerUp(event: PointerEvent) {
		if (event.pointerId === pointerId) {
			node.isMoving = false;
			pointerId = null;
			onSelect();
		}
	}
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} />

<g transform="translate(0.5,0.5)" style="visibility: visible;" onpointerdown={onPointerDown}>
	<rect
		x={node.x}
		y={node.y}
		width={node.width}
		height={node.height}
		fill="rgb(255, 255, 255)"
		stroke="rgb(0, 0, 0)"
		stroke-width="1.15"
		pointer-events="all"
	></rect>
</g>
