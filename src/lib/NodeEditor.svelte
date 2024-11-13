<script lang="ts">
	import NodeState from "./state/node.svelte.ts";
	import { sharedContext } from "./state/shared-context.svelte.ts";

	type Handle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';

	let {	node }: { node: NodeState} = $props();
	let handle: Handle | null = $state(null);
	let pointerId = $state<number | null>(null);

	function onPointerDown(event: PointerEvent, selectedHandle: Handle) {
		console.log('onPointerDown', selectedHandle);
		if (event.isPrimary) {
			node.isResizing = true;
			pointerId = event.pointerId;
			handle = selectedHandle;
		}
	}

	function onPointerMove(event: PointerEvent) {
		if (!handle) {
			return;
		}

		if (node.isResizing && event.pointerId === pointerId) {
			const minWidth = 5;
			let movementX = event.movementX / sharedContext.zoomLevel;
			if (handle.includes('w') && node.width - movementX < minWidth) {
				movementX = node.width - minWidth;
			} else if (handle.includes('e') && node.width + movementX < minWidth) {
				movementX = minWidth - node.width;
			}
			
			const minHeight = 5;
			let movementY = event.movementY / sharedContext.zoomLevel;
			if (handle.includes('n') && node.height - movementY < minHeight) {
				movementY = node.height - minHeight;
			} else if (handle.includes('s') && node.height + movementY < minHeight) {
				movementY = minHeight - node.height;
			}

			switch (handle) {
				case 'nw':
					node.x += movementX;
					node.y += movementY;
					node.width -= movementX;
					node.height -= movementY;
					break;
				case 'n':
					node.y += movementY;
					node.height -= movementY;
					break;
				case 'ne':
					node.y += movementY;
					node.width += movementX;
					node.height -= movementY;
					break;
				case 'w':
					node.x += movementX;
					node.width -= movementX;
					break;
				case 'e':
					node.width += movementX;
					break;
				case 'sw':
					node.x += movementX;
					node.width -= movementX;
					node.height += movementY;
					break;
				case 's':
					node.height += movementY;
					break;
				case 'se':
					node.width += movementX;
					node.height += movementY;
					break;
			}
		}
	}

	function onPointerUp(event: PointerEvent) {
		if (event.pointerId === pointerId) {
			node.isResizing = false;
			pointerId = null;
			handle = null;
		}
	}
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} />

<!-- Selection Outline -->
<g transform="translate(0.5,0.5)" style="cursor: move; visibility: visible; display: inline;"
	><rect
		x={node.x}
		y={node.y}
		width={node.width}
		height={node.height}
		fill="none"
		stroke="#00a8ff"
		stroke-dasharray="3 3"
		pointer-events="none"
	></rect></g
>

<!-- Handles -->
{#if !node.isMoving}
	<g style="cursor: nw-resize;" onpointerdown={(event) => onPointerDown(event, 'nw')}
		><image
			x={node.x - 21}
			y={node.y - 21}
			width="18"
			height="18"
			xlink:href="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg=="
			preserveAspectRatio="none"
		></image></g
	><g style="cursor: n-resize;" onpointerdown={(event) => onPointerDown(event, 'n')}
		><image
			x={node.x + node.width / 2 - 9}
			y={node.y - 21}
			width="18"
			height="18"
			xlink:href="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg=="
			preserveAspectRatio="none"
		></image></g
	><g style="cursor: ne-resize;" onpointerdown={(event) => onPointerDown(event, 'ne')}
		><image
			x={node.x + node.width + 3}
			y={node.y - 21}
			width="18"
			height="18"
			xlink:href="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg=="
			preserveAspectRatio="none"
		></image></g
	><g style="cursor: w-resize;" onpointerdown={(event) => onPointerDown(event, 'w')}
		><image
			x={node.x - 21}
			y={node.y + node.height / 2 - 9}
			width="18"
			height="18"
			xlink:href="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg=="
			preserveAspectRatio="none"
		></image></g
	><g style="cursor: e-resize;" onpointerdown={(event) => onPointerDown(event, 'e')}
		><image
			x={node.x + node.width + 3}
			y={node.y + node.height / 2 - 9}
			width="18"
			height="18"
			xlink:href="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg=="
			preserveAspectRatio="none"
		></image></g
	><g style="cursor: sw-resize;" onpointerdown={(event) => onPointerDown(event, 'sw')}
		><image
			x={node.x - 21}
			y={node.y + node.height + 3}
			width="18"
			height="18"
			xlink:href="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg=="
			preserveAspectRatio="none"
		></image></g
	><g style="cursor: s-resize;" onpointerdown={(event) => onPointerDown(event, 's')}
		><image
			x={node.x + node.width / 2 - 9}
			y={node.y + node.height + 3}
			width="18"
			height="18"
			xlink:href="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg=="
			preserveAspectRatio="none"
		></image></g
	><g style="cursor: se-resize;" onpointerdown={(event) => onPointerDown(event, 'se')}
		><image
			x={node.x + node.width + 3}
			y={node.y + node.height + 3}
			width="18"
			height="18"
			xlink:href="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzI5YjZmMiIvPjwvc3ZnPg=="
			preserveAspectRatio="none"
		></image></g
	>
{/if}
