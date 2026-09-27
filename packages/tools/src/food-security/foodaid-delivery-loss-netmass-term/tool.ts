import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shipped: number;
  readonly lossFraction: number;
  readonly returnMass: number;
};
export type Output = {
  readonly arrivalMass: number;
  readonly distributedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shipped: { type: "number", minimum: 0 },
    lossFraction: { type: "number", minimum: 0, maximum: 1 },
    returnMass: { type: "number", minimum: 0 },
  },
  required: ["shipped", "lossFraction", "returnMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalMass: { type: "number" },
    distributedMass: { type: "number" },
  },
  required: ["arrivalMass", "distributedMass"],
} as const;
/** Calculate foodaid delivery loss netmass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shipped, lossFraction, returnMass } = request;
  const compute = (): Output => {
    H.domain(shipped >= 0 && returnMass >= 0);
    H.probability(lossFraction);
    H.domain(returnMass <= shipped * (1 - lossFraction));
    return {
      arrivalMass: shipped * (1 - lossFraction),
      distributedMass: shipped * (1 - lossFraction) - returnMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shipped: 1000, lossFraction: 0.1, returnMass: 50 },
  output: { arrivalMass: 900, distributedMass: 850 },
} satisfies ToolExample<Input, Output>;
export const foodaidDeliveryLossNetmassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/foodaid-delivery-loss-netmass-term",
    title: "Foodaid Delivery Loss Netmass Term Tool",
    description:
      "Calculate foodaid delivery loss netmass term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shipped: { type: "number", minimum: 0 },
        lossFraction: { type: "number", minimum: 0, maximum: 1 },
        returnMass: { type: "number", minimum: 0 },
      },
      required: ["shipped", "lossFraction", "returnMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalMass: { type: "number" },
        distributedMass: { type: "number" },
      },
      required: ["arrivalMass", "distributedMass"],
    },
    ports: {
      inputs: [
        {
          id: "shipped",
          label: "Shipped",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossFraction",
          label: "Loss Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "returnMass",
          label: "Return Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "arrivalMass",
          label: "Arrival Mass",
          valueType: { type: "number" },
        },
        {
          id: "distributedMass",
          label: "Distributed Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodaidDeliveryLossNetmassTermTool.execute;
export default foodaidDeliveryLossNetmassTermTool;
