import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly survivors: number; readonly initial: number };
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    survivors: { type: "integer", minimum: 0 },
    initial: { type: "integer", minimum: 0 },
  },
  required: ["survivors", "initial"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate age band survival share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { survivors, initial } = request;
  const compute = (): Output => {
    H.integer(initial, 0);
    H.integer(survivors, 0, initial);
    return {
      share: initial > 0 ? survivors / initial : 0,
      defined: initial > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { survivors: 80, initial: 100 },
  output: { share: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const ageBandSurvivalShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/age-band-survival-share",
    title: "Age Band Survival Share Tool",
    description:
      "Calculate age band survival share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        survivors: { type: "integer", minimum: 0 },
        initial: { type: "integer", minimum: 0 },
      },
      required: ["survivors", "initial"],
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
          id: "survivors",
          label: "Survivors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "initial",
          label: "Initial",
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
export const run = ageBandSurvivalShareTool.execute;
export default ageBandSurvivalShareTool;
