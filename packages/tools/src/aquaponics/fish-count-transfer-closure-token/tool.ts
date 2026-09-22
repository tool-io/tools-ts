import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly arrived: number;
  readonly departed: number;
  readonly recordedFinal: number;
  readonly duplicateArrivals: number;
};
export type Output = { readonly expectedFinal: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "integer" },
    arrived: { type: "integer" },
    departed: { type: "integer" },
    recordedFinal: { type: "integer" },
    duplicateArrivals: { type: "integer" },
  },
  required: [
    "initial",
    "arrived",
    "departed",
    "recordedFinal",
    "duplicateArrivals",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedFinal: { type: "integer" }, gap: { type: "integer" } },
  required: ["expectedFinal", "gap"],
} as const;
/** Reconcile supplied animal inventory counts and duplicate transfers without husbandry recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, arrived, departed, recordedFinal, duplicateArrivals } =
    request;
  const compute = (): Output => {
    H.domain(
      [initial, arrived, departed, recordedFinal, duplicateArrivals].every(
        (x) => x >= 0,
      ) && duplicateArrivals <= arrived,
    );
    const expected =
      BigInt(initial) +
      BigInt(arrived) -
      BigInt(duplicateArrivals) -
      BigInt(departed);
    H.domain(expected >= 0n);
    return {
      expectedFinal: Number(expected),
      gap: Number(BigInt(recordedFinal) - expected),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initial: 100,
    arrived: 20,
    departed: 10,
    recordedFinal: 105,
    duplicateArrivals: 2,
  },
  output: { expectedFinal: 108, gap: -3 },
} satisfies ToolExample<Input, Output>;
export const fishCountTransferClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/fish-count-transfer-closure-token",
    title: "Fish Count Transfer Closure Token Tool",
    description:
      "Reconcile supplied animal inventory counts and duplicate transfers without husbandry recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "integer" },
        arrived: { type: "integer" },
        departed: { type: "integer" },
        recordedFinal: { type: "integer" },
        duplicateArrivals: { type: "integer" },
      },
      required: [
        "initial",
        "arrived",
        "departed",
        "recordedFinal",
        "duplicateArrivals",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedFinal: { type: "integer" },
        gap: { type: "integer" },
      },
      required: ["expectedFinal", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "initial",
          label: "Initial",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "arrived",
          label: "Arrived",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "departed",
          label: "Departed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedFinal",
          label: "Recorded Final",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "duplicateArrivals",
          label: "Duplicate Arrivals",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expectedFinal",
          label: "Expected Final",
          valueType: { type: "integer" },
        },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = fishCountTransferClosureTokenTool.execute;
export default fishCountTransferClosureTokenTool;
