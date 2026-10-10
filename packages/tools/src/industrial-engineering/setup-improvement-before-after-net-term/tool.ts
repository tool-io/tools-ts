import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousSetupMinutes: number;
  readonly newSetupMinutes: number;
  readonly addedSupportMinutes: number;
};
export type Output = {
  readonly grossSavedMinutes: number;
  readonly netSavedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousSetupMinutes: { type: "number", minimum: 0 },
    newSetupMinutes: { type: "number", minimum: 0 },
    addedSupportMinutes: { type: "number", minimum: 0 },
  },
  required: ["previousSetupMinutes", "newSetupMinutes", "addedSupportMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossSavedMinutes: { type: "number" },
    netSavedMinutes: { type: "number" },
  },
  required: ["grossSavedMinutes", "netSavedMinutes"],
} as const;
/** Compare explicit setup-time savings after a supplied additional support-time requirement without claiming sustained productivity gains. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousSetupMinutes, newSetupMinutes, addedSupportMinutes } =
    request;
  const compute = (): Output => {
    H.domain(previousSetupMinutes >= 0, "previousSetupMinutes");
    H.domain(newSetupMinutes >= 0, "newSetupMinutes");
    H.domain(addedSupportMinutes >= 0, "addedSupportMinutes");
    return {
      grossSavedMinutes: previousSetupMinutes - newSetupMinutes,
      netSavedMinutes:
        previousSetupMinutes - newSetupMinutes - addedSupportMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousSetupMinutes: 60,
    newSetupMinutes: 40,
    addedSupportMinutes: 5,
  },
  output: { grossSavedMinutes: 20, netSavedMinutes: 15 },
} satisfies ToolExample<Input, Output>;
export const setupImprovementBeforeAfterNetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/setup-improvement-before-after-net-term",
    title: "Setup Improvement Before After Net Term Tool",
    description:
      "Compare explicit setup-time savings after a supplied additional support-time requirement without claiming sustained productivity gains.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousSetupMinutes: { type: "number", minimum: 0 },
        newSetupMinutes: { type: "number", minimum: 0 },
        addedSupportMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "previousSetupMinutes",
        "newSetupMinutes",
        "addedSupportMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossSavedMinutes: { type: "number" },
        netSavedMinutes: { type: "number" },
      },
      required: ["grossSavedMinutes", "netSavedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "previousSetupMinutes",
          label: "Previous Setup Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newSetupMinutes",
          label: "New Setup Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedSupportMinutes",
          label: "Added Support Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossSavedMinutes",
          label: "Gross Saved Minutes",
          valueType: { type: "number" },
        },
        {
          id: "netSavedMinutes",
          label: "Net Saved Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = setupImprovementBeforeAfterNetTermTool.execute;
export default setupImprovementBeforeAfterNetTermTool;
