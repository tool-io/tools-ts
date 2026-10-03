import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly current: string;
  readonly previous: string;
  readonly p: string;
  readonly q: string;
};
export type Output = { readonly next: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "string", maxLength: 8192 },
    previous: { type: "string", maxLength: 8192 },
    p: { type: "string", maxLength: 8192 },
    q: { type: "string", maxLength: 8192 },
  },
  required: ["current", "previous", "p", "q"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { next: { type: "string", maxLength: 8192 } },
  required: ["next"],
} as const;
/** Calculate lucas recurrence one state update from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, previous, p, q } = request;
  const compute = (): Output => {
    const a = H.decimal(current),
      b = H.decimal(previous),
      pp = H.decimal(p),
      qq = H.decimal(q);
    return { next: String(pp * a - qq * b) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { current: "3", previous: "1", p: "2", q: "-1" },
  output: { next: "7" },
} satisfies ToolExample<Input, Output>;
export const lucasRecurrenceOneStateUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/lucas-recurrence-one-state-update",
    title: "Lucas Recurrence One State Update Tool",
    description:
      "Calculate lucas recurrence one state update from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "string", maxLength: 8192 },
        previous: { type: "string", maxLength: 8192 },
        p: { type: "string", maxLength: 8192 },
        q: { type: "string", maxLength: 8192 },
      },
      required: ["current", "previous", "p", "q"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { next: { type: "string", maxLength: 8192 } },
      required: ["next"],
    },
    ports: {
      inputs: [
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "string" },
        },
        { id: "p", label: "P", required: true, valueType: { type: "string" } },
        { id: "q", label: "Q", required: true, valueType: { type: "string" } },
      ],
      outputs: [{ id: "next", label: "Next", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = lucasRecurrenceOneStateUpdateTool.execute;
export default lucasRecurrenceOneStateUpdateTool;
