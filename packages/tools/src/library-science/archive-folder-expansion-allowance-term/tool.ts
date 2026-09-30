import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentThickness: number;
  readonly expectedIncreaseFraction: number;
  readonly fixedAllowance: number;
};
export type Output = {
  readonly plannedThickness: number;
  readonly allowance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentThickness: { type: "number", minimum: 0 },
    expectedIncreaseFraction: { type: "number", minimum: 0 },
    fixedAllowance: { type: "number", minimum: 0 },
  },
  required: ["currentThickness", "expectedIncreaseFraction", "fixedAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedThickness: { type: "number" },
    allowance: { type: "number" },
  },
  required: ["plannedThickness", "allowance"],
} as const;
/** Calculate archive folder expansion allowance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentThickness, expectedIncreaseFraction, fixedAllowance } =
    request;
  const compute = (): Output => {
    H.domain(
      currentThickness >= 0 &&
        expectedIncreaseFraction >= 0 &&
        fixedAllowance >= 0,
    );
    return {
      plannedThickness:
        currentThickness * (1 + expectedIncreaseFraction) + fixedAllowance,
      allowance: currentThickness * expectedIncreaseFraction + fixedAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentThickness: 10,
    expectedIncreaseFraction: 0.2,
    fixedAllowance: 1,
  },
  output: { plannedThickness: 13, allowance: 3 },
} satisfies ToolExample<Input, Output>;
export const archiveFolderExpansionAllowanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "library-science/archive-folder-expansion-allowance-term",
      title: "Archive Folder Expansion Allowance Term Tool",
      description:
        "Calculate archive folder expansion allowance term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          currentThickness: { type: "number", minimum: 0 },
          expectedIncreaseFraction: { type: "number", minimum: 0 },
          fixedAllowance: { type: "number", minimum: 0 },
        },
        required: [
          "currentThickness",
          "expectedIncreaseFraction",
          "fixedAllowance",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plannedThickness: { type: "number" },
          allowance: { type: "number" },
        },
        required: ["plannedThickness", "allowance"],
      },
      ports: {
        inputs: [
          {
            id: "currentThickness",
            label: "Current Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "expectedIncreaseFraction",
            label: "Expected Increase Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedAllowance",
            label: "Fixed Allowance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "plannedThickness",
            label: "Planned Thickness",
            valueType: { type: "number" },
          },
          {
            id: "allowance",
            label: "Allowance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = archiveFolderExpansionAllowanceTermTool.execute;
export default archiveFolderExpansionAllowanceTermTool;
