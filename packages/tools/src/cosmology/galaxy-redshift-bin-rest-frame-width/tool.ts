import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerRedshift: number;
  readonly observedWidth: number;
};
export type Output = { readonly restFrameWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerRedshift: { type: "number", exclusiveMinimum: -1 },
    observedWidth: { type: "number", minimum: 0 },
  },
  required: ["centerRedshift", "observedWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { restFrameWidth: { type: "number" } },
  required: ["restFrameWidth"],
} as const;
/** Normalize a small observed redshift interval by 1+z; this is not a full relativistic velocity-width conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerRedshift, observedWidth } = request;
  const compute = (): Output => {
    H.domain(centerRedshift > -1 && observedWidth >= 0);
    return { restFrameWidth: observedWidth / (1 + centerRedshift) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerRedshift: 1, observedWidth: 0.2 },
  output: { restFrameWidth: 0.1 },
} satisfies ToolExample<Input, Output>;
export const galaxyRedshiftBinRestFrameWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/galaxy-redshift-bin-rest-frame-width",
    title: "Galaxy Redshift Bin Rest Frame Width Tool",
    description:
      "Normalize a small observed redshift interval by 1+z; this is not a full relativistic velocity-width conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerRedshift: { type: "number", exclusiveMinimum: -1 },
        observedWidth: { type: "number", minimum: 0 },
      },
      required: ["centerRedshift", "observedWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { restFrameWidth: { type: "number" } },
      required: ["restFrameWidth"],
    },
    ports: {
      inputs: [
        {
          id: "centerRedshift",
          label: "Center Redshift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedWidth",
          label: "Observed Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "restFrameWidth",
          label: "Rest Frame Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = galaxyRedshiftBinRestFrameWidthTool.execute;
export default galaxyRedshiftBinRestFrameWidthTool;
