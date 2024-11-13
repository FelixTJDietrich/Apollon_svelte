<script lang="ts">
	import * as d3 from 'd3';
	import { onMount, type Snippet } from 'svelte';
	import { sharedContext } from './state/shared-context.svelte.ts';

	type $Props = { 
		children: Snippet,
		allowInteraction: boolean,
		onDeselect: () => void,
	};

	let { children, allowInteraction, onDeselect }: $Props = $props();
	let pointerId = $state<number | null>(null);
	let isMoving = $state(false);
	let didMove = $state(false);

	let element: HTMLDivElement;
	let svg: SVGElement;
	let group: SVGGElement;
	let zoomBehavior: d3.ZoomBehavior<Element, unknown>;

	function onPointerDown(event: PointerEvent) {
		if (allowInteraction && event.isPrimary) {
			isMoving = true;
			pointerId = event.pointerId;
		}
	}

	function onPointerMove(event: PointerEvent) {
		if (allowInteraction && isMoving && event.pointerId === pointerId) {
			element.style.cursor = 'grabbing';
			element.scrollLeft -= event.movementX;
			element.scrollTop -= event.movementY;
			didMove = true;
		}
	}

	function onPointerUp(event: PointerEvent) {
		if (event.pointerId === pointerId) {
			isMoving = false;
			pointerId = null;
			element.style.cursor = 'default';
			if (!didMove) {
				onDeselect();
			}
			didMove = false;
		}
	}

	onMount(() => {
		// Initialize zoom behavior
		zoomBehavior = d3.zoom()
			.scaleExtent([0.1, 5]) // Set zoom scale limits
			.on("zoom", handleZoom)
			.filter(event => {
				console.log(event);
				const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
				if (!isMobile) {
					return event.ctrlKey
				} else {
					return allowInteraction;
				}
			}); // Allow vertical and horizontal scrolling


		// Apply zoom behavior to the SVG element
		d3.select(svg).call(zoomBehavior as any); // TypeScript workaround

		return () => {
			// Clean up if necessary
			d3.select(svg).on('.zoom', null);
		};
	});

	function handleZoom(event: any) {
		const transform: d3.ZoomTransform = event.transform;
		d3.select(group).attr('transform', transform.toString());
		sharedContext.zoomLevel = transform.k;
	}
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} />

<div
	class="geDiagramContainer geDiagramBackdrop prevent-select"
	style="inset: 0px 0px 0px 100px; touch-action: none; overflow: auto; cursor: default;"
	bind:this={element}
>
	<!-- <div
		class="geBackgroundPage"
		style="position: absolute; border-width: 1px; overflow: hidden; left: 0px; top: 50px; min-width: 1262px; min-height: 1054px; border-color: rgb(255, 255, 255); border-style: solid; background-color: rgb(255, 255, 255); background-image: url(&quot;data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDYiIGhlaWdodD0iNDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0NiIgaGVpZ2h0PSI0NiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDExLjUgTCA0NiAxMS41IE0gMTEuNSAwIEwgMTEuNSA0NiBNIDAgMjMgTCA0NiAyMyBNIDIzIDAgTCAyMyA0NiBNIDAgMzQuNSBMIDQ2IDM0LjUgTSAzNC41IDAgTCAzNC41IDQ2IiBmaWxsPSJub25lIiBzdHJva2U9IiNkMGQwZDAiIG9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTSA0NiAwIEwgMCAwIDAgNDYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+&quot;); background-position: -1px -1px; scale: {sharedContext.zoomLevel};" 
	></div> -->
	<svg
		style="left: 0px; top: 0px; width: 100%; height: 100%; display: block; min-width: 1362px; min-height: 1254px; position: absolute;"
		bind:this={svg}
		onpointerdown={onPointerDown}
	>
		<g bind:this={group}>
			{@render children()}
		</g>
	</svg>
</div>

<style>
	.prevent-select {
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
	}
</style>