import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousFamily: string;
  readonly nextFamily: string;
  readonly sameFamilyCost: number;
  readonly changedFamilyCost: number;
};
export type Output = {
  readonly switchRequired: boolean;
  readonly cost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousFamily: { type: "string", maxLength: 8192 },
    nextFamily: { type: "string", maxLength: 8192 },
    sameFamilyCost: { type: "number", minimum: 0 },
    changedFamilyCost: { type: "number", minimum: 0 },
  },
  required: [
    "previousFamily",
    "nextFamily",
    "sameFamilyCost",
    "changedFamilyCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { switchRequired: { type: "boolean" }, cost: { type: "number" } },
  required: ["switchRequired", "cost"],
} as const;
/** Select supplied setup costs from explicit family labels, without estimating machine setup behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousFamily, nextFamily, sameFamilyCost, changedFamilyCost } =
    request;
  const compute = (): Output => {
    H.domain(sameFamilyCost >= 0 && changedFamilyCost >= 0);
    const switchRequired = previousFamily !== nextFamily;
    return {
      switchRequired,
      cost: switchRequired ? changedFamilyCost : sameFamilyCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousFamily: "A",
    nextFamily: "B",
    sameFamilyCost: 2,
    changedFamilyCost: 10,
  },
  output: { switchRequired: true, cost: 10 },
} satisfies ToolExample<Input, Output>;
export const setupFamilySwitchCostTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/setup-family-switch-cost-token",
    title: "Setup Family Switch Cost Token Tool",
    description:
      "Select supplied setup costs from explicit family labels, without estimating machine setup behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousFamily: { type: "string", maxLength: 8192 },
        nextFamily: { type: "string", maxLength: 8192 },
        sameFamilyCost: { type: "number", minimum: 0 },
        changedFamilyCost: { type: "number", minimum: 0 },
      },
      required: [
        "previousFamily",
        "nextFamily",
        "sameFamilyCost",
        "changedFamilyCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        switchRequired: { type: "boolean" },
        cost: { type: "number" },
      },
      required: ["switchRequired", "cost"],
    },
    ports: {
      inputs: [
        {
          id: "previousFamily",
          label: "Previous Family",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextFamily",
          label: "Next Family",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sameFamilyCost",
          label: "Same Family Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "changedFamilyCost",
          label: "Changed Family Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "switchRequired",
          label: "Switch Required",
          valueType: { type: "boolean" },
        },
        { id: "cost", label: "Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = setupFamilySwitchCostTokenTool.execute;
export default setupFamilySwitchCostTokenTool;
