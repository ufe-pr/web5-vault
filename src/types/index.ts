export type FileNodeStoreSchema = {
  name: string;
  metadata?: Record<string, any>;
} & (
  | {
      nodeType: "file";
      fileID?: string;
      fileType?: string;
      size: number;
    }
  | {
      nodeType: "directory";
      // TODO: Add validation for path to check whether nodes exists through that path
      // Format is `rootID/childID/childID/...`
      parent: string;
    }
);

export type FileNode = FileNodeStoreSchema & {
  id: string;
  createdAt: string;
  updatedAt: string;
  parent?: string;
};

export interface CatalogStoreSchema {
  name: string;
  description: string;
}

export type Catalog = CatalogStoreSchema & {
  id: string;
};
