import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVersion: string;
  readonly secondVersion: string;
  readonly firstDay: number;
  readonly secondDay: number;
};
export type Output = { readonly sameVersion: boolean; readonly dayGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVersion: { type: "string", maxLength: 8192 },
    secondVersion: { type: "string", maxLength: 8192 },
    firstDay: { type: "integer" },
    secondDay: { type: "integer" },
  },
  required: ["firstVersion", "secondVersion", "firstDay", "secondDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sameVersion: { type: "boolean" }, dayGap: { type: "integer" } },
  required: ["sameVersion", "dayGap"],
} as const;
/** Compare supplied source-version tokens and resolved day indices without clinical guideline interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVersion, secondVersion, firstDay, secondDay } = request;
  const compute = (): Output => {
    return {
      sameVersion: firstVersion === secondVersion,
      dayGap: secondDay - firstDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstVersion: "v1",
    secondVersion: "v2",
    firstDay: 100,
    secondDay: 130,
  },
  output: { sameVersion: false, dayGap: 30 },
} satisfies ToolExample<Input, Output>;
export const guidelineSourceVersionDategapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/guideline-source-version-dategap",
    title: "Guideline Source Version Dategap Tool",
    description:
      "Compare supplied source-version tokens and resolved day indices without clinical guideline interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVersion: { type: "string", maxLength: 8192 },
        secondVersion: { type: "string", maxLength: 8192 },
        firstDay: { type: "integer" },
        secondDay: { type: "integer" },
      },
      required: ["firstVersion", "secondVersion", "firstDay", "secondDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameVersion: { type: "boolean" },
        dayGap: { type: "integer" },
      },
      required: ["sameVersion", "dayGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstVersion",
          label: "First Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondVersion",
          label: "Second Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstDay",
          label: "First Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondDay",
          label: "Second Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sameVersion",
          label: "Same Version",
          valueType: { type: "boolean" },
        },
        { id: "dayGap", label: "Day Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = guidelineSourceVersionDategapTool.execute;
export default guidelineSourceVersionDategapTool;
