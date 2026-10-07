import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerId: string;
  readonly suppliedWasteCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedWasteCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["containerId", "suppliedWasteCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit waste-container label by source without prescribing handling or disposal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerId, suppliedWasteCode, source } = request;
  const compute = (): Output => {
    H.domain(containerId.length > 0, "containerId");
    H.domain(suppliedWasteCode.length > 0, "suppliedWasteCode");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([containerId, suppliedWasteCode, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    containerId: "CONT17",
    suppliedWasteCode: "W2",
    source: "Local key A",
  },
  output: { token: '["CONT17","W2","Local key A"]' },
} satisfies ToolExample<Input, Output>;
export const biosafetyWasteContainerLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosafety", "research and quality management"],
      keywords: ["biosafety", "research and quality management"],
    },
    id: "biosafety/biosafety-waste-container-label",
    title: "Biosafety Waste Container Label",
    description:
      "Qualify an explicit waste-container label by source without prescribing handling or disposal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedWasteCode: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["containerId", "suppliedWasteCode", "source"],
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
          id: "containerId",
          label: "Container Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedWasteCode",
          label: "Supplied Waste Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biosafetyWasteContainerLabelTool.execute;
export default biosafetyWasteContainerLabelTool;
