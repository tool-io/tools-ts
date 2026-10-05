import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly overflowLevel: number;
  readonly rimLevel: number;
};
export type Output = { readonly freeboard: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overflowLevel: { type: "number" },
    rimLevel: { type: "number" },
  },
  required: ["overflowLevel", "rimLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { freeboard: { type: "number" } },
  required: ["freeboard"],
} as const;
/** Measure signed freeboard between a rain-garden overflow and rim on a shared elevation datum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { overflowLevel, rimLevel } = request;
  const compute = (): Output => {
    return { freeboard: rimLevel - overflowLevel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { overflowLevel: 99.7, rimLevel: 100 },
  output: { freeboard: 0.29999999999999716 },
} satisfies ToolExample<Input, Output>;
export const rainGardenFreeboardLevelPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/rain-garden-freeboard-level-pair",
    title: "Rain Garden Freeboard Level Pair Tool",
    description:
      "Measure signed freeboard between a rain-garden overflow and rim on a shared elevation datum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overflowLevel: { type: "number" },
        rimLevel: { type: "number" },
      },
      required: ["overflowLevel", "rimLevel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { freeboard: { type: "number" } },
      required: ["freeboard"],
    },
    ports: {
      inputs: [
        {
          id: "overflowLevel",
          label: "Overflow Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rimLevel",
          label: "Rim Level",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "freeboard", label: "Freeboard", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rainGardenFreeboardLevelPairTool.execute;
export default rainGardenFreeboardLevelPairTool;
