import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly screenRejectMass: number;
  readonly totalScreenedMass: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    screenRejectMass: { type: "number", minimum: 0 },
    totalScreenedMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["screenRejectMass", "totalScreenedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicit screen-reject mass to compatible total screened mass without assessing compost quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { screenRejectMass, totalScreenedMass } = request;
  const compute = (): Output => {
    (H.domain(totalScreenedMass > 0, "totalScreenedMass"), totalScreenedMass);
    H.domain(
      screenRejectMass >= 0 && screenRejectMass <= totalScreenedMass,
      "screenRejectMass",
    );
    return {
      fraction: screenRejectMass / totalScreenedMass,
      remainder: totalScreenedMass - screenRejectMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { screenRejectMass: 30, totalScreenedMass: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const compostScreenedRejectShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["permaculture", "agriculture"],
      keywords: ["permaculture", "agriculture"],
    },
    id: "permaculture/compost-screened-reject-share",
    title: "Compost Screened Reject Share",
    description:
      "Normalize explicit screen-reject mass to compatible total screened mass without assessing compost quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        screenRejectMass: { type: "number", minimum: 0 },
        totalScreenedMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["screenRejectMass", "totalScreenedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "screenRejectMass",
          label: "Screen Reject Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalScreenedMass",
          label: "Total Screened Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = compostScreenedRejectShareTool.execute;
export default compostScreenedRejectShareTool;
