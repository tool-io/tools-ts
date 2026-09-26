import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseVersion: string;
  readonly requestedVersion: string;
  readonly caseDate: number;
  readonly validFrom: number;
  readonly validThrough: number;
};
export type Output = {
  readonly versionMatches: boolean;
  readonly dateValid: boolean;
  readonly compatible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseVersion: { type: "string", maxLength: 8192 },
    requestedVersion: { type: "string", maxLength: 8192 },
    caseDate: { type: "integer" },
    validFrom: { type: "integer" },
    validThrough: { type: "integer" },
  },
  required: [
    "caseVersion",
    "requestedVersion",
    "caseDate",
    "validFrom",
    "validThrough",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionMatches: { type: "boolean" },
    dateValid: { type: "boolean" },
    compatible: { type: "boolean" },
  },
  required: ["versionMatches", "dateValid", "compatible"],
} as const;
/** Calculate case definition version match pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseVersion, requestedVersion, caseDate, validFrom, validThrough } =
    request;
  const compute = (): Output => {
    H.domain(validThrough >= validFrom);
    return {
      versionMatches: caseVersion === requestedVersion,
      dateValid: caseDate >= validFrom && caseDate <= validThrough,
      compatible:
        caseVersion === requestedVersion &&
        caseDate >= validFrom &&
        caseDate <= validThrough,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caseVersion: "v2",
    requestedVersion: "v2",
    caseDate: 20,
    validFrom: 10,
    validThrough: 30,
  },
  output: { versionMatches: true, dateValid: true, compatible: true },
} satisfies ToolExample<Input, Output>;
export const caseDefinitionVersionMatchPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/case-definition-version-match-pair",
    title: "Case Definition Version Match Pair Tool",
    description:
      "Calculate case definition version match pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseVersion: { type: "string", maxLength: 8192 },
        requestedVersion: { type: "string", maxLength: 8192 },
        caseDate: { type: "integer" },
        validFrom: { type: "integer" },
        validThrough: { type: "integer" },
      },
      required: [
        "caseVersion",
        "requestedVersion",
        "caseDate",
        "validFrom",
        "validThrough",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        versionMatches: { type: "boolean" },
        dateValid: { type: "boolean" },
        compatible: { type: "boolean" },
      },
      required: ["versionMatches", "dateValid", "compatible"],
    },
    ports: {
      inputs: [
        {
          id: "caseVersion",
          label: "Case Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requestedVersion",
          label: "Requested Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caseDate",
          label: "Case Date",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "validFrom",
          label: "Valid From",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "validThrough",
          label: "Valid Through",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "versionMatches",
          label: "Version Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "dateValid",
          label: "Date Valid",
          valueType: { type: "boolean" },
        },
        {
          id: "compatible",
          label: "Compatible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = caseDefinitionVersionMatchPairTool.execute;
export default caseDefinitionVersionMatchPairTool;
