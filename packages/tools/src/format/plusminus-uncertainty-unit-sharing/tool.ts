import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: string;
  readonly uncertainty: string;
  readonly unit: string;
  readonly shared: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    uncertainty: { type: "string", maxLength: 8192 },
    unit: { type: "string", maxLength: 8192 },
    shared: { type: "boolean" },
  },
  required: ["value", "uncertainty", "unit", "shared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate plusminus uncertainty unit sharing from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, uncertainty, unit, shared } = request;
  const compute = (): Output => {
    H.domain(unit.length > 0);
    return {
      text: shared
        ? "(" + value + " ± " + uncertainty + ") " + unit
        : value + " " + unit + " ± " + uncertainty + " " + unit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: "12", uncertainty: "2", unit: "m", shared: true },
  output: { text: "(12 ± 2) m" },
} satisfies ToolExample<Input, Output>;
export const plusminusUncertaintyUnitSharingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/plusminus-uncertainty-unit-sharing",
    title: "Plusminus Uncertainty Unit Sharing Tool",
    description:
      "Calculate plusminus uncertainty unit sharing from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        uncertainty: { type: "string", maxLength: 8192 },
        unit: { type: "string", maxLength: 8192 },
        shared: { type: "boolean" },
      },
      required: ["value", "uncertainty", "unit", "shared"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "uncertainty",
          label: "Uncertainty",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "shared",
          label: "Shared",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = plusminusUncertaintyUnitSharingTool.execute;
export default plusminusUncertaintyUnitSharingTool;
