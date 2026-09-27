import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly optionCount: number;
  readonly origin: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    optionCount: { type: "integer", minimum: 1 },
    origin: { type: "integer" },
  },
  required: ["index", "optionCount", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate survey option position share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, optionCount, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    H.integer(optionCount, 1);
    H.integer(index, origin, origin + optionCount - 1);
    return {
      share: optionCount > 1 ? (index - origin) / (optionCount - 1) : 0,
      defined: optionCount > 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 2, optionCount: 5, origin: 0 },
  output: { share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const surveyOptionPositionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/survey-option-position-share",
    title: "Survey Option Position Share Tool",
    description:
      "Calculate survey option position share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        optionCount: { type: "integer", minimum: 1 },
        origin: { type: "integer" },
      },
      required: ["index", "optionCount", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "optionCount",
          label: "Option Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = surveyOptionPositionShareTool.execute;
export default surveyOptionPositionShareTool;
