import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type JosephusKStepInput = {
  readonly people: number;
  readonly step: string;
};
export type JosephusKStepOutput = {
  readonly survivor: number;
};

export const josephusKStepInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    people: {
      type: "integer",
      minimum: 1,
      maximum: 100000,
      description: "People in the circle (resource limit 100000)",
    },
    step: {
      type: "string",
      pattern: "^[1-9][0-9]*$",
      maxLength: 200,
      description: "Positive counting step",
    },
  },
  required: ["people", "step"],
} as const satisfies ToolJsonSchema;
export const josephusKStepOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    survivor: {
      type: "integer",
      minimum: 1,
      maximum: 100000,
      description: "One-based survivor position",
    },
  },
  required: ["survivor"],
} as const satisfies ToolJsonSchema;

const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Definition and independently known values: https://www3.cs.stonybrook.edu/~nbanati/josephus_problem.pdf
export const calculateJosephusKStep = (rawInput: unknown): ToolResult<JosephusKStepOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as {
    readonly people?: unknown;
    readonly step?: unknown;
  };
  for (const key of Object.keys(candidate)) {
    if (!["people", "step"].includes(key))
      return issue(key, "unknown_field", "Unsupported input field.");
  }
  const peopleValue = candidate.people;
  if (typeof peopleValue !== "number" || !Number.isSafeInteger(peopleValue))
    return issue("people", "invalid_type", "Enter a finite safe integer.");
  if (peopleValue < 1)
    return issue("people", "out_of_range", "Value must be at least 1.");
  if (peopleValue > 100000)
    return issue("people", "resource_limit", "Value must be at most 100000.");
  const stepValue = candidate.step;
  if (typeof stepValue !== "string")
    return issue("step", "invalid_type", "Enter an integer as a decimal string.");
  if (stepValue.length > 200)
    return issue("step", "resource_limit", "Decimal input exceeds the 200-character resource limit.");
  if (!/^[1-9][0-9]*$/.test(stepValue))
    return issue("step", "invalid_format", "Enter a canonical decimal integer with the required sign.");
  const input: JosephusKStepInput = { people: peopleValue, step: stepValue };
  const step = BigInt(input.step);
  let position = 0n;
  for (let size = 2n; size <= BigInt(input.people); size++) position = (position + step) % size;
  return toolSuccess({ survivor: Number(position) + 1 });
};

export const example = {
  input: {
    people: 7,
    step: "3",
  },
  output: {
    survivor: 4,
  },
} satisfies ToolExample<JosephusKStepInput, JosephusKStepOutput>;

export const josephusKStepTool = defineTool<JosephusKStepInput, JosephusKStepOutput>({
  id: "math/josephus-k-step",
  title: "Josephus Survivor for General Step Size",
  description: "Find the one-based survivor when counting begins at position one and every kth person is removed, using an exact decimal step size and at most 100,000 people.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: josephusKStepInputSchema,
  outputSchema: josephusKStepOutputSchema,
  ports: {
    inputs: [
      {
        id: "people",
        label: "People in the circle (resource limit 100000)",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "step",
        label: "Positive counting step",
        required: true,
        valueType: {
          type: "string",
          format: "integer/arbitrary",
        },
      },
    ],
    outputs: [
      {
        id: "survivor",
        label: "One-based survivor position",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: calculateJosephusKStep,
});
export const runJosephusKStep = josephusKStepTool.execute;
export default josephusKStepTool;
