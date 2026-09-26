import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeVoltage: number;
  readonly immediatelyAfterVoltage: number;
  readonly beforeCurrent: number;
  readonly afterCurrent: number;
};
export type Output = {
  readonly voltageDrop: number;
  readonly resistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeVoltage: { type: "number" },
    immediatelyAfterVoltage: { type: "number" },
    beforeCurrent: { type: "number" },
    afterCurrent: { type: "number" },
  },
  required: [
    "beforeVoltage",
    "immediatelyAfterVoltage",
    "beforeCurrent",
    "afterCurrent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltageDrop: { type: "number" },
    resistance: { type: "number" },
  },
  required: ["voltageDrop", "resistance"],
} as const;
/** Signed instantaneous delta-voltage/delta-current estimate; slower polarization relaxation must be excluded by the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    beforeVoltage,
    immediatelyAfterVoltage,
    beforeCurrent,
    afterCurrent,
  } = request;
  const compute = (): Output => {
    H.domain(beforeCurrent !== afterCurrent);
    return {
      voltageDrop: beforeVoltage - immediatelyAfterVoltage,
      resistance:
        (beforeVoltage - immediatelyAfterVoltage) /
        (beforeCurrent - afterCurrent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beforeVoltage: 4,
    immediatelyAfterVoltage: 3.8,
    beforeCurrent: 2,
    afterCurrent: 0,
  },
  output: { voltageDrop: 0.20000000000000018, resistance: 0.10000000000000009 },
} satisfies ToolExample<Input, Output>;
export const currentInterruptOhmicDropTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/current-interrupt-ohmic-drop-term",
    title: "Current Interrupt Ohmic Drop Term Tool",
    description:
      "Signed instantaneous delta-voltage/delta-current estimate; slower polarization relaxation must be excluded by the caller.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeVoltage: { type: "number" },
        immediatelyAfterVoltage: { type: "number" },
        beforeCurrent: { type: "number" },
        afterCurrent: { type: "number" },
      },
      required: [
        "beforeVoltage",
        "immediatelyAfterVoltage",
        "beforeCurrent",
        "afterCurrent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voltageDrop: { type: "number" },
        resistance: { type: "number" },
      },
      required: ["voltageDrop", "resistance"],
    },
    ports: {
      inputs: [
        {
          id: "beforeVoltage",
          label: "Before Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "immediatelyAfterVoltage",
          label: "Immediately After Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beforeCurrent",
          label: "Before Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterCurrent",
          label: "After Current",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voltageDrop",
          label: "Voltage Drop",
          valueType: { type: "number" },
        },
        {
          id: "resistance",
          label: "Resistance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = currentInterruptOhmicDropTermTool.execute;
export default currentInterruptOhmicDropTermTool;
