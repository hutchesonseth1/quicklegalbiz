export function motionReadyTemplate({
  userName,
  checklist,
  downloadUrl,
}: {
  userName?: string;
  checklist: string[];
  downloadUrl?: string;
}) {
  const items = checklist.map(i => `<li>${i}</li>`).join("");

  return `
    <div style="font:14px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#111">
      <h2>Your motion is ready${userName ? `, ${userName}` : ""}.</h2>
      <ul>${items}</ul>
      ${
        downloadUrl
          ? `<p><a href="${downloadUrl}" style="color:#0070f3">Download PDF</a></p>`
          : ""
      }
      <p style="font-size:12px;color:#666;margin-top:16px;">
        This email is not legal advice.
      </p>
    </div>
  `;
}