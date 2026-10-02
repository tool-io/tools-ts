import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effectValue: number;
  readonly suppliedOrigin: number;
  readonly increasingIsPositive: boolean;
  readonly suppliedUnitFactor: number;
};
export type Output = {
  readonly directedEffect: number;
  readonly multiplier: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectValue: { type: "number" },
    suppliedOrigin: { type: "number" },
    increasingIsPositive: { type: "boolean" },
    suppliedUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "effectValue",
    "suppliedOrigin",
    "increasingIsPositive",
    "suppliedUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directedEffect: { type: "number" },
    multiplier: { type: "number" },
  },
  required: ["directedEffect", "multiplier"],
} as const;
/** Apply one explicitly declared increasing/decreasing assay scale multiplier; no clinical benefit interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    effectValue,
    suppliedOrigin,
    increasingIsPositive,
    suppliedUnitFactor,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedUnitFactor);
    return {
      directedEffect:
        (effectValue - suppliedOrigin) *
        suppliedUnitFactor *
        (increasingIsPositive ? 1 : -1),
      multiplier: suppliedUnitFactor * (increasingIsPositive ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    effectValue: 8,
    suppliedOrigin: 5,
    increasingIsPositive: false,
    suppliedUnitFactor: 2,
  },
  output: { directedEffect: -6, multiplier: -2 },
} satisfies ToolExample<Input, Output>;
export const effectScaleDirectionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/effect-scale-direction-factor",
    title: "Effect Scale Direction Factor Tool",
    description:
      "Apply one explicitly declared increasing/decreasing assay scale multiplier; no clinical benefit interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectValue: { type: "number" },
        suppliedOrigin: { type: "number" },
        increasingIsPositive: { type: "boolean" },
        suppliedUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "effectValue",
        "suppliedOrigin",
        "increasingIsPositive",
        "suppliedUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directedEffect: { type: "number" },
        multiplier: { type: "number" },
      },
      required: ["directedEffect", "multiplier"],
    },
    ports: {
      inputs: [
        {
          id: "effectValue",
          label: "Effect Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOrigin",
          label: "Supplied Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "increasingIsPositive",
          label: "Increasing Is Positive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedUnitFactor",
          label: "Supplied Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "directedEffect",
          label: "Directed Effect",
          valueType: { type: "number" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = effectScaleDirectionFactorTool.execute;
export default effectScaleDirectionFactorTool;
