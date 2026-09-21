import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly waiting: number; readonly elapsed: number };
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waiting: { type: "number", minimum: 0 },
    elapsed: { type: "number", minimum: 0 },
  },
  required: ["waiting", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate approval wait time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waiting, elapsed } = request;
  const compute = (): Output => {
    H.domain(elapsed >= 0 && waiting >= 0 && waiting <= elapsed);
    return { share: elapsed > 0 ? waiting / elapsed : 0, defined: elapsed > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waiting: 5, elapsed: 20 },
  output: { share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const approvalWaitTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/approval-wait-time-share",
    title: "Approval Wait Time Share Tool",
    description:
      "Calculate approval wait time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waiting: { type: "number", minimum: 0 },
        elapsed: { type: "number", minimum: 0 },
      },
      required: ["waiting", "elapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "waiting",
          label: "Waiting",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = approvalWaitTimeShareTool.execute;
export default approvalWaitTimeShareTool;
