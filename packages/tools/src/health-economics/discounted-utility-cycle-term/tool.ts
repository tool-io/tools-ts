import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly utility: number;
  readonly durationYears: number;
  readonly discountFactor: number;
  readonly populationWeight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utility: { type: "number" },
    durationYears: { type: "number", minimum: 0 },
    discountFactor: { type: "number", minimum: 0 },
    populationWeight: { type: "number", minimum: 0 },
  },
  required: ["utility", "durationYears", "discountFactor", "populationWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Return one supplied utility-time contribution with explicit discount and population weights; utility may be negative. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { utility, durationYears, discountFactor, populationWeight } = request;
  const compute = (): Output => {
    H.domain(
      durationYears >= 0 && discountFactor >= 0 && populationWeight >= 0,
    );
    return {
      contribution: utility * durationYears * discountFactor * populationWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    utility: 0.8,
    durationYears: 0.5,
    discountFactor: 0.9,
    populationWeight: 2,
  },
  output: { contribution: 0.7200000000000001 },
} satisfies ToolExample<Input, Output>;
export const discountedUtilityCycleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/discounted-utility-cycle-term",
    title: "Discounted Utility Cycle Term Tool",
    description:
      "Return one supplied utility-time contribution with explicit discount and population weights; utility may be negative.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utility: { type: "number" },
        durationYears: { type: "number", minimum: 0 },
        discountFactor: { type: "number", minimum: 0 },
        populationWeight: { type: "number", minimum: 0 },
      },
      required: [
        "utility",
        "durationYears",
        "discountFactor",
        "populationWeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "utility",
          label: "Utility",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationYears",
          label: "Duration Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountFactor",
          label: "Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "populationWeight",
          label: "Population Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = discountedUtilityCycleTermTool.execute;
export default discountedUtilityCycleTermTool;
