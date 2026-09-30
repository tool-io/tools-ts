import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly idleSeconds: number;
  readonly clockHz: number;
  readonly roundUp: boolean;
};
export type Output = {
  readonly clocks: number;
  readonly actualSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idleSeconds: { type: "number" },
    clockHz: { type: "number", exclusiveMinimum: 0 },
    roundUp: { type: "boolean" },
  },
  required: ["idleSeconds", "clockHz", "roundUp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clocks: { type: "integer" },
    actualSeconds: { type: "number" },
  },
  required: ["clocks", "actualSeconds"],
} as const;
/** Compute spi interword idle clock count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { idleSeconds, clockHz, roundUp } = input;
  const compute = (): Output => {
    domain(idleSeconds >= 0);
    positive(clockHz);
    const raw = idleSeconds * clockHz,
      clocks = roundUp ? Math.ceil(raw) : Math.floor(raw);
    return { clocks, actualSeconds: clocks / clockHz };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { idleSeconds: 0.0025, clockHz: 1000, roundUp: true },
  output: { clocks: 3, actualSeconds: 0.003 },
} satisfies ToolExample<Input, Output>;
export const spiInterwordIdleClockCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/spi-interword-idle-clock-count",
  title: "SPI Interword Idle Clock Count Tool",
  description:
    "Compute spi interword idle clock count from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "idleSeconds",
        label: "Idle Seconds",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "clockHz",
        label: "Clock Hz",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "roundUp",
        label: "Round Up",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "clocks", label: "Clocks", valueType: { type: "integer" } },
      {
        id: "actualSeconds",
        label: "Actual Seconds",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = spiInterwordIdleClockCountTool.execute;
export default spiInterwordIdleClockCountTool;
