import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speed: number;
  readonly coriolis: number;
  readonly length: number;
};
export type Output = { readonly rossby: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speed: { type: "number", minimum: 0 },
    coriolis: { type: "number" },
    length: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["speed", "coriolis", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rossby: { type: "number" } },
  required: ["rossby"],
} as const;
/** Calculate rossby number single scale term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speed, coriolis, length } = request;
  const compute = (): Output => {
    H.domain(speed >= 0 && coriolis !== 0);
    H.positive(length);
    return { rossby: speed / (Math.abs(coriolis) * length) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speed: 10, coriolis: 0.0001, length: 100000 },
  output: { rossby: 1 },
} satisfies ToolExample<Input, Output>;
export const rossbyNumberSingleScaleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/rossby-number-single-scale-term",
    title: "Rossby Number Single Scale Term Tool",
    description:
      "Calculate rossby number single scale term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speed: { type: "number", minimum: 0 },
        coriolis: { type: "number" },
        length: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["speed", "coriolis", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rossby: { type: "number" } },
      required: ["rossby"],
    },
    ports: {
      inputs: [
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coriolis",
          label: "Coriolis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rossby", label: "Rossby", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rossbyNumberSingleScaleTermTool.execute;
export default rossbyNumberSingleScaleTermTool;
