import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstShare: number;
  readonly suppliedComplement: number;
};
export type Output = {
  readonly expectedComplement: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstShare: { type: "number", minimum: 0, maximum: 1 },
    suppliedComplement: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["firstShare", "suppliedComplement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedComplement: { type: "number" },
    gap: { type: "number" },
  },
  required: ["expectedComplement", "gap"],
} as const;
/** Calculate blend share complement gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstShare, suppliedComplement } = request;
  const compute = (): Output => {
    H.probability(firstShare);
    H.probability(suppliedComplement);
    return {
      expectedComplement: 1 - firstShare,
      gap: suppliedComplement - (1 - firstShare),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstShare: 0.25, suppliedComplement: 0.7 },
  output: { expectedComplement: 0.75, gap: -0.050000000000000044 },
} satisfies ToolExample<Input, Output>;
export const blendShareComplementGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/blend-share-complement-gap",
    title: "Blend Share Complement Gap Tool",
    description:
      "Calculate blend share complement gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstShare: { type: "number", minimum: 0, maximum: 1 },
        suppliedComplement: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["firstShare", "suppliedComplement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedComplement: { type: "number" },
        gap: { type: "number" },
      },
      required: ["expectedComplement", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "firstShare",
          label: "First Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedComplement",
          label: "Supplied Complement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedComplement",
          label: "Expected Complement",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = blendShareComplementGapTool.execute;
export default blendShareComplementGapTool;
