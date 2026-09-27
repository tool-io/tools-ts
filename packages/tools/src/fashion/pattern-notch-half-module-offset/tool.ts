import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly module: number;
  readonly notchIndex: number;
  readonly halfOffset: boolean;
  readonly origin: number;
};
export type Output = { readonly position: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    module: { type: "number", exclusiveMinimum: 0 },
    notchIndex: { type: "integer", minimum: 0 },
    halfOffset: { type: "boolean" },
    origin: { type: "number" },
  },
  required: ["module", "notchIndex", "halfOffset", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { position: { type: "number" } },
  required: ["position"],
} as const;
/** Calculate pattern notch half module offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { module, notchIndex, halfOffset, origin } = request;
  const compute = (): Output => {
    H.positive(module);
    H.integer(notchIndex, 0);
    return {
      position: origin + (notchIndex + (halfOffset ? 0.5 : 0)) * module,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { module: 4, notchIndex: 3, halfOffset: true, origin: 1 },
  output: { position: 15 },
} satisfies ToolExample<Input, Output>;
export const patternNotchHalfModuleOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/pattern-notch-half-module-offset",
    title: "Pattern Notch Half Module Offset Tool",
    description:
      "Calculate pattern notch half module offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        module: { type: "number", exclusiveMinimum: 0 },
        notchIndex: { type: "integer", minimum: 0 },
        halfOffset: { type: "boolean" },
        origin: { type: "number" },
      },
      required: ["module", "notchIndex", "halfOffset", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { position: { type: "number" } },
      required: ["position"],
    },
    ports: {
      inputs: [
        {
          id: "module",
          label: "Module",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "notchIndex",
          label: "Notch Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "halfOffset",
          label: "Half Offset",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "position", label: "Position", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = patternNotchHalfModuleOffsetTool.execute;
export default patternNotchHalfModuleOffsetTool;
