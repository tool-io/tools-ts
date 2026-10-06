import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly structureWording: string;
  readonly leftCode: string;
  readonly rightCode: string;
};
export type Output = {
  readonly leftLabel: string;
  readonly rightLabel: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    structureWording: { type: "string", maxLength: 8192, minLength: 1 },
    leftCode: { type: "string", maxLength: 8192, minLength: 1 },
    rightCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["structureWording", "leftCode", "rightCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftLabel: { type: "string", maxLength: 8192 },
    rightLabel: { type: "string", maxLength: 8192 },
  },
  required: ["leftLabel", "rightLabel"],
} as const;
/** Format explicitly paired left and right structure identifiers without inferring bilateral homology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { structureWording, leftCode, rightCode } = request;
  const compute = (): Output => {
    H.domain(
      structureWording.length > 0 &&
        leftCode.length > 0 &&
        rightCode.length > 0,
      "structureWording",
    );
    return {
      leftLabel: structureWording + " [left: " + leftCode + "]",
      rightLabel: structureWording + " [right: " + rightCode + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { structureWording: "Structure A", leftCode: "L17", rightCode: "R17" },
  output: {
    leftLabel: "Structure A [left: L17]",
    rightLabel: "Structure A [right: R17]",
  },
} satisfies ToolExample<Input, Output>;
export const anatomyBilateralLabelPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anatomy", "health and medicine"],
      keywords: ["anatomy", "health and medicine"],
    },
    id: "anatomy/anatomy-bilateral-label-pair",
    title: "Anatomy Bilateral Label Pair",
    description:
      "Format explicitly paired left and right structure identifiers without inferring bilateral homology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        structureWording: { type: "string", maxLength: 8192, minLength: 1 },
        leftCode: { type: "string", maxLength: 8192, minLength: 1 },
        rightCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["structureWording", "leftCode", "rightCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftLabel: { type: "string", maxLength: 8192 },
        rightLabel: { type: "string", maxLength: 8192 },
      },
      required: ["leftLabel", "rightLabel"],
    },
    ports: {
      inputs: [
        {
          id: "structureWording",
          label: "Structure Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "leftCode",
          label: "Left Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rightCode",
          label: "Right Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "leftLabel", label: "Left Label", valueType: { type: "string" } },
        {
          id: "rightLabel",
          label: "Right Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = anatomyBilateralLabelPairTool.execute;
export default anatomyBilateralLabelPairTool;
