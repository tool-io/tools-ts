import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wells: number;
  readonly reserved: number;
  readonly students: number;
};
export type Output = {
  readonly perStudent: number;
  readonly unallocated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wells: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    students: { type: "integer", minimum: 1 },
  },
  required: ["wells", "reserved", "students"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perStudent: { type: "integer" },
    unallocated: { type: "integer" },
  },
  required: ["perStudent", "unallocated"],
} as const;
/** Calculate student palette shared well allocation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wells, reserved, students } = request;
  const compute = (): Output => {
    H.integer(wells, 0);
    H.integer(reserved, 0, wells);
    H.integer(students, 1);
    return {
      perStudent: Math.floor((wells - reserved) / students),
      unallocated: (wells - reserved) % students,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wells: 24, reserved: 4, students: 6 },
  output: { perStudent: 3, unallocated: 2 },
} satisfies ToolExample<Input, Output>;
export const studentPaletteSharedWellAllocationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/student-palette-shared-well-allocation",
    title: "Student Palette Shared Well Allocation Tool",
    description:
      "Calculate student palette shared well allocation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wells: { type: "integer", minimum: 0 },
        reserved: { type: "integer", minimum: 0 },
        students: { type: "integer", minimum: 1 },
      },
      required: ["wells", "reserved", "students"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perStudent: { type: "integer" },
        unallocated: { type: "integer" },
      },
      required: ["perStudent", "unallocated"],
    },
    ports: {
      inputs: [
        {
          id: "wells",
          label: "Wells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserved",
          label: "Reserved",
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
        {
          id: "perStudent",
          label: "Per Student",
          valueType: { type: "integer" },
        },
        {
          id: "unallocated",
          label: "Unallocated",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = studentPaletteSharedWellAllocationTool.execute;
export default studentPaletteSharedWellAllocationTool;
