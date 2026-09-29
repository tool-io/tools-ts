import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingWidth: number;
  readonly gripWidth: number;
  readonly leftAllowance: number;
  readonly rightAllowance: number;
};
export type Output = {
  readonly clearance: number;
  readonly usableOpening: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingWidth: { type: "number", minimum: 0 },
    gripWidth: { type: "number", minimum: 0 },
    leftAllowance: { type: "number", minimum: 0 },
    rightAllowance: { type: "number", minimum: 0 },
  },
  required: ["openingWidth", "gripWidth", "leftAllowance", "rightAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearance: { type: "number" },
    usableOpening: { type: "number" },
  },
  required: ["clearance", "usableOpening"],
} as const;
/** Supplied nominal geometry without ergonomic suitability or safety claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingWidth, gripWidth, leftAllowance, rightAllowance } = request;
  const compute = (): Output => {
    H.domain(
      openingWidth >= 0 &&
        gripWidth >= 0 &&
        leftAllowance >= 0 &&
        rightAllowance >= 0,
    );
    return {
      clearance: openingWidth - gripWidth - leftAllowance - rightAllowance,
      usableOpening: openingWidth - leftAllowance - rightAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingWidth: 100,
    gripWidth: 70,
    leftAllowance: 5,
    rightAllowance: 5,
  },
  output: { clearance: 20, usableOpening: 90 },
} satisfies ToolExample<Input, Output>;
export const gripClearanceDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/grip-clearance-difference",
    title: "Grip Clearance Difference Tool",
    description:
      "Supplied nominal geometry without ergonomic suitability or safety claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingWidth: { type: "number", minimum: 0 },
        gripWidth: { type: "number", minimum: 0 },
        leftAllowance: { type: "number", minimum: 0 },
        rightAllowance: { type: "number", minimum: 0 },
      },
      required: [
        "openingWidth",
        "gripWidth",
        "leftAllowance",
        "rightAllowance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearance: { type: "number" },
        usableOpening: { type: "number" },
      },
      required: ["clearance", "usableOpening"],
    },
    ports: {
      inputs: [
        {
          id: "openingWidth",
          label: "Opening Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gripWidth",
          label: "Grip Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftAllowance",
          label: "Left Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightAllowance",
          label: "Right Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
        {
          id: "usableOpening",
          label: "Usable Opening",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gripClearanceDifferenceTool.execute;
export default gripClearanceDifferenceTool;
