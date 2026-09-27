import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBase: number;
  readonly secondBase: number;
  readonly firstBonus: number;
  readonly secondBonus: number;
  readonly includeBonus: boolean;
};
export type Output = {
  readonly firstTotal: number;
  readonly secondTotal: number;
  readonly relativeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBase: { type: "number", exclusiveMinimum: 0 },
    secondBase: { type: "number", minimum: 0 },
    firstBonus: { type: "number", minimum: 0 },
    secondBonus: { type: "number", minimum: 0 },
    includeBonus: { type: "boolean" },
  },
  required: [
    "firstBase",
    "secondBase",
    "firstBonus",
    "secondBonus",
    "includeBonus",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTotal: { type: "number" },
    secondTotal: { type: "number" },
    relativeGap: { type: "number" },
  },
  required: ["firstTotal", "secondTotal", "relativeGap"],
} as const;
/** Explicit first-group reference pay gap with a caller-selected bonus basis, without causal interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBase, secondBase, firstBonus, secondBonus, includeBonus } =
    request;
  const compute = (): Output => {
    H.domain(
      firstBase > 0 && secondBase >= 0 && firstBonus >= 0 && secondBonus >= 0,
    );
    return {
      firstTotal: firstBase + (includeBonus ? firstBonus : 0),
      secondTotal: secondBase + (includeBonus ? secondBonus : 0),
      relativeGap:
        1 -
        (secondBase + (includeBonus ? secondBonus : 0)) /
          (firstBase + (includeBonus ? firstBonus : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstBase: 100,
    secondBase: 80,
    firstBonus: 20,
    secondBonus: 10,
    includeBonus: true,
  },
  output: { firstTotal: 120, secondTotal: 90, relativeGap: 0.25 },
} satisfies ToolExample<Input, Output>;
export const paygapIncludedBonusBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/paygap-included-bonus-base-flag",
    title: "Paygap Included Bonus Base Flag Tool",
    description:
      "Explicit first-group reference pay gap with a caller-selected bonus basis, without causal interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBase: { type: "number", exclusiveMinimum: 0 },
        secondBase: { type: "number", minimum: 0 },
        firstBonus: { type: "number", minimum: 0 },
        secondBonus: { type: "number", minimum: 0 },
        includeBonus: { type: "boolean" },
      },
      required: [
        "firstBase",
        "secondBase",
        "firstBonus",
        "secondBonus",
        "includeBonus",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTotal: { type: "number" },
        secondTotal: { type: "number" },
        relativeGap: { type: "number" },
      },
      required: ["firstTotal", "secondTotal", "relativeGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstBase",
          label: "First Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBase",
          label: "Second Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstBonus",
          label: "First Bonus",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBonus",
          label: "Second Bonus",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeBonus",
          label: "Include Bonus",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "firstTotal",
          label: "First Total",
          valueType: { type: "number" },
        },
        {
          id: "secondTotal",
          label: "Second Total",
          valueType: { type: "number" },
        },
        {
          id: "relativeGap",
          label: "Relative Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paygapIncludedBonusBaseFlagTool.execute;
export default paygapIncludedBonusBaseFlagTool;
