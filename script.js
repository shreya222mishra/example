
async function generateRoadmap() {
  const idea = document.getElementById("ideaInput").value;
  const apiKey = "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";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that breaks down ideas into roadmaps." },
        { role: "user", content: `Create a roadmap with milestones for the following project idea: ${idea}` },
      ],
    }),
  });

  const data = await response.json();
  const milestones = data.choices[0].message.content.split("\n").filter(line => line.trim() !== "");

  const ul = document.getElementById("milestones");
  ul.innerHTML = "";
  milestones.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    ul.appendChild(li);
  });
}

function exportPDF() {
  const content = document.getElementById("milestones").innerText;
  const blob = new Blob([content], { type: "application/pdf" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "roadmap.pdf";
  a.click();
}
