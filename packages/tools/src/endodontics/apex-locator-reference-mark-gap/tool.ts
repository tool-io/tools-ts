import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMarkPosition: number;
  readonly referenceMarkPosition: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMarkPosition: { type: "number" },
    referenceMarkPosition: { type: "number" },
  },
  required: ["observedMarkPosition", "referenceMarkPosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Compare explicit apex-locator reference-mark positions without estimating anatomical apex position or recommending instrumentation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMarkPosition, referenceMarkPosition } = request;
  const compute = (): Output => {
    return { signedGap: observedMarkPosition - referenceMarkPosition };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMarkPosition: 21, referenceMarkPosition: 20 },
  output: { signedGap: 1 },
} satisfies ToolExample<Input, Output>;
export const apexLocatorReferenceMarkGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endodontics", "health and medicine"],
      keywords: ["endodontics", "health and medicine"],
    },
    id: "endodontics/apex-locator-reference-mark-gap",
    title: "Apex Locator Reference Mark Gap",
    description:
      "Compare explicit apex-locator reference-mark positions without estimating anatomical apex position or recommending instrumentation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMarkPosition: { type: "number" },
        referenceMarkPosition: { type: "number" },
      },
      required: ["observedMarkPosition", "referenceMarkPosition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "observedMarkPosition",
          label: "Observed Mark Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMarkPosition",
          label: "Reference Mark Position",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = apexLocatorReferenceMarkGapTool.execute;
export default apexLocatorReferenceMarkGapTool;
