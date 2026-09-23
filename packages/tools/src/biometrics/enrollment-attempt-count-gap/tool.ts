import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attempts: number;
  readonly suppliedLimit: number;
};
export type Output = { readonly remaining: number; readonly exceeded: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attempts: { type: "integer", minimum: 0 },
    suppliedLimit: { type: "integer", minimum: 0 },
  },
  required: ["attempts", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "integer" }, exceeded: { type: "boolean" } },
  required: ["remaining", "exceeded"],
} as const;
/** Calculate enrollment attempt count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attempts, suppliedLimit } = request;
  const compute = (): Output => {
    H.integer(attempts, 0);
    H.integer(suppliedLimit, 0);
    return {
      remaining: suppliedLimit - attempts,
      exceeded: attempts > suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attempts: 3, suppliedLimit: 5 },
  output: { remaining: 2, exceeded: false },
} satisfies ToolExample<Input, Output>;
export const enrollmentAttemptCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/enrollment-attempt-count-gap",
    title: "Enrollment Attempt Count Gap Tool",
    description:
      "Calculate enrollment attempt count gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attempts: { type: "integer", minimum: 0 },
        suppliedLimit: { type: "integer", minimum: 0 },
      },
      required: ["attempts", "suppliedLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "integer" },
        exceeded: { type: "boolean" },
      },
      required: ["remaining", "exceeded"],
    },
    ports: {
      inputs: [
        {
          id: "attempts",
          label: "Attempts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "exceeded", label: "Exceeded", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = enrollmentAttemptCountGapTool.execute;
export default enrollmentAttemptCountGapTool;
