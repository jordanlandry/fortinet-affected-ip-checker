async function fetchFileData() {
  const url =
    "https://raw.githubusercontent.com/arsolutioner/fortigate-belsen-leak/main/affected_ips.txt";

  const ips = new Set();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    const lines = data.split("\n");
    lines.forEach(line => {
      const ip = line.trim();
      if (ip) {
        ips.add(ip);
      }
    });
  } catch (error) {
    console.error("Error fetching the file:", error);
  }

  return ips;
}

fetchFileData().then(data => {
  if (data.size === 0)
    document.getElementById("loading").innerText = "No data found";
  else {
    document.getElementById("loading").style.display = "none";
    const textArea = document.createElement("textarea");
    textArea.placeholder = "Paste IPs here";

    document.body.appendChild(textArea);

    const button = document.createElement("button");
    button.innerText = "Check";
    button.style.margin = "10px";
    button.onclick = () => {
      const ips = textArea.value
        .split(/[\s,]+/)
        .map(ip => ip.trim())
        .filter(ip => ip !== "");

      const affectedIps = new Set([...data].filter(x => ips.includes(x)));
      if (affectedIps.size > 0) {
        const result = Array.from(affectedIps).join("\n");

        document.getElementById("result")?.remove();
        document.getElementById("affected-ips")?.remove();

        const title = document.createElement("h2");
        title.innerText = "Affected IPs";
        title.style.color = "red";
        title.id = "affected-ips";

        document.body.appendChild(title);

        const copyButton = document.createElement("button");
        copyButton.innerText = "Copy";
        copyButton.onclick = () => {
          navigator.clipboard.writeText(
            document.querySelector("pre").innerText
          );
          alert("Copied to clipboard");
        };

        document.body.appendChild(copyButton);

        const text = document.createElement("pre");
        text.id = "result";
        text.style.whiteSpace = "pre-wrap";
        text.innerText = result;

        document.body.appendChild(text);
      } else {
        alert("No affected IPs found");
        document.querySelector("pre").remove();
      }
    };

    document.body.appendChild(button);
  }
});
