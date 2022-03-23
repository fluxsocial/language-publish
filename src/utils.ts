export function cleanOutput(data: string) {
  const lines = data.split('\n')
  lines.splice(0, 1);
  const cleaned = lines.join('\n')

  if (cleaned) {    
    const parsed = JSON.parse(cleaned.replace(/'/gm, "\"").replace(/(\w+)[:]\s/gm, "\"$1\": ").replace(/"{/g, "{").replace(/}"/g, "}"));

    return parsed;
  }

  throw Error('cannot be parsed');
}