class SharedContext {
	zoomLevel = $state<number>(1);
}

export const sharedContext = new SharedContext();