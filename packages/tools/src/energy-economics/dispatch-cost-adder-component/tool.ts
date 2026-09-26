import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energy: number;
  readonly suppliedAdderPerEnergy: number;
  readonly suppliedLossFraction: number;
  readonly grossUpLosses: boolean;
};
export type Output = {
  readonly costAdder: number;
  readonly chargedEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energy: { type: "number", minimum: 0 },
    suppliedAdderPerEnergy: { type: "number" },
    suppliedLossFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    grossUpLosses: { type: "boolean" },
  },
  required: [
    "energy",
    "suppliedAdderPerEnergy",
    "suppliedLossFraction",
    "grossUpLosses",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costAdder: { type: "number" },
    chargedEnergy: { type: "number" },
  },
  required: ["costAdder", "chargedEnergy"],
} as const;
/** Apply supplied energy adder and optional loss gross-up without simulating dispatch or selecting market rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    energy,
    suppliedAdderPerEnergy,
    suppliedLossFraction,
    grossUpLosses,
  } = request;
  const compute = (): Output => {
    H.domain(
      energy >= 0 && suppliedLossFraction >= 0 && suppliedLossFraction < 1,
    );
    return {
      costAdder:
        (energy / (grossUpLosses ? 1 - suppliedLossFraction : 1)) *
        suppliedAdderPerEnergy,
      chargedEnergy: energy / (grossUpLosses ? 1 - suppliedLossFraction : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    energy: 80,
    suppliedAdderPerEnergy: 2,
    suppliedLossFraction: 0.2,
    grossUpLosses: true,
  },
  output: { costAdder: 200, chargedEnergy: 100 },
} satisfies ToolExample<Input, Output>;
export const dispatchCostAdderComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/dispatch-cost-adder-component",
    title: "Dispatch Cost Adder Component Tool",
    description:
      "Apply supplied energy adder and optional loss gross-up without simulating dispatch or selecting market rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energy: { type: "number", minimum: 0 },
        suppliedAdderPerEnergy: { type: "number" },
        suppliedLossFraction: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1,
        },
        grossUpLosses: { type: "boolean" },
      },
      required: [
        "energy",
        "suppliedAdderPerEnergy",
        "suppliedLossFraction",
        "grossUpLosses",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costAdder: { type: "number" },
        chargedEnergy: { type: "number" },
      },
      required: ["costAdder", "chargedEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "energy",
          label: "Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAdderPerEnergy",
          label: "Supplied Adder Per Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLossFraction",
          label: "Supplied Loss Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossUpLosses",
          label: "Gross Up Losses",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "costAdder", label: "Cost Adder", valueType: { type: "number" } },
        {
          id: "chargedEnergy",
          label: "Charged Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dispatchCostAdderComponentTool.execute;
export default dispatchCostAdderComponentTool;
