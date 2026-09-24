import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCredit: number;
  readonly secondCredit: number;
  readonly sharedCredit: number;
  readonly withheld: number;
};
export type Output = {
  readonly uniqueCredit: number;
  readonly availableCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCredit: { type: "number", minimum: 0 },
    secondCredit: { type: "number", minimum: 0 },
    sharedCredit: { type: "number", minimum: 0 },
    withheld: { type: "number", minimum: 0 },
  },
  required: ["firstCredit", "secondCredit", "sharedCredit", "withheld"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueCredit: { type: "number" },
    availableCredit: { type: "number" },
  },
  required: ["uniqueCredit", "availableCredit"],
} as const;
/** Supplied habitat-credit accounting, without establishing ecological equivalence or certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCredit, secondCredit, sharedCredit, withheld } = request;
  const compute = (): Output => {
    H.domain(
      firstCredit >= 0 &&
        secondCredit >= 0 &&
        sharedCredit >= 0 &&
        sharedCredit <= Math.min(firstCredit, secondCredit) &&
        withheld >= 0,
    );
    return {
      uniqueCredit: firstCredit + secondCredit - sharedCredit,
      availableCredit: firstCredit + secondCredit - sharedCredit - withheld,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCredit: 100, secondCredit: 80, sharedCredit: 30, withheld: 10 },
  output: { uniqueCredit: 150, availableCredit: 140 },
} satisfies ToolExample<Input, Output>;
export const habitatCreditDoubleCountTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/habitat-credit-double-count-term",
    title: "Habitat Credit Double Count Term Tool",
    description:
      "Supplied habitat-credit accounting, without establishing ecological equivalence or certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCredit: { type: "number", minimum: 0 },
        secondCredit: { type: "number", minimum: 0 },
        sharedCredit: { type: "number", minimum: 0 },
        withheld: { type: "number", minimum: 0 },
      },
      required: ["firstCredit", "secondCredit", "sharedCredit", "withheld"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueCredit: { type: "number" },
        availableCredit: { type: "number" },
      },
      required: ["uniqueCredit", "availableCredit"],
    },
    ports: {
      inputs: [
        {
          id: "firstCredit",
          label: "First Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCredit",
          label: "Second Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedCredit",
          label: "Shared Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withheld",
          label: "Withheld",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueCredit",
          label: "Unique Credit",
          valueType: { type: "number" },
        },
        {
          id: "availableCredit",
          label: "Available Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = habitatCreditDoubleCountTermTool.execute;
export default habitatCreditDoubleCountTermTool;
