import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rise: number; readonly run: number };
export type Output = { readonly risePerRun: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rise: { type: "number", minimum: 0 },
    run: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rise", "run"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    risePerRun: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["risePerRun", "label"],
} as const;
/** Label a nonnegative roof pitch with explicit rise and positive horizontal run in consistent length units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rise, run } = request;
  const compute = (): Output => {
    H.domain(rise >= 0, "rise");
    (H.domain(run > 0, "run"), run);
    return { risePerRun: rise / run, label: rise + ":" + run + " rise:run" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rise: 3, run: 12 },
  output: { risePerRun: 0.25, label: "3:12 rise:run" },
} satisfies ToolExample<Input, Output>;
export const roofPitchRisePerRunLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/roof-pitch-rise-per-run-label",
    title: "Roof Pitch Rise Per Run Label Tool",
    description:
      "Label a nonnegative roof pitch with explicit rise and positive horizontal run in consistent length units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rise: { type: "number", minimum: 0 },
        run: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rise", "run"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        risePerRun: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["risePerRun", "label"],
    },
    ports: {
      inputs: [
        {
          id: "rise",
          label: "Rise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "run",
          label: "Run",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "risePerRun",
          label: "Rise Per Run",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = roofPitchRisePerRunLabelTool.execute;
export default roofPitchRisePerRunLabelTool;
