export const toolDocumentor = ({
  name,
  purpose,
  coreLogic,
  useCases,
  inputs,
  dataDescription,
}: {
  name: string;
  purpose: string;
  coreLogic: string;
  useCases: string[];
  inputs: { name: string; type: string; description: string }[];
  dataDescription: string;
}) => {
  return `
## ${name}  

The tool is designed to ${purpose}.

### 🧩 Core Functionality
${coreLogic}

### 💡 Use Cases
${useCases.map((u) => `- ${u}`).join("\n")}

### ⚙️ Input Parameters
${inputs
  .map((i) => `- **${i.name}** *(${i.type})* — ${i.description}`)
  .join("\n")}

### 📤 Response Format
The tool returns a standardized response object with the following fields:

- **success** — Indicates whether the operation was executed successfully.
- **data** — ${dataDescription}
- **error** — Contains an error message if the operation fails.
  `.trim();
};
