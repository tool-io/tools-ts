import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly harvested: number;
  readonly consumed: number;
  readonly donated: number;
  readonly spoiled: number;
  readonly retained: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly edibleShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    harvested: { type: "number", exclusiveMinimum: 0 },
    consumed: { type: "number", minimum: 0 },
    donated: { type: "number", minimum: 0 },
    spoiled: { type: "number", minimum: 0 },
    retained: { type: "number", minimum: 0 },
  },
  required: ["harvested", "consumed", "donated", "spoiled", "retained"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "number" },
    edibleShare: { type: "number" },
  },
  required: ["unaccounted", "edibleShare"],
} as const;
/** Calculate urban crop consumed donated balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { harvested, consumed, donated, spoiled, retained } = request;
  const compute = (): Output => {
    H.positive(harvested);
    H.domain(consumed >= 0 && donated >= 0 && spoiled >= 0 && retained >= 0);
    return {
      unaccounted: harvested - consumed - donated - spoiled - retained,
      edibleShare: (consumed + donated + retained) / harvested,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    harvested: 100,
    consumed: 40,
    donated: 30,
    spoiled: 10,
    retained: 15,
  },
  output: { unaccounted: 5, edibleShare: 0.85 },
} satisfies ToolExample<Input, Output>;
export const urbanCropConsumedDonatedBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/urban-crop-consumed-donated-balance",
    title: "Urban Crop Consumed Donated Balance Tool",
    description:
      "Calculate urban crop consumed donated balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        harvested: { type: "number", exclusiveMinimum: 0 },
        consumed: { type: "number", minimum: 0 },
        donated: { type: "number", minimum: 0 },
        spoiled: { type: "number", minimum: 0 },
        retained: { type: "number", minimum: 0 },
      },
      required: ["harvested", "consumed", "donated", "spoiled", "retained"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unaccounted: { type: "number" },
        edibleShare: { type: "number" },
      },
      required: ["unaccounted", "edibleShare"],
    },
    ports: {
      inputs: [
        {
          id: "harvested",
          label: "Harvested",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "consumed",
          label: "Consumed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "donated",
          label: "Donated",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spoiled",
          label: "Spoiled",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retained",
          label: "Retained",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unaccounted",
          label: "Unaccounted",
          valueType: { type: "number" },
        },
        {
          id: "edibleShare",
          label: "Edible Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = urbanCropConsumedDonatedBalanceTool.execute;
export default urbanCropConsumedDonatedBalanceTool;
