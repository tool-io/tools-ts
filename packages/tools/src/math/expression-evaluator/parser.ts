import { simpleError } from "../../core/simple.js";

export type MathNode =
  | { readonly kind: "number"; readonly value: number }
  | { readonly kind: "symbol"; readonly name: string }
  | { readonly kind: "unary"; readonly value: MathNode }
  | {
      readonly kind: "binary";
      readonly operator: "+" | "-" | "*" | "/" | "%" | "^";
      readonly left: MathNode;
      readonly right: MathNode;
    }
  | {
      readonly kind: "call";
      readonly name: string;
      readonly arguments: readonly MathNode[];
    };

type Operation = {
  readonly minimum: number;
  readonly maximum: number;
  readonly calculate: (...values: number[]) => number;
};
const unary = (calculate: (value: number) => number): Operation => ({
  minimum: 1,
  maximum: 1,
  calculate,
});
// Fixed numeric operations only: no eval, property access or arbitrary calls.
// Math semantics: https://tc39.es/ecma262/#sec-math-object
const operations: Readonly<Record<string, Operation>> = {
  sqrt: unary(Math.sqrt),
  cbrt: unary(Math.cbrt),
  abs: unary(Math.abs),
  sin: unary(Math.sin),
  cos: unary(Math.cos),
  tan: unary(Math.tan),
  asin: unary(Math.asin),
  acos: unary(Math.acos),
  atan: unary(Math.atan),
  sinh: unary(Math.sinh),
  cosh: unary(Math.cosh),
  tanh: unary(Math.tanh),
  ln: unary(Math.log),
  log: unary(Math.log10),
  log10: unary(Math.log10),
  log2: unary(Math.log2),
  exp: unary(Math.exp),
  floor: unary(Math.floor),
  ceil: unary(Math.ceil),
  round: unary(Math.round),
  trunc: unary(Math.trunc),
  sign: unary(Math.sign),
  pow: { minimum: 2, maximum: 2, calculate: Math.pow },
  atan2: { minimum: 2, maximum: 2, calculate: Math.atan2 },
  min: { minimum: 1, maximum: 128, calculate: Math.min },
  max: { minimum: 1, maximum: 128, calculate: Math.max },
  hypot: { minimum: 1, maximum: 128, calculate: Math.hypot },
};
const constants: Readonly<Record<string, number>> = {
  pi: Math.PI,
  e: Math.E,
  tau: 2 * Math.PI,
};
const fail = (message: string): never =>
  simpleError("expression", message, "malformed_expression");
export const finiteMathValue = (value: number): number => {
  if (!Number.isFinite(value))
    fail("The expression does not evaluate to a finite real number.");
  return value;
};
export const validateMathVariable = (variable: string): string => {
  if (
    !/^[a-zA-Z][a-zA-Z0-9]*$/.test(variable) ||
    Object.hasOwn(constants, variable.toLowerCase()) ||
    Object.hasOwn(operations, variable.toLowerCase())
  )
    simpleError(
      "variable",
      "Use a variable name such as x or p; constants and function names are reserved.",
      "invalid_variable",
    );
  return variable;
};

export const parseMathExpression = (
  expression: string,
  allowVariables = false,
): MathNode => {
  if (!expression.trim()) fail("Expression must not be empty.");
  if (expression.length > 4096) fail("Expression exceeds 4096 characters.");
  let position = 0;
  let depth = 0;
  let nodes = 0;
  const node = <T extends MathNode>(value: T): T => {
    if (++nodes > 2048) fail("Expression contains too many operations.");
    return value;
  };
  const skipSpaces = () => {
    while (/\s/.test(expression[position] || "")) position += 1;
  };
  const atom = (): MathNode => {
    skipSpaces();
    if (expression[position] === "(") {
      position += 1;
      const value = sum();
      skipSpaces();
      if (expression[position++] !== ")")
        fail("Expected a closing parenthesis.");
      return value;
    }
    const identifier = /^(?:[a-zA-Z][a-zA-Z0-9]*|π|τ)/.exec(
      expression.slice(position),
    );
    if (identifier) {
      position += identifier[0].length;
      const original = identifier[0];
      const name =
        original === "π"
          ? "pi"
          : original === "τ"
            ? "tau"
            : original.toLowerCase();
      skipSpaces();
      if (expression[position] !== "(") {
        if (Object.hasOwn(constants, name))
          return node({ kind: "symbol", name });
        if (allowVariables && !Object.hasOwn(operations, name))
          return node({ kind: "symbol", name: original });
        fail(`Unknown constant or missing function parentheses: ${original}.`);
      }
      if (!Object.hasOwn(operations, name))
        fail(`Unknown function: ${original}.`);
      const operation = operations[name];
      const values: MathNode[] = [];
      position += 1;
      skipSpaces();
      if (expression[position] !== ")") {
        for (;;) {
          if (values.length >= operation.maximum)
            fail(`Too many arguments for ${name}.`);
          values.push(sum());
          skipSpaces();
          if (expression[position] !== ",") break;
          position += 1;
        }
      }
      if (expression[position++] !== ")")
        fail("Expected a closing function parenthesis.");
      if (values.length < operation.minimum)
        fail(`Not enough arguments for ${name}.`);
      return node({ kind: "call", name, arguments: values });
    }
    const match = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(
      expression.slice(position),
    );
    if (!match) fail("Expected a number, constant, function, or parenthesis.");
    position += match![0].length;
    return node({ kind: "number", value: finiteMathValue(Number(match![0])) });
  };
  const power = (): MathNode => {
    const left = atom();
    skipSpaces();
    if (
      expression[position] === "^" ||
      expression.slice(position, position + 2) === "**"
    ) {
      position += expression[position] === "^" ? 1 : 2;
      return node({ kind: "binary", operator: "^", left, right: signed() });
    }
    return left;
  };
  const signed = (): MathNode => {
    if (++depth > 128) fail("Expression nests operations too deeply.");
    try {
      skipSpaces();
      if (expression[position] === "-" || expression[position] === "+") {
        const negative = expression[position++] === "-";
        const value = signed();
        return negative ? node({ kind: "unary", value }) : value;
      }
      return power();
    } finally {
      depth -= 1;
    }
  };
  const product = (): MathNode => {
    let left = signed();
    for (;;) {
      skipSpaces();
      const operator = expression[position];
      if (operator !== "*" && operator !== "/" && operator !== "%") return left;
      position += 1;
      left = node({ kind: "binary", operator, left, right: signed() });
    }
  };
  const sum = (): MathNode => {
    let left = product();
    for (;;) {
      skipSpaces();
      const operator = expression[position];
      if (operator !== "+" && operator !== "-") return left;
      position += 1;
      left = node({ kind: "binary", operator, left, right: product() });
    }
  };
  const tree = sum();
  skipSpaces();
  if (position !== expression.length)
    fail("Unexpected trailing characters in the expression.");
  return tree;
};

export const evaluateMathExpression = (
  node: MathNode,
  variables: Readonly<Record<string, number>> = {},
): number => {
  if (node.kind === "number") return node.value;
  if (node.kind === "symbol") {
    if (Object.hasOwn(constants, node.name)) return constants[node.name];
    if (Object.hasOwn(variables, node.name))
      return finiteMathValue(variables[node.name]);
    return fail(`No value was supplied for variable ${node.name}.`);
  }
  if (node.kind === "unary")
    return finiteMathValue(-evaluateMathExpression(node.value, variables));
  if (node.kind === "call")
    return finiteMathValue(
      operations[node.name].calculate(
        ...node.arguments.map((value) =>
          evaluateMathExpression(value, variables),
        ),
      ),
    );
  const left = evaluateMathExpression(node.left, variables);
  const right = evaluateMathExpression(node.right, variables);
  if ((node.operator === "/" || node.operator === "%") && right === 0)
    simpleError("expression", "Division by zero.", "division_by_zero");
  switch (node.operator) {
    case "+":
      return finiteMathValue(left + right);
    case "-":
      return finiteMathValue(left - right);
    case "*":
      return finiteMathValue(left * right);
    case "/":
      return finiteMathValue(left / right);
    case "%":
      return finiteMathValue(left % right);
    case "^":
      return finiteMathValue(left ** right);
  }
};

export const assertConstantMathDomains = (tree: MathNode): void => {
  const visit = (node: MathNode): boolean => {
    if (node.kind === "symbol") return Object.hasOwn(constants, node.name);
    const children =
      node.kind === "binary"
        ? [node.left, node.right]
        : node.kind === "unary"
          ? [node.value]
          : node.kind === "call"
            ? node.arguments
            : [];
    const constant = children.map(visit).every(Boolean);
    if (constant) evaluateMathExpression(node);
    return constant;
  };
  visit(tree);
};
