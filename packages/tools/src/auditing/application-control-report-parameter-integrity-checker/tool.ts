import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReportParameterIntegrityInput = {
  readonly actualParameters: ReadonlyArray<string>;
  readonly requiredParameters: ReadonlyArray<string>;
  readonly supportedParameters: ReadonlyArray<string>;
};

export type ReportParameterIntegrityOutput = {
  readonly complete: boolean;
  readonly missingRequired: ReadonlyArray<string>;
  readonly missingRequiredCount: number;
  readonly unexpectedParameters: ReadonlyArray<string>;
};

const normalize = (
  values: ReadonlyArray<string>,
  field: string,
): Set<string> => {
  if (!Array.isArray(values))
    simpleError(field, `${field} must be an array.`, "parameter_list_required");
  return new Set(
    values.map((value, index) => {
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `${field}.${index}`,
          "Parameter names must be nonempty strings.",
          "invalid_parameter_name",
        );
      return value.trim().toLowerCase();
    }),
  );
};

export const checkReportParameterIntegrity = (
  input: ReportParameterIntegrityInput,
): ReportParameterIntegrityOutput => {
  const supported = normalize(input.supportedParameters, "supportedParameters");
  const required = normalize(input.requiredParameters, "requiredParameters");
  const actual = normalize(input.actualParameters, "actualParameters");
  if (supported.size === 0)
    simpleError(
      "supportedParameters",
      "At least one supported parameter is required.",
      "supported_parameters_required",
    );
  const missingRequired = [...required]
    .filter((parameter) => !actual.has(parameter))
    .sort();
  const unexpectedParameters = [...actual]
    .filter((parameter) => !supported.has(parameter))
    .sort();
  return {
    complete: missingRequired.length === 0 && unexpectedParameters.length === 0,
    missingRequired,
    missingRequiredCount: missingRequired.length,
    unexpectedParameters,
  };
};

export const reportParameterIntegrityExample = {
  input: {
    actualParameters: ["as_of_date", "entity"],
    requiredParameters: ["as_of_date", "entity", "currency"],
    supportedParameters: ["as_of_date", "currency", "entity", "segment"],
  },
  output: {
    complete: false,
    missingRequired: ["currency"],
    missingRequiredCount: 1,
    unexpectedParameters: [],
  },
} satisfies ToolExample<
  ReportParameterIntegrityInput,
  ReportParameterIntegrityOutput
>;

export const reportParameterIntegrityTool = createSimpleTool({
  calculate: (input) =>
    checkReportParameterIntegrity({
      actualParameters: input.actualParameters as string[],
      requiredParameters: input.requiredParameters as string[],
      supportedParameters: input.supportedParameters as string[],
    }),
  description:
    "Compare actual report parameter names with caller-supplied required and supported sets using normalized names, reporting omissions and unsupported extras.",
  id: "auditing/application-control-report-parameter-integrity-checker",
  inputs: [
    {
      id: "actualParameters",
      kind: "stringList",
      label: "Actual parameters",
    },
    {
      id: "requiredParameters",
      kind: "stringList",
      label: "Required parameters",
    },
    {
      id: "supportedParameters",
      kind: "stringList",
      label: "Supported parameters",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Parameters complete" },
    {
      id: "missingRequired",
      kind: "stringList",
      label: "Missing required parameters",
    },
    {
      id: "missingRequiredCount",
      kind: "integer",
      label: "Missing required count",
      minimum: 0,
    },
    {
      id: "unexpectedParameters",
      kind: "stringList",
      label: "Unexpected parameters",
    },
  ],
  title: "Application Control Report Parameter Integrity Checker",
});

export const runReportParameterIntegrity = reportParameterIntegrityTool.execute;
export default reportParameterIntegrityTool;
