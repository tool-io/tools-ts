import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responded: boolean;
  readonly responseElapsed: number;
  readonly deadlineElapsed: number;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responded: { type: "boolean" },
    responseElapsed: { type: "number", minimum: 0 },
    deadlineElapsed: { type: "number", minimum: 0 },
  },
  required: ["responded", "responseElapsed", "deadlineElapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Distinguish an explicit omitted response from a response after a supplied inclusive deadline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responded, responseElapsed, deadlineElapsed } = request;
  const compute = (): Output => {
    H.domain(responseElapsed >= 0, "responseElapsed");
    H.domain(deadlineElapsed >= 0, "deadlineElapsed");
    return {
      status: !responded
        ? "omitted"
        : responseElapsed > deadlineElapsed
          ? "late"
          : "within-window",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responded: false, responseElapsed: 0, deadlineElapsed: 5 },
  output: { status: "omitted" },
} satisfies ToolExample<Input, Output>;
export const responseOmissionVersusLateTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/response-omission-versus-late-tag",
    title: "Response Omission Versus Late Tag",
    description:
      "Distinguish an explicit omitted response from a response after a supplied inclusive deadline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responded: { type: "boolean" },
        responseElapsed: { type: "number", minimum: 0 },
        deadlineElapsed: { type: "number", minimum: 0 },
      },
      required: ["responded", "responseElapsed", "deadlineElapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "responded",
          label: "Responded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "responseElapsed",
          label: "Response Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deadlineElapsed",
          label: "Deadline Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = responseOmissionVersusLateTagTool.execute;
export default responseOmissionVersusLateTagTool;
