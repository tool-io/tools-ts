import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inkMass: number;
  readonly setupWaste: number;
  readonly sheets: number;
  readonly students: number;
};
export type Output = {
  readonly usableInk: number;
  readonly perSheet: number;
  readonly perStudent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inkMass: { type: "number" },
    setupWaste: { type: "number", minimum: 0 },
    sheets: { type: "integer", minimum: 1 },
    students: { type: "integer", minimum: 1 },
  },
  required: ["inkMass", "setupWaste", "sheets", "students"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableInk: { type: "number" },
    perSheet: { type: "number" },
    perStudent: { type: "number" },
  },
  required: ["usableInk", "perSheet", "perStudent"],
} as const;
/** Calculate printmaking class ink per sheet term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inkMass, setupWaste, sheets, students } = request;
  const compute = (): Output => {
    H.domain(setupWaste >= 0 && inkMass >= setupWaste);
    H.integer(sheets, 1);
    H.integer(students, 1);
    return {
      usableInk: inkMass - setupWaste,
      perSheet: (inkMass - setupWaste) / sheets,
      perStudent: inkMass / students,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inkMass: 100, setupWaste: 20, sheets: 40, students: 10 },
  output: { usableInk: 80, perSheet: 2, perStudent: 10 },
} satisfies ToolExample<Input, Output>;
export const printmakingClassInkPerSheetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/printmaking-class-ink-per-sheet-term",
    title: "Printmaking Class Ink Per Sheet Term Tool",
    description:
      "Calculate printmaking class ink per sheet term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inkMass: { type: "number" },
        setupWaste: { type: "number", minimum: 0 },
        sheets: { type: "integer", minimum: 1 },
        students: { type: "integer", minimum: 1 },
      },
      required: ["inkMass", "setupWaste", "sheets", "students"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableInk: { type: "number" },
        perSheet: { type: "number" },
        perStudent: { type: "number" },
      },
      required: ["usableInk", "perSheet", "perStudent"],
    },
    ports: {
      inputs: [
        {
          id: "inkMass",
          label: "Ink Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "setupWaste",
          label: "Setup Waste",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sheets",
          label: "Sheets",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "students",
          label: "Students",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "usableInk", label: "Usable Ink", valueType: { type: "number" } },
        { id: "perSheet", label: "Per Sheet", valueType: { type: "number" } },
        {
          id: "perStudent",
          label: "Per Student",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = printmakingClassInkPerSheetTermTool.execute;
export default printmakingClassInkPerSheetTermTool;
