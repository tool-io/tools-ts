import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConfirmationProcessInput = {
  readonly addressesVerified: boolean;
  readonly authorizationObtained: boolean;
  readonly exceptionsResolved: boolean;
  readonly independenceConfirmed: boolean;
  readonly responsesTracked: boolean;
};

export type ConfirmationProcessOutput = {
  readonly complete: boolean;
  readonly completedCount: number;
  readonly missingControls: ReadonlyArray<string>;
  readonly processStepCount: number;
};

export const checkConfirmationProcessControls = (
  input: ConfirmationProcessInput,
): ConfirmationProcessOutput => {
  const controls: readonly (readonly [string, boolean])[] = [
    ["independence confirmed", input.independenceConfirmed],
    ["addresses verified", input.addressesVerified],
    ["authorization obtained", input.authorizationObtained],
    ["responses tracked", input.responsesTracked],
    ["exceptions resolved", input.exceptionsResolved],
  ];
  for (const [name, present] of controls)
    if (typeof present !== "boolean")
      simpleError(
        name.replaceAll(" ", ""),
        `${name} must be a boolean.`,
        "boolean_field_required",
      );
  const missingControls = controls
    .filter(([, present]) => !present)
    .map(([name]) => name);
  return {
    complete: missingControls.length === 0,
    completedCount: controls.length - missingControls.length,
    missingControls,
    processStepCount: controls.length,
  };
};

export const confirmationProcessExample = {
  input: {
    addressesVerified: true,
    authorizationObtained: true,
    exceptionsResolved: false,
    independenceConfirmed: true,
    responsesTracked: true,
  },
  output: {
    complete: false,
    completedCount: 4,
    missingControls: ["exceptions resolved"],
    processStepCount: 5,
  },
} satisfies ToolExample<ConfirmationProcessInput, ConfirmationProcessOutput>;

export const confirmationProcessTool = createSimpleTool({
  calculate: (input) =>
    checkConfirmationProcessControls({
      addressesVerified: input.addressesVerified as boolean,
      authorizationObtained: input.authorizationObtained as boolean,
      exceptionsResolved: input.exceptionsResolved as boolean,
      independenceConfirmed: input.independenceConfirmed as boolean,
      responsesTracked: input.responsesTracked as boolean,
    }),
  description:
    "Check a supplied external-confirmation process for independence, address validation, authorization, response tracking, and exception resolution.",
  id: "auditing/external-confirmation-process-control-checklist",
  inputs: [
    { id: "addressesVerified", kind: "boolean", label: "Addresses verified" },
    {
      id: "authorizationObtained",
      kind: "boolean",
      label: "Authorization obtained",
    },
    { id: "exceptionsResolved", kind: "boolean", label: "Exceptions resolved" },
    {
      id: "independenceConfirmed",
      kind: "boolean",
      label: "Independence confirmed",
    },
    { id: "responsesTracked", kind: "boolean", label: "Responses tracked" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Process complete" },
    {
      id: "completedCount",
      kind: "integer",
      label: "Controls present",
      minimum: 0,
    },
    { id: "missingControls", kind: "stringList", label: "Missing controls" },
    {
      id: "processStepCount",
      kind: "integer",
      label: "Controls checked",
      minimum: 5,
    },
  ],
  title: "External Confirmation Process Control Checklist",
});

export const runConfirmationProcess = confirmationProcessTool.execute;
export default confirmationProcessTool;
