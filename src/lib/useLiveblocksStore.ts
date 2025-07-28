import { useEffect, useState } from "react";
import { useRoom, useSelf } from "@liveblocks/react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { TLStoreWithStatus, createTLStore, defaultShapeUtils } from "tldraw";
import * as Y from "yjs";

// Simple hook for creating a tldraw store with Liveblocks integration
export function useLiveblocksStore({ roomId }: { roomId: string }) {
	const room = useRoom();
	const self = useSelf();

	// Create a Yjs document
	const [doc] = useState(() => new Y.Doc());
	
	// Create a tldraw store
	const [store] = useState(() => createTLStore({ 
		shapeUtils: defaultShapeUtils
	}));

	// Create a state to hold the store with its connection status
	const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({ 
		status: 'loading' 
	});

	// Create the Liveblocks provider
	const [provider] = useState(() => new LiveblocksYjsProvider(room, doc));

	useEffect(() => {
		// Set up the store with synced status when everything is ready
		if (store && provider) {
			setStoreWithStatus({ 
				store, 
				status: 'synced-local'
			});
		}

		// Clean up on unmount
		return () => {
			provider?.destroy();
		};
	}, [store, provider]);

	// Update user presence information
	useEffect(() => {
		if (!self || !provider) return;

		const awareness = provider.awareness;
		if (awareness && self.info) {
			awareness.setLocalStateField('user', self.info);
		}

		return () => {
			if (awareness) {
				awareness.setLocalStateField('user', null);
			}
		};
	}, [self, provider]);

	return storeWithStatus;
}