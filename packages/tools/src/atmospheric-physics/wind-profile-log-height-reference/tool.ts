import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly roughnessLength: number;
};
export type Output = { readonly logHeightRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number", exclusiveMinimum: 0 },
    roughnessLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["height", "roughnessLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logHeightRatio: { type: "number" } },
  required: ["logHeightRatio"],
} as const;
/** Calculate the natural logarithm of an explicit positive height-to-roughness ratio without estimating wind speed or stability correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, roughnessLength } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(height) && height > 0, "height"), height);
    (H.domain(
      Number.isFinite(roughnessLength) && roughnessLength > 0,
      "roughnessLength",
    ),
      roughnessLength);
    return { logHeightRatio: Math.log(height) - Math.log(roughnessLength) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 10, roughnessLength: 0.1 },
  output: { logHeightRatio: 4.605170185988092 },
} satisfies ToolExample<Input, Output>;
export const windProfileLogHeightReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/wind-profile-log-height-reference",
    title: "Wind Profile Log Height Reference",
    description:
      "Calculate the natural logarithm of an explicit positive height-to-roughness ratio without estimating wind speed or stability correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        height: { type: "number", exclusiveMinimum: 0 },
        roughnessLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["height", "roughnessLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logHeightRatio: { type: "number" } },
      required: ["logHeightRatio"],
    },
    ports: {
      inputs: [
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roughnessLength",
          label: "Roughness Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logHeightRatio",
          label: "Log Height Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = windProfileLogHeightReferenceTool.execute;
export default windProfileLogHeightReferenceTool;
