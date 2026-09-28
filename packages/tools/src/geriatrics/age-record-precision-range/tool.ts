import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestAge: number;
  readonly latestAge: number;
};
export type Output = { readonly width: number; readonly midpoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestAge: { type: "number", minimum: 0 },
    latestAge: { type: "number" },
  },
  required: ["earliestAge", "latestAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, midpoint: { type: "number" } },
  required: ["width", "midpoint"],
} as const;
/** Calculate age record precision range from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestAge, latestAge } = request;
  const compute = (): Output => {
    H.domain(earliestAge >= 0 && latestAge >= earliestAge);
    return {
      width: latestAge - earliestAge,
      midpoint: earliestAge / 2 + latestAge / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestAge: 70, latestAge: 72 },
  output: { width: 2, midpoint: 71 },
} satisfies ToolExample<Input, Output>;
export const ageRecordPrecisionRangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/age-record-precision-range",
    title: "Age Record Precision Range Tool",
    description:
      "Calculate age record precision range from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestAge: { type: "number", minimum: 0 },
        latestAge: { type: "number" },
      },
      required: ["earliestAge", "latestAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" }, midpoint: { type: "number" } },
      required: ["width", "midpoint"],
    },
    ports: {
      inputs: [
        {
          id: "earliestAge",
          label: "Earliest Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestAge",
          label: "Latest Age",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ageRecordPrecisionRangeTool.execute;
export default ageRecordPrecisionRangeTool;
