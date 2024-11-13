<script lang="ts">
	import DiagramContainer from './DiagramContainer.svelte';
	import Sidebar from './Sidebar.svelte';
	import Node from './Node.svelte';
	import NodeEditor from './NodeEditor.svelte';
	import NodeState from "./state/node.svelte.ts";

	let nodes = $state([
		new NodeState(184.05, 204.95, 438, 100),
		new NodeState(241.55, 454.45, 138, 69),
		new NodeState(384.05, 503.95, 238, 200),
		new NodeState(184.05, 703.95, 138, 46),
	]);
	let selectedNode = $state<NodeState | undefined>(nodes[0]);

	let isInteracting = $derived.by(() => {
		return nodes.some((node) => node.isMoving || node.isResizing);
	});
</script>

<Sidebar />
<DiagramContainer allowInteraction={!isInteracting} onDeselect={() => selectedNode = undefined}>
	{#each nodes as node}
		<Node node={node} onSelect={() => selectedNode = node} />
	{/each}
	{#if selectedNode}
  	<NodeEditor node={selectedNode} />
	{/if}
</DiagramContainer>
