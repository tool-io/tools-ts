import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialGap: number;
  readonly imposedDisplacement: number;
  readonly elasticReturn: number;
};
export type Output = {
  readonly remainingGap: number;
  readonly closed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialGap: { type: "number", minimum: 0 },
    imposedDisplacement: { type: "number", minimum: 0 },
    elasticReturn: { type: "number", minimum: 0 },
  },
  required: ["initialGap", "imposedDisplacement", "elasticReturn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingGap: { type: "number" }, closed: { type: "boolean" } },
  required: ["remainingGap", "closed"],
} as const;
/** Signed bench gap closure with independently supplied imposed displacement and return. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialGap, imposedDisplacement, elasticReturn } = request;
  const compute = (): Output => {
    H.domain(
      initialGap >= 0 &&
        imposedDisplacement >= 0 &&
        elasticReturn >= 0 &&
        elasticReturn <= imposedDisplacement,
    );
    return {
      remainingGap: initialGap - imposedDisplacement + elasticReturn,
      closed: initialGap - imposedDisplacement + elasticReturn <= 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialGap: 3, imposedDisplacement: 4, elasticReturn: 0.5 },
  output: { remainingGap: -0.5, closed: true },
} satisfies ToolExample<Input, Output>;
export const prosthesisBenchGapClosureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthesis-bench-gap-closure",
    title: "Prosthesis Bench Gap Closure Tool",
    description:
      "Signed bench gap closure with independently supplied imposed displacement and return.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialGap: { type: "number", minimum: 0 },
        imposedDisplacement: { type: "number", minimum: 0 },
        elasticReturn: { type: "number", minimum: 0 },
      },
      required: ["initialGap", "imposedDisplacement", "elasticReturn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingGap: { type: "number" },
        closed: { type: "boolean" },
      },
      required: ["remainingGap", "closed"],
    },
    ports: {
      inputs: [
        {
          id: "initialGap",
          label: "Initial Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imposedDisplacement",
          label: "Imposed Displacement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elasticReturn",
          label: "Elastic Return",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingGap",
          label: "Remaining Gap",
          valueType: { type: "number" },
        },
        { id: "closed", label: "Closed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = prosthesisBenchGapClosureTool.execute;
export default prosthesisBenchGapClosureTool;
