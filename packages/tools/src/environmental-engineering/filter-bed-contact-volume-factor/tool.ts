import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flow: number;
  readonly emptyBedContactTime: number;
};
export type Output = { readonly bedVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number", minimum: 0 },
    emptyBedContactTime: { type: "number", minimum: 0 },
  },
  required: ["flow", "emptyBedContactTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bedVolume: { type: "number" } },
  required: ["bedVolume"],
} as const;
/** Compute a supplied empty-bed contact volume without treatment-performance claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, emptyBedContactTime } = request;
  const compute = (): Output => {
    H.domain(flow >= 0 && emptyBedContactTime >= 0);
    return { bedVolume: flow * emptyBedContactTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flow: 2, emptyBedContactTime: 3 },
  output: { bedVolume: 6 },
} satisfies ToolExample<Input, Output>;
export const filterBedContactVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/filter-bed-contact-volume-factor",
    title: "Filter BED Contact Volume Factor Tool",
    description:
      "Compute a supplied empty-bed contact volume without treatment-performance claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flow: { type: "number", minimum: 0 },
        emptyBedContactTime: { type: "number", minimum: 0 },
      },
      required: ["flow", "emptyBedContactTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bedVolume: { type: "number" } },
      required: ["bedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emptyBedContactTime",
          label: "Empty Bed Contact Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "bedVolume", label: "Bed Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = filterBedContactVolumeFactorTool.execute;
export default filterBedContactVolumeFactorTool;
