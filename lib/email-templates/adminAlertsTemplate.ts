// lib/email-templates/adminAlertTemplate.ts

export interface AdminAlertTemplateProps {
  title: string;
  message?: string;
  details?: Record<string, any>;
  level?: "info" | "warning" | "critical";
}

export function adminAlertTemplate({
  title,
  message,
  details = {},
  level = "info",
}: AdminAlertTemplateProps) {
  const colors = {
    info: "#0070f3",
    warning: "#ffb300",
    critical: "#e00",
  };

  const alertColor = colors[level] || colors.info;

  const detailRows = Object.entries(details)
    .map(
      ([key, value]) => `
      <tr>
        <td style="padding: 4px 8px; font-weight: 500; text-transform: capitalize;">${key}</td>
        <td style="padding: 4px 8px; color: #333;">${value}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div style="
      background: #f9fafb;
      padding: 24px;
      border-radius: 10px;
      font-family: 'Segoe UI', Roboto, sans-serif;
      color: #111;
      line-height: 1.5;
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #eee;
    ">
      <h2 style="color:${alertColor}; margin-top:0;">${title}</h2>
      ${
        message
          ? `<p style="font-size:15px; margin-bottom: 16px;">${message}</p>`
          : ""
      }
      ${
        detailRows
          ? `<table style="width:100%; border-collapse: collapse; background:#fff; border-radius:8px; overflow:hidden;">${detailRows}</table>`
          : ""
      }

      <p style="margin-top:24px; font-size:13px; color:#777;">
        — QuickLegalBiz Admin System<br/>
        <a href="https://quicklegalbiz.com" style="color:${alertColor}; text-decoration:none;">quicklegalbiz.com</a>
      </p>
    </div>
  `;
}