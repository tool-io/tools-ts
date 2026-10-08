import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceRedshift: number;
  readonly lensRedshift: number;
};
export type Output = {
  readonly sourceBehindLensByRedshift: boolean;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceRedshift: { type: "number", minimum: 0 },
    lensRedshift: { type: "number", minimum: 0 },
  },
  required: ["sourceRedshift", "lensRedshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceBehindLensByRedshift: { type: "boolean" },
    difference: { type: "number" },
  },
  required: ["sourceBehindLensByRedshift", "difference"],
} as const;
/** Compare explicit nonnegative cosmological source and lens redshifts under the ordinary monotonic background-distance assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceRedshift, lensRedshift } = request;
  const compute = (): Output => {
    H.domain(sourceRedshift >= 0 && lensRedshift >= 0, "sourceRedshift");
    return {
      sourceBehindLensByRedshift: sourceRedshift > lensRedshift,
      difference: sourceRedshift - lensRedshift,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceRedshift: 2, lensRedshift: 0.5 },
  output: { sourceBehindLensByRedshift: true, difference: 1.5 },
} satisfies ToolExample<Input, Output>;
export const sourceRedshiftBehindLensFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/source-redshift-behind-lens-flag",
    title: "Source Redshift Behind Lens Flag",
    description:
      "Compare explicit nonnegative cosmological source and lens redshifts under the ordinary monotonic background-distance assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceRedshift: { type: "number", minimum: 0 },
        lensRedshift: { type: "number", minimum: 0 },
      },
      required: ["sourceRedshift", "lensRedshift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceBehindLensByRedshift: { type: "boolean" },
        difference: { type: "number" },
      },
      required: ["sourceBehindLensByRedshift", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "sourceRedshift",
          label: "Source Redshift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lensRedshift",
          label: "Lens Redshift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sourceBehindLensByRedshift",
          label: "Source Behind Lens By Redshift",
          valueType: { type: "boolean" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceRedshiftBehindLensFlagTool.execute;
export default sourceRedshiftBehindLensFlagTool;
