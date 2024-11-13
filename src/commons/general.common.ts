export function featureFlag(flag: string): boolean {
  return ['true', '1', 'True', 'TRUE', true, 1].includes(
    process.env[flag] as any,
  );
}

export function decodeParams<T = any>(urlParams: string): T {
  const obj = Object.fromEntries(new URLSearchParams(urlParams));

  // Recursively parse any string values that are valid JSON
  function parseNestedJSON(value: any) {
    if (typeof value === 'string') {
      try {
        // Check if the string is a valid JSON object
        return JSON.parse(decodeURIComponent(value));
      } catch (e) {
        return value; // Return the value as-is if it's not valid JSON
      }
    }
    return value;
  }

  // Recursively traverse the object to decode and parse JSON strings
  function traverseAndParse(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Recursively parse nested objects if necessary
        obj[key] = parseNestedJSON(obj[key]);

        // If the value is an object, recurse to handle nested objects
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverseAndParse(obj[key]);
        }

        // Automatically convert string numbers to actual numbers
        if (
          typeof obj[key] === 'string' &&
          !isNaN(Number(obj[key])) &&
          obj[key].trim() !== ''
        ) {
          obj[key] = Number(obj[key]);
        }
      }
    }
  }

  // Start parsing the entire object
  traverseAndParse(obj);

  return obj as T;
}
