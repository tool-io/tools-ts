import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseCount: number;
  readonly controlCount: number;
};
export type Output = {
  readonly totalMembers: number;
  readonly controlsPerCase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseCount: { type: "integer", minimum: 1 },
    controlCount: { type: "integer", minimum: 0 },
  },
  required: ["caseCount", "controlCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMembers: { type: "integer" },
    controlsPerCase: { type: "number" },
  },
  required: ["totalMembers", "controlsPerCase"],
} as const;
/** Describe a positive-case matched set’s member count and control/case ratio without evaluating matching quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseCount, controlCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(caseCount) &&
        caseCount >= 1 &&
        caseCount <= Number.MAX_SAFE_INTEGER,
      "caseCount",
    ),
      caseCount);
    (H.domain(
      Number.isSafeInteger(controlCount) &&
        controlCount >= 0 &&
        controlCount <= Number.MAX_SAFE_INTEGER,
      "controlCount",
    ),
      controlCount);
    return {
      totalMembers: caseCount + controlCount,
      controlsPerCase: controlCount / caseCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseCount: 1, controlCount: 4 },
  output: { totalMembers: 5, controlsPerCase: 4 },
} satisfies ToolExample<Input, Output>;
export const matchedSetCaseControlCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/matched-set-case-control-count",
    title: "Matched Set Case Control Count",
    description:
      "Describe a positive-case matched set’s member count and control/case ratio without evaluating matching quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseCount: { type: "integer", minimum: 1 },
        controlCount: { type: "integer", minimum: 0 },
      },
      required: ["caseCount", "controlCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMembers: { type: "integer" },
        controlsPerCase: { type: "number" },
      },
      required: ["totalMembers", "controlsPerCase"],
    },
    ports: {
      inputs: [
        {
          id: "caseCount",
          label: "Case Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "controlCount",
          label: "Control Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalMembers",
          label: "Total Members",
          valueType: { type: "integer" },
        },
        {
          id: "controlsPerCase",
          label: "Controls Per Case",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = matchedSetCaseControlCountTool.execute;
export default matchedSetCaseControlCountTool;
