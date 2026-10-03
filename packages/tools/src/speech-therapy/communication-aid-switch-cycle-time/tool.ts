import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowChoices: number;
  readonly columnChoices: number;
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly dwellSeconds: number;
  readonly confirmationSeconds: number;
};
export type Output = {
  readonly rowDelay: number;
  readonly columnDelay: number;
  readonly totalSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowChoices: { type: "integer", minimum: 1 },
    columnChoices: { type: "integer", minimum: 1 },
    rowIndex: { type: "integer", minimum: 0 },
    columnIndex: { type: "integer", minimum: 0 },
    dwellSeconds: { type: "number", minimum: 0 },
    confirmationSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "rowChoices",
    "columnChoices",
    "rowIndex",
    "columnIndex",
    "dwellSeconds",
    "confirmationSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowDelay: { type: "number" },
    columnDelay: { type: "number" },
    totalSeconds: { type: "number" },
  },
  required: ["rowDelay", "columnDelay", "totalSeconds"],
} as const;
/** Calculate communication aid switch cycle time from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rowChoices,
    columnChoices,
    rowIndex,
    columnIndex,
    dwellSeconds,
    confirmationSeconds,
  } = request;
  const compute = (): Output => {
    H.integer(rowChoices, 1);
    H.integer(columnChoices, 1);
    H.integer(rowIndex, 0, rowChoices - 1);
    H.integer(columnIndex, 0, columnChoices - 1);
    H.domain(dwellSeconds >= 0 && confirmationSeconds >= 0);
    return {
      rowDelay: rowIndex * dwellSeconds,
      columnDelay: columnIndex * dwellSeconds,
      totalSeconds:
        (rowIndex + columnIndex) * dwellSeconds + confirmationSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rowChoices: 4,
    columnChoices: 5,
    rowIndex: 2,
    columnIndex: 3,
    dwellSeconds: 0.5,
    confirmationSeconds: 0.2,
  },
  output: { rowDelay: 1, columnDelay: 1.5, totalSeconds: 2.7 },
} satisfies ToolExample<Input, Output>;
export const communicationAidSwitchCycleTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/communication-aid-switch-cycle-time",
    title: "Communication Aid Switch Cycle Time Tool",
    description:
      "Calculate communication aid switch cycle time from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowChoices: { type: "integer", minimum: 1 },
        columnChoices: { type: "integer", minimum: 1 },
        rowIndex: { type: "integer", minimum: 0 },
        columnIndex: { type: "integer", minimum: 0 },
        dwellSeconds: { type: "number", minimum: 0 },
        confirmationSeconds: { type: "number", minimum: 0 },
      },
      required: [
        "rowChoices",
        "columnChoices",
        "rowIndex",
        "columnIndex",
        "dwellSeconds",
        "confirmationSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowDelay: { type: "number" },
        columnDelay: { type: "number" },
        totalSeconds: { type: "number" },
      },
      required: ["rowDelay", "columnDelay", "totalSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "rowChoices",
          label: "Row Choices",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnChoices",
          label: "Column Choices",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowIndex",
          label: "Row Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnIndex",
          label: "Column Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dwellSeconds",
          label: "Dwell Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "confirmationSeconds",
          label: "Confirmation Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rowDelay", label: "Row Delay", valueType: { type: "number" } },
        {
          id: "columnDelay",
          label: "Column Delay",
          valueType: { type: "number" },
        },
        {
          id: "totalSeconds",
          label: "Total Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = communicationAidSwitchCycleTimeTool.execute;
export default communicationAidSwitchCycleTimeTool;
