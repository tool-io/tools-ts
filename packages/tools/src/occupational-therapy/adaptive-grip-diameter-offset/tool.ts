import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDiameter: number;
  readonly suppliedReferenceDiameter: number;
};
export type Output = { readonly signedDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDiameter: { type: "number", minimum: 0 },
    suppliedReferenceDiameter: { type: "number", minimum: 0 },
  },
  required: ["recordedDiameter", "suppliedReferenceDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDifference: { type: "number" } },
  required: ["signedDifference"],
} as const;
/** Compare explicit adaptive-grip diameters without choosing a grip size or assessing suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDiameter, suppliedReferenceDiameter } = request;
  const compute = (): Output => {
    H.domain(
      recordedDiameter >= 0 && suppliedReferenceDiameter >= 0,
      "recordedDiameter",
    );
    return { signedDifference: recordedDiameter - suppliedReferenceDiameter };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDiameter: 35, suppliedReferenceDiameter: 30 },
  output: { signedDifference: 5 },
} satisfies ToolExample<Input, Output>;
export const adaptiveGripDiameterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-therapy",
        "occupational therapy",
        "health and medicine",
      ],
      keywords: ["occupational therapy", "health and medicine"],
    },
    id: "occupational-therapy/adaptive-grip-diameter-offset",
    title: "Adaptive Grip Diameter Offset",
    description:
      "Compare explicit adaptive-grip diameters without choosing a grip size or assessing suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDiameter: { type: "number", minimum: 0 },
        suppliedReferenceDiameter: { type: "number", minimum: 0 },
      },
      required: ["recordedDiameter", "suppliedReferenceDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedDifference: { type: "number" } },
      required: ["signedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDiameter",
          label: "Recorded Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceDiameter",
          label: "Supplied Reference Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDifference",
          label: "Signed Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = adaptiveGripDiameterOffsetTool.execute;
export default adaptiveGripDiameterOffsetTool;
