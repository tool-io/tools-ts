import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeAge: number;
  readonly afterAge: number;
  readonly elapsedYears: number;
};
export type Output = { readonly ageChange: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeAge: { type: "number" },
    afterAge: { type: "number" },
    elapsedYears: { type: "number" },
  },
  required: ["beforeAge", "afterAge", "elapsedYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageChange: { type: "number" }, residual: { type: "number" } },
  required: ["ageChange", "residual"],
} as const;
/** Compare supplied character-age change with a signed story-time jump. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeAge, afterAge, elapsedYears } = request;
  const compute = (): Output => {
    return {
      ageChange: afterAge - beforeAge,
      residual: afterAge - beforeAge - elapsedYears,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeAge: 20, afterAge: 25, elapsedYears: 4 },
  output: { ageChange: 5, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const storyTimeJumpAgeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/story-time-jump-age-residual",
    title: "Story Time Jump Age Residual Tool",
    description:
      "Compare supplied character-age change with a signed story-time jump.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeAge: { type: "number" },
        afterAge: { type: "number" },
        elapsedYears: { type: "number" },
      },
      required: ["beforeAge", "afterAge", "elapsedYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageChange: { type: "number" },
        residual: { type: "number" },
      },
      required: ["ageChange", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "beforeAge",
          label: "Before Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterAge",
          label: "After Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedYears",
          label: "Elapsed Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ageChange", label: "Age Change", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = storyTimeJumpAgeResidualTool.execute;
export default storyTimeJumpAgeResidualTool;
