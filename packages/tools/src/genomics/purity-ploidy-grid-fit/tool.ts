import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { fraction, positive, rectangular } from "../shared.js";

export type Input = Readonly<{
  readonly purityValues: readonly number[];
  readonly ploidyValues: readonly number[];
  readonly residualGrid: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly bestPurity: number;
  readonly bestPloidy: number;
  readonly minimumResidual: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  rectangular(input.residualGrid, "residualGrid");
  if (
    input.residualGrid.length !== input.purityValues.length ||
    input.residualGrid[0].length !== input.ploidyValues.length
  )
    simpleError(
      "residualGrid",
      "Residual rows must align with purities and columns with ploidies.",
    );
  input.purityValues.forEach((v) => fraction(v, "purityValues"));
  input.ploidyValues.forEach((v) => positive(v, "ploidyValues"));
  let row = 0,
    col = 0;
  for (let i = 0; i < input.purityValues.length; i++)
    for (let j = 0; j < input.ploidyValues.length; j++)
      if (input.residualGrid[i][j] < input.residualGrid[row][col]) {
        row = i;
        col = j;
      }
  return {
    bestPurity: input.purityValues[row],
    bestPloidy: input.ploidyValues[col],
    minimumResidual: input.residualGrid[row][col],
  };
};
export const exampleInput = {
  purityValues: [0.5, 1],
  ploidyValues: [2, 3],
  residualGrid: [
    [4, 2],
    [1, 3],
  ],
} satisfies Input;
export const exampleOutput = {
  bestPurity: 1,
  bestPloidy: 2,
  minimumResidual: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purityValues: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 128,
    },
    ploidyValues: {
      type: "array",
      items: {
        type: "number",
        exclusiveMinimum: 0,
      },
      minItems: 1,
      maxItems: 128,
    },
    residualGrid: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "number",
          minimum: 0,
        },
        minItems: 1,
        maxItems: 128,
      },
      minItems: 1,
      maxItems: 128,
    },
  },
  required: ["purityValues", "ploidyValues", "residualGrid"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bestPurity: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
    bestPloidy: {
      type: "number",
      exclusiveMinimum: 0,
    },
    minimumResidual: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["bestPurity", "bestPloidy", "minimumResidual"],
} as const satisfies ToolJsonSchema;

// The shared schema matcher uses Array.every, which skips holes; reject sparse lists explicitly.
const matchesDenseSchema = (value: unknown, schema: ToolJsonSchema): boolean => {
  if (!matchesToolJsonSchema(value, schema)) return false;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (!Object.hasOwn(value, i)) return false;
      if (schema.items && !matchesDenseSchema(value[i], schema.items)) return false;
    }
  } else if (typeof value === "object" && value !== null && schema.properties) {
    const fields = new Map<string, unknown>(Object.entries(value as Record<string, unknown>));
    for (const [field, fieldSchema] of Object.entries(schema.properties))
      if (!matchesDenseSchema(fields.get(field), fieldSchema)) return false;
  }
  return true;
};

function validateInput(value: unknown): asserts value is Input {
  if (matchesDenseSchema(value, inputSchema)) return;
  if (typeof value !== "object" || value === null || Array.isArray(value))
    simpleError("", "Input must be an object.", "object_required");
  const fields = new Map<string, unknown>(Object.entries(value as Record<string, unknown>));
  for (const field of fields.keys())
    if (!Object.hasOwn(inputSchema.properties, field))
      simpleError(field, `${field} is not a supported input field.`, "unknown_field");
  for (const [field, schema] of Object.entries(inputSchema.properties))
    if (!matchesDenseSchema(fields.get(field), schema))
      simpleError(field, `${field} does not match the declared input schema.`, "invalid_field");
  simpleError("", "Input does not match the tool schema.", "invalid_field");
}

export const run = (input: unknown): ToolResult<Output> => {
  try {
    validateInput(input);
    const output = calculate(input);
    if (!matchesDenseSchema(output, outputSchema))
      throw new Error("Calculation produced output outside its declared schema.");
    return toolSuccess(output);
  } catch (error) {
    if (!(error instanceof SimpleToolError)) throw error;
    return invalidInput([{ code: error.code, field: error.field, message: error.message }]);
  }
};

export const tool = defineTool<Input, Output>({
  contractVersion: 1,
  id: "genomics/purity-ploidy-grid-fit",
  title: "Purity Ploidy Grid Fit",
  description: "Choose the minimum-residual cell from an externally fitted purity-by-ploidy grid.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "purityValues",
        label: "Purity values",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "ploidyValues",
        label: "Ploidy values",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "residualGrid",
        label: "Residual grid",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "list",
            items: {
              type: "number",
            },
          },
        },
      },
    ],
    outputs: [
      {
        id: "bestPurity",
        label: "Best purity",
        valueType: {
          type: "number",
        },
      },
      {
        id: "bestPloidy",
        label: "Best ploidy",
        valueType: {
          type: "number",
        },
      },
      {
        id: "minimumResidual",
        label: "Minimum residual",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
