import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly argument: string;
  readonly attackers: readonly string[];
  readonly targets: readonly string[];
};
export type Output = { readonly incoming: number; readonly outgoing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    argument: { type: "string", maxLength: 8192 },
    attackers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targets: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["argument", "attackers", "targets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { incoming: { type: "integer" }, outgoing: { type: "integer" } },
  required: ["incoming", "outgoing"],
} as const;
/** Count supplied attack-edge incidences, including repeated edges and self-attacks as listed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { argument, attackers, targets } = request;
  const compute = (): Output => {
    H.sameLength(attackers, targets);
    return {
      incoming: targets.filter((x) => x === argument).length,
      outgoing: attackers.filter((x) => x === argument).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    argument: "a",
    attackers: ["a", "b", "a"],
    targets: ["b", "a", "a"],
  },
  output: { incoming: 2, outgoing: 2 },
} satisfies ToolExample<Input, Output>;
export const argumentAttackInoutDegreeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/argument-attack-inout-degree",
    title: "Argument Attack Inout Degree Tool",
    description:
      "Count supplied attack-edge incidences, including repeated edges and self-attacks as listed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        argument: { type: "string", maxLength: 8192 },
        attackers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targets: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["argument", "attackers", "targets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incoming: { type: "integer" },
        outgoing: { type: "integer" },
      },
      required: ["incoming", "outgoing"],
    },
    ports: {
      inputs: [
        {
          id: "argument",
          label: "Argument",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "attackers",
          label: "Attackers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targets",
          label: "Targets",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "incoming", label: "Incoming", valueType: { type: "integer" } },
        { id: "outgoing", label: "Outgoing", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = argumentAttackInoutDegreeTool.execute;
export default argumentAttackInoutDegreeTool;
