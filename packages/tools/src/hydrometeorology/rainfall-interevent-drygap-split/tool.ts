import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousWetEnd: number;
  readonly nextWetStart: number;
  readonly minimumDryGap: number;
  readonly inclusive: boolean;
};
export type Output = { readonly dryGap: number; readonly newEvent: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousWetEnd: { type: "number" },
    nextWetStart: { type: "number" },
    minimumDryGap: { type: "number", minimum: 0 },
    inclusive: { type: "boolean" },
  },
  required: ["previousWetEnd", "nextWetStart", "minimumDryGap", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryGap: { type: "number" }, newEvent: { type: "boolean" } },
  required: ["dryGap", "newEvent"],
} as const;
/** Calculate rainfall interevent drygap split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousWetEnd, nextWetStart, minimumDryGap, inclusive } = request;
  const compute = (): Output => {
    H.domain(nextWetStart >= previousWetEnd && minimumDryGap >= 0);
    return {
      dryGap: nextWetStart - previousWetEnd,
      newEvent: inclusive
        ? nextWetStart - previousWetEnd >= minimumDryGap
        : nextWetStart - previousWetEnd > minimumDryGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousWetEnd: 10,
    nextWetStart: 16,
    minimumDryGap: 6,
    inclusive: true,
  },
  output: { dryGap: 6, newEvent: true },
} satisfies ToolExample<Input, Output>;
export const rainfallIntereventDrygapSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/rainfall-interevent-drygap-split",
    title: "Rainfall Interevent Drygap Split Tool",
    description:
      "Calculate rainfall interevent drygap split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousWetEnd: { type: "number" },
        nextWetStart: { type: "number" },
        minimumDryGap: { type: "number", minimum: 0 },
        inclusive: { type: "boolean" },
      },
      required: [
        "previousWetEnd",
        "nextWetStart",
        "minimumDryGap",
        "inclusive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryGap: { type: "number" }, newEvent: { type: "boolean" } },
      required: ["dryGap", "newEvent"],
    },
    ports: {
      inputs: [
        {
          id: "previousWetEnd",
          label: "Previous Wet End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextWetStart",
          label: "Next Wet Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumDryGap",
          label: "Minimum Dry Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "dryGap", label: "Dry Gap", valueType: { type: "number" } },
        { id: "newEvent", label: "New Event", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = rainfallIntereventDrygapSplitTool.execute;
export default rainfallIntereventDrygapSplitTool;
