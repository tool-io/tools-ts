import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualVersionText: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualVersionText", label: "Actual version text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const m =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(
      input.actualVersionText,
    );
  if (!m) simpleError("version", "ActualSemVer2.0syntax.");
  if (
    m[4]
      ?.split(".")
      .some((v) => /^\d+$/.test(v) && v.length > 1 && v[0] === "0")
  )
    simpleError("prerelease", "No numericprereleaseleadingzero.");
  const a = m.slice(1, 4).map(Number);
  if (a.some((v) => !Number.isSafeInteger(v)))
    simpleError("version", "Safeintegercomponents.");
  return {
    major: a[0],
    minor: a[1],
    patch: a[2],
    prerelease: m[4] ?? "",
    build: m[5] ?? "",
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualVersionText: "1.2.3-alpha.1+build.7" },
  output: {
    result: {
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: "alpha.1",
      build: "build.7",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/version-parse",
  title: "Version String Parser",
  description:
    "StrictSemVer2three-numericcomponents/prerelease/buildparser,no coercion/comparison or arbitraryvendorversionmeaning. Explicitboundedofflineconvention,not authoritative external identity,eligibility,clinical or safe-use determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          major: { type: "number" },
          minor: { type: "number" },
          patch: { type: "number" },
          prerelease: { type: "string" },
          build: { type: "string" },
        },
        required: ["major", "minor", "patch", "prerelease", "build"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
