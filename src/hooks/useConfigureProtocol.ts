import { web5Context } from "@/providers/web5";
import { Protocol, Web5 } from "@web5/api";
import { useContext, useEffect, useState } from "react";
import _ from "lodash";

async function installProtocol(
  did: string,
  web5: Web5,
  protocolDef: any
): Promise<Protocol | undefined> {
  let { protocols } = await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: protocolDef.protocol,
      },
    },
  });

  let protocol = protocols[0];

  if (protocol && _.isEqual(protocol.definition, protocolDef)) {
    console.log("Protocol already configured", protocol);
    return protocol;
  }

  const response = await web5.dwn.protocols.configure({
    message: {
      definition: protocolDef,
    },
  });
  response.protocol && (protocol = response.protocol);
  await protocol.send(did);
  console.log("Protocol configured", protocol);

  return protocol;
}

export function useConfigureProtocol(protocolDefinition: any) {
  const { connectedDid, web5 } = useContext(web5Context);
  const [protocol, setProtocol] = useState<Protocol | undefined>();

  useEffect(() => {
    if (connectedDid && web5) {
      installProtocol(connectedDid, web5, protocolDefinition).then(
        (protocol) => {
          if (protocol) setProtocol(protocol);
        }
      );
    }
  }, [connectedDid, web5, protocolDefinition]);

  return protocol;
}
