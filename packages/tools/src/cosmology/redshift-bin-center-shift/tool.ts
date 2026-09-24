import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerRedshift: number;
  readonly upperRedshift: number;
  readonly referenceCenter: number;
};
export type Output = { readonly center: number; readonly shift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerRedshift: { type: "number", exclusiveMinimum: -1 },
    upperRedshift: { type: "number" },
    referenceCenter: { type: "number" },
  },
  required: ["lowerRedshift", "upperRedshift", "referenceCenter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { center: { type: "number" }, shift: { type: "number" } },
  required: ["center", "shift"],
} as const;
/** Calculate redshift bin center shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerRedshift, upperRedshift, referenceCenter } = request;
  const compute = (): Output => {
    H.domain(lowerRedshift > -1 && upperRedshift >= lowerRedshift);
    return {
      center: lowerRedshift / 2 + upperRedshift / 2,
      shift: lowerRedshift / 2 + upperRedshift / 2 - referenceCenter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerRedshift: 1, upperRedshift: 2, referenceCenter: 1 },
  output: { center: 1.5, shift: 0.5 },
} satisfies ToolExample<Input, Output>;
export const redshiftBinCenterShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/redshift-bin-center-shift",
    title: "Redshift Bin Center Shift Tool",
    description:
      "Calculate redshift bin center shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerRedshift: { type: "number", exclusiveMinimum: -1 },
        upperRedshift: { type: "number" },
        referenceCenter: { type: "number" },
      },
      required: ["lowerRedshift", "upperRedshift", "referenceCenter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { center: { type: "number" }, shift: { type: "number" } },
      required: ["center", "shift"],
    },
    ports: {
      inputs: [
        {
          id: "lowerRedshift",
          label: "Lower Redshift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperRedshift",
          label: "Upper Redshift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCenter",
          label: "Reference Center",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "center", label: "Center", valueType: { type: "number" } },
        { id: "shift", label: "Shift", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = redshiftBinCenterShiftTool.execute;
export default redshiftBinCenterShiftTool;
