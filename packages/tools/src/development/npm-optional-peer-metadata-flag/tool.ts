import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packageName: string;
  readonly peerNames: readonly string[];
  readonly optionalMetadataNames: readonly string[];
};
export type Output = {
  readonly declaredPeer: boolean;
  readonly markedOptional: boolean;
  readonly optionalPeer: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageName: { type: "string", maxLength: 8192 },
    peerNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    optionalMetadataNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["packageName", "peerNames", "optionalMetadataNames"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    declaredPeer: { type: "boolean" },
    markedOptional: { type: "boolean" },
    optionalPeer: { type: "boolean" },
  },
  required: ["declaredPeer", "markedOptional", "optionalPeer"],
} as const;
/** Join supplied peer-dependency keys and keys explicitly carrying optional=true metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packageName, peerNames, optionalMetadataNames } = request;
  const compute = (): Output => {
    H.domain(packageName.length > 0);
    const declaredPeer = peerNames.includes(packageName),
      markedOptional = optionalMetadataNames.includes(packageName);
    return {
      declaredPeer,
      markedOptional,
      optionalPeer: declaredPeer && markedOptional,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    packageName: "react",
    peerNames: ["react"],
    optionalMetadataNames: ["react"],
  },
  output: { declaredPeer: true, markedOptional: true, optionalPeer: true },
} satisfies ToolExample<Input, Output>;
export const npmOptionalPeerMetadataFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/npm-optional-peer-metadata-flag",
    title: "npm Optional Peer Metadata Flag Tool",
    description:
      "Join supplied peer-dependency keys and keys explicitly carrying optional=true metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packageName: { type: "string", maxLength: 8192 },
        peerNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        optionalMetadataNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["packageName", "peerNames", "optionalMetadataNames"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        declaredPeer: { type: "boolean" },
        markedOptional: { type: "boolean" },
        optionalPeer: { type: "boolean" },
      },
      required: ["declaredPeer", "markedOptional", "optionalPeer"],
    },
    ports: {
      inputs: [
        {
          id: "packageName",
          label: "Package Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "peerNames",
          label: "Peer Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "optionalMetadataNames",
          label: "Optional Metadata Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "declaredPeer",
          label: "Declared Peer",
          valueType: { type: "boolean" },
        },
        {
          id: "markedOptional",
          label: "Marked Optional",
          valueType: { type: "boolean" },
        },
        {
          id: "optionalPeer",
          label: "Optional Peer",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = npmOptionalPeerMetadataFlagTool.execute;
export default npmOptionalPeerMetadataFlagTool;
