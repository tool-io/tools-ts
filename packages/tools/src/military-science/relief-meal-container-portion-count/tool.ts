import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerVolume: number;
  readonly suppliedPortionVolume: number;
};
export type Output = {
  readonly wholePortions: number;
  readonly remainingVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerVolume: { type: "number", minimum: 0 },
    suppliedPortionVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["containerVolume", "suppliedPortionVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholePortions: { type: "integer" },
    remainingVolume: { type: "number" },
  },
  required: ["wholePortions", "remainingVolume"],
} as const;
/** Count whole relief-meal portions under an explicitly supplied portion volume without choosing nutritional requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerVolume, suppliedPortionVolume } = request;
  const compute = (): Output => {
    H.domain(containerVolume >= 0, "containerVolume");
    (H.domain(
      Number.isFinite(suppliedPortionVolume) && suppliedPortionVolume > 0,
      "suppliedPortionVolume",
    ),
      suppliedPortionVolume);
    return (() => {
      const wholePortions = Math.floor(containerVolume / suppliedPortionVolume);
      return {
        wholePortions,
        remainingVolume:
          containerVolume - wholePortions * suppliedPortionVolume,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { containerVolume: 105, suppliedPortionVolume: 4 },
  output: { wholePortions: 26, remainingVolume: 1 },
} satisfies ToolExample<Input, Output>;
export const reliefMealContainerPortionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["military-science", "military science", "social sciences"],
      keywords: ["military science", "social sciences"],
    },
    id: "military-science/relief-meal-container-portion-count",
    title: "Relief Meal Container Portion Count",
    description:
      "Count whole relief-meal portions under an explicitly supplied portion volume without choosing nutritional requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerVolume: { type: "number", minimum: 0 },
        suppliedPortionVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["containerVolume", "suppliedPortionVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholePortions: { type: "integer" },
        remainingVolume: { type: "number" },
      },
      required: ["wholePortions", "remainingVolume"],
    },
    ports: {
      inputs: [
        {
          id: "containerVolume",
          label: "Container Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPortionVolume",
          label: "Supplied Portion Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wholePortions",
          label: "Whole Portions",
          valueType: { type: "integer" },
        },
        {
          id: "remainingVolume",
          label: "Remaining Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reliefMealContainerPortionCountTool.execute;
export default reliefMealContainerPortionCountTool;
