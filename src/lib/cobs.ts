import type { PeerId } from "@app/lib/project";

export interface Author {
  id: string;
}

export interface PeerIdentity {
  id: string;
  name: string;
  ens: {
    name: string;
  } | null;
}

export interface PeerInfo {
  id: PeerId;
  person?: PeerIdentity;
  delegate: boolean;
}

// Formats COBs Object Ids
export function formatObjectId(id: string): string {
  return id.substring(0, 11);
}
