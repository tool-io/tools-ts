import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rentPerArea: number;
  readonly yieldPerArea: number;
};
export type Output = { readonly rentPerOutput: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rentPerArea: { type: "number", minimum: 0 },
    yieldPerArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rentPerArea", "yieldPerArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rentPerOutput: { type: "number" } },
  required: ["rentPerOutput"],
} as const;
/** Calculate land rent productivity factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rentPerArea, yieldPerArea } = request;
  const compute = (): Output => {
    H.domain(rentPerArea >= 0);
    H.positive(yieldPerArea);
    return { rentPerOutput: rentPerArea / yieldPerArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rentPerArea: 200, yieldPerArea: 5 },
  output: { rentPerOutput: 40 },
} satisfies ToolExample<Input, Output>;
export const landRentProductivityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/land-rent-productivity-factor",
    title: "Land Rent Productivity Factor Tool",
    description:
      "Calculate land rent productivity factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rentPerArea: { type: "number", minimum: 0 },
        yieldPerArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rentPerArea", "yieldPerArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rentPerOutput: { type: "number" } },
      required: ["rentPerOutput"],
    },
    ports: {
      inputs: [
        {
          id: "rentPerArea",
          label: "Rent Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yieldPerArea",
          label: "Yield Per Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rentPerOutput",
          label: "Rent Per Output",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landRentProductivityFactorTool.execute;
export default landRentProductivityFactorTool;
