import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supply: number;
  readonly leakage: number;
  readonly resistance: number;
};
export type Output = { readonly voltage: number; readonly drop: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supply: { type: "number", minimum: 0 },
    leakage: { type: "number", minimum: 0 },
    resistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["supply", "leakage", "resistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { voltage: { type: "number" }, drop: { type: "number" } },
  required: ["voltage", "drop"],
} as const;
/** Calculate gpio pullup leakage static gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { supply, leakage, resistance } = input;
  const compute = (): Output => {
    H.domain(supply >= 0 && leakage >= 0);
    H.positive(resistance);
    const drop = leakage * resistance;
    return { voltage: supply - drop, drop };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { supply: 3.3, leakage: 0.00001, resistance: 10000 },
  output: { voltage: 3.1999999999999997, drop: 0.1 },
} satisfies ToolExample<Input, Output>;
export const gpioPullupLeakageStaticGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/gpio-pullup-leakage-static-gap",
    title: "GPIO Pullup Leakage Static Gap Tool",
    description:
      "Calculate gpio pullup leakage static gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supply: { type: "number", minimum: 0 },
        leakage: { type: "number", minimum: 0 },
        resistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["supply", "leakage", "resistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { voltage: { type: "number" }, drop: { type: "number" } },
      required: ["voltage", "drop"],
    },
    ports: {
      inputs: [
        {
          id: "supply",
          label: "Supply",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leakage",
          label: "Leakage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resistance",
          label: "Resistance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "voltage", label: "Voltage", valueType: { type: "number" } },
        { id: "drop", label: "Drop", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gpioPullupLeakageStaticGapTool.execute;
export default gpioPullupLeakageStaticGapTool;
