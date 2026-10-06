import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plotId: string;
  readonly protocolId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plotId: { type: "string", maxLength: 8192, minLength: 1 },
    protocolId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["plotId", "protocolId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an ordered observation-protocol key from supplied plot, protocol and version identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plotId, protocolId, version } = request;
  const compute = (): Output => {
    H.domain(plotId.length > 0, "plotId");
    H.domain(protocolId.length > 0, "protocolId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([plotId, protocolId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plotId: "P17", protocolId: "flower-count", version: "v2" },
  output: { token: '["P17","flower-count","v2"]' },
} satisfies ToolExample<Input, Output>;
export const agroecologyObservationProtocolKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/agroecology-observation-protocol-key",
    title: "Agroecology Observation Protocol Key",
    description:
      "Build an ordered observation-protocol key from supplied plot, protocol and version identifiers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plotId: { type: "string", maxLength: 8192, minLength: 1 },
        protocolId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["plotId", "protocolId", "version"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "plotId",
          label: "Plot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "protocolId",
          label: "Protocol Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agroecologyObservationProtocolKeyTool.execute;
export default agroecologyObservationProtocolKeyTool;
