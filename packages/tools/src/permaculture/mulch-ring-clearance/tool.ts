import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mulchInnerRadius: number;
  readonly stemRadius: number;
};
export type Output = { readonly radialClearance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mulchInnerRadius: { type: "number", minimum: 0 },
    stemRadius: { type: "number", minimum: 0 },
  },
  required: ["mulchInnerRadius", "stemRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radialClearance: { type: "number" } },
  required: ["radialClearance"],
} as const;
/** Subtract explicit stem radius from mulch inner radius without choosing a horticultural clearance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mulchInnerRadius, stemRadius } = request;
  const compute = (): Output => {
    H.domain(mulchInnerRadius >= 0 && stemRadius >= 0, "mulchInnerRadius");
    return { radialClearance: mulchInnerRadius - stemRadius };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mulchInnerRadius: 20, stemRadius: 5 },
  output: { radialClearance: 15 },
} satisfies ToolExample<Input, Output>;
export const mulchRingClearanceTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["permaculture", "agriculture"],
      keywords: ["permaculture", "agriculture"],
    },
    id: "permaculture/mulch-ring-clearance",
    title: "Mulch Ring Clearance",
    description:
      "Subtract explicit stem radius from mulch inner radius without choosing a horticultural clearance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mulchInnerRadius: { type: "number", minimum: 0 },
        stemRadius: { type: "number", minimum: 0 },
      },
      required: ["mulchInnerRadius", "stemRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radialClearance: { type: "number" } },
      required: ["radialClearance"],
    },
    ports: {
      inputs: [
        {
          id: "mulchInnerRadius",
          label: "Mulch Inner Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stemRadius",
          label: "Stem Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radialClearance",
          label: "Radial Clearance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mulchRingClearanceTool.execute;
export default mulchRingClearanceTool;
