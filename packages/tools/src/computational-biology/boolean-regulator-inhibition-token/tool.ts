import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activators: readonly boolean[];
  readonly inhibitors: readonly boolean[];
  readonly activatorRule: string;
};
export type Output = {
  readonly activated: boolean;
  readonly inhibited: boolean;
  readonly output: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activators: { type: "array", maxItems: 256, items: { type: "boolean" } },
    inhibitors: { type: "array", maxItems: 256, items: { type: "boolean" } },
    activatorRule: { type: "string", maxLength: 8192, enum: ["all", "any"] },
  },
  required: ["activators", "inhibitors", "activatorRule"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activated: { type: "boolean" },
    inhibited: { type: "boolean" },
    output: { type: "boolean" },
  },
  required: ["activated", "inhibited", "output"],
} as const;
/** Evaluate an explicit Boolean gating rule; no gene network or biological effect is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activators, inhibitors, activatorRule } = request;
  const compute = (): Output => {
    H.domain(["all", "any"].includes(activatorRule));
    const activated =
        activatorRule === "all"
          ? activators.every(Boolean)
          : activators.some(Boolean),
      inhibited = inhibitors.some(Boolean);
    return { activated, inhibited, output: activated && !inhibited };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activators: [true, false],
    inhibitors: [false],
    activatorRule: "any",
  },
  output: { activated: true, inhibited: false, output: true },
} satisfies ToolExample<Input, Output>;
export const booleanRegulatorInhibitionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/boolean-regulator-inhibition-token",
    title: "Boolean Regulator Inhibition Token Tool",
    description:
      "Evaluate an explicit Boolean gating rule; no gene network or biological effect is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activators: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        inhibitors: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        activatorRule: {
          type: "string",
          maxLength: 8192,
          enum: ["all", "any"],
        },
      },
      required: ["activators", "inhibitors", "activatorRule"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activated: { type: "boolean" },
        inhibited: { type: "boolean" },
        output: { type: "boolean" },
      },
      required: ["activated", "inhibited", "output"],
    },
    ports: {
      inputs: [
        {
          id: "activators",
          label: "Activators",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "inhibitors",
          label: "Inhibitors",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "activatorRule",
          label: "Activator Rule",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "activated", label: "Activated", valueType: { type: "boolean" } },
        { id: "inhibited", label: "Inhibited", valueType: { type: "boolean" } },
        { id: "output", label: "Output", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = booleanRegulatorInhibitionTokenTool.execute;
export default booleanRegulatorInhibitionTokenTool;
