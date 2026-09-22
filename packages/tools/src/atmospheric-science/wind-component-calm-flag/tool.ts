import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eastward: number;
  readonly northward: number;
  readonly suppliedCalmThreshold: number;
  readonly equalityCalm: boolean;
};
export type Output = { readonly speed: number; readonly calm: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eastward: { type: "number" },
    northward: { type: "number" },
    suppliedCalmThreshold: { type: "number", minimum: 0 },
    equalityCalm: { type: "boolean" },
  },
  required: ["eastward", "northward", "suppliedCalmThreshold", "equalityCalm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { speed: { type: "number" }, calm: { type: "boolean" } },
  required: ["speed", "calm"],
} as const;
/** Calculate wind component calm flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eastward, northward, suppliedCalmThreshold, equalityCalm } = request;
  const compute = (): Output => {
    H.domain(suppliedCalmThreshold >= 0);
    return {
      speed: Math.hypot(eastward, northward),
      calm: equalityCalm
        ? Math.hypot(eastward, northward) <= suppliedCalmThreshold
        : Math.hypot(eastward, northward) < suppliedCalmThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eastward: 3,
    northward: 4,
    suppliedCalmThreshold: 5,
    equalityCalm: true,
  },
  output: { speed: 5, calm: true },
} satisfies ToolExample<Input, Output>;
export const windComponentCalmFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/wind-component-calm-flag",
    title: "Wind Component Calm Flag Tool",
    description:
      "Calculate wind component calm flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eastward: { type: "number" },
        northward: { type: "number" },
        suppliedCalmThreshold: { type: "number", minimum: 0 },
        equalityCalm: { type: "boolean" },
      },
      required: [
        "eastward",
        "northward",
        "suppliedCalmThreshold",
        "equalityCalm",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { speed: { type: "number" }, calm: { type: "boolean" } },
      required: ["speed", "calm"],
    },
    ports: {
      inputs: [
        {
          id: "eastward",
          label: "Eastward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "northward",
          label: "Northward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCalmThreshold",
          label: "Supplied Calm Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityCalm",
          label: "Equality Calm",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "speed", label: "Speed", valueType: { type: "number" } },
        { id: "calm", label: "Calm", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = windComponentCalmFlagTool.execute;
export default windComponentCalmFlagTool;
