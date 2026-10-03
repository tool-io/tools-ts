import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEndLower: number;
  readonly firstEndUpper: number;
  readonly secondStartLower: number;
  readonly secondStartUpper: number;
};
export type Output = {
  readonly gapLower: number;
  readonly gapUpper: number;
  readonly certainlySeparated: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEndLower: { type: "number" },
    firstEndUpper: { type: "number" },
    secondStartLower: { type: "number" },
    secondStartUpper: { type: "number" },
  },
  required: [
    "firstEndLower",
    "firstEndUpper",
    "secondStartLower",
    "secondStartUpper",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapLower: { type: "number" },
    gapUpper: { type: "number" },
    certainlySeparated: { type: "boolean" },
  },
  required: ["gapLower", "gapUpper", "certainlySeparated"],
} as const;
/** Propagate supplied utterance boundary uncertainty without inferring linguistic boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEndLower, firstEndUpper, secondStartLower, secondStartUpper } =
    request;
  const compute = (): Output => {
    H.domain(
      firstEndLower <= firstEndUpper && secondStartLower <= secondStartUpper,
    );
    return {
      gapLower: secondStartLower - firstEndUpper,
      gapUpper: secondStartUpper - firstEndLower,
      certainlySeparated: secondStartLower > firstEndUpper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEndLower: 1,
    firstEndUpper: 2,
    secondStartLower: 3,
    secondStartUpper: 4,
  },
  output: { gapLower: 1, gapUpper: 3, certainlySeparated: true },
} satisfies ToolExample<Input, Output>;
export const utteranceBoundaryAmbiguityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/utterance-boundary-ambiguity-gap",
    title: "Utterance Boundary Ambiguity Gap Tool",
    description:
      "Propagate supplied utterance boundary uncertainty without inferring linguistic boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEndLower: { type: "number" },
        firstEndUpper: { type: "number" },
        secondStartLower: { type: "number" },
        secondStartUpper: { type: "number" },
      },
      required: [
        "firstEndLower",
        "firstEndUpper",
        "secondStartLower",
        "secondStartUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapLower: { type: "number" },
        gapUpper: { type: "number" },
        certainlySeparated: { type: "boolean" },
      },
      required: ["gapLower", "gapUpper", "certainlySeparated"],
    },
    ports: {
      inputs: [
        {
          id: "firstEndLower",
          label: "First End Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEndUpper",
          label: "First End Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStartLower",
          label: "Second Start Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStartUpper",
          label: "Second Start Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gapLower", label: "Gap Lower", valueType: { type: "number" } },
        { id: "gapUpper", label: "Gap Upper", valueType: { type: "number" } },
        {
          id: "certainlySeparated",
          label: "Certainly Separated",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = utteranceBoundaryAmbiguityGapTool.execute;
export default utteranceBoundaryAmbiguityGapTool;
