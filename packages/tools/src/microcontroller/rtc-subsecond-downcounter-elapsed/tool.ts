import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly counter: number; readonly reload: number };
export type Output = {
  readonly elapsedTicks: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counter: { type: "integer", minimum: 0 },
    reload: { type: "integer", minimum: 0 },
  },
  required: ["counter", "reload"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedTicks: { type: "integer" },
    fraction: { type: "number" },
  },
  required: ["elapsedTicks", "fraction"],
} as const;
/** Calculate rtc subsecond downcounter elapsed from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { counter, reload } = input;
  const compute = (): Output => {
    H.integer(reload, 0);
    H.integer(counter, 0, reload);
    return {
      elapsedTicks: reload - counter,
      fraction: (reload - counter) / (reload + 1),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { counter: 127, reload: 255 },
  output: { elapsedTicks: 128, fraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const rtcSubsecondDowncounterElapsedTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/rtc-subsecond-downcounter-elapsed",
    title: "RTC Subsecond Downcounter Elapsed Tool",
    description:
      "Calculate rtc subsecond downcounter elapsed from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counter: { type: "integer", minimum: 0 },
        reload: { type: "integer", minimum: 0 },
      },
      required: ["counter", "reload"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedTicks: { type: "integer" },
        fraction: { type: "number" },
      },
      required: ["elapsedTicks", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "counter",
          label: "Counter",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reload",
          label: "Reload",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedTicks",
          label: "Elapsed Ticks",
          valueType: { type: "integer" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rtcSubsecondDowncounterElapsedTool.execute;
export default rtcSubsecondDowncounterElapsedTool;
