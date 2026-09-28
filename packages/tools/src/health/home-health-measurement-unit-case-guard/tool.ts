import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly observed: string; readonly required: string };
export type Output = {
  readonly exact: boolean;
  readonly caseOnlyDifference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "string", maxLength: 8192 },
    required: { type: "string", maxLength: 8192 },
  },
  required: ["observed", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exact: { type: "boolean" },
    caseOnlyDifference: { type: "boolean" },
  },
  required: ["exact", "caseOnlyDifference"],
} as const;
/** Calculate home health measurement unit case guard from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, required } = request;
  const compute = (): Output => {
    return {
      exact: observed === required,
      caseOnlyDifference:
        observed !== required &&
        observed.toLowerCase() === required.toLowerCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: "mg", required: "Mg" },
  output: { exact: false, caseOnlyDifference: true },
} satisfies ToolExample<Input, Output>;
export const homeHealthMeasurementUnitCaseGuardTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/home-health-measurement-unit-case-guard",
    title: "Home Health Measurement Unit Case Guard Tool",
    description:
      "Calculate home health measurement unit case guard from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "string", maxLength: 8192 },
        required: { type: "string", maxLength: 8192 },
      },
      required: ["observed", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exact: { type: "boolean" },
        caseOnlyDifference: { type: "boolean" },
      },
      required: ["exact", "caseOnlyDifference"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "exact", label: "Exact", valueType: { type: "boolean" } },
        {
          id: "caseOnlyDifference",
          label: "Case Only Difference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = homeHealthMeasurementUnitCaseGuardTool.execute;
export default homeHealthMeasurementUnitCaseGuardTool;
