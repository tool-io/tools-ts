import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExpressionEvaluatorInput = {
  readonly expression: string;
};

export type ExpressionEvaluatorOutput = {
  readonly value: number;
};

const MAX_DEPTH = 512;

/**
 * Recursive-descent arithmetic parser: + - * / % ^ with parentheses,
 * unary +/- and right-associative exponentiation.
 */
export const calculateExpressionEvaluator = (
  input: ExpressionEvaluatorInput,
): ExpressionEvaluatorOutput => {
  const expression = input.expression;
  if (expression.trim().length === 0)
    simpleError(
      "expression",
      "Expression must not be empty.",
      "malformed_expression",
    );
  let position = 0;
  let depth = 0;
  const skipSpaces = () => {
    while (position < expression.length && /\s/.test(expression[position]))
      position += 1;
  };
  const parseAtom = (): number => {
    skipSpaces();
    if (expression[position] === "(") {
      position += 1;
      depth += 1;
      if (depth > MAX_DEPTH)
        simpleError(
          "expression",
          "Expression nests parentheses too deeply.",
          "malformed_expression",
        );
      const value = parseSum();
      skipSpaces();
      if (expression[position] !== ")")
        simpleError(
          "expression",
          "Expected a closing parenthesis.",
          "malformed_expression",
        );
      position += 1;
      depth -= 1;
      return value;
    }
    const match = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(
      expression.slice(position),
    );
    if (!match)
      simpleError(
        "expression",
        "Expected a number or parenthesis.",
        "malformed_expression",
      );
    position += match![0].length;
    return Number(match![0]);
  };
  const parsePower = (): number => {
    const base = parseAtom();
    skipSpaces();
    if (expression[position] === "^") {
      position += 1;
      return base ** parseUnary();
    }
    return base;
  };
  const parseUnary = (): number => {
    skipSpaces();
    if (expression[position] === "-") {
      position += 1;
      return -parseUnary();
    }
    if (expression[position] === "+") {
      position += 1;
      return parseUnary();
    }
    return parsePower();
  };
  const parseProduct = (): number => {
    let value = parseUnary();
    for (;;) {
      skipSpaces();
      const operator = expression[position];
      if (operator !== "*" && operator !== "/" && operator !== "%")
        return value;
      position += 1;
      const right = parseUnary();
      if ((operator === "/" || operator === "%") && right === 0)
        simpleError("expression", "Division by zero.", "division_by_zero");
      value =
        operator === "*"
          ? value * right
          : operator === "/"
            ? value / right
            : value % right;
    }
  };
  const parseSum = (): number => {
    let value = parseProduct();
    for (;;) {
      skipSpaces();
      const operator = expression[position];
      if (operator !== "+" && operator !== "-") return value;
      position += 1;
      const right = parseProduct();
      value = operator === "+" ? value + right : value - right;
    }
  };
  const value = parseSum();
  skipSpaces();
  if (position !== expression.length || !Number.isFinite(value))
    simpleError(
      "expression",
      Number.isFinite(value)
        ? "Unexpected trailing characters in the expression."
        : "The expression does not evaluate to a finite number.",
      "malformed_expression",
    );
  return { value };
};

export const expressionEvaluatorExample = {
  input: { expression: "2 + 3 * 4 ^ 2" },
  output: { value: 50 },
} satisfies ToolExample<ExpressionEvaluatorInput, ExpressionEvaluatorOutput>;

export const expressionEvaluatorTool = createSimpleTool({
  id: "math/expression-evaluator",
  title: "Arithmetic Expression Evaluator",
  description:
    "Evaluate an arithmetic expression with + - * / % ^, unary minus and parentheses using standard precedence.",
  inputs: [
    {
      description: "Arithmetic expression, e.g. (2 + 3) * 4 ^ 2.",
      id: "expression",
      kind: "string",
      label: "Expression",
    },
  ],
  outputs: [
    {
      description: "Numeric result of the expression.",
      id: "value",
      kind: "number",
      label: "Value",
    },
  ],
  calculate: (input) =>
    calculateExpressionEvaluator({ expression: input.expression as string }),
});

export const runExpressionEvaluator = expressionEvaluatorTool.execute;
export default expressionEvaluatorTool;
