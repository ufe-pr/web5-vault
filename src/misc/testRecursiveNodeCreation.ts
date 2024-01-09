import protocols from "@/protocols";
import { FileNodeStoreSchema } from "@/types";
import { Web5 } from "@web5/api";

export async function testRecursiveNodeCreation(web5: Web5) {
  // Create root node
  const root: FileNodeStoreSchema = {
    name: "root",
    nodeType: "directory",
    parent: "",
  };
  const { status, record: rootRecord } = await web5.dwn.records.create({
    data: root,
    message: {
      protocol: protocols.personalDrive.protocol,
      protocolPath: "fileNode",
      schema: protocols.personalDrive.types.fileNode.schema,
    },
  });

  if (status.code >= 400 || !rootRecord) {
    throw new Error(`Error creating root node: ${status.detail}`);
  }

  // Create child node
  const child: FileNodeStoreSchema = {
    name: "child 1",
    nodeType: "directory",
    parent: rootRecord.id,
  };
  const { status: status1, record: child1Record } =
    await web5.dwn.records.create({
      data: child,
      message: {
        protocol: protocols.personalDrive.protocol,
        protocolPath: "fileNode/fileNode",
        schema: protocols.personalDrive.types.fileNode.schema,
        parentId: rootRecord.id,
        contextId: rootRecord.id,
      },
    });

  if (status1.code >= 400 || !child1Record) {
    throw new Error(`Error creating child1 node: ${status1.detail}`);
  }

  // // Create child node
  // const child2: FileNode = {
  //   name: "child 2",
  //   nodeType: "directory",
  //   parent: `${rootRecord.id}/${child1Record.id}`,
  // };
  // const { status: status2, record: child2Record } =
  //   await web5.dwn.records.create({
  //     data: child2,
  //     message: {
  //       protocol: protocols.personalDrive.protocol,
  //       protocolPath: "fileNode/fileNode/fileNode",
  //       schema: protocols.personalDrive.types.fileNode.schema,
  //       parentId: child1Record.id,
  //       contextId: child1Record.id,
  //     },
  //   });

  // if (status2.code >= 400 || !child2Record) {
  //   throw new Error(`Error creating child2 node: ${status2.detail}`);
  // }

  // // Create child node
  // const child3: FileNode = {
  //   name: "child 3",
  //   nodeType: "directory",
  //   parent: `${rootRecord.id}/${child1Record.id}/${child2Record.id}`,
  // };
  // const { status: status3, record: child3Record } =
  //   await web5.dwn.records.create({
  //     data: child3,
  //     message: {
  //       protocol: protocols.personalDrive.protocol,
  //       protocolPath: "fileNode/fileNode",
  //       schema: protocols.personalDrive.types.fileNode.schema,
  //       parentId: child2Record.id,
  //       contextId: child2Record.id,
  //     },
  //   });

  // if (status3.code >= 400 || !child3Record) {
  //   throw new Error(`Error creating child3 node: ${status3.detail}`);
  // }

  // // Create child node
  // const child4: FileNode = {
  //   name: "child 4",
  //   nodeType: "directory",
  //   parent: `${rootRecord.id}/${child1Record.id}/${child2Record.id}/${child3Record.id}`,
  // };
  // const { status: status4, record: child4Record } =
  //   await web5.dwn.records.create({
  //     data: child4,
  //     message: {
  //       protocol: protocols.personalDrive.protocol,
  //       protocolPath: "fileNode/fileNode",
  //       schema: protocols.personalDrive.types.fileNode.schema,
  //       parentId: child3Record.id,
  //       contextId: child3Record.id,
  //     },
  //   });

  // if (status4.code >= 400 || !child4Record) {
  //   throw new Error(`Error creating child4 node: ${status4.detail}`);
  // }

  console.log("Root node:", rootRecord);
  console.log("Child 1 node:", child1Record);
  // console.log("Child 2 node:", child2Record);
  // console.log("Child 3 node:", child3Record);
  // console.log("Child 4 node:", child4Record);
}
