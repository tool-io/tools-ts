import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opened: number;
  readonly closed: number;
  readonly suppliedPaused: number;
};
export type Output = { readonly elapsed: number; readonly activeDelay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opened: { type: "number" },
    closed: { type: "number" },
    suppliedPaused: { type: "number", minimum: 0 },
  },
  required: ["opened", "closed", "suppliedPaused"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, activeDelay: { type: "number" } },
  required: ["elapsed", "activeDelay"],
} as const;
/** Administrative supplied review-action timing without clinical decision guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opened, closed, suppliedPaused } = request;
  const compute = (): Output => {
    H.domain(
      closed >= opened &&
        suppliedPaused >= 0 &&
        suppliedPaused <= closed - opened,
    );
    return {
      elapsed: closed - opened,
      activeDelay: closed - opened - suppliedPaused,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opened: 10, closed: 50, suppliedPaused: 5 },
  output: { elapsed: 40, activeDelay: 35 },
} satisfies ToolExample<Input, Output>;
export const reviewActionClosureDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/review-action-closure-delay",
    title: "Review Action Closure Delay Tool",
    description:
      "Administrative supplied review-action timing without clinical decision guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opened: { type: "number" },
        closed: { type: "number" },
        suppliedPaused: { type: "number", minimum: 0 },
      },
      required: ["opened", "closed", "suppliedPaused"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        activeDelay: { type: "number" },
      },
      required: ["elapsed", "activeDelay"],
    },
    ports: {
      inputs: [
        {
          id: "opened",
          label: "Opened",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closed",
          label: "Closed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPaused",
          label: "Supplied Paused",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "activeDelay",
          label: "Active Delay",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reviewActionClosureDelayTool.execute;
export default reviewActionClosureDelayTool;
