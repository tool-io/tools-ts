import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unsaturated: number;
  readonly saturated: number;
  readonly referenceRelative: number;
};
export type Output = {
  readonly relative: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unsaturated: { type: "number", minimum: 0 },
    saturated: { type: "number", exclusiveMinimum: 0 },
    referenceRelative: { type: "number" },
  },
  required: ["unsaturated", "saturated", "referenceRelative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relative: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["relative", "referenceGap"],
} as const;
/** Calculate saturated unsaturated conductivity ratio term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unsaturated, saturated, referenceRelative } = request;
  const compute = (): Output => {
    H.domain(unsaturated >= 0);
    H.positive(saturated);
    return {
      relative: unsaturated / saturated,
      referenceGap: unsaturated / saturated - referenceRelative,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unsaturated: 2, saturated: 10, referenceRelative: 0.25 },
  output: { relative: 0.2, referenceGap: -0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const saturatedUnsaturatedConductivityRatioTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrophysics/saturated-unsaturated-conductivity-ratio-term",
      title: "Saturated Unsaturated Conductivity Ratio Term Tool",
      description:
        "Calculate saturated unsaturated conductivity ratio term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unsaturated: { type: "number", minimum: 0 },
          saturated: { type: "number", exclusiveMinimum: 0 },
          referenceRelative: { type: "number" },
        },
        required: ["unsaturated", "saturated", "referenceRelative"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relative: { type: "number" },
          referenceGap: { type: "number" },
        },
        required: ["relative", "referenceGap"],
      },
      ports: {
        inputs: [
          {
            id: "unsaturated",
            label: "Unsaturated",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "saturated",
            label: "Saturated",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceRelative",
            label: "Reference Relative",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "relative", label: "Relative", valueType: { type: "number" } },
          {
            id: "referenceGap",
            label: "Reference Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = saturatedUnsaturatedConductivityRatioTermTool.execute;
export default saturatedUnsaturatedConductivityRatioTermTool;
