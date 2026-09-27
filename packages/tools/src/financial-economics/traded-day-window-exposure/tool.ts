import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tradedDays: number;
  readonly windowDays: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tradedDays: { type: "integer", minimum: 0 },
    windowDays: { type: "integer", minimum: 0 },
  },
  required: ["tradedDays", "windowDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate traded day window exposure from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tradedDays, windowDays } = request;
  const compute = (): Output => {
    H.integer(windowDays, 0);
    H.integer(tradedDays, 0, windowDays);
    return {
      share: windowDays > 0 ? tradedDays / windowDays : 0,
      defined: windowDays > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tradedDays: 15, windowDays: 20 },
  output: { share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const tradedDayWindowExposureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/traded-day-window-exposure",
    title: "Traded Day Window Exposure Tool",
    description:
      "Calculate traded day window exposure from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tradedDays: { type: "integer", minimum: 0 },
        windowDays: { type: "integer", minimum: 0 },
      },
      required: ["tradedDays", "windowDays"],
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
          id: "tradedDays",
          label: "Traded Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowDays",
          label: "Window Days",
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
export const run = tradedDayWindowExposureTool.execute;
export default tradedDayWindowExposureTool;
