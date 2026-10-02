import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actions: readonly string[];
  readonly initialDepth: number;
};
export type Output = {
  readonly finalDepth: number;
  readonly peakDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    initialDepth: { type: "integer", minimum: 0 },
  },
  required: ["actions", "initialDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalDepth: { type: "integer" },
    peakDepth: { type: "integer" },
  },
  required: ["finalDepth", "peakDepth"],
} as const;
/** Audit explicit opening/closing assumption-scope actions without evaluating argument validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actions, initialDepth } = request;
  const compute = (): Output => {
    H.integer(initialDepth, 0);
    H.domain(actions.every((x) => x === "open" || x === "close"));
    let finalDepth = initialDepth,
      peakDepth = initialDepth;
    for (const a of actions) {
      finalDepth += a === "open" ? 1 : -1;
      H.domain(finalDepth >= 0, "actions");
      peakDepth = Math.max(peakDepth, finalDepth);
    }
    return { finalDepth, peakDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actions: ["open", "open", "close"], initialDepth: 0 },
  output: { finalDepth: 1, peakDepth: 2 },
} satisfies ToolExample<Input, Output>;
export const argumentAssumptionScopeDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/argument-assumption-scope-depth",
    title: "Argument Assumption Scope Depth Tool",
    description:
      "Audit explicit opening/closing assumption-scope actions without evaluating argument validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        initialDepth: { type: "integer", minimum: 0 },
      },
      required: ["actions", "initialDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finalDepth: { type: "integer" },
        peakDepth: { type: "integer" },
      },
      required: ["finalDepth", "peakDepth"],
    },
    ports: {
      inputs: [
        {
          id: "actions",
          label: "Actions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "initialDepth",
          label: "Initial Depth",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "finalDepth",
          label: "Final Depth",
          valueType: { type: "integer" },
        },
        {
          id: "peakDepth",
          label: "Peak Depth",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = argumentAssumptionScopeDepthTool.execute;
export default argumentAssumptionScopeDepthTool;
