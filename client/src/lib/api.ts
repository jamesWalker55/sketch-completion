export async function process(
  imageUri: string,
  prompt: string,
  negPrompt: string,
) {
  const endpoint = `/api/process`;
  const data = {
    image_uri: imageUri,
    prompt: prompt,
    negative_prompt: negPrompt,
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw res;

  return await res.blob();
}
