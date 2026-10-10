import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enteredUnits: number;
  readonly passedWithoutRework: number;
};
export type Output = {
  readonly firstPassYield: number;
  readonly firstPassFailures: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enteredUnits: { type: "integer", minimum: 0 },
    passedWithoutRework: { type: "integer", minimum: 0 },
  },
  required: ["enteredUnits", "passedWithoutRework"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPassYield: { type: "number" },
    firstPassFailures: { type: "integer" },
    defined: { type: "boolean" },
  },
  required: ["firstPassYield", "firstPassFailures", "defined"],
} as const;
/** Calculate first-pass yield from explicit entered and no-rework pass counts, distinguishing an empty input count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { enteredUnits, passedWithoutRework } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(enteredUnits) &&
        enteredUnits >= 0 &&
        enteredUnits <= Number.MAX_SAFE_INTEGER,
      "enteredUnits",
    ),
      enteredUnits);
    (H.domain(
      Number.isSafeInteger(passedWithoutRework) &&
        passedWithoutRework >= 0 &&
        passedWithoutRework <= enteredUnits,
      "passedWithoutRework",
    ),
      passedWithoutRework);
    return {
      firstPassYield: enteredUnits > 0 ? passedWithoutRework / enteredUnits : 0,
      firstPassFailures: enteredUnits - passedWithoutRework,
      defined: enteredUnits > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { enteredUnits: 100, passedWithoutRework: 92 },
  output: { firstPassYield: 0.92, firstPassFailures: 8, defined: true },
} satisfies ToolExample<Input, Output>;
export const processFirstPassYieldFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "industrial-engineering",
        "industrial engineering",
        "engineering",
      ],
      keywords: ["industrial engineering", "engineering"],
    },
    id: "industrial-engineering/process-first-pass-yield-factor",
    title: "Process First Pass Yield Factor",
    description:
      "Calculate first-pass yield from explicit entered and no-rework pass counts, distinguishing an empty input count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enteredUnits: { type: "integer", minimum: 0 },
        passedWithoutRework: { type: "integer", minimum: 0 },
      },
      required: ["enteredUnits", "passedWithoutRework"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPassYield: { type: "number" },
        firstPassFailures: { type: "integer" },
        defined: { type: "boolean" },
      },
      required: ["firstPassYield", "firstPassFailures", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "enteredUnits",
          label: "Entered Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "passedWithoutRework",
          label: "Passed Without Rework",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "firstPassYield",
          label: "First Pass Yield",
          valueType: { type: "number" },
        },
        {
          id: "firstPassFailures",
          label: "First Pass Failures",
          valueType: { type: "integer" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = processFirstPassYieldFactorTool.execute;
export default processFirstPassYieldFactorTool;
