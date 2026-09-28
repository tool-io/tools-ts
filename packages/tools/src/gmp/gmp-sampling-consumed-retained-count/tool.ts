import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampled: number;
  readonly tested: number;
  readonly retained: number;
  readonly destroyed: number;
  readonly returned: number;
};
export type Output = {
  readonly unassigned: number;
  readonly consumedShare: number;
  readonly retainedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampled: { type: "integer", minimum: 1 },
    tested: { type: "integer", minimum: 0 },
    retained: { type: "integer", minimum: 0 },
    destroyed: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
  },
  required: ["sampled", "tested", "retained", "destroyed", "returned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unassigned: { type: "integer" },
    consumedShare: { type: "number" },
    retainedShare: { type: "number" },
  },
  required: ["unassigned", "consumedShare", "retainedShare"],
} as const;
/** Calculate gmp sampling consumed retained count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampled, tested, retained, destroyed, returned } = request;
  const compute = (): Output => {
    H.integer(sampled, 1);
    H.integer(tested, 0);
    H.integer(retained, 0);
    H.integer(destroyed, 0);
    H.integer(returned, 0);
    return {
      unassigned: sampled - tested - retained - destroyed - returned,
      consumedShare: (tested + destroyed) / sampled,
      retainedShare: retained / sampled,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampled: 100,
    tested: 30,
    retained: 40,
    destroyed: 10,
    returned: 15,
  },
  output: { unassigned: 5, consumedShare: 0.4, retainedShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const gmpSamplingConsumedRetainedCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-sampling-consumed-retained-count",
    title: "GMP Sampling Consumed Retained Count Tool",
    description:
      "Calculate gmp sampling consumed retained count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampled: { type: "integer", minimum: 1 },
        tested: { type: "integer", minimum: 0 },
        retained: { type: "integer", minimum: 0 },
        destroyed: { type: "integer", minimum: 0 },
        returned: { type: "integer", minimum: 0 },
      },
      required: ["sampled", "tested", "retained", "destroyed", "returned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unassigned: { type: "integer" },
        consumedShare: { type: "number" },
        retainedShare: { type: "number" },
      },
      required: ["unassigned", "consumedShare", "retainedShare"],
    },
    ports: {
      inputs: [
        {
          id: "sampled",
          label: "Sampled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tested",
          label: "Tested",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retained",
          label: "Retained",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "destroyed",
          label: "Destroyed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unassigned",
          label: "Unassigned",
          valueType: { type: "integer" },
        },
        {
          id: "consumedShare",
          label: "Consumed Share",
          valueType: { type: "number" },
        },
        {
          id: "retainedShare",
          label: "Retained Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpSamplingConsumedRetainedCountTool.execute;
export default gmpSamplingConsumedRetainedCountTool;
