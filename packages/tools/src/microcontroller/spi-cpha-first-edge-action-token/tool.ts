import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly cpha: number; readonly cpol: number };
export type Output = {
  readonly firstEdge: string;
  readonly action: string;
  readonly idleLevel: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cpha: { type: "integer", minimum: 0, maximum: 1 },
    cpol: { type: "integer", minimum: 0, maximum: 1 },
  },
  required: ["cpha", "cpol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEdge: { type: "string", maxLength: 8192 },
    action: { type: "string", maxLength: 8192 },
    idleLevel: { type: "integer" },
  },
  required: ["firstEdge", "action", "idleLevel"],
} as const;
/** Compute spi cpha first edge action token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { cpha, cpol } = input;
  const compute = (): Output => {
    integer(cpha, 0, 1);
    integer(cpol, 0, 1);
    return {
      firstEdge: cpol === 0 ? "rising" : "falling",
      action: cpha === 0 ? "sample" : "shift",
      idleLevel: cpol,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cpha: 0, cpol: 0 },
  output: { firstEdge: "rising", action: "sample", idleLevel: 0 },
} satisfies ToolExample<Input, Output>;
export const spiCphaFirstEdgeActionTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/spi-cpha-first-edge-action-token",
  title: "SPI Cpha First Edge Action Token Tool",
  description:
    "Compute spi cpha first edge action token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "cpha",
        label: "Cpha",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "cpol",
        label: "Cpol",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "firstEdge", label: "First Edge", valueType: { type: "string" } },
      { id: "action", label: "Action", valueType: { type: "string" } },
      { id: "idleLevel", label: "Idle Level", valueType: { type: "integer" } },
    ],
  },
});
export const run = spiCphaFirstEdgeActionTokenTool.execute;
export default spiCphaFirstEdgeActionTokenTool;
