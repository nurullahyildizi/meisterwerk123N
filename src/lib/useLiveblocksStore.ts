
import { useYjsStore } from "tldraw/yjs";
import { useRoom, useSelf } from '@liveblocks/react'
import { useEffect, useState } from 'react'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import { TLSchema } from "tldraw";
import { useYjsStore } from "tldraw/yjs";

import { useRoom, useSelf } from "@liveblocks/react";
import { useEffect, useState } from "react";

// This function creates a default schema for the tldraw store.
// It's used to define the structure of the data that will be stored.
function createDefaultSchema(): TLSchema {
	const serializedSchema = {
		recordVersions: {
			asset: { version: 1, subTypeKey: 'type', subTypeVersions: { image: 2, video: 2, bookmark: 0 } },
			camera: { version: 1 },
			document: { version: 2 },
			instance: { version: 24 },
			instance_page_state: { version: 5 },
			page: { version: 1 },
			shape: {
				version: 4,
				subTypeKey: 'type',
				subTypeVersions: {
					group: 0, text: 1, bookmark: 2, draw: 1, geo: 8, note: 5, line: 4, frame: 0, arrow: 3, highlight: 0, embed: 4, image: 3, video: 2,
				},
			},
			instance_presence: { version: 5 },
			pointer: { version: 1 },
		},
		storeVersion: 4,
		schemaVersion: 1,
	} as const satisfies SerializedSchema
	return TLSchema.create(serializedSchema)
}


// This is the core hook that connects tldraw to Liveblocks.
export function useLiveblocksStore({ roomId }: { roomId: string }) {
	// Create a tldraw store. This is a local store that holds the whiteboard data.
	const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils, schema: createDefaultSchema() }))
	
    // Create a state to hold the store with its connection status.
	const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({ status: 'loading' })

	const room = useRoom()
	const self = useSelf()

    // Use the yjs store hook to connect the tldraw store to a Yjs document.
	const { yjsStore, yjsState } = useYjsStore({
		roomId,
		store,
		// The provider connects the Yjs document to the Liveblocks room.
		provider: new LiveblocksYjsProvider(room, room.getDoc()),
	})

	const { status } = yjsState

    // Update user presence information (e.g., name, color) in the Liveblocks room.
	useEffect(() => {
		if (!self || !yjsStore) return

		const awareness = yjsStore.awareness
		awareness.setLocalStateField('user', self.info)

		return () => {
			awareness.setLocalStateField('user', undefined)
		}
	}, [self, yjsStore])

    // Update the store status based on the yjs connection state.
	useEffect(() => {
		if (status === 'synced' && yjsStore) {
			setStoreWithStatus({ store: yjsStore, status: 'synced', error: null })
		} else if (status === 'error') {
			setStoreWithStatus({ status: 'error', error: new Error('Could not connect to yjs') })
		} else {
			setStoreWithStatus({ status: 'loading' })
		}
	}, [status, yjsStore])

	return storeWithStatus
}
