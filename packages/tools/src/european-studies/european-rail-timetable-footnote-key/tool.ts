import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly timetableEdition: string;
  readonly serviceReference: string;
  readonly footnoteCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timetableEdition: { type: "string", maxLength: 8192, minLength: 1 },
    serviceReference: { type: "string", maxLength: 8192, minLength: 1 },
    footnoteCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["timetableEdition", "serviceReference", "footnoteCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit historical rail timetable footnote key without providing current travel schedules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { timetableEdition, serviceReference, footnoteCode } = request;
  const compute = (): Output => {
    H.domain(timetableEdition.length > 0, "timetableEdition");
    H.domain(serviceReference.length > 0, "serviceReference");
    H.domain(footnoteCode.length > 0, "footnoteCode");
    return {
      token: JSON.stringify([timetableEdition, serviceReference, footnoteCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    timetableEdition: "ED17",
    serviceReference: "TRAIN2",
    footnoteCode: "a",
  },
  output: { token: '["ED17","TRAIN2","a"]' },
} satisfies ToolExample<Input, Output>;
export const europeanRailTimetableFootnoteKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["european-studies", "european studies", "humanities"],
      keywords: ["european studies", "humanities"],
    },
    id: "european-studies/european-rail-timetable-footnote-key",
    title: "European Rail Timetable Footnote Key",
    description:
      "Qualify an explicit historical rail timetable footnote key without providing current travel schedules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timetableEdition: { type: "string", maxLength: 8192, minLength: 1 },
        serviceReference: { type: "string", maxLength: 8192, minLength: 1 },
        footnoteCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["timetableEdition", "serviceReference", "footnoteCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "timetableEdition",
          label: "Timetable Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "serviceReference",
          label: "Service Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "footnoteCode",
          label: "Footnote Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = europeanRailTimetableFootnoteKeyTool.execute;
export default europeanRailTimetableFootnoteKeyTool;
