import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fresh: number;
  readonly recycle: number;
  readonly reactorFeed: number;
  readonly outlet: number;
  readonly purge: number;
};
export type Output = {
  readonly feedResidual: number;
  readonly splitResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fresh: { type: "number", minimum: 0 },
    recycle: { type: "number", minimum: 0 },
    reactorFeed: { type: "number", minimum: 0 },
    outlet: { type: "number", minimum: 0 },
    purge: { type: "number", minimum: 0 },
  },
  required: ["fresh", "recycle", "reactorFeed", "outlet", "purge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedResidual: { type: "number" },
    splitResidual: { type: "number" },
  },
  required: ["feedResidual", "splitResidual"],
} as const;
/** Two signed supplied mass-flow balance residuals, without a process operating recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fresh, recycle, reactorFeed, outlet, purge } = request;
  const compute = (): Output => {
    H.domain(
      fresh >= 0 &&
        recycle >= 0 &&
        reactorFeed >= 0 &&
        outlet >= 0 &&
        purge >= 0,
    );
    return {
      feedResidual: reactorFeed - fresh - recycle,
      splitResidual: outlet - recycle - purge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fresh: 10, recycle: 40, reactorFeed: 50, outlet: 55, purge: 15 },
  output: { feedResidual: 0, splitResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const recyclePurgeLoopResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/recycle-purge-loop-residual",
    title: "Recycle Purge Loop Residual Tool",
    description:
      "Two signed supplied mass-flow balance residuals, without a process operating recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fresh: { type: "number", minimum: 0 },
        recycle: { type: "number", minimum: 0 },
        reactorFeed: { type: "number", minimum: 0 },
        outlet: { type: "number", minimum: 0 },
        purge: { type: "number", minimum: 0 },
      },
      required: ["fresh", "recycle", "reactorFeed", "outlet", "purge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedResidual: { type: "number" },
        splitResidual: { type: "number" },
      },
      required: ["feedResidual", "splitResidual"],
    },
    ports: {
      inputs: [
        {
          id: "fresh",
          label: "Fresh",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recycle",
          label: "Recycle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reactorFeed",
          label: "Reactor Feed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outlet",
          label: "Outlet",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purge",
          label: "Purge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "feedResidual",
          label: "Feed Residual",
          valueType: { type: "number" },
        },
        {
          id: "splitResidual",
          label: "Split Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recyclePurgeLoopResidualTool.execute;
export default recyclePurgeLoopResidualTool;
